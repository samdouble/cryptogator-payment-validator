import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import etherscanEndpoints from './ethereum/endpoints';
import polygonscanEndpoints from './polygon/endpoints';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const [etherscanTransactionsUsdc, etherscanTransactionsUsdt, etherscanLogsUsdc, etherscanLogsUsdt] = await Promise.all([
    etherscanEndpoints.fetchErc20TransactionForAddress('usdc', process.env.ADDRESS_USDC),
    etherscanEndpoints.fetchErc20TransactionForAddress('usdt', process.env.ADDRESS_USDT),
    etherscanEndpoints.fetchLogsForAddress(process.env.ADDRESS_USDC),
    etherscanEndpoints.fetchLogsForAddress(process.env.ADDRESS_USDT),
  ]);

  console.log('Etherscan Transactions USDC', etherscanTransactionsUsdc);
  console.log('Etherscan Transactions USDT', etherscanTransactionsUsdt);
  console.log('Etherscan Logs USDC', etherscanLogsUsdc);
  console.log('Etherscan Logs USDT', etherscanLogsUsdt);

  const [polygonscanTransactionsUsdt, polygonscanLogsUsdt] = await Promise.all([
    polygonscanEndpoints.fetchErc20TransactionForAddress('usdt', process.env.ADDRESS_USDT),
    polygonscanEndpoints.fetchLogsForAddress(process.env.ADDRESS_USDT),
  ]);

  console.log('Polygonscan Transactions USDT', polygonscanTransactionsUsdt);
  console.log('Polygonscan Logs USDT', polygonscanLogsUsdt);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'hello world',
    }),
  };
};
