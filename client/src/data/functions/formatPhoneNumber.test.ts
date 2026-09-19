import { formatPhoneNumber } from "./formatPhoneNumber";

describe("formatPhoneNumber", () => {
  it("returns an empty string for no digits", () => {
    expect(formatPhoneNumber("")).toBe("");
  });

  it("opens the DDD parenthesis while typing the first two digits", () => {
    expect(formatPhoneNumber("1")).toBe("(1");
    expect(formatPhoneNumber("11")).toBe("(11");
  });

  it("formats a landline (10 digits) as (xx) xxxx-xxxx", () => {
    expect(formatPhoneNumber("1132345678")).toBe("(11) 3234-5678");
  });

  it("formats a mobile number (11 digits) as (xx) xxxxx-xxxx", () => {
    expect(formatPhoneNumber("11987654321")).toBe("(11) 98765-4321");
  });

  it("ignores non-digit characters already present in the value", () => {
    expect(formatPhoneNumber("(11) 98765-4321")).toBe("(11) 98765-4321");
  });

  it("truncates anything past 11 digits", () => {
    expect(formatPhoneNumber("119876543219999")).toBe("(11) 98765-4321");
  });
});
