"use client"

import React from "react"
import { motion } from "framer-motion"

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 }
  }
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] as const }
  }
}

export function AnimatedStatsGrid({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6"
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={item}>{child}</motion.div>
      ))}
    </motion.div>
  )
}
