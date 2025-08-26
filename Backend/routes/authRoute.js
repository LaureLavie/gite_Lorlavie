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

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Les routes suivantes sont protégées
router.get("/", verifyAdmin, getAdmins);
router.get("/:id", verifyAdmin, getAdminById);
router.put("/:id", verifyAdmin, updateAdmin);
router.delete("/:id", verifyAdmin, deleteAdmin);

export default router;
