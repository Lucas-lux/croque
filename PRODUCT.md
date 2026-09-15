# Croque — product context

## What it is

Croque is a mobile-first web app that answers one question: « Je ne sais jamais quoi manger ce soir. »
The user swipes recipe cards like a dating app. Likes fill a personal recipe book, every swipe
teaches a taste profile, and a single big button picks tonight's dinner from what the profile knows.

## Who uses it, where

Twenty-to-forty-year-olds in France, in the evening, on the couch or standing in the kitchen,
phone in one hand, deciding what to cook in the next hour. Low light, low patience, high appetite.
The first surface most people see is a TikTok clip of the swipe deck.

## Core jobs (V1)

1. Onboarding: cuisines, hated ingredients, diet, allergens, level, max time, budget, moods. Skippable, editable later.
2. Discover: swipe deck (left = nope, right = like, tap = details) plus buttons and undo.
3. Learning: every swipe updates a per-feature affinity profile; the deck is re-ranked after each swipe.
4. Match: a like on a recipe scoring ≥ 90 % triggers the match moment.
5. Book: liked recipes, searchable, filterable, sortable, favourites, delete.
6. « Je mange quoi ce soir ? »: weighted random pick with optional time, budget, people, fridge and mood criteria.
7. Profile: counts, taste bars, badges, favourites, preference summary, reset.

## Voice

Slightly cheeky, never childish. Second person singular (tu). Red flags / green flags on recipes.
Emoji appear in copy where they carry meaning (the brief uses them); icons in the UI are drawn (lucide).

## Constraints and truths

- No backend in V1: everything persists in localStorage. The store layer is written so a cloud sync can replace it.
- Recipe catalogue is mocked (78 recipes), photos come from Unsplash, Pexels and TheMealDB free media.
- Platform: web (React + Vite), installable-feeling on phones, usable on desktop inside a phone-width column.
- French UI only for now.

## Later (not built, but the architecture leaves room)

AI recommendations, recipe generation, fridge photo analysis, shopping list, accounts and cloud sync,
sharing, seasonal picks, social features, recipe import from URL.
