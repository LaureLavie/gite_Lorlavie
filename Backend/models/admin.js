import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  motDePasse: { type: String, required: true },
  dernièreConnexion: { type: Date },
});

export default mongoose.model("Admin", AdminSchema);
