import express from 'express'
import { turso } from '../database/connection.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
dotenv.config()
/* eslint-disable camelcase */

const router = express.Router()

// Ejemplo de ruta GET
router.post('/user/login', async (req, res) => {
  try {
    const { username, password } = req.body

    const result = await turso.execute({
      sql: 'SELECT * FROM tutores WHERE username = ?',
      args: [username]
    })

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no existe' })
    }

    // Verificar la contraseña
    const userPass = result.rows[0]
    const hashedPassword = userPass.password

    const match = await bcrypt.compare(password, hashedPassword)

    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' })
    }

    const user = result.rows[0]

    const {
      id,
      nombres,
      apellidos,
      fech_nacimiento,
      foto_url,
      telefono,
      direccion,
      tipo,
      observaciones,
      modulo_id,
      activo
    } = user

    const datosUser = {
      nombre: nombres + ' ' + apellidos,
      tipo,
      modulo_id,
      activo
    }

    const token = jwt.sign(datosUser, process.env.JWT_SECRET, {
      expiresIn: '6d'
    })

    // return cookie
    res.cookie('token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 6,
      sameSite: 'none',
      secure: true,
      httpOnly: true
    })

    const usernameLogin = user.username
    res.status(200).json({
      user: {
        id,
        nombres,
        apellidos,
        fech_nacimiento,
        foto_url,
        telefono,
        direccion,
        tipo,
        username: usernameLogin,
        observaciones,
        modulo_id,
        activo,
        token
      }
      // token
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Buscar alumno por nombres y apellidos "LIKE"
router.post('/user/searchStudent', async (req, res) => {
  try {
    const { search } = req.body

    // verificar que los datos requeridos estén presentes
    if (!search) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    // Buscar el alumno
    const resultado = await turso.execute({
      sql: `SELECT id, nombres, apellidos, telefono
            FROM Alumnos
            WHERE CONCAT(nombres, ' ', apellidos) LIKE ?`,
      args: [`%${search}%`]
    })

    const columns = resultado.columns
    const rows = resultado.rows

    const students = rows.map((row) => {
      const student = {}
      columns.forEach((col, index) => {
        student[col] = row[index]
      })
      return student
    })

    res.status(200).json(students)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

export default router
