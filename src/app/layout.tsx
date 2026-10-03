import type { Metadata } from 'next';
import { Playfair_Display, Montserrat, Wix_Madefor_Text } from 'next/font/google';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import './globals.css';

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
  title: 'Psicóloga Marina Falcão | Ribeirão Preto & On-line',
  description:
    'Psicoterapia especializada em ansiedade, burnout, luto, questões de relacionamento e vínculos afetivos, depressão, psicossomática e psicogerontologia. Atendimento on-line.',
  keywords: [
    'Psicóloga Ribeirão Preto',
    'Marina Falcão',
    'Psicoterapia Ansiedade',
    'Burnout',
    'Questões de Relacionamento e Vínculos Afetivos',
    'Luto',
    'Psicossomática',
    'Psicogerontologia',
    'Análise do Comportamento',
  ],
  authors: [{ name: 'Marina Falcão', url: 'https://marinafalcao.com.br' }],
  openGraph: {
    title: 'Psicóloga Marina Falcão | Saúde Mental & Psicoterapia',
    description: 'Tudo começa na sua saúde mental. Agende sua sessão on-line.',
    url: 'https://marinafalcao.com.br',
    siteName: 'Psicóloga Marina Falcão',
    locale: 'pt_BR',
    type: 'website',
  },
};

import dynamic from 'next/dynamic';

const SmoothScroll = dynamic(() => import('@/components/SmoothScroll'), {
  ssr: false,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${montserrat.variable} ${madefor.variable} overflow-x-hidden`}>
      <body className="min-h-screen bg-warm-50 text-slate-800 font-sans antialiased selection:bg-brand-200 selection:text-brand-900 overflow-x-hidden">
        <AnalyticsTracker />
        {children}
        <SmoothScroll>{null}</SmoothScroll>
      </body>
    </html>
  );
}
