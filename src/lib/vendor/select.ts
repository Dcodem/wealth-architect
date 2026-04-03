import { findVendorsByTrade } from "@/lib/db/queries/vendors";
import type { Vendor } from "@/lib/db/schema";

/**
 * Select the best available vendor for a given trade.
 * Returns vendors ordered by preference score (highest first).
 * Optionally excludes specific vendor IDs (e.g., ones that already declined).
 */
export async function selectVendor(
  trade: Vendor["trade"],
  orgId: string,
  excludeIds: string[] = []
): Promise<Vendor | null> {
  const vendors = await findVendorsByTrade(trade, orgId);

  const available = excludeIds.length > 0
    ? vendors.filter((v) => !excludeIds.includes(v.id))
    : vendors;

  return available[0] ?? null;
}
