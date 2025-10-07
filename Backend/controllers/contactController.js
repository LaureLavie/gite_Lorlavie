import { sendContactMail } from "../middlewares/mail.js";

export async function FormContact(req, res) {
  try {
    const { nom, mail, message } = req.body;
    if (!nom || !mail || !message) {
      showMessage(errorDiv, "Tous les champs sont obligatoires.", "error");
      return;
    }

    await sendContactMail(nom, mail, message);
    res.json({ success: true, message: "Message envoyé avec succès !" });
  } catch (err) {
    console.error("Erreur d'envoi du mail :", err);
    res.status(500).json({ error: "Erreur lors de l'envoi du message." });
  }
}
