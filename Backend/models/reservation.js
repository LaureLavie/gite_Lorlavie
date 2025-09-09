import mongoose from "mongoose";

/**
 * Modèle Reservation unifié
 * - Remplace les anciens modèles Reservation et ConfirmReservation
 * - Gère tout le cycle de vie d'une réservation
 */
const ReservationSchema = new mongoose.Schema({
  numero: {
    type: String,
    unique: true,
    required: true,
  }, // Numéro visible par le client (ex: RES-20260109-1234)

  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },

  // Dates de séjour
  dateArrivee: { type: Date, required: true },
  dateDepart: { type: Date, required: true },

  // Personnes
  nombrePersonnes: { type: Number, required: true, min: 1, max: 6 },
  personnesSupplementaires: { type: Number, default: 0, max: 2 }, // Max 8 total

  // Options et services
  options: {
    menage: { type: Boolean, default: false },
    commentaires: { type: String, maxlength: 500 },
  },

  // Paiement
  prixTotal: { type: Number, required: true },
  modePaiement: {
    type: String,
    enum: ["carte", "espece", "en ligne"],
    required: true,
  },

  // États de la réservation
  statut: {
    type: String,
    enum: ["En Attente", "Confirmee", "Annulee", "Refusee"],
    default: "En Attente",
  },

  // Gestion des modifications admin
  raisonRefus: { type: String }, // Si refusée
  modificationsAdmin: { type: String }, // Notes de l'admin

  // Dates de suivi
  dateCreation: { type: Date, default: Date.now },
  dateValidation: { type: Date }, // Quand l'admin valide/refuse
  dateModification: { type: Date }, // Dernière modification
});

// Middleware pour générer le numéro de réservation
ReservationSchema.pre("save", function (next) {
  if (!this.numero) {
    const now = new Date();
    const dateString = now.toISOString().replace(/[-:T]/g, "").slice(0, 8); // YYYYMMDD
    const rand = Math.floor(1000 + Math.random() * 9000);
    this.numero = `RES-${dateString}-${rand}`;
  }
  next();
});

// Méthode pour calculer le nombre de nuits
ReservationSchema.methods.getNombreNuits = function () {
  const arrivee = new Date(this.dateArrivee);
  const depart = new Date(this.dateDepart);
  return Math.ceil((depart - arrivee) / (1000 * 60 * 60 * 24));
};

// Méthode pour vérifier si la réservation peut être modifiée
ReservationSchema.methods.peutEtreModifiee = function () {
  return this.statut === "En Attente" || this.statut === "Confirmee";
};

export default mongoose.model("Reservation", ReservationSchema);
