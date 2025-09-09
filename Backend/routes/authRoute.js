/**
 * Routeur Authentification Administrateur
 * - Gère l'inscription, la connexion, la déconnexion et la gestion CRUD des comptes admin
 * - Protège les routes sensibles via le middleware verifyAdmin
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

// Connexion admin (public)
authRouter.post("/register", registerAdmin);
authRouter.post("/login", loginAdmin);

//Activation du compte et Mot de passe oublié
authRouter.get("/activate/:token", activateAccount);
authRouter.post("/motdepasseoublie", forgotPassword);
authRouter.post("/resetmotdepasse/:token", resetPassword);

//Deconnexion
authRouter.post("/logout", verifyAdmin, logoutAdmin);

// Gestion CRUD admin (routes protégées)
authRouter.get("/", verifyAdmin, getAdmins); // Liste des admins
authRouter.get("/:id", verifyAdmin, getAdminById); // Détail d'un admin
authRouter.put("/:id", verifyAdmin, updateAdmin); // Modification admin
authRouter.delete("/:id", verifyAdmin, deleteAdmin); // Suppression admin

export default authRouter;
