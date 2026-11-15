import type { Metadata } from 'next';
import { Bricolage_Grotesque, Public_Sans } from 'next/font/google';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import './globals.css';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['600', '700'],
});

const body = Public_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lantunan.ryzellx.my.id'),
  title: { default: 'Lantunan, musik tanpa gangguan', template: '%s · Lantunan' },
  description:
    'Lantunan memutar YouTube Music tanpa iklan, dengan lirik tersinkron, equalizer, dan unduhan offline. APK langsung, tanpa Play Store.',
  applicationName: 'Lantunan',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'Lantunan',
    title: 'Lantunan, musik tanpa gangguan',
    description: 'YouTube Music tanpa iklan, lirik tersinkron, equalizer, unduhan offline.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable}`}>
      <body>
        <a className="skip" href="#main">Lewati ke konten</a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
