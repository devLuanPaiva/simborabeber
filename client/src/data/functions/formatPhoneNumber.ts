/**
 * Formats a BR phone number as the user types: (xx) xxxx-xxxx while it could
 * still be a landline, shifting to (xx) xxxxx-xxxx once an 11th digit shows
 * it's a mobile number.
 */
export function formatPhoneNumber(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (!digits) return "";

    const ddd = digits.slice(0, 2);
    if (digits.length <= 2) return `(${ddd}`;

    const localDigits = digits.slice(2);
    const splitAt = digits.length > 10 ? 5 : 4;
    const firstPart = localDigits.slice(0, splitAt);
    const secondPart = localDigits.slice(splitAt);

    return secondPart ? `(${ddd}) ${firstPart}-${secondPart}` : `(${ddd}) ${firstPart}`;
}
