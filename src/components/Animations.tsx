"use client";

import { motion } from "framer-motion";

export function FadeDown({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0, filter: "blur(4px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0)" }}
      transition={{ ease: "easeInOut", duration: 1.5, delay: delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0)" }}
      transition={{ ease: "easeInOut", duration: 1.5, delay: delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FadeLeft({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0, filter: "blur(4px)" }}
      animate={{ x: 0, opacity: 1, filter: "blur(0)" }}
      transition={{ ease: "easeInOut", duration: 1.5, delay: delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FadeRight({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) {
  return (
    <motion.div
      initial={{ x: 20, opacity: 0, filter: "blur(4px)" }}
      animate={{ x: 0, opacity: 1, filter: "blur(0)" }}
      transition={{ ease: "easeInOut", duration: 1.5, delay: delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
