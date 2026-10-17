const DATE_FORMAT = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

const INR_FORMAT = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** "2026-10-17T10:39:45Z" → "17 Oct 2026". Fixed time zone, so server and browser agree. */
export function formatDate(isoDate: string): string {
  return DATE_FORMAT.format(new Date(isoDate));
}

/** 1200 → "₹1,200". */
export function formatInr(amount: number): string {
  return INR_FORMAT.format(amount);
}
