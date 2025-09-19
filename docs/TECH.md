# Documentation Technique – Tic Tac Toe Dynamique

## 1. Structure HTML

Le HTML est structuré en 5 étapes principales (`steps`) correspondant au processus de configuration et de jeu.

### 1.1 Structure générale

```html
<div class="container">
    <div id="step-0" class="step active">...</div>
    <div id="step-1" class="step">...</div>
    <div id="step-2" class="step">...</div>
    <div id="step-3" class="step">...</div>
    <div id="step-4" class="step">...</div>
</div>
- **container** : enveloppe principale, applique le style principal du jeu.  
- **step** : chaque étape est masquée (`display: none`) sauf celle avec la classe `active`.  
- La navigation entre étapes est gérée par le **Step Manager** (JS).

### 1.2 Étapes détaillées

**Step 0 – Accueil**  
- Titre et description.  
- Bouton **Commencer** pour passer à la configuration.

**Step 1 – Configuration Joueur 1**  
- Input pour le nom du joueur.  
- Sélecteur de symbole (`symbol-selector`) avec `div.symbol-option`.  
- Validation affichée via `<p class="error">`.

**Step 2 – Configuration Joueur 2**  
- Même structure que Step 1.  
- Vérification que le nom est différent de Joueur 1.

**Step 3 – Paramètres du jeu**  
- Taille de la grille (`select#grid-size`).  
- Nombre d’alignements pour gagner (`input#win-condition`).  
- Nombre de parties (`select#match-count`).  
- Bouton pour démarrer le jeu.

**Step 4 – Jeu**  
- Menu burger pour gérer les actions : Nouvelle partie, Nouveau jeu, Paramètres.  
- Affichage des joueurs et scores (`player-info`).  
- Plateau de jeu (`#board`) généré dynamiquement par JS.  
- Message du tour actuel (`#game-message`).

### 1.3 Scripts liés

```html
<script type="module" src="/script/storage.js"></script>
<script type="module" src="/script/ui.js"></script>
<script type="module" src="/script/game.js"></script>
<script type="module" src="/script/stepManager.js"></script>
<script type="module" src="/script/menuBurger.js"></script>

- **Chargement modulaire** : permet de séparer la logique du jeu en différents fichiers pour plus de clarté et maintenabilité.  
- **Responsabilité par fichier** : chaque module JS gère une partie précise du jeu (données, UI, logique, navigation, menu burger).

## 2. CSS

Le CSS est conçu selon les principes de **design moderne** et **responsive**.

### 2.1 Variables globales

Définies dans `:root` pour faciliter la maintenance et la réutilisation :

```css
:root {
    --primary-gradient: linear-gradient(...);
    --card-bg: rgba(...);
    --primary-color: #667eea;
    --text-color: #4a5568;
    --spacing-sm: clamp(0.5rem, 2vw, 1rem);
    --board-size: min(80vw, 80vh, 500px);
}

- **Couleurs** : dégradés, texte, erreurs, succès.  
- **Tailles et espacements** : adaptatifs grâce à `clamp()` pour un rendu responsive.  
- **Taille du plateau** : ajustable automatiquement selon la taille de la fenêtre (viewport).

### 2.2 Layout

- **.container** : centre le contenu, applique blur et shadow pour effet *glassmorphism*.  
- **.step** : affichage contrôlé par la classe `active` (flex centré).  
- **.game-layout** : grille CSS pour positionner joueurs et plateau.  
- **Responsive** : via `@media` pour différents breakpoints (desktop, tablette, mobile).  

### 2.3 Composants principaux

**Boutons et inputs**  
- `.btn` et `.btn-secondary` avec hover et états active.  
- Inputs avec styles de focus.  

**Symboles**  
- `.symbol-option` avec `selected` pour indiquer le choix actif.  
- Effets de hover et sélection dynamique.  

**Plateau**  
- `#board` est une grille CSS (`display:grid`).  
- Chaque `.cell` a `aspect-ratio: 1/1`.  
- Styles pour cellules prises (`taken`) ou gagnantes (`winner`).  

**Menu burger**  
- `.burger-btn` toggle `active` pour ouvrir/fermer le panel.  
- `.burger-panel` animé avec `transform: translateX`.

## 3. JavaScript

Le JS est organisé en 5 modules principaux.

### 3.1 storage.js
**Responsabilité** : gestion de l’état du jeu.  

Contient `gameState` avec toutes les informations : joueurs, grille, scores, étape actuelle.  

**Fonctions** :  
- `saveGameState()` → sauvegarde dans `localStorage`.  
- `loadGameState()` → récupère l’état sauvegardé.  

### 3.2 ui.js
**Responsabilité** : mise à jour visuelle du plateau et des informations joueurs.  

**Fonctions** :  
- `updateGameDisplay()` → met à jour noms, symboles, scores et matchs.  
- `createBoard()` → génère dynamiquement les cellules du plateau.  
- Gestion de taille responsive via `handleResize()`.  

### 3.3 game.js
**Responsabilité** : logique du jeu.  

**Fonctions** :  
- `initializeGame()` → initialise le plateau, joueurs et scores.  
- `handleCellClick(index)` → gère le clic sur une cellule.  
- `switchPlayer()` → change le joueur actif.  
- `handleDraw()` → gère le match nul.  
- Interaction avec UI via `updateGameDisplay()`.  

### 3.4 stepManager.js
**Responsabilité** : navigation entre étapes et validation des formulaires.  

**Fonctions** :  
- `showStep(stepNumber)` → affiche une étape.  
- `nextStep(currentStepNumber)` → passe à l’étape suivante si validation OK.  
- `validateStep(stepNumber)` → vérifie les inputs (nom, symbole, taille de grille…).  
- `updatePlayer2Symbols()` → ajuste les symboles disponibles pour Joueur 2.  
- Event listeners pour boutons de navigation et symboles.  

### 3.5 menuBurger.js
**Responsabilité** : gestion du menu burger en jeu.  

**Actions** :  
- Toggle menu.  
- Redémarrer la partie (`initializeGame()`).  
- Revenir aux paramètres (`showStep(3)`).  
- Revenir au début du jeu (`showStep(0)`).
## 4. Flux global du jeu

- **Accueil** → `start-btn` → Step 1.  
- **Configuration Joueur 1** → Step 2 après validation.  
- **Configuration Joueur 2** → Step 3 après validation.  
- **Paramètres du jeu** → Step 4 → initialisation plateau.  

**Jeu :**  
- Clic sur cellule → `handleCellClick()`.  
- Changement joueur → `switchPlayer()`.  
- Fin de partie → message ou reset.  

**Menu burger :**  
- Actions supplémentaires en jeu (nouvelle partie, retour aux paramètres, nouveau jeu).  

## 5. Points techniques clés

- **Stockage persistant** avec `localStorage` → conserve état même après refresh.  
- **Responsive design** grâce à `clamp()` et media queries.  
- **Séparation des responsabilités** via modules JS :  
  - `storage.js` : données.  
  - `ui.js` : affichage.  
  - `game.js` : logique.  
  - `stepManager.js` : navigation/validation.  
  - `menuBurger.js` : menu contextuel.  

**Accessibilité :**  
- Textes descriptifs sur boutons.  
- Focus visible sur inputs.  
- Symboles facilement distinguables.
