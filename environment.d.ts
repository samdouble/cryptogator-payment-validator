declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ETHERSCAN_API_SERVER: string;
      ETHERSCAN_API_TOKEN: string;
      NODE_ENV: 'development' | 'production';
    }
  }
}

export {};