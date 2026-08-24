import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react'

const particles = [
  { type: '+', left: '6%', top: '19%', size: 15, opacity: 0.45 },
  { type: '•', left: '22%', top: '8%', size: 12, opacity: 0.35 },
  { type: '×', left: '91%', top: '18%', size: 17, opacity: 0.32 },
  { type: '+', left: '84%', top: '36%', size: 13, opacity: 0.38 },
  { type: '•', left: '71%', top: '12%', size: 10, opacity: 0.3 },
  { type: '×', left: '4%', top: '62%', size: 14, opacity: 0.28 },
  { type: '+', left: '12%', top: '82%', size: 13, opacity: 0.3 },
  { type: '•', left: '76%', top: '79%', size: 9, opacity: 0.28 },
  { type: '+', left: '94%', top: '70%', size: 18, opacity: 0.3 },
  { type: '•', left: '61%', top: '88%', size: 10, opacity: 0.25 },
  { type: '×', left: '34%', top: '91%', size: 12, opacity: 0.24 },
  { type: '•', left: '47%', top: '18%', size: 8, opacity: 0.22 },
]

function CursorParticleField() {
  const reduceMotion = useReducedMotion()

  const mouseX = useMotionValue(-500)
  const mouseY = useMotionValue(-500)

  const smoothX = useSpring(mouseX, {
    stiffness: 90,
    damping: 22,
    mass: 0.45,
  })

  const smoothY = useSpring(mouseY, {
    stiffness: 90,
    damping: 22,
    mass: 0.45,
  })

  const background = useMotionTemplate`
    radial-gradient(
      360px circle at ${smoothX}px ${smoothY}px,
      rgba(91, 86, 245, 0.10),
      rgba(112, 130, 255, 0.055) 35%,
      rgba(248, 250, 253, 0) 72%
    )
  `

  const handlePointerMove = (event) => {
    if (reduceMotion) return

    const rect = event.currentTarget.getBoundingClientRect()

    mouseX.set(event.clientX - rect.left)
    mouseY.set(event.clientY - rect.top)
  }

  const handlePointerLeave = () => {
    mouseX.set(-500)
    mouseY.set(-500)
  }

  return (
    <div
      aria-hidden="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="pointer-events-auto absolute inset-0 overflow-hidden"
    >
      {/* Mouse light */}
      {!reduceMotion && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background }}
        />
      )}

      {/* Fixed decorative particles */}
      {particles.map((particle, index) => (
        <motion.span
          key={index}
          className={`
            pointer-events-none
            absolute
            select-none
            font-medium
            ${
              index % 4 === 0
                ? 'text-[#5B56F5]'
                : index % 4 === 1
                  ? 'text-[#7EA6FF]'
                  : index % 4 === 2
                    ? 'text-[#78CFA8]'
                    : 'text-[#9AA7FF]'
            }
          `}
          style={{
            left: particle.left,
            top: particle.top,
            fontSize: `${particle.size}px`,
            opacity: particle.opacity,
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, -3, 0],
                  rotate: [0, 5, 0],
                }
          }
          transition={{
            duration: 6 + index * 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {particle.type}
        </motion.span>
      ))}
    </div>
  )
}

export default CursorParticleField