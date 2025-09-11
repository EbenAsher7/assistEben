import express from 'express'
import { turso } from '../database/connection.js'

const router = express.Router()

// --- Endpoints de Configuración ---

// Obtener todas las configuraciones
router.get('/settings', async (req, res) => {
  try {
    const result = await turso.execute('SELECT * FROM Configuracion')
    const settings = result.rows.reduce((acc, row) => {
      acc[row.clave] = row.valor === 'true'
      return acc
    }, {})
    res.status(200).json(settings)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Actualizar configuraciones
router.put('/settings', async (req, res) => {
  const settings = req.body
  try {
    await turso.execute({
      sql: `INSERT OR IGNORE INTO Configuracion (clave, valor) VALUES ('permitir_correos_duplicados', 'true')`,
      args: []
    })
    await turso.execute({
      sql: `INSERT OR IGNORE INTO Configuracion (clave, valor) VALUES ('permitir_telefonos_duplicados', 'true')`,
      args: []
    })

    const promises = Object.entries(settings).map(([clave, valor]) => {
      return turso.execute({
        sql: 'UPDATE Configuracion SET valor = ? WHERE clave = ?',
        args: [valor.toString(), clave]
      })
    })
    await Promise.all(promises)
    res.status(200).json({ message: 'Configuración actualizada correctamente' })
  } catch (error) {
    res
      .status(500)
      .json({ error: 'Hubo un error al actualizar la configuración' })
  }
})

// --- Endpoint para Alumnos sin Asignar ---

// Obtener alumnos sin módulo o tutor, con paginación y búsqueda
router.get('/unassigned-students', async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const searchTerm = req.query.search || ''
  const offset = (page - 1) * limit

  try {
    let countSql =
      'SELECT COUNT(*) as total FROM Alumnos WHERE modulo_id IS NULL OR tutor_id IS NULL'
    let dataSql =
      'SELECT id, nombres, apellidos, telefono, pais, iglesia, modalidad, prefijoNumero FROM Alumnos WHERE modulo_id IS NULL OR tutor_id IS NULL'

    const args = []
    const countArgs = []

    if (searchTerm) {
      const searchCondition =
        '(nombres LIKE ? OR apellidos LIKE ? OR telefono LIKE ?)'
      countSql += ` AND ${searchCondition}`
      dataSql += ` AND ${searchCondition}`
      const likeTerm = `%${searchTerm}%`
      args.push(likeTerm, likeTerm, likeTerm)
      countArgs.push(likeTerm, likeTerm, likeTerm)
    }

    dataSql += ' ORDER BY id DESC LIMIT ? OFFSET ?'
    args.push(limit, offset)

    const [dataResult, countResult] = await Promise.all([
      turso.execute({ sql: dataSql, args }),
      turso.execute({ sql: countSql, args: countArgs })
    ])

    const total = countResult.rows[0].total
    const totalPages = Math.ceil(total / limit)

    const students = dataResult.rows.map((row) => ({
      id: row.id,
      nombres: row.nombres,
      apellidos: row.apellidos,
      telefono: row.telefono,
      pais: row.pais,
      iglesia: row.iglesia,
      modalidad: row.modalidad,
      prefijoNumero: row.prefijoNumero
    }))

    res.status(200).json({
      students,
      currentPage: page,
      totalPages,
      totalStudents: total
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Obtener detalles completos de un alumno por ID
router.get('/student/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await turso.execute({
      sql: 'SELECT * FROM Alumnos WHERE id = ?',
      args: [id]
    })

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alumno no encontrado' })
    }

    res.status(200).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Obtener los módulos disponibles
router.get('/modules', async (req, res) => {
  try {
    const result = await turso.execute('SELECT * FROM modulos')

    // Transformar los datos en el formato deseado
    const columns = result.columns
    const rows = result.rows

    const modules = rows.map((row) => {
      const module = {}
      columns.forEach((col, index) => {
        module[col] = row[index]
      })
      return module
    })

    res.status(200).json(modules)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Obtener todos los tutores agrupados por módulo, excluyendo un tutor específico
router.get('/allTutorsByModule/:tutorID', async (req, res) => {
  const { tutorID } = req.params // Obtener el ID del tutor desde los parámetros de la URL

  try {
    // Consulta para obtener todos los módulos con sus respectivos tutores, excluyendo el tutor con el ID dado
    const result = await turso.execute({
      sql: `SELECT
        m.id AS idModulo,
        m.nombre AS nombreModulo,
        t.id AS tutorId,
        t.nombres AS tutorNombres,
        t.apellidos AS tutorApellidos,
        t.fecha_nacimiento AS tutorFechaNacimiento,
        t.foto_url AS tutorFotoUrl,
        t.telefono AS tutorTelefono,
        t.direccion AS tutorDireccion,
        t.tipo AS tutorTipo,
        t.observaciones AS tutorObservaciones
      FROM Modulos m
      LEFT JOIN TutoresModulos tm ON m.id = tm.modulo_id
      LEFT JOIN Tutores t ON tm.tutor_id = t.id
      WHERE t.activo = 1
      AND t.id != ? AND m.activo = 1`,
      args: [tutorID]
    })

    // Transformar los datos en el formato deseado
    const columns = result.columns
    const rows = result.rows

    const modulesMap = {}

    rows.forEach((row) => {
      const idModulo = row[columns.indexOf('idModulo')]
      const nombreModulo = row[columns.indexOf('nombreModulo')]

      // Si el módulo no existe en el mapa, inicializarlo
      if (!modulesMap[idModulo]) {
        modulesMap[idModulo] = {
          idModulo,
          nombreModulo,
          Tutores: []
        }
      }

      // Crear el objeto Tutor si existe
      if (row[columns.indexOf('tutorId')]) {
        const tutor = {
          id: row[columns.indexOf('tutorId')],
          nombres: row[columns.indexOf('tutorNombres')],
          apellidos: row[columns.indexOf('tutorApellidos')],
          fecha_nacimiento: row[columns.indexOf('tutorFechaNacimiento')],
          foto_url: row[columns.indexOf('tutorFotoUrl')],
          telefono: row[columns.indexOf('tutorTelefono')],
          direccion: row[columns.indexOf('tutorDireccion')],
          tipo: row[columns.indexOf('tutorTipo')],
          observaciones: row[columns.indexOf('tutorObservaciones')]
        }
        modulesMap[idModulo].Tutores.push(tutor)
      }
    })

    // Convertir el mapa a un arreglo de objetos para la respuesta
    const modulesArray = Object.values(modulesMap)

    res.status(200).json(modulesArray)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Obtener la cantidad de alumnos asignados a un tutor por módulo
router.get('/alumnosModulo', async (req, res) => {
  try {
    const query = `
      SELECT
          t.nombres || ' ' || t.apellidos AS tutor_nombre,
          m.nombre AS modulo_nombre,
          COUNT(a.id) AS cantidad_alumnos
      FROM
          Alumnos a
      JOIN
          TutoresModulos tm ON a.modulo_id = tm.modulo_id AND a.tutor_id = tm.tutor_id
      JOIN
          Tutores t ON tm.tutor_id = t.id
      JOIN
          Modulos m ON tm.modulo_id = m.id
      GROUP BY
          t.id, m.id
      ORDER BY
          tutor_nombre, modulo_nombre;
    `

    const result = await turso.execute(query)

    // Transformar los datos en el formato deseado
    const columns = result.columns
    const rows = result.rows

    const data = rows.map((row) => {
      const item = {}
      columns.forEach((col, index) => {
        item[col] = row[index]
      })
      return item
    })

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Obtener la cantidad de preguntas enviadas a un tutor por módulo
router.get('/preguntasModulo', async (req, res) => {
  try {
    const query = `
      SELECT
          t.nombres || ' ' || t.apellidos AS tutor_nombre,
          m.nombre AS modulo_nombre,
          COUNT(a.pregunta) AS cantidad_preguntas
      FROM
          Asistencias a
      JOIN
          Alumnos al ON a.alumno_id = al.id
      JOIN
          TutoresModulos tm ON al.modulo_id = tm.modulo_id AND al.tutor_id = tm.tutor_id
      JOIN
          Tutores t ON tm.tutor_id = t.id
      JOIN
          Modulos m ON tm.modulo_id = m.id
      WHERE
          a.pregunta IS NOT NULL
      GROUP BY
          t.id, m.id
      ORDER BY
          tutor_nombre, modulo_nombre;
    `

    const result = await turso.execute(query)

    // Transformar los datos en el formato deseado
    const columns = result.columns
    const rows = result.rows

    const data = rows.map((row) => {
      const item = {}
      columns.forEach((col, index) => {
        item[col] = row[index]
      })
      return item
    })

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Obtener la cantidad de asistencias virtuales y presenciales por módulo
router.get('/asistenciasModulo', async (req, res) => {
  try {
    const query = `
      SELECT
          t.nombres || ' ' || t.apellidos AS tutor_nombre,
          m.nombre AS modulo_nombre,
          SUM(CASE WHEN a.tipo = 'Virtual' THEN 1 ELSE 0 END) AS cantidad_virtuales,
          SUM(CASE WHEN a.tipo = 'Presencial' THEN 1 ELSE 0 END) AS cantidad_presenciales
      FROM
          Asistencias a
      JOIN
          Alumnos al ON a.alumno_id = al.id
      JOIN
          TutoresModulos tm ON al.modulo_id = tm.modulo_id AND al.tutor_id = tm.tutor_id
      JOIN
          Tutores t ON tm.tutor_id = t.id
      JOIN
          Modulos m ON tm.modulo_id = m.id
      GROUP BY
          t.id, m.id
      ORDER BY
          tutor_nombre, modulo_nombre;
    `

    const result = await turso.execute(query)

    // Transformar los datos en el formato deseado
    const columns = result.columns
    const rows = result.rows

    const data = rows.map((row) => {
      const item = {}
      columns.forEach((col, index) => {
        item[col] = row[index]
      })
      return item
    })

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Obtener la cantidad de alumnos pendientes totales por módulo
router.get('/alumnosPendientesModulo', async (req, res) => {
  try {
    const query = `
      SELECT
          m.nombre AS modulo_nombre,
          COUNT(a.id) AS cantidad_alumnos_pendientes
      FROM
          Alumnos a
      JOIN
          Modulos m ON a.modulo_id = m.id
      WHERE
          a.activo = 'Pendiente'
          AND m.activo = 1
      GROUP BY
          m.id
      ORDER BY
          modulo_nombre;
    `

    const result = await turso.execute(query)

    // Transformar los datos en el formato deseado
    const columns = result.columns
    const rows = result.rows

    const data = rows.map((row) => {
      const item = {}
      columns.forEach((col, index) => {
        item[col] = row[index]
      })
      return item
    })

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Obtener la cantidad de preguntas según asistencia virtual o presencial por módulo
router.get('/preguntasTipoAsistencia', async (req, res) => {
  try {
    const query = `
      SELECT
          m.nombre AS modulo_nombre,
          a.tipo AS tipo_asistencia,
          COUNT(a.pregunta) AS cantidad_preguntas
      FROM
          Asistencias a
      JOIN
          Alumnos al ON a.alumno_id = al.id
      JOIN
          Modulos m ON al.modulo_id = m.id
      WHERE
          a.pregunta IS NOT NULL
          AND m.activo = 1
      GROUP BY
          m.id, a.tipo
      ORDER BY
          modulo_nombre, tipo_asistencia;
    `

    const result = await turso.execute(query)

    // Transformar los datos en el formato deseado
    const columns = result.columns
    const rows = result.rows

    const data = rows.map((row) => {
      const item = {}
      columns.forEach((col, index) => {
        item[col] = row[index]
      })
      return item
    })

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Obtener lista de preguntas por rango de fechas
router.get('/preguntasAnonimas/:startDate/:endDate', async (req, res) => {
  // Extraer las fechas de los parámetros de la ruta
  const { startDate, endDate } = req.params

  // Si no se proporcionan fechas, asignar las fechas de hoy y mañana como predeterminadas
  const start = startDate ?? new Date().toISOString().split('T')[0]
  const end =
    endDate ??
    new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split('T')[0]

  try {
    // Consulta para obtener las preguntas dentro del rango de fechas
    const result = await turso.execute({
      sql: 'SELECT id, pregunta, preguntaeng, respondida FROM Preguntas WHERE fecha BETWEEN ? AND ? ORDER BY fecha DESC',
      args: [start, end]
    })

    // Transformar los datos en el formato deseado
    const columns = result.columns
    const rows = result.rows

    const modules = rows.map((row) => {
      const module = {}
      columns.forEach((col, index) => {
        module[col] = row[index]
      })
      return module
    })
    res.status(200).json(modules)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Actualizar estado de la pregunta a respondida (1)
router.put('/preguntasAnonimas/:id', async (req, res) => {
  const { id } = req.params

  try {
    await turso.execute({
      sql: 'UPDATE Preguntas SET respondida = 1 WHERE id = ?',
      args: [id]
    })

    res.status(200).json({ message: 'Pregunta actualizada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Hubo un error al actualizar la pregunta' })
  }
})

export default router
