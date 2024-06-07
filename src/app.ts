import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { DateTime } from 'luxon';
import { connect, disconnect } from './db';
import createTransaction from './transactions/controllers/create';
import etherscanEndpoints from './utils/ethereum/endpoints';
import polygonscanEndpoints from './utils/polygon/endpoints';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  await connect(process.env.MONGODB_URL!);

  // Ethereum
  const [etherscanTransactionsUsdc, etherscanTransactionsUsdt] = await Promise.all([
    etherscanEndpoints.fetchErc20TransactionForAddress('usdc', process.env.ADDRESS_USDC),
    etherscanEndpoints.fetchErc20TransactionForAddress('usdt', process.env.ADDRESS_USDT),
  ]);
  for (const etherscanTransaction of [...etherscanTransactionsUsdc, ...etherscanTransactionsUsdt]) {
    const tokenDecimal = parseInt(etherscanTransaction.tokenDecimal, 10);
    await createTransaction({
      blockchain: 'Ethereum',
      blockNumber: parseInt(etherscanTransaction.blockNumber, 10),
      timestamp: 1000 * parseInt(etherscanTransaction.timeStamp, 10),
      date: DateTime.fromMillis(1000 * parseInt(etherscanTransaction.timeStamp, 10)).toUTC().toJSDate(),
      hash: etherscanTransaction.hash,
      nonce: parseInt(etherscanTransaction.nonce, 10),
      blockHash: etherscanTransaction.blockHash,
      sender: etherscanTransaction.from,
      receiver: etherscanTransaction.to,
      contractAddress: etherscanTransaction.contractAddress,
      tokenName: etherscanTransaction.tokenName,
      tokenSymbol: etherscanTransaction.tokenSymbol,
      transactionIndex: parseInt(etherscanTransaction.transactionIndex, 10),
      value: parseInt(etherscanTransaction.value, 10) * Math.pow(10, -tokenDecimal),
      gas: parseInt(etherscanTransaction.gas, 10) * Math.pow(10, -tokenDecimal),
      gasPrice: parseInt(etherscanTransaction.gasPrice, 10) * Math.pow(10, -tokenDecimal),
      gasUsed: parseInt(etherscanTransaction.gasUsed, 10) * Math.pow(10, -tokenDecimal),
      cumulativeGasUsed: parseInt(etherscanTransaction.cumulativeGasUsed, 10) * Math.pow(10, -tokenDecimal),
      nbConfirmations: parseInt(etherscanTransaction.confirmations, 10),
    });
  }

  // Polygon
  const polygonscanTransactionsUsdt = await polygonscanEndpoints.fetchErc20TransactionForAddress('usdt', process.env.ADDRESS_USDT);
  for (const polygonscanTransaction of polygonscanTransactionsUsdt) {
    const tokenDecimal = parseInt(polygonscanTransaction.tokenDecimal, 10);
    await createTransaction({
      blockchain: 'Polygon',
      blockNumber: parseInt(polygonscanTransaction.blockNumber, 10),
      timestamp: 1000 * parseInt(polygonscanTransaction.timeStamp, 10),
      date: DateTime.fromMillis(1000 * parseInt(polygonscanTransaction.timeStamp, 10)).toUTC().toJSDate(),
      hash: polygonscanTransaction.hash,
      nonce: parseInt(polygonscanTransaction.nonce, 10),
      blockHash: polygonscanTransaction.blockHash,
      sender: polygonscanTransaction.from,
      receiver: polygonscanTransaction.to,
      contractAddress: polygonscanTransaction.contractAddress,
      tokenName: polygonscanTransaction.tokenName,
      tokenSymbol: polygonscanTransaction.tokenSymbol,
      transactionIndex: parseInt(polygonscanTransaction.transactionIndex, 10),
      value: parseInt(polygonscanTransaction.value, 10) * Math.pow(10, -tokenDecimal),
      gas: parseInt(polygonscanTransaction.gas, 10) * Math.pow(10, -tokenDecimal),
      gasPrice: parseInt(polygonscanTransaction.gasPrice, 10) * Math.pow(10, -tokenDecimal),
      gasUsed: parseInt(polygonscanTransaction.gasUsed, 10) * Math.pow(10, -tokenDecimal),
      cumulativeGasUsed: parseInt(polygonscanTransaction.cumulativeGasUsed, 10) * Math.pow(10, -tokenDecimal),
      nbConfirmations: parseInt(polygonscanTransaction.confirmations, 10),
    });
  }

  await disconnect();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'hello world',
    }),
  };
};
