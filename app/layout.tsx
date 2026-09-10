import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Elemental Sandspiel | Chemical & Particle Physics Sandbox',
  description: 'Modern falling-sand element simulation with complex chemical reactions, multithreaded fluid physics, and custom element builder.',
  openGraph: {
    title: 'Elemental Sandspiel | Chemical & Particle Physics Sandbox',
    description: 'Modern falling-sand element simulation with complex chemical reactions, multithreaded fluid physics, and custom element builder.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Elemental Sandspiel | Chemical & Particle Physics Sandbox',
    description: 'Modern falling-sand element simulation with complex chemical reactions, multithreaded fluid physics, and custom element builder.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
