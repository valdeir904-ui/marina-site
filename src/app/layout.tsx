import type { Metadata } from 'next';
import { Playfair_Display, Montserrat, Wix_Madefor_Text } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import GoogleAdsScript from '@/components/GoogleAdsScript';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const madefor = Wix_Madefor_Text({
  subsets: ['latin'],
  variable: '--font-madefor',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Psicóloga Online Marina Falcão | CRP 06/162899 | Atendimento em todo o Brasil',
  description:
    'Psicoterapia on-line com a psicóloga Marina Falcão (CRP 06/162899). Sessões de 50 minutos por videochamada, para adultos em todo o Brasil e no exterior. Agende pelo WhatsApp.',
  keywords: [
    'Psicóloga Online',
    'Psicólogo Online',
    'Terapia Online',
    'Psicoterapia Online',
    'Marina Falcão',
    'Psicoterapia Ansiedade',
    'Burnout',
    'Luto',
    'Relacionamentos e Vínculos Afetivos',
    'Análise do Comportamento',
  ],
  authors: [{ name: 'Marina Falcão', url: 'https://www.marinafalcao.com.br' }],
  openGraph: {
    title: 'Psicóloga Online Marina Falcão | CRP 06/162899 | Atendimento em todo o Brasil',
    description:
      'Psicoterapia on-line com a psicóloga Marina Falcão (CRP 06/162899). Sessões de 50 minutos por videochamada, para adultos em todo o Brasil e no exterior. Agende pelo WhatsApp.',
    url: 'https://www.marinafalcao.com.br',
    siteName: 'Psicóloga Marina Falcão',
    locale: 'pt_BR',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Psicóloga Online Marina Falcão',
  image: 'https://www.marinafalcao.com.br/images/marina-hero-v2.jpg',
  url: 'https://www.marinafalcao.com.br',
  telephone: '+5516994244626',
  areaServed: {
    '@type': 'Country',
    name: 'BR',
  },
  availableService: {
    '@type': 'MedicalTherapy',
    name: 'Psicoterapia On-line',
    description: 'Atendimento psicológico 100% on-line por videochamada para adultos em todo o Brasil e no exterior.',
  },
  provider: {
    '@type': 'Person',
    name: 'Marina Falcão',
    jobTitle: 'Psicóloga Clínica',
    identifier: 'CRP 06/162899',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${montserrat.variable} ${madefor.variable} overflow-x-hidden`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-warm-50 text-slate-800 font-sans antialiased selection:bg-brand-200 selection:text-brand-900 overflow-x-hidden">
        <GoogleAdsScript />
        <AnalyticsTracker />
        {children}
        <SmoothScroll>{null}</SmoothScroll>
      </body>
    </html>
  );
}
