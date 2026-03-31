"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export function ConfirmationAnimation() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.1,
      }}
      className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
      >
        <CheckCircle2 className="h-10 w-10 text-green-500" />
      </motion.div>
    </motion.div>
  );
}
