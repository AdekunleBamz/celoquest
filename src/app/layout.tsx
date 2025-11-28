import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "CeloQuest - Gamified Micro-Lending on Celo",
  description: "Fund entrepreneurs worldwide with as little as one dollar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
