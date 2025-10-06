import express from "express";
import { sendContactMail } from "../middlewares/mail.js";
const contactRouter = express.Router();

contactRouter.post("/", async (req, res) => {
  const { nom, prenom, message } = req.body;
  if (!nom || !prenom || !message) {
    return res
      .status(400)
      .json({ error: "Tous les champs sont obligatoires." });
  }

  try {
    await sendContactMail(nom, prenom, message);
    res.json({ success: true, message: "Message envoyé avec succès !" });
  } catch (err) {
    console.error("Erreur d'envoi du mail :", err);
    res.status(500).json({ error: "Erreur lors de l'envoi du message." });
  }
});

export default contactRouter;
