// Web3 konfigürasyonu - wagmi ve viem setup
import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

// Somnia network benzeri test ağı (Sepolia kullanıyoruz demo için)
export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
    metaMask(),
    // WalletConnect için projectId gerekir - gerçek projede eklenecek
    // walletConnect({ projectId: 'your-project-id' }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

// Type declarations for wagmi
declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}