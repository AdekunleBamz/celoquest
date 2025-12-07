# 🌟 CeloQuest

> **Gamified Micro-Lending on Celo**  
> Fund entrepreneurs worldwide with as little as one dollar

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://celoquest.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Built on Celo](https://img.shields.io/badge/built%20on-Celo-FBCC5C)](https://celo.org)

---

## 📖 Overview

CeloQuest is a decentralized micro-lending platform built on the Celo blockchain that democratizes access to financial services. We connect global lenders with entrepreneurs in emerging markets, enabling micro-loans starting from just $1 using Celo stablecoins (cUSD).

### ✨ Key Features

- 💰 **Micro-Lending** - Lend as little as $1 to verified entrepreneurs
- 🎮 **Gamification** - Earn impact points and unlock achievement badges
- 🔄 **Token Swaps** - Seamlessly swap between CELO, cUSD, and cEUR
- 📊 **Portfolio Tracking** - Monitor your lending history and impact
- 🌍 **Global Impact** - Support entrepreneurs across Africa, Asia, and Latin America
- 🔒 **Transparent** - All transactions on-chain and verifiable

---

## 🎯 Problem & Solution

### The Problem
- **1.7 billion** people worldwide lack access to traditional banking
- Entrepreneurs in developing countries struggle to secure small business loans
- High barriers to entry and lack of credit history
- Limited platforms for impactful peer-to-peer lending

### Our Solution
A decentralized micro-lending platform that:
- Removes intermediaries with smart contracts
- Enables instant, low-cost cross-border transactions
- Gamifies the lending experience to drive engagement
- Provides complete transparency and accountability
- Makes social impact accessible to everyone

---

## 🚀 Live Demo

