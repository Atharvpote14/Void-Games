import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout/MainLayout'
import NotFound from '@/pages/NotFound/NotFound'
import ServerError from '@/pages/NotFound/ServerError'
import LazyPage from '@/components/loading/LazyPage/LazyPage'

const Home = lazy(() => import('@/pages/Home/Home'))
const BrowseGames = lazy(() => import('@/pages/BrowseGames/BrowseGames'))
const SearchPage = lazy(() => import('@/pages/Search/Search'))
const GameDetails = lazy(() => import('@/pages/GameDetails/GameDetails'))

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
        path: 'search',
        element: (
          <LazyPage>
            <SearchPage />
          </LazyPage>
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
