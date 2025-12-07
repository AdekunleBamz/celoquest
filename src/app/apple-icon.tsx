import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'
 
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FCD34D 0%, #FBBF24 50%, #F59E0B 100%)',
          borderRadius: '20%',
        }}
      >
        <div
          style={{
            fontSize: 85,
            fontWeight: 900,
            color: 'white',
            display: 'flex',
            letterSpacing: '-4px',
          }}
        >
          CQ
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
