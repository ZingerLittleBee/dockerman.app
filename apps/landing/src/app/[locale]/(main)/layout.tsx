import Footer from '@/components/ui/Footer'
import { Navigation } from '@/components/ui/Navbar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
      <Footer />
    </>
  )
}
