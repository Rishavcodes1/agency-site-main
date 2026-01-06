import { motion } from "motion/react"

type FallingParticlesProps = {
    side: "left" | "right"
}

export const FallingParticles = ({ side }: FallingParticlesProps) => {
    // Generate random particles
    const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        delay: Math.random() * 5,
        duration: 2 + Math.random() * 3,
        startX: Math.random() * 100 - 50,
        endY: 150 + Math.random() * 100,
        size: 0.5 + Math.random() * 1.5,
        opacity: 0.3 + Math.random() * 0.7
    }))

    const isLeft = side === "left"

    // Position classes based on side
    const lightPosition = isLeft
        ? "top-0 left-0 -translate-x-1/2 -translate-y-1/2"
        : "top-0 right-0 translate-x-1/2 -translate-y-1/2"

    const particlesPosition = isLeft
        ? "top-0 left-0"
        : "top-0 right-0"

    // Rotation based on side (45deg for left, -45deg for right)
    const rotation = isLeft ? 45 : -45

    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            {/* Light burst effect from top corner */}
            <motion.div
                className={`absolute rounded-[50%] h-24 w-108 bg-white/40 blur-3xl ${lightPosition}`}
                style={{ rotate: rotation }}
                initial={{
                    scale: 0,
                    opacity: 0
                }}
                animate={{
                    scale: 1.5,
                    opacity: [0, 1, 0.6],
                    transition: {
                        duration: 2,
                        times: [0, 0.3, 1]
                    }
                }}
            />

            {/* Falling particles */}
            <div className={`absolute ${particlesPosition}`}>
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        className="absolute bg-white rounded-full"
                        style={{
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            left: isLeft ? `${particle.startX}px` : 'auto',
                            right: isLeft ? 'auto' : `${particle.startX}px`,
                            boxShadow: `0 0 ${particle.size * 2}px ${particle.size}px rgba(255,255,255,${particle.opacity * 0.5})`
                        }}
                        initial={{
                            x: 0,
                            y: 0,
                            opacity: 0
                        }}
                        animate={{
                            x: isLeft ? particle.endY : -particle.endY,
                            y: particle.endY,
                            opacity: [0, particle.opacity, 0],
                            transition: {
                                delay: particle.delay,
                                duration: particle.duration,
                                repeat: Infinity,
                                repeatDelay: Math.random() * 2,
                                ease: "linear",
                                times: [0, 0.1, 1]
                            }
                        }}
                    />
                ))}
            </div>
        </div>
    )
}


// import { motion, useReducedMotion } from "motion/react"
// import { useMemo } from "react"

// type FallingParticlesProps = {
//     side: "left" | "right"
//     count?: number // Allow customization
// }

// interface Particle {
//     id: number
//     delay: number
//     duration: number
//     startX: number
//     endY: number
//     size: number
//     opacity: number
// }

// /**
//  * Optimized particle generator with memoization
//  */
// const generateParticles = (count: number): Particle[] => {
//     return Array.from({ length: count }, (_, i) => ({
//         id: i,
//         delay: Math.random() * 5,
//         duration: 3 + Math.random() * 2, // Slower = smoother
//         startX: Math.random() * 80 - 40, // Reduced spread
//         endY: 120 + Math.random() * 80,
//         size: 1 + Math.random() * 2,
//         opacity: 0.4 + Math.random() * 0.4
//     }))
// }

// export const FallingParticles = ({ side, count = 8 }: FallingParticlesProps) => {
//     const shouldReduceMotion = useReducedMotion()
//     const isLeft = side === "left"

//     // Memoize particles to prevent regeneration
//     const particles = useMemo(() => generateParticles(count), [count])

//     // Don't render if reduced motion is preferred
//     if (shouldReduceMotion) {
//         return null
//     }

//     const lightPosition = isLeft
//         ? "top-0 left-0 -translate-x-1/2 -translate-y-1/2"
//         : "top-0 right-0 translate-x-1/2 -translate-y-1/2"

//     const particlesPosition = isLeft ? "top-0 left-0" : "top-0 right-0"
//     const rotation = isLeft ? 45 : -45

//     return (
//         <div 
//             className="absolute inset-0 overflow-hidden pointer-events-none"
//             aria-hidden="true"
//         >
//             {/* Optimized light burst - using transform instead of blur where possible */}
//             <motion.div
//                 className={`absolute rounded-full h-32 w-32 bg-gradient-to-br from-white/30 to-transparent ${lightPosition}`}
//                 style={{ 
//                     rotate: rotation,
//                     // GPU acceleration
//                     willChange: 'transform, opacity',
//                     transform: 'translateZ(0)' // Force GPU layer
//                 }}
//                 initial={{
//                     scale: 0,
//                     opacity: 0
//                 }}
//                 animate={{
//                     scale: [0, 1.8, 1.5],
//                     opacity: [0, 0.8, 0.4],
//                 }}
//                 transition={{
//                     duration: 2.5,
//                     times: [0, 0.4, 1],
//                     ease: "easeOut"
//                 }}
//             />

//             {/* Optimized falling particles */}
//             <div className={`absolute ${particlesPosition}`}>
//                 {particles.map((particle) => (
//                     <motion.div
//                         key={particle.id}
//                         className="absolute bg-white rounded-full"
//                         style={{
//                             width: particle.size,
//                             height: particle.size,
//                             left: isLeft ? particle.startX : 'auto',
//                             right: isLeft ? 'auto' : particle.startX,
//                             // GPU acceleration
//                             willChange: 'transform, opacity',
//                             transform: 'translateZ(0)',
//                             // Static shadow - no recalculation
//                             filter: `blur(${particle.size * 0.5}px)`,
//                         }}
//                         initial={{
//                             x: 0,
//                             y: 0,
//                             opacity: 0
//                         }}
//                         animate={{
//                             x: isLeft ? particle.endY : -particle.endY,
//                             y: particle.endY,
//                             opacity: [0, particle.opacity, 0],
//                         }}
//                         transition={{
//                             delay: particle.delay,
//                             duration: particle.duration,
//                             repeat: Infinity,
//                             repeatDelay: Math.random() * 3,
//                             ease: "linear",
//                             times: [0, 0.15, 1]
//                         }}
//                     />
//                 ))}
//             </div>
//         </div>
//     )
// }