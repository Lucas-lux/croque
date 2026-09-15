import { useMemo } from 'react'
import { computeTasteProfile } from '@/domain/recommendation/profile'
import { recipeRepository } from '@/services/recipeRepository'
import { useSwipeStore } from '@/store/useSwipeStore'

const recipesById = new Map(recipeRepository.getAll().map((r) => [r.id, r]))

export function useTasteProfile() {
  const swipes = useSwipeStore((s) => s.swipes)
  return useMemo(() => computeTasteProfile(swipes, recipesById), [swipes])
}

export function useRecipe(id: string | undefined) {
  return id ? recipeRepository.getById(id) : undefined
}

export const allRecipes = recipeRepository.getAll()
