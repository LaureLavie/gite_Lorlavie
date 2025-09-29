import { calculPrixReservation } from "../js/calculPrix.js";

const reservationListDiv = document.getElementById("reservation-list");
const messageDiv = document.getElementById("message");

// Récupérer et afficher la liste
export async function fetchReservations() {
  try {
    const res = await fetch("http://localhost:3000/api/reservations");
    const reservations = await res.json();
    renderReservations(reservations);
  } catch (error) {
    messageDiv.textContent = "Erreur lors du chargement des réservations";
    messageDiv.style.display = "block";
  }
}

// Affichage des cartes + gestion CRUD inline
export function renderReservations(reservations) {
  reservationListDiv.innerHTML = reservations
    .map(
      (r) => `
    <div class="card card--white" data-id="${r._id}">
      <div class="card__badge">${r.client?.surname || ""} ${
        r.client?.name || ""
      }</div>
      <div class="card__icons">
        <button class="icon-modif" title="Modifier" data-id="${
          r._id
        }"><i class="fa fa-pen"></i></button>
        <button class="icon-delete" title="Supprimer" data-id="${
          r._id
        }"><i class="fa fa-trash"></i></button>
        ${
          r.statut === "En Attente"
            ? `<button class="icon-valid" title="Valider" data-id="${r._id}"><i class="fa fa-check"></i></button>`
            : ""
        }
      </div>
      <div class="card__content">
        <div class="card__row"><span>Date d'arrivée:</span> <strong>${r.dateArrivee?.slice(
          0,
          10
        )}</strong></div>
        <div class="card__row"><span>Date de départ:</span> <strong>${r.dateDepart?.slice(
          0,
          10
        )}</strong></div>
        <div class="card__row"><span>Nombre de nuits:</span> <strong>${
          r.nombreNuits
        }</strong></div>
        <div class="card__row"><span>Nombre de personnes:</span> <strong>${
          r.nombrePersonnes
        }</strong></div>
        <div class="card__row"><span>Nombre de personnes supplémentaires:</span> <strong>${
          r.personnesSupplementaires
        }</strong></div>
        <div class="card__row">
  <span>Option ménage:</span>
  <strong>${r.options?.menage ? "Oui" : "Non"}</strong>
</div>
${
  r.options?.commentaires
    ? `<div class="card__row"><span>Commentaire:</span> <strong>${r.options.commentaires}</strong></div>`
    : ""
}
        <div class="card__row"><span>Montant total:</span> <strong>${
          r.prixTotal
        } €</strong></div>
        <div class="card__row"><span>Statut:</span> <strong>${
          r.statut
        }</strong></div>
      </div>
      <div class="edit-div" id="edit-${r._id}" style="display:none;"></div>
    </div>
  `
    )
    .join("");

  // Listeners CRUD
  reservationListDiv.querySelectorAll(".icon-modif").forEach((btn) => {
    btn.addEventListener("click", (e) =>
      showEditDiv(btn.dataset.id, "modifier")
    );
  });
  reservationListDiv.querySelectorAll(".icon-delete").forEach((btn) => {
    btn.addEventListener("click", (e) =>
      showEditDiv(btn.dataset.id, "supprimer")
    );
  });
  reservationListDiv.querySelectorAll(".icon-valid").forEach((btn) => {
    btn.addEventListener("click", (e) =>
      showEditDiv(btn.dataset.id, "valider")
    );
  });
}

