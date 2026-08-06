import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout/MainLayout'
import NotFound from '@/pages/NotFound/NotFound'
import ServerError from '@/pages/NotFound/ServerError'
import LazyPage from '@/components/loading/LazyPage/LazyPage'
import ProtectedRoute from '@/components/auth/ProtectedRoute/ProtectedRoute'

const Home = lazy(() => import('@/pages/Home/Home'))
const BrowseGames = lazy(() => import('@/pages/BrowseGames/BrowseGames'))
const SearchPage = lazy(() => import('@/pages/Search/Search'))
const GameDetails = lazy(() => import('@/pages/GameDetails/GameDetails'))
const Guides = lazy(() => import('@/pages/Guides/Guides'))
const GuideDetails = lazy(() => import('@/pages/GuideDetails/GuideDetails'))
const FixCenter = lazy(() => import('@/pages/FixCenter/FixCenter'))
const FixDetails = lazy(() => import('@/pages/FixDetails/FixDetails'))
const Login = lazy(() => import('@/pages/Login/Login'))
const AuthCallback = lazy(() => import('@/pages/AuthCallback/AuthCallback'))
const Profile = lazy(() => import('@/pages/Profile/Profile'))
const Favorites = lazy(() => import('@/pages/Favorites/Favorites'))
const DownloadHistory = lazy(() => import('@/pages/DownloadHistory/DownloadHistory'))
const Settings = lazy(() => import('@/pages/Settings/Settings'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ServerError />,
    children: [
      {
        index: true,
        element: (
          <LazyPage>
            <Home />
          </LazyPage>
        ),
      },
      {
        path: 'games',
        element: (
          <LazyPage>
            <BrowseGames />
          </LazyPage>
        ),
      },
      {
        path: 'game/:slug',
        element: (
          <LazyPage>
            <GameDetails />
          </LazyPage>
        ),
      },
      {
        path: 'guides',
        element: (
          <LazyPage>
            <Guides />
          </LazyPage>
        ),
      },
      {
        path: 'guide/:slug',
        element: (
          <LazyPage>
            <GuideDetails />
          </LazyPage>
        ),
      },
      {
        path: 'fixes',
        element: (
          <LazyPage>
            <FixCenter />
          </LazyPage>
        ),
      },
      {
        path: 'fix/:slug',
        element: (
          <LazyPage>
            <FixDetails />
          </LazyPage>
        ),
      },
      {
        path: 'search',
        element: (
          <LazyPage>
            <SearchPage />
          </LazyPage>
        ),
      },
      {
        path: 'login',
        element: (
          <LazyPage>
            <Login />
          </LazyPage>
        ),
      },
      {
        path: 'auth/callback',
        element: (
          <LazyPage>
            <AuthCallback />
          </LazyPage>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <LazyPage>
              <Profile />
            </LazyPage>
          </ProtectedRoute>
        ),
      },
      {
        path: 'favorites',
        element: (
          <ProtectedRoute>
            <LazyPage>
              <Favorites />
            </LazyPage>
          </ProtectedRoute>
        ),
      },
      {
        path: 'downloads',
        element: (
          <ProtectedRoute>
            <LazyPage>
              <DownloadHistory />
            </LazyPage>
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <LazyPage>
              <Settings />
            </LazyPage>
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
])

export default router
