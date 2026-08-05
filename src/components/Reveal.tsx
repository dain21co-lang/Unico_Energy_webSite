"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className,
  y = 24,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      // opacity is intentionally NOT animated here: on some real
      // mobile browsers hydration can lag or fail, and an
      // initial opacity:0 leaves content permanently invisible
      // (confirmed cause of the Hero/About blank-section bugs)
      // Animating only the y-offset means content is always
      // visible even if this script never runs
      initial={{ y }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
