import type { Metadata } from "next";
import { AuthProvider } from "./providers";
import "../client/global.css";

export const metadata: Metadata = {
  title: "Légion de Marie",
  description: "Plateforme de gestion de la Légion de Marie",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
