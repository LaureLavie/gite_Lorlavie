/**
 * Contrôleur Administrateur
 * Toutes les opérations CRUD et authentification pour les administrateurs du site.
 * Respecte le modèle MVC, la sécurité (hash, JWT), et la clarté pour la certification.
 */

import Admin from "../models/admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendMail } from "../middlewares/mail.js"; // Assure-toi d'importer ta fonction d'envoi de mail

/**
 * Inscription d'un nouvel administrateur
 * - Hash du mot de passe avec bcrypt (12 rounds)
 * - Création en base MongoDB
 * - Retourne l'admin créé (sans le hash)
 */
export const registerAdmin = async (req, res) => {
  try {
    // Validation basique des champs
    const { email, motDePasse } = req.body;
    if (!email || !motDePasse) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }
    // Hash du mot de passe
    const hash = await bcrypt.hash(motDePasse, 12);
    // Création de l'admin
    const admin = await Admin.create({ email, motDePasseHash: hash });

    // Envoi de l'email de confirmation
    const dashboardUrl =
      "http://localhost:3000/pages/administrateur/dashboard.html";
    const html = `
      <h2>Bienvenue sur Gîte Lorlavie !</h2>
      <p>Votre compte administrateur a bien été créé.</p>
      <p><strong>Email :</strong> ${email}</p>
      <p>Pour accéder à votre espace administrateur, cliquez sur le lien ci-dessous :</p>
      <a href="${dashboardUrl}">Accéder au dashboard admin</a>
      <br><br>
      <p>Merci et bonne gestion !</p>
    `;
    await sendMail(email, "Confirmation d'inscription administrateur", html);

    // On ne retourne pas le hash
    res
      .status(201)
      .json({ message: "Administrateur créé", admin: { email: admin.email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Connexion administrateur
 * - Vérifie email et mot de passe
 * - Génère un token JWT sécurisé
 * - Met à jour la date de dernière connexion
 */
export const loginAdmin = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    if (!email || !motDePasse) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }
    const admin = await Admin.findOne({ email });
    if (!admin)
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    const valid = await bcrypt.compare(motDePasse, admin.motDePasseHash);
    if (!valid)
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });

    // Générer le token JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    admin.derniereConnexion = new Date();
    await admin.save();
    res.json({ token, admin: { email: admin.email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Récupérer tous les administrateurs
 * - Pour interface de gestion
 */
export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, { motDePasseHash: 0 }); // On masque le hash
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Récupérer un administrateur par ID
 */
export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id, { motDePasseHash: 0 });
    if (!admin)
      return res.status(404).json({ error: "Administrateur non trouvé" });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Modifier un administrateur
 * - Si mot de passe modifié, on le hash
 */
export const updateAdmin = async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.motDePasse) {
      update.motDePasseHash = await bcrypt.hash(update.motDePasse, 12);
      delete update.motDePasse;
    }
    const admin = await Admin.findByIdAndUpdate(req.params.id, update, {
      new: true,
      fields: { motDePasseHash: 0 },
    });
    if (!admin)
      return res.status(404).json({ error: "Administrateur non trouvé" });
    res.json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Supprimer un administrateur
 */
export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin)
      return res.status(404).json({ error: "Administrateur non trouvé" });
    res.json({ message: "Administrateur supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
