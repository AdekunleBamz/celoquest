import { Metadata } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://celoquest.vercel.app';

export const metadata: Metadata = {
  title: 'CeloQuest - Micro-Lending on Celo',
  description: 'Fund entrepreneurs worldwide with as little as $1',
  openGraph: {
    title: 'CeloQuest - Micro-Lending',
    description: 'Fund entrepreneurs worldwide',
    images: [`${BASE_URL}/api/og`],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${BASE_URL}/api/og`,
    'fc:frame:button:1': '🌍 Browse Borrowers',
    'fc:frame:button:2': '💼 My Portfolio', 
    'fc:frame:button:3': '📝 Apply for Loan',
    'fc:frame:button:4': '🔗 Open App',
    'fc:frame:button:4:action': 'link',
    'fc:frame:button:4:target': BASE_URL,
    'fc:frame:post_url': `${BASE_URL}/api/frame`,
  },
};

export default function FramePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="glass rounded-3xl p-10 text-center max-w-lg">
        <p className="text-6xl mb-4">🎯</p>
        <h1 className="text-3xl font-bold text-white mb-4">CeloQuest Frame</h1>
        <p className="text-white/70 mb-6">
          This page is optimized for Farcaster Frames. 
          Share the URL in Warpcast to see the interactive frame!
        </p>
        <a 
          href="/"
          className="inline-block btn-primary px-8 py-3 rounded-xl"
        >
          Open Full App
        </a>
      </div>
    </main>
  );
}
