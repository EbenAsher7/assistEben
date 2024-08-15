import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import api from './routes/api.js'
import user from './routes/user.js'
import gets from './routes/gets.js'
import posts from './routes/posts.js'
import puts from './routes/put.js'
import admin from './routes/admin.js'
import authMiddleware from './middleware/auth.js'

const app = express()
const port = process.env.PORT || 3000

// Usar CORS
app.use(cors())

// Middleware para parsear JSON
app.use(express.json())

// Configurar cookie-parser
app.use(cookieParser())

// Ruta pública para el login
app.use('/api', user)

// Middleware de autenticación
app.use(authMiddleware('Tutor'))

// Usar rutas protegidas
app.use('/api', api)
app.use('/get', gets)
app.use('/post', posts)
app.use('/put', puts)

// Rutas específicas que requieren tipos de usuarios particulares
app.use('/admin', authMiddleware('Administrador'), admin)

// Manejo de errores globales en Express
app.use((err, req, res, next) => {
  console.error('Error en la aplicación:', err.stack)

  // Envía una respuesta genérica al cliente
  res
    .status(500)
    .json({ mensaje: 'Ocurrió un error en el servidor', error: err.message })
})

// Manejo de promesas rechazadas que no fueron capturadas
process.on('unhandledRejection', (razon, promesa) => {
  console.log('Se detectó una promesa rechazada no manejada')
  console.log('Promesa:', promesa)
  console.log('Razón:', razon)
})

// Manejo de excepciones no capturadas en el proceso principal
process.on('uncaughtException', (error) => {
  console.log('Se produjo una excepción no capturada en el proceso principal')
  console.log('Error:', error)
  // process.exit(1)
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
