import express from "express";
import { turso } from "../database/connection.js";

const router = express.Router();

router.get("/modules", async (req, res) => {
  try {
    const result = await turso.execute("SELECT * FROM modulos");

    // Transformar los datos en el formato deseado
    const columns = result.columns;
    const rows = result.rows;

    const modules = rows.map((row) => {
      let module = {};
      columns.forEach((col, index) => {
        module[col] = row[index];
      });
      return module;
    });

    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/tutors", async (req, res) => {
  try {
    const result = await turso.execute("SELECT * FROM tutores");

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

router.get("/students", async (req, res) => {
  try {
    const result = await turso.execute("SELECT * FROM alumnos");

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

export default router;
