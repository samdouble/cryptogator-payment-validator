declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ADDRESS_USDC: string;
      ADDRESS_USDT: string;
      ETHERSCAN_API_SERVER: string;
      ETHERSCAN_API_TOKEN: string;
      NODE_ENV: 'development' | 'production';
    }
  }
}

export {};