import { describe, it, expect } from "vitest";
import { parseVendorResponse } from "@/lib/vendor/response";

describe("parseVendorResponse", () => {
  it("detects acceptance", () => {
    expect(parseVendorResponse("Yes, I can be there by 3pm").status).toBe("accepted");
    expect(parseVendorResponse("On my way").status).toBe("accepted");
    expect(parseVendorResponse("Got it, heading over now").status).toBe("accepted");
    expect(parseVendorResponse("I'll be there in an hour").status).toBe("accepted");
  });

  it("detects decline", () => {
    expect(parseVendorResponse("Can't today, fully booked").status).toBe("declined");
    expect(parseVendorResponse("No, I'm unavailable this week").status).toBe("declined");
    expect(parseVendorResponse("Sorry, can't make it").status).toBe("declined");
  });

  it("detects questions", () => {
    expect(parseVendorResponse("What's the address again?").status).toBe("question");
    expect(parseVendorResponse("Which unit is it?").status).toBe("question");
    expect(parseVendorResponse("Do they have a dog?").status).toBe("question");
  });

  it("extracts ETA when present", () => {
    const result = parseVendorResponse("Yes, I can be there by 3pm");
    expect(result.eta).toBe("3pm");
  });

  it("returns unknown for ambiguous messages", () => {
    expect(parseVendorResponse("Ok").status).toBe("accepted");
    expect(parseVendorResponse("hmm let me check").status).toBe("unknown");
  });
});
