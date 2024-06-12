import express from "express";
import { turso } from "../database/connection.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Ejemplo de ruta GET
router.post("/user/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const result = await turso.execute({
      sql: "SELECT * FROM tutores WHERE username = ? AND password = ?",
      args: [username, password],
    });

    if (result.rows.length === 0) {
      res.status(401).json({ error: "Usuario o contraseña incorrectos" });
      return;
    }
    const user = result.rows[0];

    const { nombres, apellidos, fecha_nacimiento, foto_url, telefono, direccion, tipo, observaciones, modulo, activo } =
      user;

    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "6d" });

    //return cookie
    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 6,
      sameSite: "none",
      secure: true,
      httpOnly: false,
    });

    res.status(200).json({
      user: {
        nombres: nombres + " " + apellidos,
        fecha_nacimiento,
        foto_url,
        telefono,
        direccion,
        tipo,
        observaciones,
        modulo,
        activo,
      },
      //   token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
