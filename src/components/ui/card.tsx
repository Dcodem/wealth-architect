import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-surface-container-lowest p-6 card-shadow border border-outline-variant/10",
        hover && "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer hover:border-primary/20",
        className
      )}
    >
      {children}
    </div>
  );
}
