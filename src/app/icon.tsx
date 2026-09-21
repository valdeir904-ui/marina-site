import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0B3B24', // brand-900 ou brand-800
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          borderRadius: '50%',
          fontSize: '16px',
          fontWeight: 800,
          fontFamily: 'sans-serif',
          letterSpacing: '-0.5px'
        }}
      >
        MF
      </div>
    ),
    {
      ...size,
    }
  );
}
