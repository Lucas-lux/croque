import { AnimatePresence } from 'framer-motion'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { BottomNav } from '@/components/layout/BottomNav'
import { ToastProvider } from '@/hooks/useToast'
import { usePrefsStore } from '@/store/usePrefsStore'
import { OnboardingScreen } from '@/features/onboarding/OnboardingScreen'
import { DiscoverScreen } from '@/features/discover/DiscoverScreen'
import { RecipeScreen } from '@/features/recipe/RecipeScreen'
import { BookScreen } from '@/features/book/BookScreen'
import { TonightScreen } from '@/features/tonight/TonightScreen'
import { ProfileScreen } from '@/features/profile/ProfileScreen'
import { PreferencesScreen } from '@/features/preferences/PreferencesScreen'

/** Phone-shaped column on large screens, full-bleed on phones. */
function Shell() {
  const { pathname } = useLocation()
  const withNav = !pathname.startsWith('/recipe') && pathname !== '/preferences'
  return (
    <div className="mx-auto min-h-full w-full max-w-md">
      <AnimatePresence mode="wait" initial={false}>
        <Outlet key={pathname.startsWith('/recipe') ? 'recipe' : pathname} />
      </AnimatePresence>
      {withNav && <BottomNav />}
    </div>
  )
}

function RequireOnboarding() {
  const done = usePrefsStore((s) => s.onboardingDone)
  return done ? <Shell /> : <Navigate to="/onboarding" replace />
}

function OnboardingGate() {
  const done = usePrefsStore((s) => s.onboardingDone)
  return done ? <Navigate to="/" replace /> : <OnboardingScreen />
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/onboarding" element={<OnboardingGate />} />
          <Route element={<RequireOnboarding />}>
            <Route path="/" element={<DiscoverScreen />} />
            <Route path="/tonight" element={<TonightScreen />} />
            <Route path="/book" element={<BookScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/preferences" element={<PreferencesScreen />} />
            <Route path="/recipe/:id" element={<RecipeScreen />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}
