import { AuthForce } from "@/components/auth/AuthForce";
import { AdminLayout } from "@/components/layout/AdminLayout";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthForce><AdminLayout>{children}</AdminLayout></AuthForce>
    );
}