// Affiche la div d'édition sous la carte concernée
export async function showEditDiv(id, action) {
  // Récupère la réservation
  const res = await fetch(`http://localhost:3000/api/reservations/${id}`);
  const r = await res.json();
  const editDiv = document.getElementById(`edit-${id}`);

  // Calcul dynamique du montant
  function calcMontant() {
    const dateArrivee = editDiv.querySelector("#edit-date-arrivee").value;
    const dateDepart = editDiv.querySelector("#edit-date-depart").value;
    const nbPersonnes =
      parseInt(editDiv.querySelector("#edit-personnes").value, 10) || 1;
    const supPersonnes =
      parseInt(editDiv.querySelector("#edit-sup-personnes").value, 10) || 0;
    const menage = editDiv.querySelector("#edit-menage").checked;
    let nuits = 1;
    if (dateArrivee && dateDepart) {
      nuits =
        (new Date(dateDepart) - new Date(dateArrivee)) / (1000 * 60 * 60 * 24);
      nuits = nuits > 0 ? nuits : 1;
    }
    return calculPrixReservation(nbPersonnes, nuits, supPersonnes, { menage });
  }

  // Génère le formulaire selon l'action
  editDiv.innerHTML = `
    <form class="form-edit">
      <label>Date d'arrivée</label>
      <input type="date" id="edit-date-arrivee" value="${
        r.dateArrivee?.slice(0, 10) || ""
      }" ${action !== "modifier" ? "disabled" : ""}/>
      <label>Date de départ</label>
      <input type="date" id="edit-date-depart" value="${
        r.dateDepart?.slice(0, 10) || ""
      }" ${action !== "modifier" ? "disabled" : ""}/>
      <label>Nombre de personnes</label>
      <input type="number" id="edit-personnes" value="${
        r.nombrePersonnes
      }" min="1" max="6" ${action !== "modifier" ? "disabled" : ""}/>
      <label>Personnes supplémentaires</label>
      <input type="number" id="edit-sup-personnes" value="${
        r.personnesSupplementaires || 0
      }" min="0" max="2" ${action !== "modifier" ? "disabled" : ""}/>
      <label>
        <input type="checkbox" id="edit-menage" ${
          r.options?.menage ? "checked" : ""
        } ${action !== "modifier" ? "disabled" : ""}/> Ménage
      </label>
      <label>Commentaires</label>
      <textarea id="edit-commentaires" ${
        action !== "modifier" ? "disabled" : ""
      }>${r.options?.commentaires || ""}</textarea>
      <div class="card__row"><span>Montant total:</span> <strong id="edit-montant">${
        r.prixTotal
      } €</strong></div>
      <div class="button-container">
        ${
          action === "modifier"
            ? `<button type="submit" class="button-green">Valider la modification</button>`
            : ""
        }
        ${
          action === "supprimer"
            ? `<button type="button" class="button-red" id="btn-supprimer">Confirmer la suppression</button>`
            : ""
        }
        ${
          action === "valider"
            ? `<button type="button" class="button-green" id="btn-valider">Confirmer la validation</button>`
            : ""
        }
        <button type="button" class="button-grey" id="btn-annuler">Annuler</button>
      </div>
      <div class="successDiv" id="edit-success" style="display:none;"></div>
      <div class="errorDiv" id="edit-error" style="display:none;"></div>
    </form>
  `;
  editDiv.style.display = "block";

  // Recalcul du montant en live
  if (action === "modifier") {
    [
      "#edit-date-arrivee",
      "#edit-date-depart",
      "#edit-personnes",
      "#edit-sup-personnes",
      "#edit-menage",
    ].forEach((sel) => {
      editDiv.querySelector(sel).addEventListener("input", () => {
        editDiv.querySelector("#edit-montant").textContent =
          calcMontant() + " €";
      });
    });
  }

  // Handler annuler
  editDiv.querySelector("#btn-annuler").onclick = () => {
    editDiv.style.display = "none";
  };

  // Handler modification
  if (action === "modifier") {
    editDiv.querySelector("form.form-edit").onsubmit = async (e) => {
      e.preventDefault();
      const data = {
        dateArrivee: editDiv.querySelector("#edit-date-arrivee").value,
        dateDepart: editDiv.querySelector("#edit-date-depart").value,
        nombrePersonnes: parseInt(
          editDiv.querySelector("#edit-personnes").value,
          10
        ),
        personnesSupplementaires: parseInt(
          editDiv.querySelector("#edit-sup-personnes").value,
          10
        ),
        options: {
          menage: editDiv.querySelector("#edit-menage").checked,
          commentaires: editDiv.querySelector("#edit-commentaires").value,
        },
        prixTotal: calcMontant(),
      };
      try {
        const res = await fetch(
          `http://localhost:3000/api/reservations/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );
        const result = await res.json();
        if (res.ok) {
          editDiv.querySelector("#edit-success").textContent =
            "Réservation modifiée avec succès.";
          editDiv.querySelector("#edit-success").style.display = "block";
          editDiv.querySelector("#edit-error").style.display = "none";
          setTimeout(() => {
            editDiv.style.display = "none";
            fetchReservations();
          }, 1200);
        } else {
          editDiv.querySelector("#edit-error").textContent =
            result.error || "Erreur lors de la modification.";
          editDiv.querySelector("#edit-error").style.display = "block";
        }
      } catch (err) {
        editDiv.querySelector("#edit-error").textContent = "Erreur serveur.";
        editDiv.querySelector("#edit-error").style.display = "block";
      }
    };
  }

  // Handler suppression
  if (action === "supprimer") {
    editDiv.querySelector("#btn-supprimer").onclick = async () => {
      if (!confirm("Supprimer cette réservation ?")) return;
      try {
        const res = await fetch(
          `http://localhost:3000/api/reservations/${id}`,
          {
            method: "DELETE",
          }
        );
        const result = await res.json();
        if (res.ok) {
          editDiv.querySelector("#edit-success").textContent =
            "Réservation supprimée.";
          editDiv.querySelector("#edit-success").style.display = "block";
          editDiv.querySelector("#edit-error").style.display = "none";
          setTimeout(() => {
            editDiv.style.display = "none";
            fetchReservations();
          }, 1200);
        } else {
          editDiv.querySelector("#edit-error").textContent =
            result.error || "Erreur lors de la suppression.";
          editDiv.querySelector("#edit-error").style.display = "block";
        }
      } catch (err) {
        editDiv.querySelector("#edit-error").textContent = "Erreur serveur.";
        editDiv.querySelector("#edit-error").style.display = "block";
      }
    };
  }

  // Handler validation
  if (action === "valider") {
    editDiv.querySelector("#btn-valider").onclick = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/reservations/${id}/valider`,
          {
            method: "POST",
          }
        );
        const result = await res.json();
        if (res.ok) {
          editDiv.querySelector("#edit-success").textContent =
            "Réservation validée et mail envoyé.";
          editDiv.querySelector("#edit-success").style.display = "block";
          editDiv.querySelector("#edit-error").style.display = "none";
          setTimeout(() => {
            editDiv.style.display = "none";
            fetchReservations();
          }, 1200);
        } else {
          editDiv.querySelector("#edit-error").textContent =
            result.error || "Erreur lors de la validation.";
          editDiv.querySelector("#edit-error").style.display = "block";
        }
      } catch (err) {
        editDiv.querySelector("#edit-error").textContent = "Erreur serveur.";
        editDiv.querySelector("#edit-error").style.display = "block";
      }
    };
  }
}
export const validerReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const modificationsAdmin = req.body?.modificationsAdmin;

    const reservation = await Reservation.findById(id).populate("client");
    if (!reservation) {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }

    if (reservation.statut !== "En Attente") {
      return res.status(400).json({
        error: "Cette réservation ne peut plus être validée",
      });
    }

    // Mise à jour de la réservation
    reservation.statut = "Confirmee";
    reservation.dateValidation = new Date();
    if (modificationsAdmin) {
      reservation.modificationsAdmin = modificationsAdmin;
    }
    await reservation.save();

    // Confirmation du statut dans le calendrier
    await CalendrierStat.updateMany(
      {
        date: {
          $gte: reservation.dateArrivee,
          $lt: reservation.dateDepart,
        },
        reservationId: reservation._id,
      },
      { statut: "reserve" }
    );

    // Envoi de l'email de confirmation
    const html = htmlReservationConfirmee(reservation, reservation.client);
    await sendMail(
      reservation.client.email,
      "Votre réservation est confirmée !",
      html
    );

    res.json({
      message: "Réservation validée avec succès",
      reservation,
    });
  } catch (error) {
    console.error("Erreur lors de la validation:", error);
    res.status(500).json({ error: error.message });
  }
};

export const refuserReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { raisonRefus } = req.body;

    const reservation = await Reservation.findById(id).populate("client");
    if (!reservation) {
      return res.status(404).json({ error: "Réservation non trouvée" });
    }

    // Mise à jour de la réservation
    reservation.statut = "Refusee";
    reservation.raisonRefus = raisonRefus || "Non spécifiée";
    reservation.dateValidation = new Date();
    await reservation.save();

    // Libération des dates
    await CalendrierStat.libererPeriode(
      reservation.dateArrivee,
      reservation.dateDepart
    );

    // Envoi de l'email de refus
    const html = htmlReservationRefusee(
      reservation,
      reservation.client,
      raisonRefus
    );
    await sendMail(
      reservation.client.email,
      "Concernant votre demande de réservation",
      html
    );

    res.json({
      message: "Réservation refusée",
      reservation,
    });
  } catch (error) {
    console.error("Erreur lors du refus:", error);
    res.status(500).json({ error: error.message });
  }
};

// Initialisation
fetchReservations();
