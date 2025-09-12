import Admin from "../models/admin.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";
import {
  sendMail,
  htmlActivateAccount,
  htmlResetPassword,
} from "../middlewares/mail.js";

/**
 * Inscription d'un nouvel administrateur
 * - Hash du mot de passe avec bcrypt (12 rounds)
 * - Création en base MongoDB
 * - Retourne l'admin créé (sans le hash)
 */
export const registerAdmin = async (req, res) => {
  try {
    // Validation basique des champs
    const { name, surname, email, password } = req.body;
    if (!name || !surname || !email || !password) {
      return res.status(400).json({
        message: "veuillez entrer votre nom, prénom, mail et mot de passe",
      });
    }
//vérifie si l'admin existe ou pas encore
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        message: "Cet utilisateur existe déjà. Veuillez vous connecter",
      });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Création de l'admin
    const newAdmin = await Admin.create({
      name,
      surname,
      email,
      password: hashedPassword,
      role: "admin",
    });

    // Génère un token d'activation et envoie le mail associé
    const token = v4();
    newAdmin.token = token;
    const link = `${process.env.CLIENT_URL}/pages/administrateur/activation.html?token=${token}`;
    const html = htmlActivateAccount(surname, link);
    await sendMail(email, "Activation de votre Compte Admin", html);
    await newAdmin.save();

    // Retourner l'admin créé pour que le frontend puisse vérifier data.admin
    res.status(201).json({
      message: "Administrateur créé avec succès",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        surname: newAdmin.surname,
        email: newAdmin.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

/**
 * Active le compte utilisateur via le token reçu par mail
 */
export const activateAccount = async (req, res) => {
  try {
    const { token } = req.params;
    const admin = await Admin.findOne({ token });
    if (!admin) {
      return res.status(400).json({ message: "Token invalide ou expiré" });
    }
    if (admin.isVerified) {
      return res.status(400).json({ message: "Compte déjà activé" });
    }
    admin.isVerified = true;
    admin.token = null;
    await admin.save();
    res.status(200).json({ message: "Compte activé avec succès" });
  } catch (error) {
    console.error("Activation error:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

/**
 * Connexion administrateur -
 * - Vérifie email et mot de passe
 * - Génère un token JWT sécurisé
 */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation des champs
    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Retourner la réponse avec le token
    res.status(200).json({
      message: "Connexion réussie",
      token: token,
      admin: {
        id: admin._id,
        name: admin.name,
        surname: admin.surname,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
};

// Déconnexion de l'administrateur en supprimant le cookie JWT
export const logoutAdmin = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      // Décodage du token pour récupérer l'ID admin
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`Admin ${decoded.id} s'est déconnecté`);
    }
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    console.error("Logout error :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

//Lance la procédure de mot de passe oublié, envoie un mail avec un lien de réinitialisation
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Veuillez entrer votre email" });
    }
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(400)
        .json({ message: "Aucun compte trouvé avec cet email" });
    }

    // Générer un token JWT pour la réinitialisation et envoie le mail associé
    const resetToken = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Lien vers la page de réinitialisation avec le token en paramètre
    const resetLink = `${process.env.CLIENT_URL}/pages/administrateur/new_password.html?token=${resetToken}`;
    const html = htmlResetPassword(admin.surname, resetLink);
    await sendMail(email, "Réinitialisation de votre mot de passe", html);
    res
      .status(200)
      .json({ message: "Email de réinitialisation envoyé avc succès" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: "Nouveau mot de passe requis" });
    }
    // vérifier le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(400).json({ message: "Administrateur non trouvé" });
    }
    //hasher le nouveau de passe
    const hashedPassword = await bcrypt.hash(password, 12);
    admin.password = hashedPassword;
    await admin.save();
    res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error("Reset password error:", error);
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(400).json({ message: "Token invalide ou expiré" });
    }
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

/**
 * Récupérer tous les administrateurs
 * - Pour interface de gestion
 */
export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({}, { password: 0 }); // On masque le hash
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
    const admin = await Admin.findById(req.params.id, { password: 0 });
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
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 12);
    }
    const admin = await Admin.findByIdAndUpdate(req.params.id, update, {
      new: true,
      fields: { password: 0 },
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
