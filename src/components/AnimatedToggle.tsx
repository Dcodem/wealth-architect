"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface AnimatedToggleProps {
  defaultOn?: boolean;
  onChange?: (on: boolean) => void;
}

export default function AnimatedToggle({ defaultOn = false, onChange }: AnimatedToggleProps) {
  const [on, setOn] = useState(defaultOn);

  const handleToggle = () => {
    const next = !on;
    setOn(next);
    onChange?.(next);
  };

  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={handleToggle}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        on ? "bg-primary" : "bg-surface-container-high"
      }`}
    >
      <motion.div
        className="absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-sm"
        animate={{ x: on ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}
