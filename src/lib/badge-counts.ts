// Centralized badge counts derived from shared data modules.
// In production these would come from an API or state store.

import { initialCards } from "@/lib/data/triage-cards";
import { pairs } from "@/lib/data/duplicate-pairs";
import { allTransactions } from "@/lib/data/large-transactions";

export const badgeCounts = {
  transactionReview: initialCards.length,
  duplicatePairs: pairs.length,
  largeTransactions: allTransactions.length,
  needsReview: 1,
} as const;
