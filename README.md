# SolSight

A minimalist, read-only Solana wallet analyzer that translates complex blockchain transaction history into a clean, human-readable timeline feed.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)
![Solana](https://img.shields.io/badge/Solana-Web3.js-9945FF)

## Features

- **Address Validation**: Client-side validation of Solana base58 addresses
- **Balance Display**: Real-time SOL balance fetching with glassmorphism UI
- **Transaction Parsing**: Intelligent detection and categorization of transactions
  - **Swaps**: Detects DEX interactions (Jupiter, Raydium, Orca)
  - **Transfers**: SOL and SPL token transfers with direction detection
  - **Mints**: NFT and token minting operations
- **Activity Timeline**: Chronological feed of wallet activity with visual indicators
- **Error Handling**: Robust RPC error classification with automatic retries
- **Responsive Design**: Mobile-first layout with adaptive two-column desktop view

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 + shadcn/ui components
- **Icons**: Lucide React
- **Blockchain**: @solana/web3.js

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/solsight.git
cd solsight
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

SolSight uses sensible defaults and works out of the box with Solana's public mainnet-beta RPC endpoint.

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SOLANA_RPC_URL` | Custom Solana RPC endpoint | `https://api.mainnet-beta.solana.com` |

### Using a Custom RPC Endpoint

For production use or higher rate limits, configure a custom RPC provider:

1. Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://your-rpc-provider.com
```

2. Update `lib/solana.ts` to use the environment variable:

```typescript
const SOLANA_RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl('mainnet-beta');
```

**Recommended RPC Providers:**
- [Helius](https://helius.xyz)
- [QuickNode](https://quicknode.com)
- [Alchemy](https://alchemy.com)
- [Triton](https://triton.one)

## Project Structure

```
solsight/
├── app/
│   ├── layout.tsx          # Root layout with metadata/SEO
│   ├── page.tsx            # Landing page with search
│   ├── globals.css         # Global styles and animations
│   └── wallet/
│       └── [address]/
│           └── page.tsx    # Dashboard page (dynamic route)
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   │   ├── button.tsx
│   │   └── input.tsx
│   ├── ActivityCard.tsx    # Transaction card with icons
│   ├── ActivityTimeline.tsx
│   ├── ActivityTimelineLoader.tsx
│   ├── ActivityTimelineSkeleton.tsx
│   ├── InvalidAddressError.tsx
│   ├── Navbar.tsx          # Sticky header with search
│   ├── NetworkError.tsx
│   ├── WalletProfileCard.tsx
│   ├── WalletProfileCardLoader.tsx
│   └── WalletProfileCardSkeleton.tsx
├── lib/
│   ├── solana.ts           # Solana connection and validation
│   ├── errors.ts           # RPC error classification
│   ├── retry.ts            # Retry logic with backoff
│   ├── utils.ts            # Utility functions (cn)
│   └── services/
│       ├── wallet.ts       # Balance and signature fetching
│       └── parser.ts       # Transaction parsing logic
├── types/
│   └── index.ts            # TypeScript interfaces
└── public/                 # Static assets
```

## Usage

### Looking Up a Wallet

1. Enter a valid Solana address on the landing page
2. Click **Search** or press Enter
3. View the wallet's SOL balance and transaction history

### Understanding the Dashboard

**Profile Card (Left Column)**
- Truncated wallet address with copy-to-clipboard functionality
- Current SOL balance

**Activity Timeline (Right Column)**
- Chronological list of recent transactions
- Color-coded icons:
  - 🟢 Green: Incoming (received tokens/SOL)
  - 🔴 Red: Outgoing (sent tokens/SOL)
  - ⚫ Gray: Neutral (swaps, failed transactions)
- Click the external link icon to view transaction details on Solscan

### Transaction Types

| Type | Description | Example Summary |
|------|-------------|-----------------|
| `TRANSFER` | SOL or token transfers | "Received 2.5 SOL" |
| `SWAP` | DEX token exchanges | "Swapped 100 USDC for 50K BONK" |
| `MINT` | NFT or token minting | "Minted NFT" |
| `UNKNOWN` | Unrecognized transactions | "Unknown transaction" |

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Type Checking

The project uses strict TypeScript. Core data models are defined in `types/index.ts`:

```typescript
type TransactionType = 'SWAP' | 'TRANSFER' | 'MINT' | 'UNKNOWN';
type TokenDirection = 'IN' | 'OUT' | 'NEUTRAL';

interface ParsedActivity {
  signature: string;
  timestamp: Date;
  type: TransactionType;
  direction: TokenDirection;
  summary: string;
  fee: number;
  successful: boolean;
}

interface WalletProfile {
  address: string;
  solBalance: number;
  recentActivities: ParsedActivity[];
}
```

### Error Handling

RPC errors are automatically classified and handled:

- **Rate Limited**: Automatic retry with exponential backoff
- **Network Errors**: User-friendly messages with retry option
- **Timeouts**: Configurable retry attempts
- **Invalid Addresses**: Client-side validation before RPC calls

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/solsight)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables if using custom RPC
4. Deploy

### Other Platforms

Build the production bundle:

```bash
npm run build
```

The output in `.next/` can be deployed to any platform supporting Next.js:
- AWS Amplify
- Netlify
- Railway
- Docker

## Limitations

- **Read-only**: No wallet connection or transaction signing
- **Rate Limits**: Public RPC endpoints have rate limits; use a dedicated provider for production
- **Token Detection**: Limited to known token mints; unknown tokens display truncated addresses
- **Transaction History**: Fetches the 20 most recent transactions by default

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT

---

Built with ❤️ for the Solana ecosystem
