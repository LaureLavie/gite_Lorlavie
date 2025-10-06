import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
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

export default mongoose.model("Reservation", ReservationSchema);
