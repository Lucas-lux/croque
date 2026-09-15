import { useBookStore } from './useBookStore'
import { usePrefsStore } from './usePrefsStore'
import { useSwipeStore } from './useSwipeStore'

/** Wipes everything: handy to re-record a demo from the onboarding. */
export function resetAll() {
  useSwipeStore.getState().reset()
  useBookStore.getState().reset()
  usePrefsStore.getState().reset()
}
