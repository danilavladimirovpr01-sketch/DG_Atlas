import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['cyrillic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
});

export default function SmetaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${inter.variable} font-sans min-h-screen bg-black text-white`}
      style={{ fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif' }}
    >
      {children}
    </div>
  );
}
