# Guide d'Utilisation - Système de Réservation Gîte Lorlavie

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Flux de réservation client](#flux-de-réservation-client)
3. [Gestion admin](#gestion-admin)
4. [Synchronisation calendrier](#synchronisation-calendrier)
5. [Résolution de problèmes](#résolution-de-problèmes)

---

## 🎯 Vue d'ensemble

Le système se compose de deux interfaces principales :

- **Interface Visiteur** : Consultation du calendrier et création de réservations
- **Interface Admin** : Validation des réservations et gestion du calendrier

### Architecture

```
Frontend (HTML/CSS/JS)
    ↓
API REST (Express.js)
    ↓
Base de données (MongoDB)
```

---

## 👥 Flux de réservation client

### Étape 1 : Consultation du calendrier

- **URL** : `/pages/hote/reservationHote.html`
- Le client voit le calendrier avec 3 états :
  - 🟢 **Vert** : Disponible
  - 🔴 **Rouge** : Réservé
  - 🟡 **Jaune** : Fermé par l'admin

### Étape 2 : Sélection des dates

1. Le client sélectionne sa date d'arrivée
2. Le système ajuste automatiquement la date de départ minimum (J+1)
3. Vérification en temps réel de la disponibilité

### Étape 3 : Configuration de la réservation

Le client configure :

- Nombre de personnes (1-6) : tarif de base de 65€ à 115€/nuit
- Personnes supplémentaires (0-2) : 30€/personne
- Option ménage : 30€
- Commentaires éventuels

**Calcul automatique du prix total**

### Étape 4 : Informations et paiement

- **URL** : `/pages/hote/modePaiement.html`
- Saisie des informations personnelles
- Choix du mode de paiement (En ligne / Carte / Espèces)
- **⚠️ RGPD OBLIGATOIRE** : Case à cocher pour accepter la politique de confidentialité

### Étape 5 : Confirmation

- **URL** : `/pages/hote/confirmation.html`
- Affichage du récapitulatif
- Statut initial : **"En Attente"**
- Email automatique envoyé au client

---

## 👨‍💼 Gestion admin

### Connexion

- **URL** : `/pages/administrateur/login.html`
- Token JWT valide 24h
- Stocké dans localStorage

### Dashboard réservations

- **URL** : `/pages/administrateur/reservation.html`
- Liste de toutes les réservations
- Actions disponibles :
  - ✅ **Valider** : Confirme la réservation + email au client
  - ❌ **Refuser** : Libère les dates + email au client
  - ✏️ **Modifier** : Change les détails
  - 🗑️ **Supprimer** : Supprime et libère les dates

### Gestion du calendrier

- **URL** : `/pages/administrateur/calendrier.html`

#### Procédure de modification :

1. Sélectionner le statut désiré (Réservé / Disponible / Fermé)
2. Cliquer sur les dates à modifier
3. Cliquer sur "Valider" pour enregistrer

#### Statuts disponibles :

- **Disponible** : Date ouverte à la réservation
- **Réservé** : Date déjà réservée (automatique lors d'une réservation)
- **Fermé** : Date bloquée par l'admin (maintenance, fermeture annuelle, etc.)

---

## 🔄 Synchronisation calendrier

### Fonctionnement

1. **Client crée une réservation** → Dates passent en "Réservé" automatiquement
2. **Admin valide** → Confirmation permanente dans le calendrier
3. **Admin refuse** → Dates redeviennent "Disponible"
4. **Actualisation automatique** : Toutes les 30 secondes côté client

### API Endpoints

```javascript
// Vérifier disponibilité (Public)
POST /api/calendrier/verifier
Body: { dateArrivee: "2025-06-15", dateDepart: "2025-06-20" }

// Obtenir calendrier du mois (Public)
GET /api/calendrier/disponibles/:annee/:mois

// Modifier statuts (Admin uniquement)
PUT /api/calendrier/dates
Headers: { Authorization: "Bearer <token>" }
Body: { dates: ["2025-06-15"], statut: "bloque" }
```

---

## 🔐 Sécurité

### Protection des routes admin

- Toutes les routes admin nécessitent un token JWT valide
- Middleware `verifyAdmin` vérifie :
  - Présence du token
  - Validité du token
  - Compte admin actif et vérifié

### RGPD

- ✅ Consentement explicite obligatoire
- ✅ Données stockées uniquement pour la réservation
- ✅ Droit d'accès, rectification, suppression

---

## 📧 Emails automatiques

### Types d'emails

1. **Réservation en attente** : Envoyé à la création
2. **Réservation confirmée** : Envoyé lors de la validation admin
3. **Réservation refusée** : Envoyé si l'admin refuse
4. **Réservation modifiée** : Envoyé si l'admin modifie

### Configuration requise

Dans `.env` :

```
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-application
```

---

## 🐛 Résolution de problèmes

### Le calendrier ne s'affiche pas

- ✅ Vérifier la connexion à MongoDB
- ✅ Vérifier que l'API est lancée (`npm start` dans Backend)
- ✅ Ouvrir la console navigateur (F12) pour voir les erreurs

### Les réservations ne s'enregistrent pas

- ✅ Vérifier les champs obligatoires du formulaire
- ✅ Vérifier que la case RGPD est cochée
- ✅ Vérifier la disponibilité des dates

### Les emails ne sont pas envoyés

- ✅ Vérifier les variables d'environnement EMAIL_USER et EMAIL_PASS
- ✅ Activer l'authentification à deux facteurs sur Gmail
- ✅ Générer un "mot de passe d'application" Gmail

### Erreur "Token invalide"

- ✅ Se reconnecter
- ✅ Vérifier que JWT_SECRET est défini dans .env
- ✅ Nettoyer le localStorage du navigateur

---

## 🚀 Déploiement

### Variables d'environnement requises

```env
# Base de données
MONGODB_URI=mongodb+srv://...

# Serveur
PORT=3000
CLIENT_URL=https://votre-domaine.com

# JWT
JWT_SECRET=votre_secret_jwt_très_sécurisé

# Email
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre-mot-de-passe-application
```

### Commandes

```bash
# Backend
cd Backend
npm install
npm start

# Frontend (serveur de développement)
cd Frontend
# Utiliser Live Server ou servir avec un serveur local
```

---

## 📞 Support

Pour toute question ou problème :

- 📧 Email : lorlavie@gmail.com
- 📱 Téléphone : 06 86 63 60 73

---

**Version** : 1.0  
**Dernière mise à jour** : Septembre 2025
