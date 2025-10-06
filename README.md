# 🏡 Gîte Lorlavie - Système de Réservation

Système de gestion de réservations pour gîte avec calendrier synchronisé en temps réel.

## ✨ Fonctionnalités

### Pour les visiteurs

- 📅 Consultation du calendrier en temps réel
- ✅ Vérification automatique de disponibilité
- 💰 Calcul automatique du prix selon les options
- 📧 Confirmation par email
- 🔒 Conformité RGPD

### Pour les administrateurs

- 🎯 Validation/refus des réservations
- 📊 Gestion complète du calendrier
- ✏️ Modification des réservations
- 📧 Envoi automatique d'emails
- 🔐 Interface sécurisée par JWT

---

## 🚀 Installation rapide

### Prérequis

- Node.js (v14 ou supérieur)
- MongoDB (local ou Atlas)
- Compte Gmail pour l'envoi d'emails

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd gite-lorlavie
```

### 2. Configuration Backend

```bash
cd Backend
npm install
```

Créer un fichier `.env` :

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gite-lorlavie

# Serveur
PORT=3000
CLIENT_URL=http://localhost:5503

# JWT (générer une clé sécurisée)
JWT_SECRET=votre_cle_secrete_tres_longue_et_complexe

# Email Gmail
EMAIL_USER=votre-email@gmail.com
EMAIL_PASS=votre_mot_de_passe_application_gmail
```

### 3. Configuration Gmail pour les emails

1. Activer l'authentification à 2 facteurs sur votre compte Gmail
2. Aller dans **Compte Google** → **Sécurité** → **Mots de passe des applications**
3. Générer un mot de passe pour "Application de messagerie"
4. Copier ce mot de passe dans `EMAIL_PASS`

### 4. Démarrer le serveur

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

### 5. Lancer le Frontend

Option - Live Server (VS Code) :

```bash
cd Frontend
# Clic droit sur index.html → "Open with Live Server"
```

Accéder à : `http://localhost:5503`

---

## 📁 Structure du projet

```
gite-lorlavie/
├── Backend/
│   ├── controllers/        # Logique métier
│   │   ├── adminController.js
│   │   ├── calendrierController.js
│   │   ├── clientController.js
│   │   └── reservationController.js
│   ├── models/            # Schémas MongoDB
│   │   ├── admin.js
│   │   ├── calendrier.js
│   │   ├── client.js
│   │   └── reservation.js
│   ├── routes/            # Routes API
│   ├── middlewares/       # Authentification, emails, calculs
│   ├── index.js          # Point d'entrée
│   └── .env              # Variables d'environnement
│
└── Frontend/
    ├── pages/
    │   ├── hote/         # Pages visiteur
    │   └── administrateur/  # Pages admin
    ├── js/               # Scripts JavaScript
    ├── src/              # Styles CSS
    ├── composants/       # Composants réutilisables
    └── index.html        # Page d'accueil
```

---

## 🔧 Configuration des URLs

### Développement local

```javascript
// Dans tous les fichiers JS frontend, remplacer :
http://localhost:3000

// Par votre URL de développement
```

### Production

Mettre à jour dans `.env` :

```env
CLIENT_URL=https://votre-domaine-production.com
```

Et dans le code frontend :

```javascript
const API_URL = "https://votre-api-production.com";
```

---

## 🎨 Personnalisation

### Couleurs du site

Modifier dans `hoteStyle.css` et `adminStyle.css` :

```css
:root {
  --color-primary: #7a5c43; /* Marron principal */
  --color-secondary: #eae7dd; /* Beige clair */
  --color-success: #4caf50; /* Vert */
  --color-error: #f44336; /* Rouge */
  --color-warning: #ff9800; /* Orange */
}
```

### Tarifs

Modifier dans `Backend/middlewares/calculReservation.js` :

```javascript
const tarifs = [65, 75, 85, 95, 105, 115]; // Tarifs pour 1-6 personnes
const tarifPersonneSupp = 30; // Coût par personne supplémentaire
const tarifMenage = 30; // Coût du service ménage
```

---

## 🧪 Tests

### Tester l'API avec Insomnia

````bash
---

## 📝 Création du premier admin

1. Accéder à `/pages/administrateur/register.html`
2. Remplir le formulaire d'inscription
3. Vérifier votre email pour le lien d'activation
4. Cliquer sur le lien d'activation
5. Se connecter via `/pages/administrateur/login.html`

---

## 🔒 Sécurité

### Bonnes pratiques implémentées

