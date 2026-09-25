import { createBrowserRouter } from 'react-router-dom'
import NotFound from '@/pages/NotFound/NotFound'
import ServerError from '@/pages/NotFound/ServerError'
import LazyPage from '@/components/loading/LazyPage/LazyPage'
import ProtectedRoute from '@/components/auth/ProtectedRoute/ProtectedRoute'
import AdminRoute from '@/components/auth/AdminRoute/AdminRoute'
import AdminLayout from '@/layouts/AdminLayout/AdminLayout'
import MainLayout from '@/layouts/MainLayout/MainLayout'
import RootLayout from '@/layouts/RootLayout/RootLayout'

import Home from '@/pages/Home/Home'
import BrowseGames from '@/pages/BrowseGames/BrowseGames'
import SearchPage from '@/pages/Search/Search'
import GameDetails from '@/pages/GameDetails/GameDetails'
import Guides from '@/pages/Guides/Guides'
import GuideDetails from '@/pages/GuideDetails/GuideDetails'
import FixCenter from '@/pages/FixCenter/FixCenter'
import FixDetails from '@/pages/FixDetails/FixDetails'
import Login from '@/pages/Login/Login'
import AuthCallback from '@/pages/AuthCallback/AuthCallback'
import Profile from '@/pages/Profile/Profile'
import Favorites from '@/pages/Favorites/Favorites'
import DownloadHistory from '@/pages/DownloadHistory/DownloadHistory'
import Settings from '@/pages/Settings/Settings'
import SuggestGame from '@/pages/SuggestGame/SuggestGame'
import SteamFreeGames from '@/pages/SteamFreeGames/SteamFreeGames'
import AdminDashboard from '@/pages/Admin/AdminDashboard/AdminDashboard'
import AdminGames from '@/pages/Admin/AdminGames/AdminGames'
import GameForm from '@/pages/Admin/AdminGames/GameForm'
import AdminCategories from '@/pages/Admin/AdminCategories/AdminCategories'
import AdminCollections from '@/pages/Admin/AdminCollections/AdminCollections'
import AdminGuides from '@/pages/Admin/AdminGuides/AdminGuides'
import AdminFixes from '@/pages/Admin/AdminFixes/AdminFixes'
import AdminUsers from '@/pages/Admin/AdminUsers/AdminUsers'
import AdminReports from '@/pages/Admin/AdminReports/AdminReports'
import AdminUnbanRequests from '@/pages/Admin/AdminUnbanRequests/AdminUnbanRequests'
import AdminSuggestions from '@/pages/Admin/AdminSuggestions/AdminSuggestions'
import AdminSteamFree from '@/pages/Admin/AdminSteamFree/AdminSteamFree'
import AdminAnalytics from '@/pages/Admin/AdminAnalytics/AdminAnalytics'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ServerError />,
    children: [
      {
        element: <MainLayout />,
        children: [
      {
        index: true,
        element: (
          <Home />
        ),
      },
      {
        path: 'games',
        element: (
          <BrowseGames />
        ),
      },
      {
        path: 'game/:slug',
        element: (
          <GameDetails />
        ),
      },
      {
        path: 'guide/:slug',
        element: (
          <GuideDetails />
        ),
      },
      {
        path: 'fixes',
        element: (
          <FixCenter />
        ),
      },
      {
        path: 'fix/:slug',
        element: (
          <FixDetails />
        ),
      },
      {
        path: 'search',
        element: (
          <SearchPage />
        ),
      },
      {
        path: 'login',
        element: (
          <Login />
        ),
      },
      {
        path: 'auth/callback',
        element: (
          <AuthCallback />
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: 'favorites',
        element: (
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        ),
      },
      {
        path: 'downloads',
        element: (
          <ProtectedRoute>
            <DownloadHistory />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: 'suggest',
        element: (
          <SuggestGame />
        ),
      },
      {
        path: 'steam-free-games',
        element: (
          <SteamFreeGames />
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: 'admin',
    element: (
      <RootLayout>
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      </RootLayout>
    ),
        element: (
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        ),
        errorElement: <ServerError />,
        children: [
          {
            index: true,
            element: (
              <AdminDashboard />
            ),
          },
          {
            path: 'games',
            element: (
              <AdminGames />
            ),
          },
          {
            path: 'games/new',
            element: (
              <GameForm />
            ),
          },
          {
            path: 'games/:id/edit',
            element: (
              <GameForm />
            ),
          },
          {
            path: 'categories',
            element: (
              <AdminCategories />
            ),
          },
          {
            path: 'collections',
            element: (
              <AdminCollections />
            ),
          },
          {
            path: 'guides',
            element: (
              <AdminGuides />
            ),
          },
          {
            path: 'fixes',
            element: (
              <AdminFixes />
            ),
          },
          {
            path: 'users',
            element: (
              <AdminUsers />
            ),
          },
          {
            path: 'reports',
            element: (
              <AdminReports />
            ),
          },
          {
            path: 'unban-requests',
            element: (
              <AdminUnbanRequests />
            ),
          },
          {
            path: 'suggestions',
            element: (
              <AdminSuggestions />
            ),
          },
          {
            path: 'steam-free',
            element: (
              <AdminSteamFree />
            ),
          },
          {
            path: 'analytics',
            element: (
              <AdminAnalytics />
            ),
          },
        ],
      },
    ],
  },
])

export default router
