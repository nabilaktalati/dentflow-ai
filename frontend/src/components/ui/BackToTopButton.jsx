import { ChevronUp } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

function BackToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600)
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{
            opacity: 0,
            scale: 0.8,
            y: 12,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            scale: 0.8,
            y: 12,
          }}
          transition={{
            duration: 0.22,
            ease: [0.22, 1, 0.36, 1],
          }}
          aria-label="Sayfanın başına dön"
          className="
            fixed bottom-6 right-6 z-40
            flex size-12
            items-center justify-center
            rounded-full
            bg-[#5956F5]
            text-white
            shadow-[0_12px_30px_rgba(91,86,245,0.28)]
            transition-all duration-300
            hover:-translate-y-1
            hover:bg-[#6864FF]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#5956F5]
            focus-visible:ring-offset-2
          "
        >
          <ChevronUp className="size-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default BackToTopButton