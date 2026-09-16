# Croque — Tinder des recettes

**Une web app mobile-first qui applique les mécaniques d'une app de dating au choix d'un dîner : on swipe des recettes, l'app apprend les goûts au fil des likes, et un algorithme de scoring répond à la question « je mange quoi ce soir ? ».**

[Dépôt GitHub](https://github.com/Lucas-lux/croque) · Licence MIT · React + TypeScript + Vite

---

## En bref

| | |
|---|---|
| **Rôle** | Conception produit, architecture, implémentation complète (frontend, moteur de recommandation, contenu) |
| **Stack** | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Zustand, React Router |
| **Catalogue** | 187 recettes originales, 54 cuisines sur 5 continents, photos sourcées et vérifiées une à une |
| **Code** | ~10 000 lignes TypeScript, 58 fichiers, zéro `any` implicite, type-check strict |
| **Infra** | Aucun backend : persistance 100 % côté client, prêt pour un déploiement statique (Vercel) |
| **Qualité** | CI GitHub Actions (type-check + build), revue visuelle systématique par capture d'écran automatisée |

---

## Le problème

« Je ne sais jamais quoi manger ce soir » est une friction quotidienne et universelle. Les apps de recettes existantes résolvent la découverte (des milliers de résultats à un mot-clé) mais pas la **décision** : trop de choix, pas de mémoire des goûts, aucune réponse directe à « et là, maintenant ? ».

L'hypothèse produit de Croque : le geste de swipe, popularisé par les apps de rencontre, est le bon outil d'entrée pour ce problème. Il est binaire, rapide, sans charge cognitive — et chaque geste est une donnée. En quelques dizaines de swipes, l'app en sait assez sur l'utilisateur pour arrêter de proposer et commencer à **décider à sa place**.

## Ce que fait l'app

- **Onboarding** en six étapes (cuisines par continent, aliments bannis, régime, allergies, niveau et temps, budget et envies), entièrement facultatif et modifiable ensuite.
- **Swipe** : cartes plein écran, glisser-déposer avec rotation et retour physique, stickers « Miam » / « Nope », boutons alternatifs, annulation du dernier geste, filtre Plats / Desserts en tête d'écran.
- **Apprentissage continu** : chaque swipe met à jour un profil de goûts multi-dimensionnel (détaillé plus bas) ; le prochain paquet de cartes est reconstruit à partir de ce profil, pas d'une liste figée.
- **Match** : un like sur une recette jugée très compatible déclenche un écran plein écran façon « It's a match », avec confettis et ajout direct aux coups de cœur.
- **Mon livre** : les recettes likées, organisées par plats et desserts, recherche floue (tolère les fautes et les pluriels), filtres, tri, favoris.
- **« Je mange quoi ce soir ? »** : un tirage pondéré parmi les recettes compatibles, avec des critères facultatifs — temps disponible, budget, nombre de convives, envie du moment, ingrédients déjà au frigo.
- **Profil** : statistiques de swipe, « type culinaire » généré dynamiquement (ex. *Italo-épicé*), barres de goût, badges, résumé des préférences.

---

## Stack technique — et pourquoi

| Choix | Raison |
|---|---|
| **React 18 + TypeScript** | Typage strict de bout en bout : le domaine (recettes, préférences, scoring) est modélisé en types purs, partagés entre logique et UI sans zone grise. |
| **Vite** | Démarrage et rebuild quasi instantanés ; build de production en quelques secondes, sans configuration webpack à maintenir. |
| **Zustand** | Un store minimal par domaine (préférences, swipes, livre), persistance automatique dans `localStorage` via un middleware, sans le boilerplate de Redux. |
| **Tailwind CSS** | Un système de tokens (couleurs, rayons, ombres) posé une fois dans `tailwind.config.ts`, plutôt que du CSS dispersé. |
| **Framer Motion** | Le geste de swipe (glisser, relâcher, ressort physique, cartes qui montent derrière) est la seule animation vraiment orchestrée de l'app — le reste reste sobre et rapide, à dessein. |
| **React Router** | Navigation par URL classique (`/recipe/:id`, `/book`, `/tonight`…), pour garder l'app « bookmarkable » et proche du web standard. |
| **Aucun backend** | Le produit n'a besoin d'aucun compte pour prouver sa valeur. Toute donnée reste dans le navigateur ; l'architecture (voir plus bas) isole volontairement la persistance pour qu'un backend puisse la remplacer sans toucher à l'UI. |

## Architecture

Le code est organisé pour qu'un changement de couche n'en fasse pas fuir une autre :

```
src/
  domain/                 logique pure — aucune dépendance à React
    types.ts              le modèle de données (Recipe, UserPreferences, TasteProfile…)
    taxonomy.ts            54 cuisines groupées par continent, tags, régimes, allergènes
    recommendation/         le moteur de recommandation (détaillé ci-dessous)
    copy.ts                le ton de l'app centralisé (flags, punchlines)
  data/                    catalogue de recettes (187, réparties par région) + sourcing photos
  services/                RecipeRepository — point d'extension vers une API
  store/                   3 stores Zustand indépendants, persistés
  hooks/                   useDeck, useTasteProfile… le pont entre domaine et UI
  features/                un dossier par écran (discover, book, tonight, profile…)
  components/              primitives UI réutilisables (Button, Chip, Sticker…)
```

Le principe directeur : **le dossier `domain/` ne sait pas que React existe**. Le moteur de recommandation est un ensemble de fonctions pures qui prennent des données et retournent des données. Conséquence directe : il est testable isolément, et remplaçable par un vrai modèle de ML sans toucher à un seul composant.

---

## Le cœur du projet : le moteur de recommandation

C'est la partie la plus travaillée du projet — un système de scoring qui reste simple à lire mais qui produit un comportement qui *a l'air* intelligent : le fil s'affine vraiment, les matchs deviennent plus fréquents, le classement s'adapte au fil de l'eau.

### 1. Une recette est un sac de features pondérées

Chaque recette est décomposée en une liste de « features » — des étiquettes comme `cuisine:italian` ou `tag:spicy` — chacune porteuse d'un poids qui dit à quel point elle explique un like :

| Feature | Exemple | Poids |
|---|---|---|
| Cuisine | `cuisine:japanese` | **3** |
| Type de plat | `kind:vegetarian` | **2** |
| Tag | `tag:spicy`, `tag:quick`… | **1.4** |
| Protéine | `protein:chicken` | **1.2** |
| Catégorie | `course:main` / `course:dessert` | **1** |
| Durée | `time:quick` / `medium` / `long` | **1** |
| Difficulté, coût | `difficulty:2`, `cost:1` | **0.6** |

Le poids de la cuisine domine volontairement : le facteur le plus prédictif d'un « j'aime » est la culture culinaire, pas la difficulté.

### 2. Apprendre une affinité par feature, à chaque swipe

Pour chaque feature vue, l'app compte les likes et les dislikes qu'elle a récoltés, puis calcule une **affinité lissée** (lissage de Laplace) :

```
affinité = (likes + 1) / (likes + dislikes + 2)
```

Ce lissage a une propriété importante : une feature jamais vue vaut `0.5` (neutre), et une feature vue une seule fois ne bascule jamais à `0` ou `1` — il faut plusieurs signaux concordants pour qu'une affinité devienne franchement basse ou haute. Le système ne sur-réagit pas à un swipe isolé.

Les swipes récents comptent un peu plus que les anciens : les 20 derniers pèsent plein pot, au-delà le poids décroît (jusqu'à un plancher de `0.6`) — pour que le profil **suive** des goûts qui évoluent plutôt que de figer une première impression.

### 3. Fusionner préférences explicites et apprentissage implicite

Deux scores existent en parallèle pour chaque recette :

- **Score explicite** : dérivé des réponses de l'onboarding (cuisines cochées, envies, difficulté et budget maximum…).
- **Score appris** : moyenne pondérée des affinités de toutes les features de la recette.

Ils sont mélangés selon une **confiance** qui grandit avec le nombre de swipes :

```
confiance      = min(1, nombre_de_swipes / 16)
poids_appris   = 0.65 × confiance
score final    = score_explicite × (1 − poids_appris) + score_appris × poids_appris
```

Au tout début, l'app s'appuie presque entièrement sur ce que l'utilisateur a déclaré. Après une quinzaine de swipes, le comportement réel prend le dessus — jusqu'à 65 % du poids, jamais 100 % : les préférences explicites (allergies mises à part, qui excluent en dur) gardent toujours une voix, pour éviter qu'un mauvais matin de swipes distraits ne réécrive tout le profil.

### 4. Construire le fil : classement, exploration, diversité

Le paquet de cartes n'est pas un simple tri par score. Trois mécanismes s'ajoutent :

- **Un peu de bruit** (`± 0.04`) à chaque reclassement, pour que deux sessions ne montrent jamais exactement le même ordre à score égal.
- **Une pénalité de diversité** : une recette perd `0.09` point par répétition de sa cuisine parmi les deux dernières cartes tirées — pour éviter une série de cinq plats italiens d'affilée.
- **De l'exploration** : une carte sur quatre est tirée non pas en tête de classement, mais au hasard dans le milieu du peloton (entre le 30ᵉ et le 70ᵉ centile). C'est le compromis classique *exploitation / exploration* : sans lui, le profil ne pourrait jamais découvrir qu'il aime aussi la cuisine éthiopienne s'il n'a jamais eu l'occasion de la voir.

### 5. Du score au « % compatible », et le seuil de match

Le score brut (0 à 1) est étiré pour que l'écart se voie à l'écran — un score déjà bon à 0.7 doit se lire comme franchement engageant, pas comme un vague 70 % :

```
compat = 50 + (score − 0.5) × 140     (borné, puis arrondi)
```

Le seuil de « match » est fixé à **90 %** de compatibilité affichée. Ce chiffre n'est pas arbitraire : il a été calibré à l'usage — un premier réglage à 85 % déclenchait un match presque à chaque like après une quinzaine de swipes, ce qui vidait le moment de son effet de surprise. Le remonter à 90 % (et resserrer l'étirement) a redonné au match sa rareté relative, condition de son impact émotionnel.

### 6. « Je mange quoi ce soir ? » : un problème différent

Le bouton phare ne réutilise pas seulement le score de goût : il résout une décision sous contrainte. À la sélection Plat/Dessert et au score appris s'ajoutent des bonus contextuels :

- jusqu'à **+0.24** si la recette utilise des ingrédients que l'utilisateur a déclaré avoir sous la main,
- **+0.12 à +0.20** si elle correspond à l'envie du moment (healthy, réconfort, épicé…), **−0.12** sinon,
- **+0.08** si elle est déjà dans le livre — le pari qu'une recette déjà aimée est un choix sûr un soir de flemme.

Le temps et le budget disponibles filtrent en dur (pas de plat de deux heures si l'utilisateur a précisé vingt minutes). Puis, plutôt que de renvoyer systématiquement le meilleur score, l'app **tire au sort parmi les six meilleures**, avec des poids qui favorisent la tête de classement sans jamais la rendre certaine — pour que relancer le dé propose autre chose de pertinent, jamais un doublon absurde.

---

## Contenu : un catalogue pensé comme un produit, pas comme un jeu de données

187 recettes originales couvrant 54 cuisines sur cinq continents (Europe, Asie, Moyen-Orient, Afrique, Amériques) — un choix produit assumé : une app qui prétend apprendre « les goûts » d'un utilisateur doit d'abord avoir assez de monde à lui montrer. Chaque recette a été écrite avec :

- des ingrédients quantifiés, mis à l'échelle dynamiquement selon le nombre de convives,
- des étapes de préparation réelles, pas des placeholders,
- une photo vérifiée individuellement (et non générée au hasard sur un mot-clé) pour qu'elle corresponde au plat décrit — sourcée sur des banques libres de droits (Unsplash, Pexels, TheMealDB),
- un ton éditorial cohérent : une punchline par recette, des « red flags » et « green flags » générés dynamiquement selon le profil de l'utilisateur (*« Red flag : 47 minutes de préparation »*, *« Green flag : ça pique, comme tu aimes »*).

## Système de design

Une identité visuelle propre plutôt qu'un décalque de Tinder : fond vert profond (« bistro de nuit »), jaune beurre comme accent d'action, rouge tomate réservé au like et au match, et un motif signature — le sticker de cagette à fruits, ovale et légèrement penché — repris pour les scores de compatibilité, les stamps de swipe et les badges. Typographie unique auto-hébergée (Bricolage Grotesque). Tout est documenté dans `DESIGN.md` : palette, échelle typographique, règles de mouvement, composants.

## Qualité & process

- **CI GitHub Actions** sur chaque push : type-check TypeScript strict puis build de production.
- **Revue visuelle systématique** : un harnais de capture d'écran automatisé (Puppeteer + Chrome headless) rejoue les parcours clés — onboarding, swipe, match, livre, profil — sur mobile et desktop, à chaque changement notable, pour attraper les régressions qu'un `tsc` ne voit pas.
- **Vérification manuelle du contenu** : chaque nouvelle photo de recette a été comparée visuellement au plat qu'elle est censée illustrer avant d'entrer au catalogue.

## Limites connues, honnêtement

- Pas de backend : les données restent sur l'appareil. Un changement de navigateur ou d'appareil repart de zéro. L'architecture (stores Zustand isolés, `RecipeRepository` comme point d'extension) est posée pour qu'une synchro cloud vienne se greffer sans réécriture.
- Le scoring est un système de règles calibré à la main, pas un modèle appris — un choix assumé pour une V1 : simple, explicable, débogable, et suffisant pour produire un comportement convaincant.

## Pistes d'évolution

Comptes et synchronisation cloud, génération de recettes, analyse du contenu du frigo par photo, liste de courses automatique, recommandations saisonnières, partage social, import de recettes depuis une URL, remplacement du moteur de scoring par un modèle appris sur des données réelles.

---

**Dépôt :** [github.com/Lucas-lux/croque](https://github.com/Lucas-lux/croque) · **Licence :** MIT
