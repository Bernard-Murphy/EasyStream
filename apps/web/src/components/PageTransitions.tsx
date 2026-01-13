"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  fade_out,
  normalize,
  transition_fast,
  fade_out_scale_1,
} from "@/lib/transitions";

export function PageTransitions({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={fade_out}
        animate={normalize}
        exit={fade_out_scale_1}
        transition={transition_fast}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
