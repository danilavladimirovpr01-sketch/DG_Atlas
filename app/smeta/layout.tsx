import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['cyrillic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
});

export default function SmetaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${inter.variable} font-sans min-h-screen bg-[#0a0a0a]`}
      style={{ fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif' }}
    >
      {/* Desktop: centered phone-width container */}
      <div className="mx-auto max-w-[430px] min-h-screen bg-black text-white relative shadow-2xl">
        {children}
      </div>
    </div>
  );
}
