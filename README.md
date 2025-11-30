# 🌳 XRP Bloom Garden

**Plateforme de donation gamifiée sur XRPL (XRP Ledger)**

XRP Bloom Garden est une application web innovante qui transforme les dons en crypto-monnaie en une expérience ludique et engageante. Les utilisateurs peuvent faire des dons à des associations via XRPL et recevoir des objets virtuels pour construire leur village personnalisé.

## ✨ Fonctionnalités principales

### 🎮 Système de gamification

- **Ouverture de packs** : Animation cinématique avec booster, slider interactif et vidéo de révélation
- **Révélation de cartes** : Affichage des objets obtenus avec leurs raretés (COMMON, RARE, EPIC, LEGENDARY)
- **Système de raretés** : Items avec différentes probabilités et visuels uniques
- **Village personnalisable** : Drag & drop d'objets sur un canvas avec système de taille dynamique

### 💰 Donations XRPL

- **Intégration XRPL** : Support des wallets GemWallet et Crossmark
- **Dons en XRP** : Transactions directes vers les adresses des associations
- **Historique blockchain** : Suivi des donations via l'API XRPL

### 🏢 Gestion multi-rôles

- **Utilisateurs** : Peuvent faire des dons et construire leur village
- **Associations** : Gestion de profil, réception de dons, wallet XRPL
- **Administrateurs** : Validation des associations, gestion des événements

### 🔥 Système d'événements

- **Événements communautaires** : Objectifs collectifs (ex: incendie de forêt)
- **Items spéciaux** : Seaux d'eau et autres objets liés aux événements
- **Progression en temps réel** : Jauge de contribution collective

## 🛠️ Stack technique

- **Framework** : Next.js 16.0.5 avec App Router
- **Langage** : TypeScript
- **Base de données** : Prisma + SQLite (dev) / PostgreSQL (production)
- **Blockchain** : XRPL (XRP Ledger)
- **Wallets** : GemWallet, Crossmark
- **Styling** : Tailwind CSS
- **Icons** : Lucide React

## 📦 Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Un wallet XRPL (GemWallet ou Crossmark)

### Installation des dépendances

```bash
npm install
```

### Configuration de la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev

# Seed la base de données (admin, associations, users, événements)
npm run seed
```

### Variables d'environnement

Créer un fichier `.env` à la racine :

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="votre-secret-jwt-super-securise"
NEXT_PUBLIC_XRPL_NETWORK="testnet" # ou "mainnet"
```

## 🚀 Démarrage

### Mode développement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### Mode production

```bash
npm run build
npm start
```

## 👥 Comptes de test

Après avoir exécuté `npm run seed`, vous aurez accès à :

### Administrateur

- Email : `admin@xrpbloomgarden.com`
- Mot de passe : `admin123`

### Associations approuvées

- **Green Forest Alliance** : `contact@greenforest.org` / `forest123`
- **Ocean Blue Conservation** : `info@oceanblue.org` / `ocean123`
- **Helping Hearts** : `contact@helpinghearts.org` / `hearts123`
- **Forest Fire Prevention** : `contact@firefighters.org` / `fire123`

### Utilisateurs

- **Alice Martin** : `alice@example.com` / `alice123`
- **Bob Dupont** : `bob@example.com` / `bob123`

## 🎨 Objets disponibles

### Nature Items

- 🌱 **Jeune Arbre** (COMMON) - Pine tree
- 🪨 **Rocher** (COMMON)
- 🌸 **Fleurs** (COMMON)
- 🛤️ **Chemin** (COMMON)
- 🐝 **Ruche à Abeilles** (RARE)
- 🏠 **Cabane** (RARE)
- 🏛️ **Sanctuaire** (EPIC)
- 🔥 **Phoenix Tree** (LEGENDARY)

### Event Items

- 💧 **Seau d'eau** (COMMON) - Pour les événements incendie

## 📁 Structure du projet

```
├── app/                      # Pages Next.js (App Router)
│   ├── api/                  # Routes API
│   │   ├── auth/            # Authentification (login, register, me)
│   │   ├── donations/       # Système de dons
│   │   ├── events/          # Gestion des événements
│   │   └── xrpl/            # Intégration XRPL
│   ├── dashboard/           # Dashboards (admin, association)
│   ├── donate/              # Page principale de donation
│   └── ...
├── components/              # Composants React
│   ├── CardReveal.tsx       # Révélation des cartes
│   ├── DraggableItem.tsx    # Items draggables
│   ├── GardenCanvas.tsx     # Canvas du village
│   ├── PackOpening.tsx      # Animation d'ouverture
│   └── providers/           # Context providers
├── lib/                     # Utilitaires
│   ├── auth.ts              # JWT, hashing
│   ├── prisma.ts            # Client Prisma
│   ├── wallets.ts           # Connexion wallets XRPL
│   └── xrpl-*.ts            # Services XRPL
├── prisma/                  # Schema et migrations
│   ├── schema.prisma        # Modèles de données
│   ├── seed.ts              # Données initiales
│   └── migrations/
├── public/images/           # Assets (images des objets)
├── utils/                   # Logique métier
│   ├── gameModels.ts        # Types TypeScript
│   ├── packsData.ts         # Configuration des packs
│   └── packSystem.ts        # Système de tirage
└── types/                   # Déclarations TypeScript
```

## 🔧 Commandes utiles

```bash
# Développement
npm run dev              # Démarrer le serveur dev

# Base de données
npm run seed             # Réinitialiser avec données de test
npx prisma studio        # Interface admin Prisma
npx prisma migrate dev   # Créer une migration

# Build
npm run build            # Build production
npm start                # Démarrer en production

# Linting
npm run lint             # ESLint
```

## 🌐 Déploiement

### Vercel (recommandé)

1. Push sur GitHub
2. Importer le projet sur Vercel
3. Configurer les variables d'environnement
4. Déployer

### Variables d'environnement production

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="votre-secret-production"
NEXT_PUBLIC_XRPL_NETWORK="mainnet"
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT.

## 🔗 Liens utiles

- [Documentation XRPL](https://xrpl.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [GemWallet](https://gemwallet.app/)
- [Crossmark](https://crossmark.io/)

## 📧 Contact

Pour toute question ou suggestion, contactez l'équipe de développement.

---

Made with 💚 by XRP Bloom Garden Team
