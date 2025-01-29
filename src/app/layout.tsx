'use client';

import { useEffect } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const initMSW = async () => {
      try {
        const enableMSW = process.env.NEXT_PUBLIC_ENABLE_MSW === 'true';
        
        if (enableMSW) {
          console.log('MSW Initialization starting...');
          const { worker } = await import('./mocks/browser');
          
          await worker.start({
            onUnhandledRequest: 'bypass'
            serviceWorker: {
              url: '/mockServiceWorker.js',
              options: {
                scope: '/',
              },
            },
          });
          console.log('MSW Initialized successfully');
        }
      } catch (error) {
        console.error('Error initializing MSW:', error);
      }
    };

    initMSW();
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}