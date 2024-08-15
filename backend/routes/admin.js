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

export default router
