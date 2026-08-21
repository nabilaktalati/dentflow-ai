import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'

import BrandLogo from '../ui/BrandLogo.jsx'
import Button from '../ui/Button.jsx'
import Container from '../ui/Container.jsx'

const navigation = [
  { label: 'Ana Sayfa', to: '/' },
  { label: 'Hizmetler', to: '/services' },
  { label: 'Doktorlar', to: '/doctors' },
  { label: 'AI Özellikler', to: '/ai-features' },
  { label: 'Hakkımızda', to: '/about' },
  { label: 'İletişim', to: '/contact' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuPath, setMenuPath] = useState(null)

  const location = useLocation()

  const menuOpen = menuPath === location.pathname

  // Navbar scroll state
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24)
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Close mobile menu when switching to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuPath(null)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Lock page scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Close mobile menu with Escape
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuPath(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const closeMenu = () => {
    setMenuPath(null)
  }

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <Container className="pt-4 lg:pt-5">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className={`
              pointer-events-auto
              flex h-[72px] items-center
              transition-[background-color,border-color,box-shadow]
              duration-300
              ${
                scrolled || menuOpen
                  ? 'rounded-df-lg border border-df-border bg-df-bg-soft/95 px-4 shadow-[0_16px_40px_rgba(0,0,0,0.22)] backdrop-blur-xl lg:px-5'
                  : 'border border-transparent bg-transparent px-0'
              }
            `}
          >
            <NavLink
              to="/"
              aria-label="DentFlow AI ana sayfa"
              onClick={closeMenu}
              className="shrink-0 rounded-df-sm"
            >
              <BrandLogo />
            </NavLink>

            <nav
              aria-label="Ana navigasyon"
              className="mx-auto hidden items-center gap-1 lg:flex"
            >
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `
                      relative rounded-df-sm px-3 py-2
                      text-[13px] font-medium
                      transition-colors duration-200
                      ${
                        isActive
                          ? 'text-df-text'
                          : 'text-df-text-secondary hover:text-df-text'
                      }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{item.label}</span>

                      {isActive && (
                        <motion.span
                          layoutId="navbar-active-indicator"
                          className="absolute inset-x-3 -bottom-[2px] h-px bg-df-cyan"
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 34,
                          }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="ml-auto hidden items-center gap-3 lg:flex">
              <div className="mr-1 flex items-center gap-2 text-[11px] font-medium text-df-text-muted">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-40" />
                  <span className="relative inline-flex size-2 rounded-full bg-success" />
                </span>

                Sistem Aktif
              </div>

              <Button
                to="/login"
                variant="ghost"
                size="sm"
              >
                Giriş
              </Button>

              <Button
                to="/register"
                size="sm"
              >
                Randevu Al
                <ArrowUpRight className="size-4" />
              </Button>
            </div>

            <button
  type="button"
  aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
  aria-expanded={menuOpen}
  aria-controls="mobile-navigation"
  onClick={() => {
    setMenuPath((current) =>
      current === location.pathname ? null : location.pathname,
    )
  }}
  className="
    ml-auto inline-flex size-11 items-center justify-center
    rounded-df-md border border-df-border
    bg-df-surface text-df-text
    transition-colors hover:bg-df-surface-soft
    lg:hidden
  "
>
  {menuOpen ? (
    <X className="size-5" />
  ) : (
    <Menu className="size-5" />
  )}
</button>
          </motion.div>
        </Container>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-df-bg lg:hidden"
          >
            <Container className="flex min-h-screen flex-col pb-8 pt-32">
              <nav
                aria-label="Mobil navigasyon"
                className="flex flex-col"
              >
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.28,
                      delay: 0.04 * index,
                    }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `
                          flex min-h-14 items-center justify-between
                          border-b border-df-border
                          font-display text-2xl font-medium
                          tracking-[-0.03em]
                          ${
                            isActive
                              ? 'text-df-cyan'
                              : 'text-df-text'
                          }
                        `
                      }
                    >
                      {item.label}

                      <span className="text-sm font-normal text-df-text-muted">
                        0{index + 1}
                      </span>
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto pt-10">
                <div className="mb-6 flex items-center gap-2 text-xs text-df-text-muted">
                  <span className="size-2 rounded-full bg-success" />
                  Sistem Aktif
                </div>

                <div className="grid gap-3">
                  <Button
                    to="/register"
                    size="lg"
                    onClick={closeMenu}
                    className="w-full"
                  >
                    Randevu Al
                    <ArrowUpRight className="size-4" />
                  </Button>

                  <Button
                    to="/login"
                    variant="secondary"
                    size="lg"
                    onClick={closeMenu}
                    className="w-full"
                  >
                    Giriş Yap
                  </Button>
                </div>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar