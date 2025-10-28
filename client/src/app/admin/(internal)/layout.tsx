import { AuthForce } from "@/components/auth/AuthForce";
import { AdminLayout } from "@/components/layout/AdminLayout";
import {
  EstablishmentProvider,
  ProductProvider,
  UserProvider,
} from "@/data/contexts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthForce>
      <UserProvider>
        <EstablishmentProvider>
          <ProductProvider>
            <AdminLayout>{children}</AdminLayout>
          </ProductProvider>
        </EstablishmentProvider>
      </UserProvider>
    </AuthForce>
  );
}
