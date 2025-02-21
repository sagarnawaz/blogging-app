// src/app/layout.jsx
import { Inter } from 'next/font/google';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import SessionWrapper from '@/components/SessionWrapper';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper session={session}>
          <Navbar session={session} />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </SessionWrapper>
      </body>
    </html>
  );
}
