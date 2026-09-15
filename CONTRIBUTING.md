# Contribuer à Croque

Merci de vouloir aider. Le projet est petit et volontairement simple : une V1 propre, facile à étendre.

## Démarrer

```bash
npm install
npm run dev
```

Node 20 ou plus. Le type-check tourne avec `npm run typecheck`, le build de production avec `npm run build`.

## Où mettre quoi

- `src/domain/` : logique pure (types, taxonomie, recommandation, ton de l'app). Pas de React ici.
- `src/data/` : le catalogue de recettes. Ajouter une recette = ajouter un objet dans un des trois fichiers.
- `src/store/` : état persisté (Zustand). Les sélecteurs doivent renvoyer des références stables ; dérive les listes avec `useMemo` dans les composants.
- `src/features/` : un dossier par écran.
- `src/components/` : primitives UI partagées. Le système visuel est décrit dans `DESIGN.md`.

## Ajouter une recette

Copie une recette existante et remplis les champs. Points d'attention :

- `kind` (`meat` / `fish` / `vegetarian` / `vegan`) pilote les filtres de régime, sois honnête.
- `allergens` exclut définitivement la recette pour les personnes concernées.
- Marque 3 ou 4 ingrédients avec le dernier argument `true` : ils s'affichent sur la carte.
- `tags` alimente l'apprentissage et « Je mange quoi ce soir ? », choisis-les parmi ceux de `taxonomy.ts`.
- La photo doit être libre de droits (Unsplash, Pexels, TheMealDB) et montrer le bon plat.

## Style

Prettier (`.prettierrc`) : pas de point-virgule, guillemets simples, lignes de 140. Copie en français, tutoiement, une pointe d'humour par écran maximum.

## Pull requests

Une PR par sujet, avec une capture si l'UI change. La CI vérifie le type-check et le build.
