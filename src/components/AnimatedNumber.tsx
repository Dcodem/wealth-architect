"use client";

import NumberFlow, { type Format, useCanAnimate } from "@number-flow/react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";

const MotionArrowUp = motion.create(ArrowUp);

interface AnimatedNumberProps {
  value: number;
  format?: Format;
  diff?: number;
  className?: string;
  diffClassName?: string;
}

export default function AnimatedNumber({
  value,
  format = { style: "currency", currency: "USD", maximumFractionDigits: 0 },
  diff,
  className = "text-2xl font-bold",
  diffClassName,
}: AnimatedNumberProps) {
  const canAnimate = useCanAnimate();

  return (
    <span className="flex items-center gap-2">
      <NumberFlow
        value={value}
        className={className}
        format={format}
      />
      {diff !== undefined && (
        <motion.span
          className={
            diffClassName ??
            `inline-flex items-center px-1.5 py-0.5 text-xs font-bold rounded-full ${
              diff > 0
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-600"
            }`
          }
          layout={canAnimate}
          transition={{ layout: { duration: 0.9, bounce: 0, type: "spring" } }}
        >
          <MotionArrowUp
            className="mr-0.5 size-[0.75em]"
            absoluteStrokeWidth
            strokeWidth={2.5}
            transition={{ rotate: { type: "spring", duration: 0.5, bounce: 0 } }}
            animate={{ rotate: diff > 0 ? 0 : -180 }}
            initial={false}
          />
          <NumberFlow
            value={Math.abs(diff)}
            className="font-bold"
            format={{ style: "percent", maximumFractionDigits: 1 }}
          />
        </motion.span>
      )}
    </span>
  );
}
