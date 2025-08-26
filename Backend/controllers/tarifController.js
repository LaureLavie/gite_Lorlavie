import Tarif from "../models/tarif.js";

// Créer un tarif
export const createTarif = async (req, res) => {
  try {
    const tarif = await Tarif.create(req.body);
    res.status(201).json(tarif);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Lire tous les tarifs
export const getTarifs = async (req, res) => {
  try {
    const tarifs = await Tarif.find();
    res.json(tarifs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lire un tarif par ID
export const getTarifById = async (req, res) => {
  try {
    const tarif = await Tarif.findById(req.params.id);
    if (!tarif) return res.status(404).json({ error: "Tarif non trouvé" });
    res.json(tarif);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Modifier un tarif
export const updateTarif = async (req, res) => {
  try {
    const tarif = await Tarif.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!tarif) return res.status(404).json({ error: "Tarif non trouvé" });
    res.json(tarif);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un tarif
export const deleteTarif = async (req, res) => {
  try {
    const tarif = await Tarif.findByIdAndDelete(req.params.id);
    if (!tarif) return res.status(404).json({ error: "Tarif non trouvé" });
    res.json({ message: "Tarif supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Calcul automatique du tarif
export const calculerTarif = async (req, res) => {
  try {
    const { dateArrivee, dateDepart, nombrePersonnes, periode } = req.body;
    const tarif = await Tarif.findOne({ nombrePersonnes, periode });
    if (!tarif) return res.status(404).json({ error: "Tarif non trouvé" });

    // Calcul du nombre de nuits
    const debut = new Date(dateArrivee);
    const fin = new Date(dateDepart);
    const nbNuits = Math.ceil((fin - debut) / (1000 * 60 * 60 * 24));

    const prixTotal = tarif.prixNuit * nbNuits;
    res.json({ prixTotal, nbNuits, tarif });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
