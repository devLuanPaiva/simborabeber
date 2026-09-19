import type { Metadata } from "next";
import { Bebas_Neue, Roboto, Montserrat } from "next/font/google";
import "./globals.css";
import { ScrollUp } from "@/components/layout/ScrollUp";
import { Analytics } from "@/data/services/analytics";

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
  metadataBase: new URL("https://www.oseucardapio.com.br"),

  title: {
    default: "O seu cardápio | Gestão e Copo Cheio",
    template: "%s | O seu cardápio",
  },

  description:
    "O seu cardápio é um sistema simples e ágil para gerenciamento de bares. Substitua comandas e cardápios físicos por digitais, controle pedidos, produtos e vendas com rapidez e sem complicar a rotina dos garçons.",

  keywords: [
    "sistema para bar",
    "gestão de bar",
    "sistema de comandas",
    "comanda digital",
    "cardápio digital",
    "sistema para barzinho",
    "software para bares",
    "controle de pedidos bar",
    "gestão de comandas",
    "automação de bares",
    "gestão de vendas bar",
    "sistema para restaurante pequeno",
    "controle de estoque bar",
    "gestão de produtos bar",
    "relatórios de vendas bar",
    "app para garçons",
    "sistema simples para bar",
    "tecnologia para bares",
    "bar digital",
    "cardápio online bar",
    "sistema de pedidos mesa",
    "gestão eficiente de bar",
    "sistema rápido para atendimento",
  ],

  authors: [{ name: "O seu cardápio" }],
  creator: "O seu cardápio",
  publisher: "O seu cardápio",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        url: "/favicon-16x16.png",
        sizes: "16x16",
      },
      {
        rel: "icon",
        url: "/favicon-32x32.png",
        sizes: "32x32",
      },
      {
        rel: "icon",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
      },
      {
        rel: "icon",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
      },
    ],
  },

  alternates: {
    canonical: "https://www.oseucardapio.com.br",
  },

  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://www.oseucardapio.com.br",
    siteName: "O seu cardápio",
    title: "O seu cardápio | Gestão e Copo Cheio",
    description:
      "Sistema ágil para bares: comandas digitais, cardápio online, controle de pedidos, produtos e relatórios de vendas. Simplifique o atendimento e ganhe velocidade.",
    images: [
      {
        url: "https://www.oseucardapio.com.br/logo-com-fundo.png",
        width: 1200,
        height: 630,
        alt: "O seu cardápio - Sistema de Gestão para Bares",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "O seu cardápio | Gestão de Bar Digital",
    description:
      "Comandas e cardápio digital para bares. Mais agilidade no atendimento e controle total das vendas.",
    images: ["https://www.oseucardapio.com.br/logo-com-fundo.png"],
  },

  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <Analytics />
      </head>
      <body
        className={`${bebasNueve.variable} ${roboto.variable} ${montSerrat.variable} bg-[#F2F2F2]`}
        cz-shortcut-listen="false"
      >
        {children}
        <ScrollUp />
      </body>
    </html>
  );
}
