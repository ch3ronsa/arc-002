'use client';

import '@rainbow-me/rainbowkit/styles.css';
import {
    getDefaultConfig,
    RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    sepolia,
} from 'wagmi/chains';
import {
    QueryClientProvider,
    QueryClient,
} from "@tanstack/react-query";
import { Chain } from '@rainbow-me/rainbowkit';

const arcNetwork = {
    id: 5042002,
    name: 'Arc Testnet',
    network: 'arc-testnet',
    nativeCurrency: { decimals: 18, name: 'USDC', symbol: 'USDC' },
    rpcUrls: {
        default: { http: ['https://rpc.testnet.arc.network'] },
        public: { http: ['https://rpc.testnet.arc.network'] }
    },
    blockExplorers: {
        default: { name: 'ArcScan', url: 'https://testnet.arcscan.app' },
    },
    testnet: true,
} as const satisfies Chain;

const config = getDefaultConfig({
    appName: 'Notion Kanban Web3',
    projectId: 'YOUR_PROJECT_ID',
    chains: [arcNetwork, sepolia, mainnet, polygon, optimism, arbitrum, base],
    ssr: true,
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
