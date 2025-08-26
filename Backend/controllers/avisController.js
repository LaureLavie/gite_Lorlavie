import Avis from "../models/avis.js";

// Créer un avis (par le client)
export const createAvis = async (req, res) => {
  try {
    const avis = await Avis.create(req.body);
    res.status(201).json(avis);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Voir tous les avis (admin ou public)
export const getAvis = async (req, res) => {
  try {
    const avis = await Avis.find().populate("client");
    res.json(avis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Valider un avis (admin)
export const validerAvis = async (req, res) => {
  try {
    const avis = await Avis.findByIdAndUpdate(
      req.params.id,
      { valide: true },
      { new: true }
    );
    if (!avis) return res.status(404).json({ error: "Avis non trouvé" });
    res.json(avis);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Répondre à un avis (admin)
export const repondreAvis = async (req, res) => {
  try {
    const { reponseAdmin } = req.body;
    const avis = await Avis.findByIdAndUpdate(
      req.params.id,
      { reponseAdmin, dateReponse: new Date() },
      { new: true }
    );
    if (!avis) return res.status(404).json({ error: "Avis non trouvé" });
    res.json(avis);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un avis (admin)
export const deleteAvis = async (req, res) => {
  try {
    const avis = await Avis.findByIdAndDelete(req.params.id);
    if (!avis) return res.status(404).json({ error: "Avis non trouvé" });
    res.json({ message: "Avis supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
