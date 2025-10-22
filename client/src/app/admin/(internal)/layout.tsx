import { AuthForce } from "@/components/auth/AuthForce";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { UserProvider } from "@/data/contexts";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthForce>
            <UserProvider>
                <AdminLayout>
                    {children}
                </AdminLayout>
            </UserProvider>
        </AuthForce>
    );
}
