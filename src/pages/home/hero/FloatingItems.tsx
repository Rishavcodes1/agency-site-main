// import { cn, sleep } from "@/lib/utils"
// import type { ChildrenProps, ClassNameProps } from "@/types/global"
// import { motion } from "motion/react"
// import Fragements from "./svgs/Fragements"
// import Cloud from "./svgs/Cloud"
// import Speaker from "./svgs/Speaker"
// import BarGraph from "./svgs/BarGraph"
// import ArtBoard from "./svgs/ArtBoard"
// import { useEffect, useRef } from "react"
// import type { AnimationHandle } from "@/types/animation"

// const gridItemClassName = "rounded-xl"

// const FloatingItem = ({ className = "", children }: ClassNameProps & ChildrenProps) => {
//     return (
//         <motion.div
//             className={cn("col-span-2 col-start-2 bg-linear-to-br from-background/40 to-foreground/10 row-span-4 row-start-4 animate-float opacity-30 ", gridItemClassName, className)}

//         >
//             {children}



//         </motion.div>
//     )
// }

// const FloatingItems = ({ className = "" }: ClassNameProps) => {

//     const fragementRef = useRef<AnimationHandle>(null)
//     const speakerRef = useRef<AnimationHandle>(null)
//     const cloudRef = useRef<AnimationHandle>(null)
//     const barGraphRef = useRef<AnimationHandle>(null)
//     const artBoardRef = useRef<AnimationHandle>(null)


//     const playAnimation = async () => {
//         fragementRef.current?.play()
//         await sleep(2000)

//         cloudRef.current?.play()
//         await sleep(2000)

//         speakerRef.current?.play()
//         await sleep(2000)

//         barGraphRef.current?.play()
//         await sleep(2000)

//         artBoardRef.current?.play()

//         await sleep(3000)
//         playAnimation()


//     }

//     useEffect(() => {
//         playAnimation()
//     }, [])
//     return (
//         <div className={cn("absolute top-0 left-0 bottom-0 right-0 w-full h-full grid grid-cols-12 grid-rows-12 gap-4", className)}>
//             <FloatingItem>

//                 <Fragements ref={fragementRef} className="size-60" />
//             </FloatingItem>
//             <FloatingItem className="col-span-3 col-start-1 row-span-4 row-start-9">

//                 <Cloud ref={cloudRef} className="size-72" />
//             </FloatingItem>
//             <FloatingItem className="col-span-3 row-span-5 row-start-3 col-start-10">

//                 <Speaker ref={speakerRef} className="size-80 scale-x-[-1] rotate-45" />
//             </FloatingItem>
//             <FloatingItem className="col-span-3 row-span-4 row-start-9 col-start-11">

//                 <BarGraph ref={barGraphRef} className="size-60" />
//             </FloatingItem>
//             <FloatingItem className="col-span-2 row-span-3 row-start-10 col-start-9">

//                 <ArtBoard ref={artBoardRef} className="size-44" />
//             </FloatingItem>




//         </div>
//     )
// }

// export default FloatingItems


import { cn } from "@/lib/utils"
import type { ChildrenProps, ClassNameProps } from "@/types/global"
import { useEffect, useRef, useCallback, useState } from "react"
import type { AnimationHandle } from "@/types/animation"
import Fragements from "./svgs/Fragements"
import Cloud from "./svgs/Cloud"
import Speaker from "./svgs/Speaker"
import BarGraph from "./svgs/BarGraph"
import ArtBoard from "./svgs/ArtBoard"
import { motion, useReducedMotion } from "motion/react"
const gridItemClassName = "rounded-xl backdrop-blur-sm"


interface FloatingItemProps extends ClassNameProps, ChildrenProps {
    delay?: number
}

const FloatingItem = ({ 
    className = "", 
    children, 
    delay = 0 
}: FloatingItemProps) => {
    const shouldReduceMotion = useReducedMotion()

    return (
        <motion.div
            className={cn(
                "col-span-2 col-start-2 bg-linear-to-br from-background/20 to-foreground/5 row-span-4 row-start-4",
                gridItemClassName,
                className
            )}
            initial={shouldReduceMotion ? {} : { 
                opacity: 0, 
                scale: 0.8,
                y: 20
            }}
            animate={shouldReduceMotion ? {} : {
                opacity: 0.3,
                scale: 1,
                y: [0, -10, 0],
            }}
            transition={shouldReduceMotion ? {} : {
                opacity: { duration: 0.8, delay },
                scale: { duration: 0.8, delay },
                y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay + 0.8
                }
            }}
            style={{
                willChange: 'transform, opacity'
            }}
        >
            {children}
        </motion.div>
    )
}

