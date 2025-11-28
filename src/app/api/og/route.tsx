import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #fcff4d 0%, #ffa500 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
            }}
          >
            🎯
          </div>
          <span style={{ fontSize: '64px', fontWeight: 800, color: 'white' }}>
            CeloQuest
          </span>
        </div>
        <p style={{ fontSize: '28px', color: 'rgba(255,255,255,0.9)' }}>
          Gamified Micro-Lending on Celo
        </p>
        <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.7)', marginTop: '20px' }}>
          Fund entrepreneurs worldwide • Earn impact points • Build your badge
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 628,
    }
  );
}
