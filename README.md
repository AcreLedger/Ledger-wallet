# AcreLedger 🌾

Decentralized agricultural supply chain finance and micro-credit protocol built natively on the Stellar Network using Soroban smart contracts.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Smart Contracts](#smart-contracts)
- [Frontend](#frontend)
- [Backend](#backend)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

AcreLedger bridges the financial gap facing unbanked smallholder farmers and local agri-merchants by turning tangible, everyday trade data into a verifiable financial identity. Traditional agricultural supply chains suffer from predatory middlemen, weeks of delayed payouts, and a lack of credit history.

### The Problem

- **Delayed Payouts**: Farmers wait weeks for payment after delivering crops
- **No Credit History**: Unbanked farmers cannot access loans for seeds, fertilizers, or equipment
- **Predatory Middlemen**: Multiple intermediaries reduce farmers' earnings
- **Lack of Trust**: No transparent way to verify crop quality and delivery

### The Solution

AcreLedger solves these through two core features:

1. **Instant Escrow Payouts**: Buyers lock stablecoins (USDC) into smart contracts, which instantly release funds directly to farmers the moment quality-vetted crops are delivered at a warehouse.

2. **DeFi Credit Scoring & Micro-Loans**: Every successful delivery logs a permanent, on-chain trade history. The system aggregates this data to generate a decentralized credit score, unlocking low-interest micro-loans for agricultural inputs.

## ✨ Features

### For Farmers
- **Instant Payments**: Receive payments immediately upon quality verification
- **Credit Building**: Build on-chain credit history through successful transactions
- **Micro-Loans**: Access low-interest loans based on DeFi credit scores
- **Transparency**: Track all transactions and payment status in real-time

### For Buyers
- **Quality Assurance**: Warehouse-verified crop quality before payment release
- **Transparent Supply Chain**: Track crop delivery and payment status
- **Reduced Risk**: Escrow system ensures funds are only released upon verification

### For Warehouses/Validators
- **Revenue Stream**: Earn fees for quality validation services
- **Role in DeFi**: Participate in credit scoring ecosystem
- **Trust Layer**: Provide trusted third-party verification

## 🏗️ Architecture

```
├── contracts/          # Soroban smart contracts (Rust)
│   ├── src/
│   │   └── lib.rs     # Main escrow contract implementation
│   └── Cargo.toml     # Rust dependencies
├── frontend/           # Web app dashboard (React, Vite, TypeScript)
│   ├── components/    # React components
│   ├── context/       # React context (Stellar wallet integration)
│   ├── hooks/         # Custom React hooks
│   ├── pages/         # Page components
│   └── src/           # Source files
├── backend/            # Express.js API (TypeScript, Node.js)
│   ├── src/
│   │   ├── routes/    # API route definitions
│   │   ├── services/  # Business logic & Stellar integration
│   │   ├── controllers/ # Request handlers
│   │   └── middleware/ # Custom middleware
│   └── package.json   # Node.js dependencies
└── .github/           # CI/CD workflows and templates
```

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

### Required Tools

- **Node.js**: v18.x or higher
  ```bash
  node --version
  ```
- **npm**: v9.x or higher (comes with Node.js)
  ```bash
  npm --version
  ```
- **Rust**: v1.70.0 or higher
  ```bash
  rustc --version
  ```
- **Soroban CLI**: For Stellar smart contract development
  ```bash
  cargo install soroban-cli
  ```

### Wallet Setup

- **Freighter Wallet**: Browser extension for Stellar wallet management
  - Install from [freighter.app](https://www.freighter.app/)
  - Create or import a wallet on the Stellar testnet

### Development Tools

- **Git**: For version control
  ```bash
  git --version
  ```
- **VS Code** (recommended): With extensions for Rust, TypeScript, and Tailwind CSS

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/acreledger.git
cd acreledger
```

### 2. Install Smart Contract Dependencies

```bash
cd contracts
cargo build
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Install Backend Dependencies

```bash
cd ../backend
npm install
```

### 5. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Stellar Network Configuration
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
STELLAR_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org

# Contract Configuration
ACRELEDGER_CONTRACT_ID=your_deployed_contract_id_here

# API Configuration
API_KEY=your_api_key_here
```

## 💻 Development

### Starting the Development Environment

#### 1. Start the Backend Server

```bash
cd backend
npm run dev
```

The backend API will run on `http://localhost:5000`

#### 2. Start the Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

#### 3. Deploy and Test Smart Contracts (Optional)

```bash
cd contracts
# Run tests
cargo test

# Build for deployment
cargo build --target wasm32-unknown-unknown --release

# Deploy to testnet (requires Soroban CLI)
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/acreledger.wasm
```

## 📜 Smart Contracts

The smart contracts are written in Rust using the Soroban SDK.

### Key Contract Functions

#### `initialize(buyer, farmer, validator, amount, crop_id)`
- Creates a new escrow transaction
- Locks buyer's funds in smart contract
- Returns unique escrow ID

#### `release(escrow_id, validator, quality_rating)`
- Releases funds from escrow
- Requires validator signature
- Distributes funds: 85% to farmer, 15% to cooperative
- Records trade for credit scoring

#### `get_credit_score(farmer)`
- Returns farmer's credit score and trade history
- Aggregates on-chain transaction data

### Running Tests

```bash
cd contracts
cargo test
```

### Building for Production

```bash
cargo build --target wasm32-unknown-unknown --release
```

The compiled WASM file will be at: `target/wasm32-unknown-unknown/release/acreledger.wasm`

## 🎨 Frontend

The frontend is built with React, Vite, TypeScript, and Tailwind CSS.

### Key Components

- **StellarContext**: Manages wallet connection and transaction signing
- **Dashboard**: Main interface showing escrows, credit scores, and trade history
- **LandingPage**: Initial page with wallet connection

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Styling

The project uses Tailwind CSS with custom color themes:

- `stellar-blue`: Primary background color
- `stellar-purple`: Secondary background color  
- `accent-green`: Success/action color
- `accent-orange`: Highlight color

## 🔌 Backend

The backend is built with Express.js, TypeScript, and integrates with the Stellar SDK.

### API Endpoints

#### Escrow Endpoints

- `GET /api/v1/escrow` - Get all escrows for an address
- `POST /api/v1/escrow` - Create a new escrow
- `POST /api/v1/escrow/:id/release` - Release escrow funds

#### Farmer Endpoints

- `GET /api/v1/farmer/credit-score` - Get farmer credit score
- `GET /api/v1/farmer/trade-history` - Get farmer trade history
- `GET /api/v1/farmer/profile` - Get farmer profile
- `GET /api/v1/farmer/eligibility` - Check loan eligibility

### Available Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🤝 Contributing

We welcome contributions from the community! Please follow these guidelines:

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Pull Request Guidelines

- Use the provided PR template
- Ensure all tests pass locally
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Include screenshots for UI changes

### Code of Conduct

Be respectful, inclusive, and constructive. We're building for farmers and agricultural communities worldwide.

## 🔐 Security

This project handles financial transactions and sensitive user data:

- Never commit private keys or secrets
- Use environment variables for sensitive configuration
- Follow secure coding practices
- Report security vulnerabilities privately

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Stellar Development Foundation** - For the amazing Soroban platform
- **Freighter** - For the user-friendly wallet extension
- **Agricultural Community** - Inspiration for solving real-world problems

## 📞 Support

- **Documentation**: [Project Wiki](https://github.com/yourusername/acreledger/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/acreledger/issues)
- **Discord**: [Join our community](https://discord.gg/yourserver)
- **Email**: support@acreledger.io

## 🗺️ Roadmap

- [ ] Mainnet deployment
- [ ] Mobile app development
- [ ] Advanced credit scoring algorithms
- [ ] Integration with agricultural IoT devices
- [ ] Multi-currency support
- [ ] Governance token implementation

---

Built with ❤️ for farmers and agricultural communities worldwide.
