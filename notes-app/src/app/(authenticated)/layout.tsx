import type { Metadata } from "next";
import "@/styles/globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
    title: "Simplify Your Note-Taking with SnapNotes - Fast, Secure, and Organized",
    description: "Experience seamless note-taking with SnapNotes. Create, organize, and access your notes from anywhere with ease. Perfect for personal and professional use, SnapNotes ensures your notes stay secure and always at your fingertips.",
    icons: "/logo.svg",
};

export default function NotesLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Sidebar>
                {children}
            </Sidebar>
        </>

    );
}
