import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The American Constitution | Scholar’s Catalogue",
  description: "An interactive map and close reading of the American Constitution.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
