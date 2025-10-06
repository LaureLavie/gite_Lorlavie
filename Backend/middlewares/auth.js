import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  // Récupération du token JWT dans l'en-tête Authorization (format "Bearer <token>")
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token manquant" });
  }
  try {
    // Vérification et décodage du token avec la clé secrète
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.admin = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Token invalide" });
  }
};
