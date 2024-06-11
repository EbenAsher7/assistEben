import express from "express";

const router = express.Router();

// Ejemplo de ruta GET
router.get("/hello", (req, res) => {
  res.json({ message: "Hello, world!" });
});

// Agrega más rutas aquí...

export default router;
