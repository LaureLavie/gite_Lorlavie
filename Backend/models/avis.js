import mongoose from "mongoose";

const AvisSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  texte: { type: String, required: true },
  note: { type: Number, min: 1, max: 5, required: true },
  dateCreation: { type: Date, default: Date.now },
  valide: { type: Boolean, default: false }, // modération
  reponseAdmin: { type: String }, // réponse de l'admin
  dateReponse: { type: Date },
});

export default mongoose.model("Avis", AvisSchema);
