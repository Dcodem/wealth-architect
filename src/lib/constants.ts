export const URGENCY_COLORS = {
  critical: "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]",
  high: "bg-[#FFF7ED] text-[#9A3412] border-[#FED7AA]",
  medium: "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]",
  low: "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]",
} as const;

export const STATUS_COLORS = {
  open: "bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]",
  in_progress: "bg-[#F5F3FF] text-[#5B21B6] border-[#DDD6FE]",
  waiting_on_vendor: "bg-[#FFF7ED] text-[#9A3412] border-[#FED7AA]",
  waiting_on_tenant: "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]",
  resolved: "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]",
  closed: "bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]",
} as const;

export const CASE_STATUSES = [
  "open",
  "in_progress",
  "waiting_on_vendor",
  "waiting_on_tenant",
  "resolved",
  "closed",
] as const;

export const URGENCY_LEVELS = [
  "critical",
  "high",
  "medium",
  "low",
] as const;

export const VENDOR_TRADES = [
  "plumber",
  "electrician",
  "hvac",
  "general",
  "locksmith",
  "appliance_repair",
  "pest_control",
  "cleaning",
  "landscaping",
  "roofing",
  "painting",
  "other",
] as const;