- ✅ Mots de passe hashés avec bcrypt (12 rounds)
- ✅ Tokens JWT avec expiration
- ✅ Protection CORS configurée
- ✅ Validation des données côté serveur
- ✅ Sanitisation des entrées
- ✅ Headers de sécurité

---

## 📊 Base de données

### Collections MongoDB

#### `admins`

```javascript
{
  name: String,           // Nom
  surname: String,        // Prénom
  email: String,          // Email unique
  password: String,       // Hash bcrypt
  role: String,           // "admin"
  token: String,          // Token d'activation
  isVerified: Boolean,    // Compte vérifié
  createdAt: Date,
  updatedAt: Date
}
````

#### `clients`

```javascript
{
  name: String,
  surname: String,
  email: String,
  telephone: String,
  adresseComplete: {
    adresse: String,
    ville: String,
    codePostal: String,
    pays: String
  }
}
```

#### `reservations`

```javascript
{
  client: ObjectId,                    // Référence Client
  dateArrivee: Date,
  dateDepart: Date,
  nombrePersonnes: Number,             // 1-6
  personnesSupplementaires: Number,    // 0-2
  options: {
    menage: Boolean,
    commentaires: String
  },
  prixTotal: Number,
  modePaiement: String,               // "carte", "espece", "en ligne"
  statut: String,                     // "En Attente", "Confirmee", "Annulee", "Refusee"
  raisonRefus: String,
  modificationsAdmin: String,
  dateCreation: Date,
  dateValidation: Date,
  dateModification: Date
}
```

#### `calendrierstats`

```javascript
{
  date: Date,                         // Date unique
  statut: String,                     // "disponible", "reserve", "bloque"
  reservationId: ObjectId,            // Si réservé
  notes: String,
  modifiePar: String,
  dateModification: Date
}
```

---

## 🐛 Débogage

### Erreurs courantes

#### 1. "MongoNetworkError"

**Cause** : Impossible de se connecter à MongoDB  
**Solution** :

- Vérifier l'URL MongoDB dans `.env`
- Autoriser l'IP dans MongoDB Atlas (0.0.0.0/0 pour dev)
- Vérifier la connexion internet

#### 2. "Token manquant"

**Cause** : Non authentifié ou token expiré  
**Solution** :

- Se reconnecter
- Vérifier que `JWT_SECRET` est dans `.env`
- Nettoyer le localStorage du navigateur

#### 3. "Les dates ne sont pas disponibles"

**Cause** : Dates déjà réservées ou bloquées  
**Solution** :

- Vérifier le calendrier admin
- Libérer les dates si nécessaire
- Vérifier qu'il n'y a pas de conflit

#### 4. "CORS Error"

**Cause** : Origine non autorisée  
**Solution** :
Ajouter l'origine dans `Backend/index.js` :

```javascript
const allowedOrigins = [
  "https://gite-lorlavie.onrender.com",
  "http://localhost:5503",
  "http://127.0.0.1:5503",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "http://votre-nouvelle-url", // Ajouter ici
];
```

#### 5. Emails non envoyés

**Cause** : Configuration Gmail incorrecte  
**Solution** :

- Utiliser un mot de passe d'application, pas le mot de passe principal
- Vérifier que l'authentification 2FA est activée
- Tester avec un autre email si nécessaire

---

## 📖 API Documentation

### Authentification

#### POST `/api/auth/register`

Inscription d'un nouvel admin

```json
{
  "name": "Dupont",
  "surname": "Jean",
  "email": "jean.dupont@example.com",
  "password": "motdepasse123"
}
```

#### POST `/api/auth/login`

Connexion admin

```json
{
  "email": "jean.dupont@example.com",
  "password": "motdepasse123"
}
```

Retourne : `{ token: "...", admin: {...} }`

### Calendrier

#### GET `/api/calendrier/disponibles/:annee/:mois`

Obtenir les dates non disponibles d'un mois (Public)

#### POST `/api/calendrier/verifier`

Vérifier la disponibilité d'une période (Public)

```json
{
  "dateArrivee": "2025-10-01",
  "dateDepart": "2025-10-05"
}
```

#### PUT `/api/calendrier/dates` 🔒

Modifier le statut de dates (Admin)

```json
{
  "dates": ["2025-10-01", "2025-10-02"],
  "statut": "bloque",
  "notes": "Maintenance"
}
```

### Réservations

#### POST `/api/reservations`

Créer une réservation (Public)

```json
{
  "client": {
    "name": "Martin",
    "surname": "Sophie",
    "email": "sophie.martin@example.com",
    "telephone": "0612345678",
    "adresseComplete": {
      "adresse": "10 Rue de la Paix",
      "ville": "Paris",
      "codePostal": "75001",
      "pays": "France"
    }
  },
  "dateArrivee": "2025-10-01",
  "dateDepart": "2025-10-05",
  "nombrePersonnes": 4,
  "personnesSupplementaires": 1,
  "options": {
    "menage": true,
    "commentaires": "Arrivée tardive prévue"
  },
  "prixTotal": 410,
  "modePaiement": "carte"
}
```

#### GET `/api/reservations` 🔒

Liste des réservations (Admin)

#### GET `/api/reservations/:id` 🔒

Détails d'une réservation (Admin)

#### PUT `/api/reservations/:id` 🔒

Modifier une réservation (Admin)

#### POST `/api/reservations/:id/valider` 🔒

Valider une réservation (Admin)

#### POST `/api/reservations/:id/refuser` 🔒

Refuser une réservation (Admin)

```json
{
  "raisonRefus": "Dates non disponibles finalement"
}
```

#### DELETE `/api/reservations/:id` 🔒

Supprimer une réservation (Admin)

🔒 = Nécessite un token JWT dans le header : `Authorization: Bearer <token>`

---

## 🎯 Scénarios d'utilisation

### Scénario 1 : Réservation standard

1. Client consulte le calendrier → voit les dates vertes
2. Sélectionne dates d'arrivée et départ
3. Configure : 2 personnes, pas de ménage
4. Remplit formulaire avec infos personnelles
5. Accepte RGPD et valide
6. Reçoit email "Réservation en attente"
7. Admin valide dans les 24h
8. Client reçoit email "Réservation confirmée"

### Scénario 2 : Blocage de dates

1. Admin se connecte
2. Va dans Calendrier
3. Sélectionne "Fermé"
4. Clique sur les dates à bloquer
5. Valide
6. Dates apparaissent en jaune pour les clients

### Scénario 3 : Modification de réservation

1. Admin va dans Réservations
2. Clique sur l'icône crayon
3. Modifie les dates/options
4. Le prix se recalcule automatiquement
5. Valide
6. Email "Réservation modifiée" envoyé au client

---

## 🚢 Déploiement en production

### Render.com (Backend)

```bash
# 1. Créer un nouveau Web Service
# 2. Connecter votre repo GitHub
# 3. Configuration :
Build Command: cd Backend && npm install
Start Command: cd Backend && npm start
Environment Variables: Ajouter toutes les variables du .env
```

### Render (Frontend)

```bash
# 1. Connecter votre repo GitHub
# 2. Créer un nouveau Static Service
# 3. Configuration :
Build Command: # Aucune
Publish Directory: Frontend
```

### Variables d'environnement production

```env
MONGODB_URI=mongodb+srv://...
PORT=3000
CLIENT_URL=https://votre-frontend.netlify.app
JWT_SECRET=cle_production_tres_securisee
EMAIL_USER=...
EMAIL_PASS=...
NODE_ENV=production
```

---

## 📈 Améliorations futures

### Fonctionnalités planifiées

- [ ] Paiement en ligne intégré (Stripe)
- [ ] Multi-gîtes (gestion de plusieurs propriétés)
- [ ] Export PDF des réservations
- [ ] Système d'avis clients
- [ ] Chat en direct
- [ ] Multilingue (FR/EN/ES)

---

## 🤝 Contribution

### Workflow Git

```bash
# Créer une branche pour votre fonctionnalité
git checkout -b feature/nouvelle-fonctionnalite

# Faire vos modifications
git add .
git commit -m "Ajout de [fonctionnalité]"

# Pousser et créer une PR
git push origin feature/nouvelle-fonctionnalite
```

### Standards de code

- ES6+ JavaScript
- Commentaires en français
- Indentation 2 espaces
- Noms de variables en camelCase
- Noms de fichiers en camelCase

---

## 📞 Support & Contact

### Aide technique

- 📧 Email : lorlavie@gmail.com
- 📱 Téléphone : 06 86 63 60 73

### Liens utiles

- [Documentation MongoDB](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [JWT Introduction](https://jwt.io/introduction)
- [Nodemailer Docs](https://nodemailer.com/)

---

## 📜 Licence

Ce projet est sous licence propriétaire.  
© 2025 Gîte Lorlavie - Tous droits réservés

---

## ⚡ Quick Start pour développeurs

```bash
# Installation complète en une commande
git clone <repo> && cd gite-lorlavie
cd Backend && npm install && cp .env.example .env
# Éditer .env avec vos valeurs
npm start &
cd ../Frontend
```

Ouvrir : http://localhost:5500

**Happy Coding! 🎉**
