import confirmReservation from "../models/confirmReservation.js";

//génère un numéro unique pour chaque réservation (basé sur la date et nombre aléatoire)
export const generateNumeroReservation = () => {
  const now = new Date();
  const dateString = now.toISOString().replace(/[-:T]/g, "").slice(0, 12); //AAAAMMDDHHMM
  const rand = Math.floor(1000 + Math.random() * 9000); //4 chiffres aléatoires
  return `Reservation-${dateString}-${rand}`;
};

// Récupère toutes les confirmations de réservations de la base
const getAllConfirmation = async (req, res) => {
  try {
    const confirmations = await confirmReservation.find();
    res.json(confirmations);
  } catch (error) {
    console.error("Error fetching confirmation:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Récupère une confirmation par son identifiant
const getConfirmationById = async (req, res) => {
  try {
    const { id } = req.params;
    const confirmation = await confirmReservation.findById(id);
    if (!confirmation)
      return res.status(404).json({ message: "Confirmation introuvable" });
    res.json(confirmation);
  } catch (error) {
    console.error("Error fetching confirmation:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Supprime une confirmation par son identifiant
const deleteConfirmation = async (req, res) => {
  const { id } = req.params;
  try {
    const confirmation = await confirmReservation.findByIdAndDelete(id);
    if (!confirmation) {
      return res.status(404).json({ message: "Confirmation non trouvée" });
    }
    res.json({ message: "Confirmation supprimée avec succès" });
  } catch (error) {
    console.error("Error deleting confirmation:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

export { getAllConfirmation, getConfirmationById, deleteConfirmation };
