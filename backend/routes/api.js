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

export default router;
