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
import { turso } from './database/connection.js'

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(cookieParser())

const publicRouter = express.Router()
publicRouter.get('/settings', async (req, res) => {
  try {
    const result = await turso.execute('SELECT clave, valor FROM Configuracion')
    const settings = result.rows.reduce((acc, row) => {
      acc[row.clave] = row.valor === 'true'
      return acc
    }, {})
    res.status(200).json(settings)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
app.use('/public', publicRouter)

app.get('/helloWorld', (req, res) => {
  res.json({ status: 'ok', mensaje: 'Hola mundo!' })
})

app.use('/api', user)

app.use(authMiddleware('Tutor'))

app.use('/api', api)
app.use('/get', gets)
app.use('/post', posts)
app.use('/put', puts)

app.use('/admin', authMiddleware('Administrador'), admin)

app.use((err, req, res, next) => {
  console.error('Error en la aplicación:', err.stack)
  res
    .status(500)
    .json({ mensaje: 'Ocurrió un error en el servidor', error: err.message })
})

process.on('unhandledRejection', (razon, promesa) => {
  console.log('Se detectó una promesa rechazada no manejada', razon)
})

process.on('uncaughtException', (error) => {
  console.log('Se produjo una excepción no capturada', error)
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
