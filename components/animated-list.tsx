'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode, Children } from 'react'

interface AnimatedListProps {
  children: ReactNode
  className?: string
}

export function AnimatedList({ children, className }: AnimatedListProps) {
  const childArray = Children.toArray(children)

  return (
    <div className={className}>
      <AnimatePresence mode="popLayout">
        {childArray.map((child) => (
          <motion.div
            key={(child as any)?.key ?? child?.toString()}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: 'easeOut',
              layout: { duration: 0.2 }
            }}
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
