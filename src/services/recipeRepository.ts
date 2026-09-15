import type { Recipe } from '@/domain/types'
import { RECIPES } from '@/data/recipes'

/**
 * Recipe access goes through this interface so the mocked catalogue can later be
 * swapped for an API, a URL importer or generated recipes without touching the UI.
 */
export interface RecipeRepository {
  getAll(): Recipe[]
  getById(id: string): Recipe | undefined
}

class LocalRecipeRepository implements RecipeRepository {
  private byId = new Map(RECIPES.map((r) => [r.id, r]))

  getAll(): Recipe[] {
    return RECIPES
  }

  getById(id: string): Recipe | undefined {
    return this.byId.get(id)
  }
}

export const recipeRepository: RecipeRepository = new LocalRecipeRepository()
