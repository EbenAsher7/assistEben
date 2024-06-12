import express from "express";
import { turso } from "../database/connection.js";

const router = express.Router();

//obtener todos los alumnos de todos los tutores
router.get("/getAllStudentsByTutor", async (req, res) => {
  try {
    const result = await turso.execute(
      "SELECT Tutores.id AS tutor_id, Tutores.nombres || ' ' || Tutores.apellidos AS tutor_nombre, Alumnos.id AS alumno_id, Alumnos.nombres || ' ' || Alumnos.apellidos AS alumno_nombre FROM Tutores LEFT JOIN Alumnos ON Tutores.id = Alumnos.tutor_id ORDER BY Tutores.id, Alumnos.id"
    );
    const columns = result.columns;
    const rows = result.rows;

    const students = rows.map((row) => {
      let student = {};
      columns.forEach((col, index) => {
        student[col] = row[index];
      });
      return student;
    });

    const groupedByTutor = students.reduce((acc, student) => {
      const tutorId = student.tutor_id;
      if (!acc[tutorId]) {
        acc[tutorId] = {
          tutor_id: tutorId,
          tutor_nombre: student.tutor_nombre,
          alumnos: [],
        };
      }
      acc[tutorId].alumnos.push({
        alumno_id: student.alumno_id,
        alumno_nombre: student.alumno_nombre,
      });
      return acc;
    }, {});

    const groupedByTutorArray = Object.values(groupedByTutor);

    res.status(200).json(groupedByTutorArray);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//obtener todos los alumnos de un tutor
router.get("/getStudentsByTutor/:tutorId", async (req, res) => {
  try {
    const tutorId = req.params.tutorId;
    const result = await turso.execute({
      sql: "SELECT Alumnos.id AS AlumnoID, Alumnos.nombres AS AlumnoNombres, Alumnos.apellidos AS AlumnoApellidos, Alumnos.fecha_nacimiento AS AlumnoFechaNacimiento, Alumnos.telefono AS AlumnoTelefono, Alumnos.direccion AS AlumnoDireccion, Alumnos.activo AS AlumnoActivo, Alumnos.observaciones AS AlumnoObservaciones FROM Alumnos JOIN Tutores ON Alumnos.tutor_id = Tutores.id WHERE Tutores.id = ?;",
      args: [tutorId],
    });

    const columns = result.columns;
    const rows = result.rows;

    const students = rows.map((row) => {
      let student = {};
      columns.forEach((col, index) => {
        student[col] = row[index];
      });
      return student;
    });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//obtener tutores asignados a un modulo
router.get("/getTutorsByModule/:moduleId", async (req, res) => {
  try {
    const moduleId = req.params.moduleId;
    const result = await turso.execute({
      sql: "SELECT Tutores.id AS TutorID, Tutores.nombres AS TutorNombres, Tutores.apellidos AS TutorApellidos, Tutores.telefono AS TutorTelefono, Tutores.direccion AS TutorDireccion, Tutores.activo AS TutorActivo, Tutores.observaciones AS TutorObservaciones FROM Tutores JOIN Modulos ON Tutores.modulo_id = Modulos.id WHERE Modulos.id = ?;",
      args: [moduleId],
    });

    const columns = result.columns;
    const rows = result.rows;

    const tutors = rows.map((row) => {
      let tutor = {};
      columns.forEach((col, index) => {
        tutor[col] = row[index];
      });
      return tutor;
    });

    res.status(200).json(tutors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// obtener todos los alumnos de un modulo y su tutor
router.get("/getStudentsByModule/:moduleId", async (req, res) => {
  try {
    const moduleId = req.params.moduleId;
    const result = await turso.execute({
      sql: `
        SELECT
          Tutores.id AS TutorID,
          Tutores.nombres AS TutorNombres,
          Tutores.apellidos AS TutorApellidos,
          Alumnos.id AS AlumnoID,
          Alumnos.nombres AS AlumnoNombres,
          Alumnos.apellidos AS AlumnoApellidos,
          Alumnos.telefono AS AlumnoTelefono,
          Alumnos.activo AS AlumnoActivo
        FROM Tutores
        JOIN Alumnos ON Tutores.id = Alumnos.tutor_id
        WHERE Tutores.modulo_id = ?;
      `,
      args: [moduleId],
    });

    const columns = result.columns;
    const rows = result.rows;

    const students = rows.map((row) => {
      let student = {};
      columns.forEach((col, index) => {
        student[col] = row[index];
      });
      return {
        alumno_id: student.AlumnoID,
        alumno_nombres: student.AlumnoNombres + " " + student.AlumnoApellidos,
        alumno_telefono: student.AlumnoTelefono,
        tutor_nombre: student.TutorNombres + " " + student.TutorApellidos,
        alumno_activo: student.AlumnoActivo,
      };
    });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
