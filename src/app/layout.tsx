import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { AuthProvider } from "@/context/useGlobalContext";
import "@/styles/globals.css";

const onest = Onest({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "The #1 Note-Taking App - SnapNotes",
  description:
    "Experience seamless note-taking with SnapNotes. Create, organize, and access your notes from anywhere with ease. Perfect for personal and professional use, SnapNotes ensures your notes stay secure and always at your fingertips.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${onest.className} antialiased bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
