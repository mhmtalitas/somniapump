// Web3 konfigürasyonu - wagmi ve viem setup
import { createConfig, http } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Basit wagmi konfigürasyonu
export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    injected(),
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