import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { AppProvider } from './context/AppContext'
import { HomePage } from './pages/HomePage'
import { GamesPage } from './pages/GamesPage'
import { GameCategoryPage } from './pages/GameCategoryPage'
import { TournamentsPage } from './pages/TournamentsPage'
import { RankingsPage } from './pages/RankingsPage'
import { ResultsPage } from './pages/ResultsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminEventsPage } from './pages/admin/AdminEventsPage'
import { AdminEventEditorPage } from './pages/admin/AdminEventEditorPage'
import { AdminEventDetailPage } from './pages/admin/AdminEventDetailPage'
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

function AppShell() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      <ScrollToTop />
      {!isAdmin && (
        <>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Header />
        </>
      )}

      {isAdmin ? (
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="events" element={<AdminEventsPage />} />
            <Route path="events/new" element={<AdminEventEditorPage />} />
            <Route path="events/:id" element={<AdminEventDetailPage />} />
            <Route path="events/:id/edit" element={<AdminEventEditorPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      ) : (
        <>
          <main id="main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/games/:slug" element={<GameCategoryPage />} />
              <Route path="/tournaments" element={<TournamentsPage />} />
              <Route path="/rankings" element={<RankingsPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </>
      )}
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AppProvider>
  )
}
