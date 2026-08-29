import { useEffect, useState } from "react";
import {
  NavLink,
  useNavigate,
} from 'react-router'
import { AnimatePresence, motion } from "motion/react";
import {
  useAuth,
} from '../../features/auth/context/authContext.js'
import {
  ArrowRight,
  BrainCircuit,
  CalendarDays,
  ChevronDown,
  Menu,
  ReceiptText,
  X,
} from "lucide-react";
import BookingCTA from '../../features/auth/components/BookingCTA.jsx'
import BrandLogo from "../ui/BrandLogo.jsx";
import Button from "../ui/Button.jsx";
import Container from "../ui/Container.jsx";

const navigation = [
  { label: "Ana Sayfa", to: "/" },
  { label: "İşlemler", to: "/services" },
  { label: "Doktorlar", to: "/doctors" },
  { label: "Akıllı Özellikler", to: "/ai-features" },
  { label: 'DentFlow Hakkında', to: '/about' },
  { label: "İletişim", to: "/contact" },
];

const serviceMenuItems = [
  {
    title: "Randevu İşlemleri",
    description:
      "Randevunuzu sorgulayın; tarih, saat, doktor ve durum bilgilerinizi görüntüleyin.",
    to: "/randevu-sorgula",
    icon: CalendarDays,
  },
  {
    title: "Fatura İşlemleri",
    description:
      "Fatura detaylarınızı, tutarı ve ödeme durumunuzu güvenli şekilde görüntüleyin.",
    to: "/fatura-sorgula",
    icon: ReceiptText,
  },
];

const aiMenuItems = [
  {
    title: 'Akıllı Özellikleri Keşfet',
    description:
      'Randevu planlama, hatırlatma, hasta takibi ve klinik içgörülerini keşfedin.',
    to: '/ai-features',
    icon: BrainCircuit,
  },
]

