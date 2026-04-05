import { LenisProvider } from '@repo/shared/components/LenisProvider'
import Footer from '@/components/ui/Footer'
import { Navigation } from '@/components/ui/Navbar'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <LenisProvider>
      <Navigation />
      {children}
      <Footer />
    </LenisProvider>
  )
}
