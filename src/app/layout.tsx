import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RSUNION IA · Aprende IA usándola",
  description:
    "No te van a explicar la inteligencia artificial. La vas a usar para entenderla. Un curso interactivo de RSUNION IA donde aprendes qué es un prompt, un token, un MCP y cómo funciona la IA — hablando con ella.",
  applicationName: "RSUNION IA",
  keywords: [
    "curso de IA",
    "inteligencia artificial",
    "prompt",
    "token",
    "MCP",
    "aprender IA",
    "ChatGPT",
    "cómo funciona la IA",
  ],
  authors: [{ name: "RSUNION IA" }],
  openGraph: {
    title: "RSUNION IA · Aprende IA usándola",
    description:
      "Un curso interactivo de RSUNION IA donde aprendes cómo funciona la IA hablando con ella.",
    type: "website",
    locale: "es_ES",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfb" },
    { media: "(prefers-color-scheme: dark)", color: "#141414" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
