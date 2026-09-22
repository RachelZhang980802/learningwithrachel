import type { Metadata } from "next";
import "./globals.css";
import "./student-workspace.css";
import "./grammar-theme.css";
import "./editable-text.css";
import { EditableTextLayer } from "./EditableTextLayer";

export const metadata: Metadata = {
  title: "Learning with Rachel",
  description: "Reading, writing, and culture learning resources with Rachel.",
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
      <body className="antialiased"><EditableTextLayer>{children}</EditableTextLayer></body>
    </html>
  );
}
