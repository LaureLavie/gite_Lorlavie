/**
 * Routeur Authentification Administrateur
 * - Gère l'inscription, la connexion et la gestion CRUD des comptes admin
 * - Protège les routes sensibles via le middleware verifyAdmin
 * - Conforme au cahier des charges : sécurité, clarté, organisation MVC
 */

import express from "express";
import {
  registerAdmin,
  activateAccount,
  forgotPassword,
  resetPassword,
  logoutAdmin,
  loginAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from "../controllers/adminController.js";
import { verifyAdmin } from "../middlewares/auth.js";

const authRouter = express.Router();

// Inscription d'un nouvel admin (public)
authRouter.post("/register", registerAdmin);

// Connexion admin (public)
authRouter.post("/login", loginAdmin);

//Activation du compte et Mot de passe oublié
authRouter.get("/activate/:token", activateAccount);
authRouter.post("/motdepasseoublie", forgotPassword);
authRouter.post("/changerdemotdepasse/:token", resetPassword);

// Gestion CRUD admin (routes protégées)
authRouter.get("/", verifyAdmin, getAdmins); // Liste des admins
authRouter.get("/:id", verifyAdmin, getAdminById); // Détail d'un admin
authRouter.put("/:id", verifyAdmin, updateAdmin); // Modification admin
authRouter.delete("/:id", verifyAdmin, deleteAdmin); // Suppression admin
authRouter.post("/logout", logoutAdmin); //Déconnexion admin

export default authRouter;
