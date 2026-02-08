import express from 'express'
import { turso } from '../database/connection.js'

const router = express.Router()

router.get('/modules', async (req, res) => {
  try {
    const result = await turso.execute('SELECT * FROM modulos WHERE activo = 1')

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
    console.error('Error en la operación:', error.message)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.get('/modulesDeleted', async (req, res) => {
  try {
    const result = await turso.execute('SELECT * FROM modulos WHERE activo = 0')

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
    console.error('Error en la operación:', error.message)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Obtener modulos dependiendo el ID del tutor
router.get('/modulesByTutor/:tutorID', async (req, res) => {
  const { tutorID } = req.params

  try {
    const result = await turso.execute({
      sql: `
        SELECT Modulos.id, Modulos.nombre, Modulos.fecha_inicio, Modulos.fecha_fin,
        Modulos.horarioInicio, Modulos.horarioFin, Modulos.encargado_id,
        Modulos.descripcion, Modulos.foto_url, Modulos.activo
          FROM TutoresModulos
          JOIN Modulos ON TutoresModulos.modulo_id = Modulos.id
          WHERE TutoresModulos.tutor_id = ? AND Modulos.activo = 1
      `,
      args: [tutorID]
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
    console.error('Error en la operación:', error.message)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.get('/Allmodules', async (req, res) => {
  try {
    const result = await turso.execute({
      sql: 'SELECT * FROM modulos'
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
    console.error('Error en la operación:', error.message)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.get('/tutors', async (req, res) => {
  try {
    const result = await turso.execute(`
      SELECT
        t.id,
        t.nombres,
        t.apellidos,
        t.fecha_nacimiento,
        t.foto_url,
        t.telefono,
        t.direccion,
        t.username,
        t.password,
        t.tipo,
        t.observaciones,
        t.activo,
        GROUP_CONCAT(m.nombre, ', ') AS modulos
      FROM Tutores t
      LEFT JOIN TutoresModulos tm ON t.id = tm.tutor_id
      LEFT JOIN Modulos m ON tm.modulo_id = m.id AND m.activo = 1
      WHERE t.activo = 1
      GROUP BY t.id
    `)

    const columns = result.columns
    const rows = result.rows

    const tutors = rows.map((row) => {
      const tutor = {}
      columns.forEach((col, index) => {
        tutor[col] = row[index]
      })
      return tutor
    })

    tutors.forEach((tutor) => {
      delete tutor.password
    })

    res.status(200).json(tutors)
  } catch (error) {
    console.error('Error en la operación:', error.message)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.get('/tutorsDeleted', async (req, res) => {
  try {
    const result = await turso.execute('SELECT * FROM tutores where activo = 0')

    const columns = result.columns
    const rows = result.rows

    const tutors = rows.map((row) => {
      const tutor = {}
      columns.forEach((col, index) => {
        tutor[col] = row[index]
      })
      return tutor
    })

    tutors.forEach((tutor) => {
      delete tutor.password
    })

    res.status(200).json(tutors)
  } catch (error) {
    console.error('Error en la operación:', error.message)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.delete('/modulesAndTutors/:id', async (req, res) => {
  const { id } = req.params
  try {
    await turso.execute({
      sql: 'DELETE FROM TutoresModulos WHERE id = ?',
      args: [id]
    })

    res
      .status(200)
      .json({ message: 'Asignacion de modulos eliminados correctamente' })
  } catch (error) {
    console.error('Error en la operación:', error.message)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.post('/modulesAndTutors', async (req, res) => {
  const { idTutor, idModule } = req.body
  try {
    await turso.execute({
      sql: 'INSERT INTO TutoresModulos (tutor_id, modulo_id) VALUES (?, ?)',
      args: [idTutor, idModule]
    })

    res
      .status(201)
      .json({ message: 'Asignacion de modulos creada correctamente' })
  } catch (error) {
    console.error('Error en la operación:', error.message)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// Obtener TutoresModulos
router.get('/modulesAndTutors/:id', async (req, res) => {
  const { id } = req.params
  try {
    const result = await turso.execute({
      sql: 'SELECT * FROM TutoresModulos WHERE modulo_id = ?',
      args: [id]
    })

    const columns = result.columns
    const rows = result.rows

    const tutorsModules = rows.map((row) => {
      const tutorModule = {}
      columns.forEach((col, index) => {
        tutorModule[col] = row[index]
      })
      return tutorModule
    })

    res.status(200).json(tutorsModules)
  } catch (error) {
    console.error('Error en la operación:', error.message)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

router.get('/students', async (req, res) => {
  try {
    const result = await turso.execute('SELECT * FROM alumnos')

    const columns = result.columns
    const rows = result.rows

    const students = rows.map((row) => {
      const student = {}
      columns.forEach((col, index) => {
        student[col] = row[index]
      })
      return student
    })

    res.status(200).json(students)
  } catch (error) {
    console.error('Error en la operación:', error.message)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

export default router
