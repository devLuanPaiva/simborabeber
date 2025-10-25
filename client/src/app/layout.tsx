import type { Metadata } from "next";
import { Bebas_Neue, Roboto, Montserrat } from "next/font/google";
import "./globals.css";

const bebasNueve = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas-neue",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const montSerrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "O Seu Cardápio | Cardápios Digitais para Bares e Restaurantes",
  description:
    "Crie seu cardápio digital em minutos com O Seu Cardápio! Ideal para bares, restaurantes, churrascarias e açaís. Prático, bonito e acessível de qualquer dispositivo.",
  keywords: [
    "cardápio digital",
    "cardápio online",
    "menu digital",
    "QR Code cardápio",
    "cardápio restaurante",
    "cardápio bar",
    "cardápio churrascaria",
    "cardápio açaí",
    "sistema de cardápio",
    "cardápio interativo",
    "cardápio fácil",
    "menu eletrônico",
    "cardápio para celular",
    "O Seu Cardápio",
  ],
  authors: [{ name: "O Seu Cardápio", url: "https://www.oseucardapio.com.br" }],
  creator: "O Seu Cardápio",
  publisher: "O Seu Cardápio",
  metadataBase: new URL("https://www.oseucardapio.com.br"),
  alternates: {
    canonical: "https://www.oseucardapio.com.br",
  },
  openGraph: {
    title: "O Seu Cardápio | Crie seu cardápio digital agora mesmo!",
    description:
      "Transforme seu estabelecimento com um cardápio digital moderno, prático e personalizável. Ideal para bares, restaurantes, churrascarias e açaís.",
    url: "https://www.oseucardapio.com.br",
    siteName: "O Seu Cardápio",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "https://www.oseucardapio.com.br/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "O Seu Cardápio - Crie seu cardápio digital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "O Seu Cardápio | Cardápios Digitais para Bares e Restaurantes",
    description:
      "Seu cardápio digital moderno e fácil de usar. Atraia mais clientes e simplifique os pedidos no seu bar, restaurante ou açaíteria.",
    images: ["https://www.oseucardapio.com.br/og-image.jpg"],
    creator: "@oseucardapio",
  },
  category: "Negócios, Tecnologia, Alimentação",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${bebasNueve.variable} ${roboto.variable} ${montSerrat.variable} antialiased`}
        cz-shortcut-listen="false"
      >
        {children}
      </body>
    </html>
  );
}
