import { describe, expect, it } from "vitest";

import { formatDate, formatInr } from "@/lib/format";

describe("format", () => {
  it("shows dates in Indian time", () => {
    // 20:00 UTC is already the next day in India.
    expect(formatDate("2026-10-17T20:00:00Z")).toBe("18 Oct 2026");
  });

  it("shows rupees without decimals and with Indian grouping", () => {
    expect(formatInr(1200)).toBe("₹1,200");
    expect(formatInr(150000)).toBe("₹1,50,000");
  });
});
