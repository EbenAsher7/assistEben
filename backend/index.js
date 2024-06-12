import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import api from "./routes/api.js";
import user from "./routes/user.js";
import authMiddleware from "./middleware/auth.js";

const app = express();
const port = process.env.PORT || 3000;

// Usar CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());

// Configurar cookie-parser
app.use(cookieParser());

// Ruta pública para el login
app.use("/api", user);

// Middleware de autenticación
app.use(authMiddleware);

// Usar rutas protegidas
app.use("/api", api);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
