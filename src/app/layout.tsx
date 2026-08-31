import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { AdminLoginModal } from '@/components/admin/AdminLoginModal';
import { AdminEventEditorModal } from '@/components/admin/AdminEventEditorModal';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GREViX ? Student Driven. Impact Focused.',
  description: 'A student-driven technology and research community building software, hackathons, and technical research.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#060810] text-[#F1F5F9] font-sans antialiased min-h-screen flex flex-col">
        <AdminAuthProvider>
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <AdminLoginModal />
          <AdminEventEditorModal />
        </AdminAuthProvider>
      </body>
    </html>
  );
}
