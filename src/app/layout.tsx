import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "CeloQuest - Gamified Micro-Lending on Celo",
  description: "Fund entrepreneurs worldwide with as little as one dollar",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.tsx', sizes: '32x32' }
    ],
    apple: '/apple-icon.tsx',
  },
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
