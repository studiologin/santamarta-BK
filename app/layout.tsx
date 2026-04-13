import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { ScrollNavigation } from '@/components/scroll-navigation';
import { MonitoringScripts } from '@/components/monitoring-scripts';
import { Inter, Space_Grotesk, Fahkwang } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const fahkwang = Fahkwang({ weight: ['400', '500', '600', '700'], subsets: ['latin'], variable: '--font-fahkwang' });

export const metadata: Metadata = {
  title: 'Santa Marta - Geossintéticos e Construção Civil',
  description: 'Soluções especializadas em geossintéticos, construção civil e serviços de engenharia.',
  icons: {
    icon: 'https://ioytminosynrorvzqxwt.supabase.co/storage/v1/object/public/Imagens%20do%20Site/Favicon_red.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`dark ${inter.variable} ${spaceGrotesk.variable} ${fahkwang.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased flex flex-col min-h-screen bg-[#f8f7f6] dark:bg-[#0A192A] text-slate-900 dark:text-slate-100">
        <MonitoringScripts />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <ScrollNavigation />
        <Footer />
      </body>
    </html>
  );
}