export const FloatingItems = ({ className = "" }: ClassNameProps) => {
    const shouldReduceMotion = useReducedMotion()
    const [isVisible, setIsVisible] = useState(false)
    
    // Refs for sequential animations
    const fragementRef = useRef<AnimationHandle>(null)
    const speakerRef = useRef<AnimationHandle>(null)
    const cloudRef = useRef<AnimationHandle>(null)
    const barGraphRef = useRef<AnimationHandle>(null)
    const artBoardRef = useRef<AnimationHandle>(null)

    // Ref to track if animation should continue
    const shouldAnimateRef = useRef(true)
    const timeoutIdsRef = useRef<ReturnType<typeof setTimeout>[]>([])

    const playAnimationSequence = useCallback(() => {
        if (!shouldAnimateRef.current || shouldReduceMotion) return

        // Clear any existing timeouts
        timeoutIdsRef.current.forEach(clearTimeout)
        timeoutIdsRef.current = []

        // Sequential animation with proper cleanup tracking
        const sequence = [
            { ref: fragementRef, delay: 0 },
            { ref: cloudRef, delay: 2000 },
            { ref: speakerRef, delay: 4000 },
            { ref: barGraphRef, delay: 6000 },
            { ref: artBoardRef, delay: 8000 }
        ]

        sequence.forEach(({ ref, delay }) => {
            const timeoutId = setTimeout(() => {
                if (shouldAnimateRef.current) {
                    ref.current?.play()
                }
            }, delay)
            timeoutIdsRef.current.push(timeoutId)
        })

        // Schedule next cycle
        const cycleTimeoutId = setTimeout(() => {
            if (shouldAnimateRef.current) {
                playAnimationSequence()
            }
        }, 12000) // Complete cycle time
        timeoutIdsRef.current.push(cycleTimeoutId)

    }, [shouldReduceMotion])

    // Intersection Observer for performance
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting)
            },
            { threshold: 0.1 }
        )

        const element = document.getElementById('floating-items-container')
        if (element) {
            observer.observe(element)
        }

        return () => {
            observer.disconnect()
        }
    }, [])

    // Start animation only when visible
    useEffect(() => {
        if (isVisible && !shouldReduceMotion) {
            shouldAnimateRef.current = true
            playAnimationSequence()
        }

        return () => {
            shouldAnimateRef.current = false
            timeoutIdsRef.current.forEach(clearTimeout)
            timeoutIdsRef.current = []
        }
    }, [isVisible, shouldReduceMotion, playAnimationSequence])

    if (shouldReduceMotion) {
        return null
    }

    return (
        <div 
            id="floating-items-container"
            className={cn(
                "absolute inset-0 w-full h-full grid grid-cols-12 grid-rows-12 gap-4",
                className
            )}
            aria-hidden="true"
        >
            <FloatingItem delay={0}>
                <Fragements ref={fragementRef} className="size-60" />
            </FloatingItem>
            
            <FloatingItem 
                className="col-span-3 col-start-1 row-span-4 row-start-9"
                delay={0.2}
            >
                <Cloud ref={cloudRef} className="size-72" />
            </FloatingItem>
            
            <FloatingItem 
                className="col-span-3 row-span-5 row-start-3 col-start-10"
                delay={0.4}
            >
                <Speaker ref={speakerRef} className="size-80 scale-x-[-1] rotate-45" />
            </FloatingItem>
            
            <FloatingItem 
                className="col-span-3 row-span-4 row-start-9 col-start-11"
                delay={0.6}
            >
                <BarGraph ref={barGraphRef} className="size-60" />
            </FloatingItem>
            
            <FloatingItem 
                className="col-span-2 row-span-3 row-start-10 col-start-9"
                delay={0.8}
            >
                <ArtBoard ref={artBoardRef} className="size-44" />
            </FloatingItem>
        </div>
    )
}

// ============================================
// ALTERNATIVE: SIMPLE GRADIENT ANIMATION
// ============================================

export const AnimatedGradientBackground = () => {
    const shouldReduceMotion = useReducedMotion()

    if (shouldReduceMotion) {
        return (
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5" />
        )
    }

    return (
        <motion.div
            className="absolute inset-0 opacity-30"
            style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
            }}
            animate={{
                background: [
                    'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
                    'radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
                    'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
                ]
            }}
            transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
    )
}