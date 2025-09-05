import mongoose from "mongoose";

/**
 * Modèle Administrateur
 * - Gère les comptes admin du site
 * - Sécurité : mot de passe stocké en hash
 * - Conforme RGPD : aucune donnée sensible en clair
 */
const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Nom de l'administrateur
    surname: { type: String, required: true }, // Prénom de l'administrateur
    email: { type: String, required: true, unique: true }, // Email unique pour chaque admin
    password: { type: String, required: true }, // Mot de passe haché (jamais en clair)
    role: { type: String, default: "admin" }, // Rôle de l'administrateur
    token: { type: String, default: null }, // Token d'activation/réinitialisation
    isVerified: { type: Boolean, default: false }, // Statut de vérification du compte
  },
  { timestamps: true }
); // Ajoute createdAt et updatedAt automatiquement

export default mongoose.model("Admin", AdminSchema);
