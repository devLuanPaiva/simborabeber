export function getFileExtension(file: File): string {
    const nameExt = file.name.split(".").pop();
    if (nameExt && nameExt.length <= 5) {
        return `.${nameExt.toLowerCase()}`;
    }
    if (file.type.includes("/")) {
        return `.${file.type.split("/")[1]}`;
    }
    return "";
}