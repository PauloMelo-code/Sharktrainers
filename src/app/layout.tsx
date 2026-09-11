import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://sharktrainers.com.br"),
  title: {
    default: "Shark Trainers — Headhunters do varejo óptico e joalheiro",
    template: "%s · Shark Trainers",
  },
  description:
    "A única e exclusiva agência headhunters do setor óptico e joalheiro. Canal de empregos, banco de talentos e treinamento comercial, com clientes em todo o Brasil.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Shark Trainers",
    images: ["/assets/logo.png"],
  },
  icons: { icon: "/assets/logo-t.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F4C01C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
