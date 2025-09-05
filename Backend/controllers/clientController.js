import Client from "../models/client.js";

/**
 * Récupérer tous les clients
 * - Utilisé pour l'interface d'administration
 */
export const getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Récupérer un client par ID
 * - Permet d'afficher les détails d'un client
 */
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ error: "Client non trouvé" });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
