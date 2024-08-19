import express from 'express'
import { turso } from '../database/connection.js'
import dotenv from 'dotenv'
dotenv.config()
/* eslint-disable camelcase */

const router = express.Router()

// actualizar o "eliminar" (desactivar) un alumno existente
router.put('/updateStudent/:AlumnoID', async (req, res) => {
  try {
    const { AlumnoID } = req.params
    const {
      AlumnoNombres,
      AlumnoApellidos,
      AlumnoTelefono,
      AlumnoFechaNacimiento,
      AlumnoObservaciones,
      direccion,
      tutor_id,
      modulo_id,
      AlumnoActivo
    } = req.body

    // verificar que el AlumnoID esté presente
    if (!AlumnoID) {
      return res.status(400).json({ error: 'ID del alumno requerido' })
    }

    // Construir dinámicamente la consulta SQL según los datos proporcionados
    const updateFields = []
    const updateValues = []

    if (AlumnoNombres) {
      updateFields.push('nombres = ?')
      updateValues.push(AlumnoNombres)
    }
    if (AlumnoApellidos) {
      updateFields.push('apellidos = ?')
      updateValues.push(AlumnoApellidos)
    }
    if (AlumnoTelefono) {
      updateFields.push('telefono = ?')
      updateValues.push(AlumnoTelefono)
    }
    if (AlumnoFechaNacimiento) {
      const fecha = new Date(AlumnoFechaNacimiento)
      fecha.setDate(fecha.getDate() + 1) // Sumar un día a la fecha
      updateFields.push('fecha_nacimiento = ?')
      updateValues.push(fecha)
    }
    if (direccion) {
      updateFields.push('direccion = ?')
      updateValues.push(direccion)
    }
    if (tutor_id) {
      // Verificar que el tutor exista
      const tutor = await turso.execute({
        sql: 'SELECT * FROM Tutores WHERE id = ? AND activo = 1',
        args: [tutor_id]
      })
      if (tutor.rows.length === 0) {
        return res.status(400).json({ error: 'Tutor no existe' })
      }
      updateFields.push('tutor_id = ?')
      updateValues.push(tutor_id)
    }
    if (modulo_id) {
      // Verificar que el modulo exista
      const modulo = await turso.execute({
        sql: 'SELECT * FROM Modulos WHERE id = ?',
        args: [modulo_id]
      })
      if (modulo.rows.length === 0) {
        return res.status(400).json({ error: 'Modulo no existe' })
      }
      updateFields.push('modulo_id = ?')
      updateValues.push(modulo_id)
    }
    if (AlumnoActivo !== undefined) {
      updateFields.push('activo = ?')
      updateValues.push(AlumnoActivo)
    }
    if (AlumnoObservaciones) {
      updateFields.push('observaciones = ?')
      updateValues.push(AlumnoObservaciones)
    }

    // Si no se proporcionó ningún campo a actualizar
    if (updateFields.length === 0) {
      return res
        .status(400)
        .json({ error: 'No se proporcionaron campos para actualizar' })
    }

    // Agregar el AlumnoID al final de los valores para la cláusula WHERE
    updateValues.push(AlumnoID)

    // Construir la consulta SQL final
    const sqlQuery = `UPDATE Alumnos SET ${updateFields.join(
      ', '
    )} WHERE id = ?`

    // Ejecutar la consulta
    const resultado = await turso.execute({
      sql: sqlQuery,
      args: updateValues
    })

    if (resultado.affectedRows === 0) {
      return res.status(500).json({ error: 'No se pudo actualizar el alumno' })
    }

    const action = AlumnoActivo === 'Inactivo' ? 'desactivado' : 'actualizado'
    res.status(200).json({ Success: `Alumno ${action} correctamente` })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// actualizar un alumno existente con observaciones y estado activo
router.put('/updateStudentPendant/:AlumnoID', async (req, res) => {
  try {
    const { AlumnoID } = req.params
    const { observaciones = '', activo = '' } = req.body

    // verificar que el AlumnoID esté presente
    if (!AlumnoID) {
      return res.status(400).json({ error: 'ID del alumno requerido' })
    }

    // Construir dinámicamente la consulta SQL según los datos proporcionados
    const updateFields = []
    const updateValues = []

    if (activo === 'Activo') {
      updateFields.push('Activo = ?')
      updateValues.push(activo)
    }
    if (observaciones) {
      updateFields.push('observaciones = ?')
      updateValues.push(observaciones)
    }

    // Si no se proporcionó ningún campo a actualizar
    if (updateFields.length === 0) {
      return res
        .status(400)
        .json({ error: 'No se proporcionaron campos para actualizar' })
    }

    // Agregar el AlumnoID al final de los valores para la cláusula WHERE
    updateValues.push(AlumnoID)

    // Construir la consulta SQL final
    const sqlQuery = `UPDATE Alumnos SET ${updateFields.join(
      ', '
    )} WHERE id = ?`

    // Ejecutar la consulta
    const resultado = await turso.execute({
      sql: sqlQuery,
      args: updateValues
    })

    if (resultado.affectedRows === 0) {
      return res.status(500).json({ error: 'No se pudo actualizar el alumno' })
    }

    res.status(200).json({ Success: 'Alumno actualizado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// actualizar un tutor existente con observaciones y estado activo
router.put('/updateTutor/:TutorID', async (req, res) => {
  try {
    const { TutorID } = req.params
    const {
      nombres = '',
      apellidos = '',
      fecha_nacimiento = '',
      foto_url = '',
      telefono = '',
      direccion = '',
      username = '',
      password = '',
      tipo = '',
      observaciones = '',
      activo = ''
    } = req.body

    // verificar que el TutorID esté presente
    if (!TutorID) {
      return res.status(400).json({ error: 'ID del tutor requerido' })
    }

    // Construir dinámicamente la consulta SQL según los datos proporcionados
    const updateFields = []
    const updateValues = []

    if (nombres) {
      updateFields.push('nombres = ?')
      updateValues.push(nombres)
    }
    if (apellidos) {
      updateFields.push('apellidos = ?')
      updateValues.push(apellidos)
    }
    if (fecha_nacimiento) {
      updateFields.push('fecha_nacimiento = ?')
      updateValues.push(fecha_nacimiento)
    }
    if (foto_url) {
      updateFields.push('foto_url = ?')
      updateValues.push(foto_url)
    }
    if (telefono) {
      updateFields.push('telefono = ?')
      updateValues.push(telefono)
    }
    if (direccion) {
      updateFields.push('direccion = ?')
      updateValues.push(direccion)
    }
    if (username) {
      updateFields.push('username = ?')
      updateValues.push(username)
    }
    if (password) {
      updateFields.push('password = ?')
      updateValues.push(password)
    }
    if (tipo) {
      updateFields.push('tipo = ?')
      updateValues.push(tipo)
    }
    if (observaciones) {
      updateFields.push('observaciones = ?')
      updateValues.push(observaciones)
    }
    if (activo) {
      updateFields.push('activo = ?')
      updateValues.push(activo)
    }

    // Si no se proporcionó ningún campo a actualizar
    if (updateFields.length === 0) {
      return res
        .status(400)
        .json({ error: 'No se proporcionaron campos para actualizar' })
    }

    // Agregar el TutorID al final de los valores para la cláusula WHERE
    updateValues.push(TutorID)

    // Construir la consulta SQL final
    const sqlQuery = `UPDATE Tutores SET ${updateFields.join(
      ', '
    )} WHERE id = ?`

    // Ejecutar la consulta
    const resultado = await turso.execute({
      sql: sqlQuery,
      args: updateValues
    })

    if (resultado.affectedRows === 0) {
      return res.status(500).json({ error: 'No se pudo actualizar el tutor' })
    }

    res.status(200).json({ Success: 'Tutor actualizado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
