'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface RevealSectionProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function RevealSection({
  children,
  delay = 0,
  className,
}: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-8% 0px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
