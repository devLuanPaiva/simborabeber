import { AuthenticationProvider } from "@/data/contexts";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <AuthenticationProvider>{children}</AuthenticationProvider>
  );
}
