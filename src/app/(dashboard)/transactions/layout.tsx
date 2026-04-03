import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Transactions",
    template: "%s — The Wealth Architect",
  },
};

export default function TransactionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
