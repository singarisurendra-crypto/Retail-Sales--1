import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'JSR Retails Sales',
  description: 'Retail Sales & Inventory Management ERP',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-[#f8fafc] text-slate-900 antialiased`}>{children}</body>
    </html>
  );
}
