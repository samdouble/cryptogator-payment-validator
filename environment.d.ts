declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ADDRESS_USDC: string;
      ADDRESS_USDT: string;
      ETHERSCAN_API_SERVER: string;
      ETHERSCAN_API_TOKEN: string;
      NODE_ENV: 'development' | 'production';
      POLYGONSCAN_API_SERVER: string;
      POLYGONSCAN_API_TOKEN: string;
      SOLANAFM_API_SERVER: string;
      SOLANAFM_API_TOKEN: string;
    }
  }
}

export {};
