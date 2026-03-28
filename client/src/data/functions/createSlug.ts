export function createSlug(input: string): string {
    if (!input) return "";

    return input
        .toString()
        .normalize("NFD")
        .replaceAll(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replaceAll(/[^a-z0-9\s-]/g, "")
        .trim()
        .replaceAll(/\s+/g, "-")
        .replaceAll(/-+/g, "-");
}