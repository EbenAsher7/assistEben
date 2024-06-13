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
      res.status(401).json({ error: 'Usuario no existe' })
      return
    }

    // Verificar la contraseña
    const userPass = result.rows[0]
    const hashedPassword = userPass.password

    const match = await bcrypt.compare(password, hashedPassword)

    if (!match) {
      res.status(401).json({ error: 'Contraseña incorrecta' })
      return
    }

    const user = result.rows[0]

    const {
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

    res.status(200).json({
      user: {
        nombres: nombres + ' ' + apellidos,
        fech_nacimiento,
        foto_url,
        telefono,
        direccion,
        tipo,
        observaciones,
        modulo_id,
        activo
      },
      token
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
