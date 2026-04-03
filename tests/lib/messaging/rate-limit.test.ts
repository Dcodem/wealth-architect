import { describe, it, expect, beforeEach } from "vitest";
import { checkRateLimit, resetRateLimits } from "@/lib/messaging/rate-limit";

describe("rate limiting", () => {
  beforeEach(() => {
    resetRateLimits();
  });

  it("allows messages under the limit", async () => {
    const result = await checkRateLimit("sender@example.com", "org-1");
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(9);
  });

  it("blocks after 10 messages from the same sender", async () => {
    for (let i = 0; i < 10; i++) {
      await checkRateLimit("spammer@example.com", "org-1");
    }
    const result = await checkRateLimit("spammer@example.com", "org-1");
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("different senders have independent limits", async () => {
    for (let i = 0; i < 10; i++) {
      await checkRateLimit("sender-a@example.com", "org-1");
    }
    const result = await checkRateLimit("sender-b@example.com", "org-1");
    expect(result.allowed).toBe(true);
  });

  it("same sender in different orgs have independent limits", async () => {
    for (let i = 0; i < 10; i++) {
      await checkRateLimit("sender@example.com", "org-1");
    }
    const result = await checkRateLimit("sender@example.com", "org-2");
    expect(result.allowed).toBe(true);
  });
});
