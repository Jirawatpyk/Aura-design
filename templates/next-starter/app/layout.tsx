import type { Metadata } from 'next';
import type { ReactNode } from 'react';
/* AURA: tokens (light + dark), then component styles. Your brand theme (optional) goes after them. */
import '@jirawatpyk/aura-tokens/aura.css';
import '@jirawatpyk/aura-react/styles.css';
import { AuraProvider, Toaster } from '@jirawatpyk/aura-react';
import './globals.css';

export const metadata: Metadata = { title: 'AURA starter', description: 'Next.js + AURA Design System' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <head>
        {/* AURA fonts. <link> tags fail quietly if Google Fonts is blocked; an @import in CSS would not. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&family=Noto+Sans+Thai:wght@400;500;600&display=swap" />
      </head>
      <body>
        {/* Thai built-in labels; dates show พ.ศ. by default. Use locale="en" for English labels. */}
        <AuraProvider locale="th">
          {children}
          <Toaster />
        </AuraProvider>
      </body>
    </html>
  );
}