**Website:** [celoquest.vercel.app](https://celoquest.vercel.app)

**Smart Contracts:**
- Main Contract: [`0x0673AC5002903fa8C1b9C69DfdBeDB93f9e7641F`](https://celoscan.io/address/0x0673AC5002903fa8C1b9C69DfdBeDB93f9e7641F)
- Applications Contract: [`0xf10c6FFF55e6Ff15aA004A81bFd7A3CA9dC83a66`](https://celoscan.io/address/0xf10c6FFF55e6Ff15aA004A81bFd7A3CA9dC83a66)

---

## 🛠 Technology Stack

### Blockchain
- **Celo Mainnet** - Mobile-first, carbon-negative blockchain
- **Solidity** - Smart contract development
- **ethers.js** - Web3 library for blockchain interactions
- **Ubeswap** - Decentralized exchange for token swaps

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vercel** - Deployment and hosting

### Smart Contracts
- **Lending Contract** - Manages borrowers, loans, and impact tracking
- **Application Contract** - Handles entrepreneur onboarding
- **ERC-20 Integration** - cUSD token interactions

---

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- MetaMask or Valora wallet
- Celo wallet with CELO/cUSD tokens

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/AdekunleBamz/celoquest.git
cd celoquest
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```env
NEXT_PUBLIC_MAIN_CONTRACT=0x0673AC5002903fa8C1b9C69DfdBeDB93f9e7641F
NEXT_PUBLIC_APP_CONTRACT=0xf10c6FFF55e6Ff15aA004A81bFd7A3CA9dC83a66
NEXT_PUBLIC_CUSD_ADDRESS=0x765DE816845861e75A25fCA122bb6898B8B1282a
NEXT_PUBLIC_CHAIN_ID=42220
NEXT_PUBLIC_RPC_URL=https://forno.celo.org
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_ADMIN_EMAIL=your_email@example.com
```

4. **Run development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
```
http://localhost:3000
```

---

## 🎮 How to Use

### For Lenders

1. **Connect Wallet** - Click "Connect Wallet" and approve the connection
2. **Browse Entrepreneurs** - View verified borrower profiles with stories
3. **Select Amount** - Choose how much to lend (minimum $1 cUSD)
4. **Approve & Lend** - Approve token spending and confirm transaction
5. **Track Impact** - Monitor your portfolio and earn impact points

### For Entrepreneurs

1. **Apply** - Fill out the application form with business details
2. **Verification** - Admin reviews and verifies your application
3. **Get Listed** - Your profile appears on the platform
4. **Receive Funding** - Lenders contribute to your loan goal
5. **Claim Funds** - Withdraw when fully funded

### Gamification Features

- 🥉 **Bronze Badge** - Lend your first dollar
- 🥈 **Silver Badge** - Lend $100+
- 🥇 **Gold Badge** - Lend $500+
- 💎 **Platinum Badge** - Lend $1000+

---

## 📂 Project Structure

```
celoquest/
├── contracts/          # Solidity smart contracts
├── public/            # Static assets (logos, images)
├── src/
│   ├── app/           # Next.js app router pages
│   │   ├── page.tsx   # Home page
│   │   ├── admin/     # Admin dashboard
│   │   ├── frame/     # Farcaster frame
│   │   └── api/       # API routes
│   ├── components/    # React components
│   │   ├── Header.tsx
│   │   ├── BorrowerCard.tsx
│   │   ├── LendModal.tsx
│   │   ├── Portfolio.tsx
│   │   └── SwapModal.tsx
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions
│   │   ├── web3.ts    # Web3 helper functions
│   │   └── contracts.ts # Contract addresses & ABIs
│   ├── styles/        # Global styles
│   └── types/         # TypeScript type definitions
├── .env.example       # Environment variables template
├── .gitignore         # Git ignore rules
├── next.config.js     # Next.js configuration
├── tailwind.config.js # Tailwind CSS configuration
└── package.json       # Project dependencies
```

---

## 🎨 Design Assets

### Logo Files
- `public/logo-512.png` - 512x512 PNG logo
- `public/logo-1024.png` - 1024x1024 high-res logo
- `public/logo-square.png` - Rounded square logo
- `public/favicon.svg` - SVG favicon

### Brand Colors
- **Primary Yellow**: `#FCD34D` → `#F59E0B`
- **Accent Green**: `#35D07F`
- **White**: `#FFFFFF`

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write clean, commented code
- Test thoroughly before submitting PR
- Update documentation as needed

---

## 🗺 Roadmap

### ✅ Phase 1 - MVP (Completed)
- Smart contract deployment
- Web3 wallet integration
- Token swap functionality
- Gamification system
- Responsive web interface

### 🚧 Phase 2 - Growth (Q1 2026)
- [ ] Onboard 50 verified entrepreneurs
- [ ] Implement repayment tracking
- [ ] Add loan progress indicators
- [ ] Launch marketing campaign

### 🔮 Phase 3 - Scale (Q2-Q4 2026)
- [ ] Mobile app (iOS & Android)
- [ ] NFT achievement badges
- [ ] Multi-language support
- [ ] DAO governance
- [ ] Expand to 10+ countries

---

## 📊 Impact Metrics

- **Target Users**: 1.7 billion unbanked adults globally
- **Market Size**: $380 billion micro-lending market
- **Repayment Rate**: 96.5% industry average
- **Minimum Loan**: $1 (accessible to everyone)
- **Transaction Fees**: ~$0.01 on Celo

---

## 🔐 Security

- Smart contracts follow best practices
- No private keys stored on frontend
- All transactions require user approval
- Open-source and auditable code
- Regular security updates

**⚠️ Disclaimer**: This is experimental software. Use at your own risk. Never invest more than you can afford to lose.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Celo Foundation** - For building an inclusive blockchain
- **Ubeswap** - DEX integration for token swaps
- **Next.js Team** - Amazing React framework
- **Open Source Community** - For tools and inspiration

---

## 📞 Contact & Links

- **Website**: [celoquest.vercel.app](https://celoquest.vercel.app)
- **GitHub**: [@AdekunleBamz](https://github.com/AdekunleBamz)
- **Twitter**: [Add your Twitter]
- **Email**: bamzzstudio@gmail.com

---

## 💡 Why Celo?

Celo is the perfect blockchain for financial inclusion:

- ✅ **Mobile-First** - Designed for smartphone accessibility
- ✅ **Ultra-Low Fees** - ~$0.01 per transaction
- ✅ **Carbon-Negative** - Environmentally sustainable
- ✅ **Stablecoins** - Built-in cUSD and cEUR
- ✅ **Fast** - 5-second block times
- ✅ **Inclusive** - Phone number-based accounts

---

<div align="center">

**Built with ❤️ on Celo**

*Empowering entrepreneurs, one dollar at a time*

[⭐ Star us on GitHub](https://github.com/AdekunleBamz/celoquest) | [🚀 Try the Demo](https://celoquest.vercel.app)

</div>
