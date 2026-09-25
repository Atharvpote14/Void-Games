import { Outlet } from 'react-router-dom'
import Navbar from '@/components/navbar/Navbar/Navbar'
import Footer from '@/components/footer/Footer/Footer'
import Banned from '@/pages/Banned/Banned'
import { useAuth } from '@/hooks/useAuth'

function MainLayout() {
  const { user } = useAuth()

  if (user?.is_banned) {
    return <Banned />
  }

  return (
    <div className='flex min-h-screen flex-col bg-void-deep relative overflow-hidden pt-14 md:pt-[60px]'>
      <Navbar />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout

