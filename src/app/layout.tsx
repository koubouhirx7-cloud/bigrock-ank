import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BIGROCK Exhibition Survey",
  description: "Feedback survey for BIGROCK Exhibition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
