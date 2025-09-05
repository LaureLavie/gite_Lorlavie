import jwt from "jsonwebtoken";

/**
 * Middleware d'authentification pour les routes administrateur
 * - Vérifie la présence et la validité du token JWT dans l'en-tête Authorization
 * - Si le token est valide, ajoute les infos admin à la requête et passe au middleware suivant
 * - Sinon, bloque l'accès et retourne une erreur claire
 *
 * Sécurité :
 * - Protège toutes les routes sensibles (CRUD admin, validation avis, etc.)
 * - Conforme aux recommandations OWASP et RGPD
 */
export const verifyAdmin = (req, res, next) => {
  // Récupération du token JWT dans l'en-tête Authorization (format "Bearer <token>")
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token manquant" });
  }
  try {
    // Vérification et décodage du token avec la clé secrète
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Ajout des infos admin à la requête pour usage ultérieur
    req.admin = decoded;
    next(); // Passage au middleware suivant
  } catch (error) {
    res.status(403).json({ error: "Token invalide" });
  }
};
