import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { fetchErc20TransactionForAddress, fetchLogsForAddress } from './endpoints';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const [transactionsUsdc, transactionsUsdt, logsUsdc, logsUsdt] = await Promise.all([
    fetchErc20TransactionForAddress('usdc', process.env.ADDRESS_USDC),
    fetchErc20TransactionForAddress('usdt', process.env.ADDRESS_USDT),
    fetchLogsForAddress(process.env.ADDRESS_USDC),
    fetchLogsForAddress(process.env.ADDRESS_USDT),
  ]);

  console.log('Transactions USDC', transactionsUsdc);
  console.log('Transactions USDT', transactionsUsdt);
  console.log('Logs USDC', logsUsdc);
  console.log('Logs USDT', logsUsdt);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'hello world',
    }),
  };
};
