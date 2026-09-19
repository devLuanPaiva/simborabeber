type WhatsAppOptions = {
    phoneNumber?: string;
    message?: string;
};

export function openWhatsApp({
    phoneNumber = "+55084996322535",
    message,
}: WhatsAppOptions = {}) {
    const defaultMessage = `Olá! Tenho interesse no sistema o seu cardápio. Gostaria de entender melhor como funciona a gestão de comandas, cardápio digital e vendas. Pode me passar mais informações?`;

    const text = message || defaultMessage;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;

    if (globalThis.window !== undefined) {
        window.open(url, "_blank");
    }
}