function DesktopDropdown({
  open,
  onOpen,
  onClose,
  onToggle,
  label,
  heading,
  intro,
  items,
  footer,
  routeActive,
}) {
  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className={`
          relative flex items-center gap-1.5
          rounded-xl px-3 py-2.5
          text-[14px] font-medium
          transition-all duration-200
          ${
            open || routeActive
              ? "bg-[#F2F1FF] text-[#5956F5]"
              : "text-[#475467] hover:bg-[#F7F8FC] hover:text-[#101828]"
          }
        `}
      >
        {label}

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="size-3.5" />
        </motion.span>

        {(open || routeActive) && (
          <motion.span
            layoutId={`navbar-dropdown-indicator-${label}`}
            className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[#5956F5]"
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.985 }}
            transition={{
              duration: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute left-1/2 top-[calc(100%+8px)] z-50 w-[440px] -translate-x-1/2 rounded-[22px] border border-[#E4E7F0] bg-white p-5 shadow-[0_20px_55px_rgba(31,41,55,0.10)]"
          >
            <span
              aria-hidden="true"
              className="absolute -top-[7px] left-1/2 size-3.5 -translate-x-1/2 rotate-45 border-l border-t border-[#E4E7F0] bg-white"
            />

            <div>
              <div className="flex items-center gap-2">
                <span className="h-4 w-[3px] rounded-full bg-[#5956F5]" />

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#4169E1]">
                  {heading}
                </p>
              </div>

              <div className="mt-3 inline-flex rounded-full border border-[#D9D7FF] bg-[#F5F4FF] px-3 py-1.5 text-[10px] font-medium text-[#5956F5]">
                {intro}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {items.map((menuItem) => {
                const Icon = menuItem.icon;

                return (
                  <NavLink
                    key={menuItem.title}
                    to={menuItem.to}
                    onClick={onClose}
                    className="group flex items-center gap-4 rounded-[18px] border border-[#E8EBF2] bg-white p-4 shadow-[0_3px_10px_rgba(31,41,55,0.04)] transition-all duration-200 hover:border-[#D8D6FF] hover:bg-[#FAFAFF] hover:shadow-[0_8px_22px_rgba(59,64,120,0.06)]"
                  >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#5956F5] text-white">
                      <Icon className="size-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-display text-[15px] font-semibold tracking-[-0.02em] text-[#344054]">
                        {menuItem.title}
                      </p>

                      <p className="mt-1 text-[12px] leading-5 text-[#667085]">
                        {menuItem.description}
                      </p>
                    </div>

                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#DDE2EC] text-[#98A2B3] transition-all duration-200 group-hover:border-[#BDB9FF] group-hover:text-[#5956F5]">
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </div>
                  </NavLink>
                );
              })}
            </div>

            <div className="mt-5 border-t border-[#EEF0F4] pt-4 text-center">
              <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#6174D9]">
                • {footer}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Navbar() {
  const navigate = useNavigate()

  const {
  user,
  isAuthenticated,
  isAuthLoading,
  logout,
} = useAuth();

  const handleLogout = async () => {
    await logout()

    navigate('/', {
      replace: true,
    })
  }
  const [scrolled, setScrolled] = useState(false);
  const [menuPath, setMenuPath] = useState(null);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const menuOpen = menuPath === location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuPath(null);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuPath(null);
        setServicesOpen(false);
        setAiOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const closeMenu = () => {
    setMenuPath(null);
    setServicesOpen(false);
    setAiOpen(false);
    setMobileServicesOpen(false);
  };

  const openServices = () => {
    setServicesOpen(true);
    setAiOpen(false);
  };

  const openAi = () => {
    setAiOpen(true);
    setServicesOpen(false);
  };
const dashboardPath =
  user?.role === "ADMIN"
    ? "/admin"
    : user?.role === "DOCTOR"
      ? "/doctor"
      : "/patient";
  return (
    <>
      <header
        className={`
          pointer-events-auto fixed inset-x-0 top-0 z-50
          transition-all duration-300
          ${scrolled ? "bg-transparent" : "border-b border-[#EEF0F5] bg-white"}
        `}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{
              opacity: 1,
              y: scrolled ? 10 : 0,
              scale: scrolled ? 0.99 : 1,
            }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={`
              pointer-events-auto relative flex h-[68px] items-center
              transition-all duration-300
              ${
                scrolled
                  ? "rounded-[18px] border border-[#E3E7F0] bg-white px-5 shadow-[0_16px_45px_rgba(31,41,55,0.10)]"
                  : "bg-transparent px-0"
              }
            `}
          >
            <NavLink
              to="/"
              aria-label="DentFlow AI ana sayfa"
              onClick={closeMenu}
              className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5956F5]"
            >
              <BrandLogo />
            </NavLink>

            <nav
              aria-label="Ana navigasyon"
              className="mx-auto hidden items-center gap-1 lg:flex"
            >
              {navigation.map((item) => {
                const isServices = item.to === "/services";
                const isAi = item.to === "/ai-features";

                if (isServices) {
                  return (
                    <DesktopDropdown
                      key={item.to}
                      open={servicesOpen}
                      onOpen={openServices}
                      onClose={() => setServicesOpen(false)}
                      onToggle={() => {
                        setServicesOpen((current) => !current);
                        setAiOpen(false);
                      }}
                      label="İşlemler"
                      heading="KLİNİK HIZLI İŞLEMLER"
                      intro="Randevu ve fatura bilgilerinize hızlıca ulaşın."
                      items={serviceMenuItems}
                      footer="• RANDEVU · FATURA · HIZLI VE GÜVENLİ ERİŞİM"
                      routeActive={location.pathname === "/services"}
                    />
                  );
                }

                if (isAi) {
                  return (
                    <DesktopDropdown
                      key={item.to}
                      open={aiOpen}
                      onOpen={openAi}
                      onClose={() => setAiOpen(false)}
                      onToggle={() => {
                        setAiOpen((current) => !current);
                        setServicesOpen(false);
                      }}
                      label="Akıllı Özellikler"
                      heading="DENTFLOW AI"
                      intro="AKILLI KLİNİK DESTEĞİ · TIBBİ TANI SUNMAZ"
                      items={aiMenuItems}
                      footer="AI DESTEKLİ · GÜVENLİ KULLANIM · KLİNİK ODAKLI"
                      routeActive={location.pathname === "/ai-features"}
                    />
                  );
                }

                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      `
                        relative rounded-xl px-3 py-2.5
                        text-[14px] font-medium
                        transition-all duration-200
                        ${
                          isActive
                            ? "text-[#101828]"
                            : "text-[#475467] hover:bg-[#F7F8FC] hover:text-[#101828]"
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
                            className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[#5956F5]"
                            transition={{
                              type: "spring",
                              stiffness: 420,
                              damping: 34,
                            }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            <div className="ml-auto hidden items-center gap-4 lg:flex">
              <div className="mr-1 flex items-center gap-2 text-[11px] font-medium text-[#667085]">
                <span className="size-2 rounded-full bg-[#22C55E]" />
                Sistem Aktif
              </div>

            {!isAuthLoading &&
  (isAuthenticated ? (
    <>
      <NavLink
        to={dashboardPath}
        className="
          rounded-lg px-3 py-2
          text-sm font-semibold text-[#5956F5]
          transition
          hover:bg-[#F2F1FF]
          hover:text-[#4845E6]
        "
      >
        Panelim
      </NavLink>

      <button
        type="button"
        onClick={handleLogout}
        className="
          rounded-lg px-3 py-2
          text-sm font-medium text-[#667085]
          transition
          hover:bg-[#F7F8FC]
          hover:text-[#101828]
        "
      >
        Çıkış Yap
      </button>
    </>
  ) : (
    <Button
      to="/login"
      variant="ghost"
      size="sm"
      className="!text-[#667085] hover:!bg-[#F7F8FC] hover:!text-[#101828]"
    >
      Giriş
    </Button>
  ))}

              <BookingCTA
  size="sm"
  className="!rounded-xl !border-0 !bg-[#5956F5] !px-5 !text-white !shadow-[0_8px_20px_rgba(89,86,245,0.20)] hover:!bg-[#4B48E8]"
/>
            </div>

            <button
              type="button"
              aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => {
                setMenuPath((current) =>
                  current === location.pathname ? null : location.pathname,
                );
              }}
              className="ml-auto inline-flex size-11 items-center justify-center rounded-xl border border-[#E3E7F0] bg-white text-[#344054] transition-colors hover:bg-[#F7F8FC] lg:hidden"
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
            className="fixed inset-0 z-40 bg-[#F5F7FB] lg:hidden"
          >
            <Container className="flex min-h-screen flex-col pb-8 pt-28">
              <nav aria-label="Mobil navigasyon" className="flex flex-col">
                {navigation.map((item, index) => {
                  const isServices = item.to === "/services";

                  if (isServices) {
                    return (
                      <motion.div
                        key={item.to}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.28,
                          delay: 0.04 * index,
                        }}
                        className="border-b border-[#E4E7F0]"
                      >
                        {/* İşlemler */}
                        <button
                          type="button"
                          onClick={() =>
                            setMobileServicesOpen((current) => !current)
                          }
                          aria-expanded={mobileServicesOpen}
                          className={`flex min-h-16 w-full items-center justify-between text-left font-display text-2xl font-medium tracking-[-0.03em] transition-colors ${
                            mobileServicesOpen
                              ? "text-[#5956F5]"
                              : "text-[#101828]"
                          }`}
                        >
                          <span>İşlemler</span>

                          <div className="flex items-center gap-4">
                            <motion.span
                              animate={{
                                rotate: mobileServicesOpen ? 180 : 0,
                              }}
                              transition={{ duration: 0.2 }}
                              className="text-[#98A2B3]"
                            >
                              <ChevronDown className="size-4" />
                            </motion.span>

                            <span className="text-[11px] font-normal text-[#98A2B3]">
                              0{index + 1}
                            </span>
                          </div>
                        </button>

                        {/* İşlemler Alt Menüsü */}
                        <AnimatePresence initial={false}>
                          {mobileServicesOpen && (
                            <motion.div
                              initial={{
                                opacity: 0,
                                height: 0,
                              }}
                              animate={{
                                opacity: 1,
                                height: "auto",
                              }}
                              exit={{
                                opacity: 0,
                                height: 0,
                              }}
                              transition={{
                                duration: 0.25,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-2 pb-5 pt-1">
                                {serviceMenuItems.map((serviceItem) => {
                                  const Icon = serviceItem.icon;

                                  return (
                                    <NavLink
                                      key={serviceItem.to}
                                      to={serviceItem.to}
                                      onClick={closeMenu}
                                      className="group flex items-center gap-3 rounded-[16px] border border-[#E4E7F0] bg-white px-4 py-3.5 transition-all hover:border-[#D8D6FF] hover:bg-[#FAFAFF]"
                                    >
                                      <div className="flex size-10 shrink-0 items-center justify-center rounded-[13px] bg-[#F1F0FF] text-[#5956F5]">
                                        <Icon className="size-[18px]" />
                                      </div>

                                      <div className="min-w-0 flex-1">
                                        <p className="text-[14px] font-semibold text-[#101828]">
                                          {serviceItem.title}
                                        </p>
                                      </div>

                                      <ArrowRight className="size-4 shrink-0 text-[#98A2B3] transition-transform group-hover:translate-x-0.5 group-hover:text-[#5956F5]" />
                                    </NavLink>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  }

                  return (
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
                        end={item.to === "/"}
                        onClick={closeMenu}
                        className={({ isActive }) =>
                          `
            flex min-h-16 items-center justify-between
            border-b border-[#E4E7F0]
            font-display text-2xl font-medium
            tracking-[-0.03em]
            ${isActive ? "text-[#5956F5]" : "text-[#101828]"}
          `
                        }
                      >
                        {item.label}

                        <span className="text-[11px] font-normal text-[#98A2B3]">
                          0{index + 1}
                        </span>
                      </NavLink>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="mt-auto pt-10">
                <div className="mb-6 flex items-center gap-2 text-xs text-[#667085]">
                  <span className="size-2 rounded-full bg-[#22C55E]" />
                  Sistem Aktif
                </div>

                <div className="grid gap-3">
                  <BookingCTA
  size="sm"
  className="!rounded-xl !border-0 !bg-[#5956F5] !px-5 !text-white !shadow-[0_8px_20px_rgba(89,86,245,0.20)] hover:!bg-[#4B48E8]"
/>

                  <Button
                    to="/login"
                    variant="secondary"
                    size="lg"
                    onClick={closeMenu}
                    className="!w-full !rounded-xl !border !border-[#E3E7F0] !bg-white !text-[#344054] hover:!bg-[#F7F8FC]"
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
  );
}
export default Navbar;