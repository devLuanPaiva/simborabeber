import { AuthForce } from "@/components/auth/AuthForce";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthForce>{children}</AuthForce>
    );
}
