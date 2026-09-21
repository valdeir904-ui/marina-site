import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0B3B24',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          borderRadius: '20%', // typical apple icon shape
          fontSize: '90px',
          fontWeight: 800,
          fontFamily: 'sans-serif',
          letterSpacing: '-2px'
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
