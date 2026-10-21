'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { GOOGLE_ADS_ID } from '@/lib/tracking';

export default function GoogleAdsScript() {
  const pathname = usePathname();

  // Não carregar nas rotas /admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
    </>
  );
}
