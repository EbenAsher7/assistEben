import express from 'express'
import { turso } from '../database/connection.js'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()
/* eslint-disable camelcase */

const router = express.Router()

// añadir un tutor verificando que no exista
router.post('/addTutor', async (req, res) => {
  try {
    const {
      nombres,
      apellidos,
      fecha_nacimiento,
      foto_url,
      telefono,
      direccion,
      username,
      password,
      tipo,
      observaciones,
      modulo_id,
      activo
    } = req.body

    // verificar que los datos requeridos estén presentes
    if (
      !nombres ||
      !apellidos ||
      !telefono ||
      !username ||
      !password ||
      !tipo
    ) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    // Verificar que no exista un tutor con el mismo username
    const tutor = await turso.execute({
      sql: 'SELECT * FROM Tutores WHERE username = ? AND activo = 1',
      args: [username]
    })

    if (tutor.rows.length > 0) {
      return res
        .status(400)
        .json({ error: 'Ya existe un tutor con ese nombre de usuario' })
    }

    // Encriptar la contraseña
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10)
    if (isNaN(saltRounds)) {
      throw new Error('Invalid SALT_ROUNDS value in environment variables')
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Agregar el tutor
    const resultado = await turso.execute({
      sql: 'INSERT INTO Tutores (nombres, apellidos, fecha_nacimiento, foto_url, telefono, direccion, username, password, tipo, observaciones, modulo_id, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [
        nombres,
        apellidos,
        fecha_nacimiento,
        foto_url,
        telefono,
        direccion,
        username,
        hashedPassword,
        tipo,
        observaciones,
        modulo_id,
        activo
      ]
    })

    if (resultado.affectedRows === 0) {
      return res.status(500).json({ error: 'No se pudo agregar el tutor' })
    }

    res.json({
      Success: 'Usuario agregado correctamente',
      idTutor: resultado.lastInsertRowid.toString()
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// cambiar la contraseña de un tutor
router.post('/changePassword', async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body

    // verificar que los datos requeridos estén presentes
    if (!username || !oldPassword || !newPassword) {
      res.status(400).json({ error: 'Faltan datos requeridos' })
      throw new Error('Faltan datos requeridos')
    }

    // Verificar que el tutor exista
    const tutor = await turso.execute({
      sql: 'SELECT * FROM Tutores WHERE username = ? AND activo = 1',
      args: [username]
    })

    if (tutor.rows.length === 0) {
      return res.status(400).json({ error: 'Usuario no existe' })
    }

    // Verificar la contraseña
    const userPass = tutor.rows[0]
    const hashedPassword = userPass.password

    const match = await bcrypt.compare(oldPassword, hashedPassword)

    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' })
    }

    // Encriptar la nueva contraseña
    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10)
    if (isNaN(saltRounds)) {
      throw new Error('Invalid SALT_ROUNDS value in environment variables')
    }

    const newHashedPassword = await bcrypt.hash(newPassword, saltRounds)

    // Cambiar la contraseña
    const resultado = await turso.execute({
      sql: 'UPDATE Tutores SET password = ? WHERE username = ?',
      args: [newHashedPassword, username]
    })

    if (resultado.affectedRows === 0) {
      return res.status(500).json({ error: 'No se pudo cambiar la contraseña' })
    }

    res.json({ Success: 'Contraseña cambiada correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// desactivar un tutor
router.post('/disableTutor', async (req, res) => {
  try {
    const { username } = req.body

    // verificar que los datos requeridos estén presentes
    if (!username) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    // Verificar que el tutor exista
    const tutor = await turso.execute({
      sql: 'SELECT * FROM Tutores WHERE username = ? AND activo = 1',
      args: [username]
    })

    if (tutor.rows.length === 0) {
      return res.status(400).json({ error: 'Usuario no existe' })
    }

    // Desactivar el tutor
    const resultado = await turso.execute({
      sql: 'UPDATE Tutores SET activo = 0 WHERE username = ?',
      args: [username]
    })

    if (resultado.affectedRows === 0) {
      return res.status(500).json({ error: 'No se pudo desactivar el tutor' })
    }

    res.json({ Success: 'Usuario desactivado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// añadir un nuevo alumno
router.post('/addStudent', async (req, res) => {
  try {
    const {
      nombres,
      apellidos,
      fecha_nacimiento,
      telefono,
      direccion,
      tutor_id,
      modulo_id,
      activo,
      observaciones
    } = req.body

    // verificar que los datos requeridos estén presentes
    if (
      !nombres ||
      !apellidos ||
      !telefono ||
      !tutor_id ||
      !modulo_id ||
      !activo
    ) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    // Verificar que el tutor exista
    const tutor = await turso.execute({
      sql: 'SELECT * FROM Tutores WHERE id = ? AND activo = 1',
      args: [tutor_id]
    })
    if (tutor.rows.length === 0) {
      return res.status(400).json({ error: 'Tutor no existe' })
    }

    // verificar que el modulo exista
    const modulo = await turso.execute({
      sql: 'SELECT * FROM Modulos WHERE id = ?',
      args: [modulo_id]
    })
    if (modulo.rows.length === 0) {
      return res.status(400).json({ error: 'Modulo no existe' })
    }

    // Agregar el alumno
    const resultado = await turso.execute({
      sql: 'INSERT INTO Alumnos (nombres, apellidos, fecha_nacimiento, telefono, direccion, tutor_id, modulo_id, activo, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      args: [
        nombres,
        apellidos,
        fecha_nacimiento,
        telefono,
        direccion,
        tutor_id,
        modulo_id,
        activo,
        observaciones
      ]
    })

    if (resultado.affectedRows === 0) {
      return res.status(500).json({ error: 'No se pudo agregar el alumno' })
    }

    res.status(200).json({ Success: 'Alumno agregado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// desactivar un alumno
router.post('/disableStudent', async (req, res) => {
  try {
    const { id } = req.body

    // verificar que los datos requeridos estén presentes
    if (!id) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    // Verificar que el alumno exista
    const alumno = await turso.execute({
      sql: 'SELECT * FROM Alumnos WHERE id = ? AND activo = "Activo" OR activo = "Pendiente"',
      args: [id]
    })

    if (alumno.rows.length === 0) {
      return res.status(400).json({ error: 'Alumno no existe' })
    }

    // Desactivar el alumno
    const resultado = await turso.execute({
      sql: 'UPDATE Alumnos SET activo = "Inactivo" WHERE id = ?',
      args: [id]
    })

    if (resultado.affectedRows === 0) {
      return res.status(500).json({ error: 'No se pudo desactivar el alumno' })
    }

    res.json({ Success: 'Alumno desactivado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// cambiar estado de pendiente a activo de un alumno
router.post('/acceptStudent', async (req, res) => {
  try {
    const { id } = req.body

    // verificar que los datos requeridos estén presentes
    if (!id) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    // Verificar que el alumno exista
    const alumno = await turso.execute({
      sql: 'SELECT * FROM Alumnos WHERE id = ? AND activo = "Pendiente"',
      args: [id]
    })

    if (alumno.rows.length === 0) {
      return res.status(400).json({ error: 'Alumno no existe' })
    }

    // Activar el alumno
    const resultado = await turso.execute({
      sql: 'UPDATE Alumnos SET activo = "Activo" WHERE id = ?',
      args: [id]
    })

    if (resultado.affectedRows === 0) {
      return res.status(500).json({ error: 'No se pudo activar el alumno' })
    }

    res.json({ Success: 'Alumno activado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// cambiar datos de un tutor
router.post('/changeTutorData', async (req, res) => {
  try {
    const {
      id,
      nombres,
      apellidos,
      fecha_nacimiento,
      foto_url,
      telefono,
      direccion,
      tipo,
      observaciones
    } = req.body

    // verificar que los datos requeridos estén presentes
    if (!id) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    // Verificar que el tutor exista
    const tutor = await turso.execute({
      sql: 'SELECT * FROM Tutores WHERE id = ? AND activo = 1',
      args: [id]
    })

    if (tutor.rows.length === 0) {
      return res.status(400).json({ error: 'Usuario no existe' })
    }

    // Cambiar los datos del tutor
    const resultado = await turso.execute({
      sql: 'UPDATE Tutores SET nombres = ?, apellidos = ?, fecha_nacimiento = ?, foto_url = ?, telefono = ?, direccion = ?, tipo = ?, observaciones = ? WHERE id = ?',
      args: [
        nombres,
        apellidos,
        fecha_nacimiento,
        foto_url,
        telefono,
        direccion,
        tipo,
        observaciones,
        id
      ]
    })

    if (resultado.affectedRows === 0) {
      return res
        .status(500)
        .json({ error: 'No se pudo cambiar los datos del tutor' })
    }

    res.json({ Success: 'Datos del tutor cambiados correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// cambiar datos de un alumno
router.post('/changeStudentData', async (req, res) => {
  try {
    const {
      id,
      nombres,
      apellidos,
      fecha_nacimiento,
      telefono,
      direccion,
      tutor_id,
      modulo_id,
      activo,
      observaciones
    } = req.body

    // verificar que los datos requeridos estén presentes
    if (!id) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    // Verificar que el alumno exista
    const alumno = await turso.execute({
      sql: 'SELECT * FROM Alumnos WHERE id = ? AND activo = "Activo"',
      args: [id]
    })

    if (alumno.rows.length === 0) {
      return res.status(400).json({ error: 'Alumno no existe' })
    }

    // Cambiar los datos del alumno
    const resultado = await turso.execute({
      sql: 'UPDATE Alumnos SET nombres = ?, apellidos = ?, fecha_nacimiento = ?, telefono = ?, direccion = ?, tutor_id = ?, modulo_id = ?, activo = ?, observaciones = ? WHERE id = ?',
      args: [
        nombres,
        apellidos,
        fecha_nacimiento,
        telefono,
        direccion,
        tutor_id,
        modulo_id,
        activo,
        observaciones,
        id
      ]
    })

    if (resultado.affectedRows === 0) {
      return res
        .status(500)
        .json({ error: 'No se pudo cambiar los datos del alumno' })
    }

    res.json({ Success: 'Datos del alumno cambiados correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/registerAttendance', async (req, res) => {
  try {
    const { alumno_id, fecha, pregunta, tipo } = req.body

    // verificar que los datos requeridos estén presentes
    if (!alumno_id || !fecha || !tipo) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    // Verificar que el alumno exista
    const alumno = await turso.execute({
      sql: 'SELECT * FROM Alumnos WHERE id = ? AND activo = "Activo"',
      args: [alumno_id]
    })

    if (alumno.rows.length === 0) {
      return res.status(400).json({ error: 'Alumno no existe' })
    }

    // Agregar la asistencia
    const resultado = await turso.execute({
      sql: 'INSERT INTO Asistencias (alumno_id, fecha, pregunta, tipo) VALUES (?, ?, ?, ?)',
      args: [alumno_id, fecha, pregunta, tipo]
    })

    if (resultado.affectedRows === 0) {
      return res
        .status(500)
        .json({ error: 'No se pudo registrar la asistencia' })
    }

    res.json({ Success: 'Asistencia registrada correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Buscar alumno por nombres y apellidos "LIKE"
router.post('/searchStudent', async (req, res) => {
  try {
    const { search } = req.body

    // verificar que los datos requeridos estén presentes
    if (!search) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    // Buscar el alumno
    const resultado = await turso.execute({
      sql: 'SELECT id, nombres, apellidos, telefono FROM Alumnos WHERE nombres LIKE ? OR apellidos LIKE ?',
      args: [`%${search}%`, `%${search}%`]
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
