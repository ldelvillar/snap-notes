import type { Metadata } from "next";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "The #1 Note-Taking App | SnapNotes",
  description:
    "Experience seamless note-taking with SnapNotes. Create, organize, and access your notes from anywhere with ease. SnapNotes ensures your notes stay secure and always at your fingertips.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
