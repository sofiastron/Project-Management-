
## 📌 Nom du projet

**Kanban Simplifié**

## 📝 Description

Kanban Simplifié est une application web Single Page Application (SPA) développée avec Vue.js 3, conçue pour faciliter la gestion de projets et de tâches selon la méthode Kanban. Cette solution intuitive permet aux utilisateurs de créer, organiser et suivre leurs projets et tâches en temps réel.

## 🛠️ Technologies utilisées

- **Vue.js 3** — Framework JavaScript pour construire l’interface utilisateur.
- **Firebase** — Backend serverless (authentification, base de données Cloud Firestore, hébergement).
- **Bootstrap 5** — Framework CSS pour le design et la mise en page responsive.
- **Pinia** — Gestion d’état obligatoire pour gérer l’utilisateur connecté et les données chargées.


L’application est **déployée en ligne** et accessible via le lien suivant :

[https://kanban-vue-firebase-7af2d.web.app]
---

## 🧰 Prérequis

Avant de lancer le projet, assurez-vous d’avoir installé :

- **Node.js** (version 18 ou supérieure)  
- **npm**  
- Un navigateur web moderne (Chrome, Firefox, etc.)  
- Un compte **Firebase**

---

## ⚙️ Configuration Firebase

1. Créer un projet sur **Firebase Console**  
2. Activer :  
   - **Authentication** (Email/Password + Google)  
   - **Cloud Firestore**  
3. Copier les clés Firebase dans le fichier :  

```js
src/firebase/config.js

## ▶️ Lancer le projet en local

### 1️⃣ Cloner le dépôt

```bash
git clone https://github.com/sofiastron/Project-Management-.git
cd Project-Management-
```

### 2️⃣ Installer les dépendances
```bash
npm install
```
### 3️⃣ Démarrer le serveur de développement
```bash
npm run dev

```
### 🌐 Accès à l’application

Une fois le serveur lancé, l’application est accessible à l’adresse :

http://localhost:5173

### ✅ Fonctionnement

## 🔐 Authentification

-Inscription avec email / mot de passe

-Connexion avec email / mot de passe

-Connexion avec Google

-Déconnexion

-Sauvegarde automatique des utilisateurs dans Firestore

Protection des routes privées (Dashboard, Projets)

## 📊 Dashboard

-Liste des projets de l’utilisateur connecté

-Création, modification et suppression de projets

-Chaque projet possède :

un nom

une description

une couleur personnalisée

## 📌 Gestion des tâches (Kanban)

- Tâches organisées en 3 colonnes :

To Do

Doing

Done

- Ajout, modification et suppression des tâches

- Changement de statut

- Synchronisation en temps réel (Firestore onSnapshot)

## Captures d’écran

### Page d’authentification

![Page d’authentification](./assets/authentication.png)

---

### Dashboard

![Dashboard](./assets/dashboard.png)

---

### Page des tâches

![Page des tâches](./assets/tasks.png)


