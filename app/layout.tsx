import type { Metadata } from "next";
import "./globals.css";
import "./student-workspace.css";
import "./grammar-theme.css";
import "./editable-text.css";
import "./article-one-quiz.css";
import "./reading-deeper.css";
import "./grammar-study.css";
import "./grammar-source-pages.css";
import "./grammar-exercise-text.css";
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
