import { Outlet } from 'react-router-dom'
import Navbar from '@/components/navbar/Navbar/Navbar'
import Footer from '@/components/footer/Footer/Footer'
import ScrollToTop from '@/components/common/ScrollToTop/ScrollToTop'
import ScrollToTopButton from '@/components/buttons/ScrollToTopButton/ScrollToTopButton'
import Banned from '@/pages/Banned/Banned'
import { useAuth } from '@/hooks/useAuth'

function MainLayout() {
  const { user } = useAuth()

  if (user?.is_banned) {
    return <Banned />
  }

  return (
    <div className="flex min-h-screen flex-col bg-void-bg">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  )
}

export default MainLayout
