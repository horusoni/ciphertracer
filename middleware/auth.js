import jwt from "jsonwebtoken"

export function authToken(req, res, next) {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ message: "Não autenticado" })
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET)
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: "Token inválido ou expirado" })
  }
}
