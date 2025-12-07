import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'
 
export default function Icon() {
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
          borderRadius: '50%',
        }}
      >
        <div
          style={{
            fontSize: 20,
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
