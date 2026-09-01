# VTX RWA Capital Workspace

VTX is a React/Vite proof-of-concept for discovering, reviewing, and managing tokenized real-world asset opportunities. Version 3.0 introduces an institutional capital-workspace interface, clearer execution safeguards, and new investor operations modules.

## Project Structure

```text
token-dapp/
├── contracts/                     # Solidity token and presale contracts
│   ├── Migrations.sol
│   ├── VTXPresale.sol
│   ├── VTXToken.sol
│   └── deployed_adr                # Reference deployment addresses
├── public/
│   └── favicon.svg
├── scripts/
│   ├── generate_task_pdf.py        # Engineering-document generator
│   └── verify-project.mjs          # Repository integrity checks
├── src/
│   ├── app/
│   │   └── App.jsx                 # Router and application shell
│   ├── contracts/
│   │   └── abis/                   # Frontend contract interfaces
│   ├── features/                   # Domain-owned UI and behavior
│   │   ├── home/                   # Homepage feature sections
│   │   ├── marketplace/            # Asset discovery and comparison
│   │   ├── mint/                   # NFT mint workflow
│   │   ├── presale/                # Presale phase workflow
│   │   ├── staking/                # Pools, calculator and guidance
│   │   ├── swap/                   # Quote and token-swap workflow
│   │   ├── transactions/           # ERC-20 activity module
│   │   └── wallet/                 # Connection and account states
│   ├── pages/                      # Route-level composition only
│   │   ├── about/
│   │   ├── compliance/
│   │   ├── contact/
│   │   ├── home/
│   │   ├── marketplace/
│   │   ├── mint/
│   │   ├── nfts/
│   │   ├── not-found/
│   │   ├── portfolio/
│   │   ├── presale/
│   │   ├── staking/
│   │   ├── swap/
│   │   └── transactions/
│   ├── shared/                     # Cross-feature infrastructure
│   │   ├── assets/                 # Images and asset catalogue
│   │   ├── components/             # Common UI and application layout
│   │   ├── config/                 # Chain and contract configuration
│   │   ├── lib/                    # Helpers, hooks and Web3 adapters
│   │   └── providers/              # Application-level providers
│   ├── styles/
│   │   └── global.css              # Visual system and responsive rules
│   └── main.jsx                    # Frontend entry point
├── Truffle/
│   ├── migrations/                 # Contract deployment migrations
│   ├── scripts/                    # Deployment utility scripts
│   └── truffle-config.js
├── .env.default                    # Safe environment-variable template
├── index.html                      # Vite HTML entry
├── package.json                    # Dependencies and project commands
├── vercel.json                     # Vercel deployment configuration
└── vite.config.js                  # Vite build and bundling configuration
```

Generated folders such as `node_modules/` and `dist/` are intentionally excluded from the repository and release archive.

## Product Modules

- Opportunity marketplace with search, category filters, sorting, local watchlist, three-asset comparison, and detailed opportunity drawers
- Portfolio workspace with modeled holdings, allocation, projected distributions, account activity, privacy controls, and CSV export
- Compliance center with jurisdiction context, local readiness checklist, transaction gates, and illustrative document-anchor records
- Contract-aware presale console for deposit, claim, and refund states
- Staking term and reward calculator with disabled transaction behavior until a staking deployment is configured
- 1inch-based swap workflow for supported networks
- Wallet transaction and NFT holding views
- Contract registry with explicit configured, missing, and disabled states
- Responsive navigation, route-level lazy loading, error recovery, reduced-motion support, and accessible focus behavior

All opportunity values, portfolio positions, returns, document hashes, and distribution schedules in the interface are illustrative unless the UI explicitly reads a configured contract.

## Frontend Routes

| Route | Purpose |
| --- | --- |
| `/` | Platform overview |
| `/gallery` | Opportunity discovery, watchlist, compare, and detail |
| `/presale` | Contract-aware sale console |
| `/portfolio` | Holdings and distribution preview |
| `/compliance` | Eligibility and document readiness |
| `/stake` | Reward calculator and staking configuration state |
| `/swap` | Token quote and swap interface |
| `/transactions` | Connected-wallet activity |
| `/nfts` | Connected-wallet NFT holdings |
| `/about` | Product model and operating principles |
| `/contact` | Local inquiry-summary builder and public address reference |

## Web3 Safety Model

Transaction controls should remain unavailable unless all relevant checks pass:

1. A wallet is connected.
2. The connected network is supported.
3. The required contract address is configured for that chain.
4. The configured address is valid.
5. The contract can be read successfully.
6. The current on-chain state permits the requested action.

The frontend must never infer a successful deployment from preview data.

## Environment Configuration

Copy `.env.default` to `.env` and add only the addresses and API keys required for the target environment.

```env
VITE_TOKEN_ADDRESS_11155111=0xYourTokenAddress
VITE_PRESALE_ADDRESS_11155111=0xYourPresaleAddress
VITE_PUBLIC_VTX_ADDRESS=0xBb569C738f56348B21a84D520f679fe41Fd01cc5
VITE_EXPLORER_API_KEY=
VITE_ONEINCH_API_KEY=
```

Never commit private keys, seed phrases, deployment credentials, or privileged API secrets.

## Local Development

Requires Node.js `20.19.0` or newer (`22.12.0+` is also supported). The project uses Vite `8.2.2`.

```bash
npm install
npm run dev:local
```

Open `http://127.0.0.1:5173`.

## Production Build

```bash
npm run build
npm run serve
```

The Vite build uses route-level lazy loading and separates React, UI, Web3, and general vendor dependencies into stable chunks.

## Browser-Persistent Preview Data

The following proof-of-concept preferences are stored only in local browser storage:

- `VTX_watchlist`
- `VTX_compliance_checklist`
- wallet connection preference

No identity document, legal record, or inquiry form content is uploaded by the current frontend.

## Solidity Scope

The repository includes:

- `contracts/VTXToken.sol`
- `contracts/VTXPresale.sol`
- Truffle deployment scripts

Before production use, add contract tests, deployment verification, access-control review, invariant/fuzz coverage, monitoring, incident response, and an independent security assessment.

## Production Boundary

This repository is a proof of concept. It is not an offering portal, broker-dealer system, transfer-agent system, custody product, legal opinion, audit report, or investment recommendation.
