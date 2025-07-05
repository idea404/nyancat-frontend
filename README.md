# NYAnCAT – Neutral Yield AggregatioNal Compounding Algorithmic Treasury

<img src="design/nyancat.png" width="180" align="right" />

NYAnCAT is a playful delta-neutral yield aggregator built as a **World App Mini App**. It lets Worldcoin users seamlessly deposit **USDC**, mint **vyShares**, and earn compounding yield powered by AI-optimised, delta-neutral strategies – all without ever leaving the World App.

> "Earn yield from advanced AI delta-neutral strategies throughout crypto." – The Cat 🐱🌈

---

## ✨ Key Features

• **One-tap Wallet Auth** – Login with World App's embedded wallet auth (powered by *minikit-js* & *next-auth*).  
• **Deposit / Mint Flow** – Swap USDC for `vyShares` via a standard Pay UI and mint on-chain.  
• **Real-time Balance & APY** – Watch your balance grow in real time as strategies compound.  
• **Delta-neutral Strategies** – Simulated back-test showing 14.7 % APY and 42.69 % YTD.  
• **Retro Pixel Aesthetics** – Press Start 2P font, Nyan Cat sprite, and brand colours `#0056A5` / `#F5F5F5` / `#FF90C2`.

---

## 🏗️ Tech Stack

| Layer            | What we use                                                    |
| ---------------- | -------------------------------------------------------------- |
| Framework        | [Next.js](https://nextjs.org/) 14 (App Router, Server Actions) |
| Styling          | [Mini Apps UI Kit](https://github.com/worldcoin/mini-apps-ui-kit) + Tailwind CSS |
| Auth & Sessions  | [Worldcoin minikit-js](https://github.com/worldcoin/minikit-js) + [next-auth](https://authjs.dev/) |
| Blockchain       | [ethers.js](https://docs.ethers.org/) – interacts with mock vault contracts in `src/abi` |
| Tooling          | TypeScript, ESLint, Prettier                                    |

---

## 🚀 Quick Start (Local Dev)

1. **Clone & install**

```bash
pnpm install   # or npm install / yarn
```

2. **Environment** – copy the sample env and follow the inline docs.

```bash
cp .env.example .env.local
# then fill in WORLD_APP_ID, APP_SECRET, RPC_URL, etc.
```

3. **Run dev server**

```bash
npm run dev
```

4. **Expose to World App** (optional) – if you want to test inside World App, tunnel port 3000 and add the public URL to `allowedDevOrigins` in `next.config.ts`.

```bash
ngrok http 3000
```

5. **Generate a fresh auth secret** (only needed once per env file):

```bash
npx auth secret    # updates AUTH_SECRET in .env.local
```

6. **Open** `https://worldcoin.org/mini-app?...` in the World App dev portal and point the draft URL to your tunnel.

> The exact steps are explained in more detail in the *Getting Started* section below.

---

## 📂 Important Folders

```
src/
  app/           # Next.js route handlers & pages
  components/    # Reusable UI components (DepositButton, MintButton, …)
  auth/          # Worldcoin wallet auth helpers
  abi/           # Mock vault smart-contract ABIs
  providers/     # Context providers (Eruda, etc.)
```

---

## 🐣 Getting Started (Detailed)

1. **Copy env** – `cp .env.example .env.local` and follow the inline checklist.  
2. **Run `npm run dev`** – starts Next.js on <http://localhost:3000>.  
3. **Tunnel** – `ngrok http 3000` (or your tool of choice).  
4. **World App Dev Portal** – open your Mini App draft → *Hosting* → paste the tunnel URL.  
5. **Auth Secret** – run `npx auth secret` anytime you change domains.  
6. **Enjoy** – inside World App, search for **NYAnCAT** and start earning!

---

## 🛠️ Scripts

| Command             | Purpose                                  |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start Next.js in dev mode                |
| `npm run build`     | Production build                         |
| `npm run start`     | Start the built app                      |
| `npm run lint`      | Lint with ESLint                         |
| `npm run format`    | Format with Prettier                     |

---

## 🧑‍💻 Contributing

PRs and issues are welcome! This repo was bootstrapped from the official Worldcoin Mini App starter and adapted for ETHGlobal's **AI x Crypto** hackathon.

---

## 📝 License

MIT – see [LICENSE](LICENSE).

> *Not financial advice. The vault contracts are mocks for hackathon demo purposes only.*
