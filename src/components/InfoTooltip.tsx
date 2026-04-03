"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface InfoTooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom";
}

export default function InfoTooltip({ content, children, position = "top" }: InfoTooltipProps) {
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleEnter = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShow(true), 200);
  };

  const handleLeave = () => {
    clearTimeout(timeoutRef.current);
    setShow(false);
  };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.span
            initial={{ opacity: 0, y: position === "top" ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: position === "top" ? 4 : -4 }}
            transition={{ duration: 0.15 }}
            className={`absolute left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 bg-inverse-surface text-inverse-on-surface text-[11px] font-medium rounded-lg whitespace-nowrap shadow-lg ${
              position === "top" ? "bottom-full mb-2" : "top-full mt-2"
            }`}
          >
            {content}
            <span
              className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-inverse-surface rotate-45 ${
                position === "top" ? "top-full -mt-1" : "bottom-full -mb-1"
              }`}
            />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
