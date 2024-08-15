import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const authMiddleware = (requiredType) => {
  return (req, res, next) => {
    try {
      // Primero intenta obtener el token de la cookie
      const tokenCookie = req.cookies.token
      if (tokenCookie) {
        const decoded = jwt.verify(tokenCookie, process.env.JWT_SECRET)

        // Verificar si el tipo coincide con el requerido
        if (decoded.tipo !== requiredType) {
          return res.status(403).json({ error: 'Acceso denegado' })
        }

        req.user = decoded
        return next()
      }
    } catch (error) {
      // Si hay un error con el token de la cookie, pasa al siguiente bloque
    }

    try {
      // Si no se encontró un token en la cookie, intenta obtenerlo del header Authorization
      const tokenHeader = req.headers.authorization
      if (tokenHeader) {
        const token = tokenHeader
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Verificar si el tipo coincide con el requerido
        if (decoded.tipo !== requiredType) {
          return res.status(403).json({ error: 'Acceso denegado' })
        }

        req.user = decoded
        return next()
      } else {
        res.status(401).json({
          error:
            'No se ha proporcionado un token por cookie ni por authorization'
        })
      }
    } catch (error) {
      res.status(401).json({ error: 'Token inválido' })
    }
  }
}

export default authMiddleware
