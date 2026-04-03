"use client";

import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...rest }, ref) => {
    const generatedId = useId();
    const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const errorId = error ? `${generatedId}-error` : undefined;

    return (
      <div>
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-on-surface mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={cn(
            "w-full px-3 py-2 min-h-[44px] rounded-lg border border-outline-variant bg-surface-container-lowest text-sm text-on-surface transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer",
            error && "border-error focus:ring-error/20",
            className,
          )}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p id={errorId} role="alert" className="text-error text-xs mt-1">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
