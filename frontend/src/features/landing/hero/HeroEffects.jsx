import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'

const shapes = [
  { symbol: '+', top: '15%', left: '5%' },
  { symbol: '•', top: '8%', left: '22%' },
  { symbol: '×', top: '22%', left: '92%' },
  { symbol: '+', top: '45%', left: '88%' },
  { symbol: '•', top: '78%', left: '84%' },
  { symbol: '+', top: '84%', left: '12%' },
  { symbol: '×', top: '68%', left: '4%' },
]

function HeroEffects() {
  const areaRef = useRef(null)

  const mouseX = useMotionValue(-500)
  const mouseY = useMotionValue(-500)

  const x = useSpring(mouseX, {
    stiffness: 120,
    damping: 25,
  })

  const y = useSpring(mouseY, {
    stiffness: 120,
    damping: 25,
  })

  const handleMouseMove = (event) => {
    const rect = areaRef.current.getBoundingClientRect()

    mouseX.set(event.clientX - rect.left)
    mouseY.set(event.clientY - rect.top)
  }

  const handleMouseLeave = () => {
    mouseX.set(-500)
    mouseY.set(-500)
  }

  return (
    <div
      ref={areaRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute inset-0 overflow-hidden"
    >
      {/* الضوء الذي يتبع الماوس */}
      <motion.div
        className="
          pointer-events-none
          absolute
          size-[500px]
          rounded-full
          bg-[#5956F5]/[0.07]
          blur-[90px]
        "
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />

      {/* العناصر الثابتة */}
      {shapes.map((shape, index) => (
        <span
          key={index}
          className={`
            pointer-events-none
            absolute
            select-none
            text-sm font-semibold
            ${
              index % 3 === 0
                ? 'text-[#5B56F5]/35'
                : index % 3 === 1
                  ? 'text-[#75A7FF]/30'
                  : 'text-[#65C99D]/30'
            }
          `}
          style={{
            top: shape.top,
            left: shape.left,
          }}
        >
          {shape.symbol}
        </span>
      ))}
    </div>
  )
}

export default HeroEffects