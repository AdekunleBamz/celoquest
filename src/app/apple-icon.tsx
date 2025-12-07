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
          background: 'linear-gradient(135deg, #35D07F 0%, #FBCC5C 50%, #35D07F 100%)',
          borderRadius: '20%',
        }}
      >
        <div
          style={{
            fontSize: 90,
            fontWeight: 'bold',
            color: 'white',
            display: 'flex',
          }}
        >
          $
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
