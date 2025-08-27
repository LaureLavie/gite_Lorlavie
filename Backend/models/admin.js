import mongoose from "mongoose";

/**
 * Modèle Administrateur
 * - Gère les comptes admin du site
 * - Sécurité : mot de passe stocké en hash
 * - Conforme RGPD : aucune donnée sensible en clair
 */
const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // Email unique pour chaque admin
  motDePasseHash: { type: String, required: true }, // Mot de passe haché (jamais en clair)
  derniereConnexion: { type: Date }, // Date de dernière connexion pour audit
});

export default mongoose.model("Admin", AdminSchema);
