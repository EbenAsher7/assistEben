import express from 'express'
import { turso } from '../database/connection.js'

const router = express.Router()

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

// Obtener todos los tutores agrupados por módulo
router.get('/allTutorsByModule', async (req, res) => {
  try {
    // Consulta para obtener todos los módulos con sus respectivos tutores
    const result = await turso.execute(`
      SELECT
        m.id AS idModulo,
        m.nombre AS nombreModulo,
        t.id AS tutorId,
        t.nombres AS tutorNombres,
        t.apellidos AS tutorApellidos,
        t.fecha_nacimiento AS tutorFechaNacimiento,
        t.foto_url AS tutorFotoUrl,
        t.telefono AS tutorTelefono,
        t.direccion AS tutorDireccion,
        t.username AS tutorUsername,
        t.tipo AS tutorTipo,
        t.observaciones AS tutorObservaciones
      FROM Modulos m
      LEFT JOIN Tutores t ON m.id = t.modulo_id
    `)

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
          username: row[columns.indexOf('tutorUsername')],
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

export default router
