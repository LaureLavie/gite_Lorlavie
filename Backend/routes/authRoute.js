/**
 * Routeur Authentification Administrateur
 * - Gère l'inscription, la connexion et la gestion CRUD des comptes admin
 * - Protège les routes sensibles via le middleware verifyAdmin
 * - Conforme au cahier des charges : sécurité, clarté, organisation MVC
 */

import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from "../controllers/adminController.js";
import { verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Inscription d'un nouvel admin (public)
router.post("/register", registerAdmin);

// Connexion admin (public)
router.post("/login", loginAdmin);

// Gestion CRUD admin (routes protégées)
router.get("/", verifyAdmin, getAdmins); // Liste des admins
router.get("/:id", verifyAdmin, getAdminById); // Détail d'un admin
router.put("/:id", verifyAdmin, updateAdmin); // Modification admin
router.delete("/:id", verifyAdmin, deleteAdmin); // Suppression admin

export default router;
