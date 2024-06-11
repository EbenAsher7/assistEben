const authMiddleware = (req, res, next) => {
  // Middleware simple que siempre deja pasar la petición
  const isAuthenticated = true;

  if (isAuthenticated) {
    next(); // Permite que la solicitud continúe
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMiddleware;
