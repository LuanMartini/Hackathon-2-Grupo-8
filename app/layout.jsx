import "./globals.css";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";

export const metadata = {
  title: "Suporte Claro — diagnóstico guiado",
  description: "Transforme um relato vago em um chamado claro, completo e pronto para o suporte.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body><AccessibilityProvider>{children}</AccessibilityProvider></body>
    </html>
  );
}
