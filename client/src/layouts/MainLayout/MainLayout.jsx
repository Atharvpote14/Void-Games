import { Outlet } from 'react-router-dom'
import Navbar from '@/components/navbar/Navbar/Navbar'
import Footer from '@/components/footer/Footer/Footer'
import ScrollToTop from '@/components/common/ScrollToTop/ScrollToTop'
import ScrollToTopButton from '@/components/buttons/ScrollToTopButton/ScrollToTopButton'

function MainLayout() {
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
