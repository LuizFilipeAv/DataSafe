import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { EPIProvider } from "@/context/EPIContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DataSafe — Gestão de EPIs",
  description:
    "Sistema corporativo de gestão de Equipamentos de Proteção Individual",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.className} bg-slate-900 text-slate-50 antialiased`}
      >
        <EPIProvider>{children}</EPIProvider>
      </body>
    </html>
  );
}
