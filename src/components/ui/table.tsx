import { cn } from "@/lib/utils";

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-surface-container-lowest card-shadow border border-outline-variant/10 overflow-hidden">
      <table className={cn("w-full text-sm", className)}>{children}</table>
    </div>
  );
}

export function TableHeader({ children, className }: TableProps) {
  return (
    <thead className={cn("bg-surface-container-lowest", className)}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className }: TableProps) {
  return (
    <tbody className={cn("divide-y divide-outline-variant/50", className)}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className }: TableProps) {
  return (
    <tr
      className={cn(
        "transition-colors duration-150 hover:bg-primary-fixed/30",
        className
      )}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className }: TableProps) {
  return (
    <td className={cn("px-4 py-3 text-[14px] text-on-surface", className)}>
      {children}
    </td>
  );
}

export function TableHeaderCell({ children, className }: TableProps) {
  return (
    <th
      scope="col"
      className={cn(
        "px-4 py-3 text-left text-[13px] font-medium text-outline",
        className
      )}
    >
      {children}
    </th>
  );
}
