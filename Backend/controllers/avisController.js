/**
 * Contrôleur des Avis Clients
 * Gère la création, la consultation, la validation, la réponse et la suppression des avis.
 * Respecte le modèle MVC, la sécurité (actions admin), et la clarté pour la certification.
 */

import Avis from "../models/avis.js";

/**
 * Créer un avis client
 * - Validation des champs requis (contenu, note, client)
 * - Création en base MongoDB
 * - Retourne l'avis créé
 */
export const createAvis = async (req, res) => {
  try {
    const { contenu, note, client } = req.body;
    if (!contenu || typeof note !== "number" || !client) {
      return res.status(400).json({ error: "Contenu, note et client requis" });
    }
    const avis = await Avis.create(req.body);
    res.status(201).json(avis);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Récupérer tous les avis
 * - Accessible à tous (public ou admin)
 * - Les avis sont peuplés avec les infos client
 */
export const getAvis = async (req, res) => {
  try {
    const avis = await Avis.find().populate("client");
    res.json(avis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Valider un avis (admin)
 * - Marque l'avis comme validé pour affichage public
 * - Nécessite authentification admin (à gérer côté routes)
 */
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

/**
 * Répondre à un avis (admin)
 * - Permet à l'administrateur de répondre à un avis client
 * - Stocke la réponse et la date de réponse
 * - Nécessite authentification admin (à gérer côté routes)
 */
export const repondreAvis = async (req, res) => {
  try {
    const { reponseAdmin } = req.body;
    if (!reponseAdmin) {
      return res.status(400).json({ error: "Réponse requise" });
    }
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

/**
 * Supprimer un avis (admin)
 * - Supprime l'avis de la base
 * - Nécessite authentification admin (à gérer côté routes)
 */
export const deleteAvis = async (req, res) => {
  try {
    const avis = await Avis.findByIdAndDelete(req.params.id);
    if (!avis) return res.status(404).json({ error: "Avis non trouvé" });
    res.json({ message: "Avis supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
