interface VendorResponseResult {
  status: "accepted" | "declined" | "question" | "unknown";
  eta?: string;
  rawMessage: string;
}

const ACCEPT_PATTERNS = [
  /\b(yes|yeah|yep|yup|sure|ok|okay|got it|on my way|heading|coming|i('ll| will) be there|accepted|confirmed)\b/i,
];

const DECLINE_PATTERNS = [
  /\b(no|nope|can't|cannot|can not|unavailable|unable|won't|decline|sorry.*(can't|unable|unavailable)|fully booked|not available)\b/i,
];

const QUESTION_PATTERNS = [
  /\?\s*$/,
  /\b(what|where|which|when|how|who|do they|does it|is there|can you)\b.*\?/i,
];

const ETA_PATTERNS = [
  /\bby\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\b/i,
  /\bin\s+(\d+\s*(?:hour|hr|minute|min)s?)\b/i,
  /\baround\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\b/i,
];

export function parseVendorResponse(message: string): VendorResponseResult {
  const trimmed = message.trim();

  // Check questions first (they might contain accept/decline words)
  for (const pattern of QUESTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { status: "question", rawMessage: trimmed };
    }
  }

  // Check decline
  for (const pattern of DECLINE_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { status: "declined", rawMessage: trimmed };
    }
  }

  // Check accept
  for (const pattern of ACCEPT_PATTERNS) {
    if (pattern.test(trimmed)) {
      // Try to extract ETA
      let eta: string | undefined;
      for (const etaPattern of ETA_PATTERNS) {
        const match = trimmed.match(etaPattern);
        if (match) {
          eta = match[1];
          break;
        }
      }
      return { status: "accepted", eta, rawMessage: trimmed };
    }
  }

  return { status: "unknown", rawMessage: trimmed };
}
