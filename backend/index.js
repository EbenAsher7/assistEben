import express from "express";
import cors from "cors";
import apiUser from "./routes/apiUser.js";
import authMiddleware from "./middleware/auth.js";
import { turso } from "./database/connection.js";

const app = express();
const port = process.env.PORT || 3000;

// Usar CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Middleware de autenticación
app.use(authMiddleware);

// Usar rutas
app.use("/user", apiUser);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
