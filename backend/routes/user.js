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

    const user = result.rows[0]

    // Verificar si el usuario está deshabilitado
    if (user.activo === 0) {
      return res.status(403).json({
        error:
          'El usuario se encuentra Deshabilitado. Contacte con su Administrador'
      })
    }

    // Verificar la contraseña
    const hashedPassword = user.password
    const match = await bcrypt.compare(password, hashedPassword)
    if (!match) {
      return res.status(401).json({ error: 'Contraseña incorrecta' })
    }

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

    // Divide el término de búsqueda en palabras individuales
    const searchWords = search.split(' ')

    // Construir condiciones LIKE dinámicamente
    const likeClauses = searchWords
      .map((word) => "CONCAT(a.nombres, ' ', a.apellidos) LIKE ?")
      .join(' AND ')
    const likeParams = searchWords.map((word) => `%${word}%`)

    // Buscar el alumno y su tutor, solo en módulos activos
    const query = `
      SELECT
        a.id,
        a.nombres AS nombres,
        a.apellidos AS apellidos,
        a.telefono AS telefono,
        t.nombres AS tutor_nombres,
        t.apellidos AS tutor_apellidos,
        m.nombre AS modulo_nombre
      FROM
        Alumnos a
      LEFT JOIN
        Tutores t ON a.tutor_id = t.id
      LEFT JOIN
        Modulos m ON a.modulo_id = m.id
      WHERE
        ${likeClauses}
        AND m.activo = 1
    `

    const resultado = await turso.execute({
      sql: query,
      args: likeParams
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

// registramos asistencia
router.post('/user/registerAttendance', async (req, res) => {
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

router.get('/user/modules', async (req, res) => {
  try {
    const result = await turso.execute(
      'SELECT id, nombre, descripcion, fecha_inicio, fecha_fin, horarioFin, horarioInicio, foto_url FROM modulos WHERE activo = 1'
    )

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

router.get('/user/tutors/:moduleId', async (req, res) => {
  const { moduleId } = req.params

  try {
    // Consulta a la base de datos para obtener los tutores del módulo
    const result = await turso.execute({
      sql: `
        SELECT
          t.id,
          t.nombres,
          t.apellidos,
          t.foto_url,
          t.telefono,
          t.tipo
        FROM
          Tutores t
        INNER JOIN
          TutoresModulos tm ON t.id = tm.tutor_id
        WHERE
          tm.modulo_id = ? AND t.activo = 1
      `,
      args: [moduleId]
    })

    const columns = result.columns
    const rows = result.rows

    // Transformar los datos en un formato adecuado
    const tutors = rows.map((row) => {
      const tutor = {}
      columns.forEach((col, index) => {
        tutor[col] = row[index]
      })
      return tutor
    })

    res.status(200).json(tutors)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Registrar nuevo alumno PENDIENTE
router.post('/user/registerAlumno', async (req, res) => {
  try {
    const {
      nombres,
      apellidos,
      fechaNacimiento,
      telefono,
      direccion,
      tutor,
      modulo
    } = req.body

    // Verificar que los datos requeridos estén presentes
    if (!nombres || !apellidos || !telefono || !tutor || !modulo) {
      return res.status(400).json({ error: 'Faltan datos requeridos' })
    }

    // Insertar el nuevo alumno en la tabla Alumnos
    const resultado = await turso.execute({
      sql: `INSERT INTO Alumnos (nombres, apellidos, fecha_nacimiento, telefono, direccion, tutor_id, modulo_id, activo)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Pendiente')`,
      args: [
        nombres,
        apellidos,
        fechaNacimiento,
        telefono,
        direccion,
        tutor,
        modulo
      ]
    })

    if (resultado.affectedRows === 0) {
      return res.status(500).json({ error: 'No se pudo registrar el alumno' })
    }

    res.json({ success: 'Alumno registrado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Registrar nueva pregunta
router.post('/user/preguntas/nueva', async (req, res) => {
  try {
    const { pregunta, preguntaeng } = req.body

    // Verificar que al menos uno de los dos campos esté presente
    if (!pregunta && !preguntaeng) {
      return res
        .status(400)
        .json({ error: 'Se requiere una pregunta en español o inglés' })
    }

    // Verificar que no se envíen ambos campos simultáneamente
    if (pregunta && preguntaeng) {
      return res
        .status(400)
        .json({
          error: 'Solo puedes enviar una pregunta a la vez, en español o inglés'
        })
    }

    // Determinar el campo a insertar y construir la consulta SQL
    const column = pregunta ? 'pregunta' : 'preguntaeng'
    const value = pregunta || preguntaeng

    // Insertar la pregunta en la tabla Preguntas
    const resultado = await turso.execute({
      sql: `INSERT INTO Preguntas (${column}, fecha)
            VALUES (?, date('now'))`,
      args: [value]
    })

    // Verificar si la inserción fue exitosa
    if (resultado.affectedRows === 0) {
      return res.status(500).json({ error: 'No se pudo registrar la pregunta' })
    }

    res.json({ success: 'Pregunta registrada correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
