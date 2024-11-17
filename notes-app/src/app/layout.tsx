import type { Metadata } from "next";
import "@/styles/globals.css";
import { AuthProvider } from "@/context/useGlobalContext";
import { Onest } from 'next/font/google';

const onest = Onest({
    subsets: ['latin'],
    variable: '--font-onest',
    weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: "SnapNotes",
    description: "Experience seamless note-taking with SnapNotes. Create, organize, and access your notes from anywhere with ease. Perfect for personal and professional use, SnapNotes ensures your notes stay secure and always at your fingertips.",
    icons: "/logo.svg",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={onest.variable}>
            <body className="antialiased font-onest">
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
