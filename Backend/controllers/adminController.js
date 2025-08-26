import Admin from "../models/admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Inscription admin
export const registerAdmin = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    const hash = await bcrypt.hash(motDePasse, 12);
    const admin = await Admin.create({ email, motDePasse: hash });
    res.status(201).json({ message: "Admin créé", admin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Connexion admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    const valid = await bcrypt.compare(motDePasse, admin.motDePasse);
    if (!valid)
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });

    // Générer le token JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    admin.dernièreConnexion = new Date();
    await admin.save();
    res.json({ token, admin: { email: admin.email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// CRUD admin
export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ error: "Admin non trouvé" });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.motDePasse) {
      update.motDePasse = await bcrypt.hash(update.motDePasse, 12);
    }
    const admin = await Admin.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!admin) return res.status(404).json({ error: "Admin non trouvé" });
    res.json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ error: "Admin non trouvé" });
    res.json({ message: "Admin supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
