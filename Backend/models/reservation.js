import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
  dateArrivee: { type: Date, required: true },
  dateDepart: { type: Date, required: true },
  nombrePersonnes: { type: Number, required: true, min: 1, max: 6 },
  prixTotal: { type: Number, required: true },
  statut: {
    type: String,
    enum: ["Confirmee", "En Attente", "Annulee"],
    default: "En Attente",
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  dateCreation: { type: Date, default: Date.now },
  dateModification: { type: Date },
});

export default mongoose.model("Reservation", ReservationSchema);
