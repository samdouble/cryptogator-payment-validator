import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { DateTime } from 'luxon';
import { connect, disconnect } from './db';
import createTransaction from './transactions/controllers/create';
import etherscanEndpoints from './utils/ethereum/endpoints';
import polygonscanEndpoints from './utils/polygon/endpoints';
import solanaContractAddresses from './utils/solana/contractAddresses';
import solanafmEndpoints from './utils/solana/endpoints';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  await connect(process.env.MONGODB_URL!);

  // Ethereum
  const [etherscanTransactionsUsdc, etherscanTransactionsUsdt] = await Promise.all([
    etherscanEndpoints.fetchErc20TransactionsForAddress('usdc', process.env.ADDRESS_USDC),
    etherscanEndpoints.fetchErc20TransactionsForAddress('usdt', process.env.ADDRESS_USDT),
  ]);
  for (const etherscanTransaction of [...etherscanTransactionsUsdc, ...etherscanTransactionsUsdt]) {
    const tokenDecimal = parseInt(etherscanTransaction.tokenDecimal, 10);
    console.log('ETH', etherscanTransaction);
    await createTransaction({
      blockchain: 'Ethereum',
      blockHash: etherscanTransaction.blockHash,
      blockNumber: parseInt(etherscanTransaction.blockNumber, 10),
      contractAddress: etherscanTransaction.contractAddress,
      cumulativeGasUsed: parseInt(etherscanTransaction.cumulativeGasUsed, 10) * Math.pow(10, -tokenDecimal),
      date: DateTime.fromMillis(1000 * parseInt(etherscanTransaction.timeStamp, 10)).toUTC().toJSDate(),
      gas: parseInt(etherscanTransaction.gas, 10) * Math.pow(10, -tokenDecimal),
      gasPrice: parseInt(etherscanTransaction.gasPrice, 10) * Math.pow(10, -tokenDecimal),
      gasUsed: parseInt(etherscanTransaction.gasUsed, 10) * Math.pow(10, -tokenDecimal),
      hash: etherscanTransaction.hash,
      nbConfirmations: parseInt(etherscanTransaction.confirmations, 10),
      nonce: parseInt(etherscanTransaction.nonce, 10),
      receiver: etherscanTransaction.to,
      sender: etherscanTransaction.from,
      timestamp: 1000 * parseInt(etherscanTransaction.timeStamp, 10),
      tokenName: etherscanTransaction.tokenName,
      tokenSymbol: etherscanTransaction.tokenSymbol,
      transactionIndex: parseInt(etherscanTransaction.transactionIndex, 10),
      value: parseInt(etherscanTransaction.value, 10) * Math.pow(10, -tokenDecimal),
    });
  }

  // Polygon
  const [polygonscanTransactionsUsdc, polygonscanTransactionsUsdt] = await Promise.all([
    polygonscanEndpoints.fetchErc20TransactionsForAddress('usdc', process.env.ADDRESS_USDC),
    polygonscanEndpoints.fetchErc20TransactionsForAddress('usdt', process.env.ADDRESS_USDT),
  ]);
  for (const polygonscanTransaction of [...polygonscanTransactionsUsdc, ...polygonscanTransactionsUsdt]) {
    const tokenDecimal = parseInt(polygonscanTransaction.tokenDecimal, 10);
    await createTransaction({
      blockchain: 'Polygon',
      blockHash: polygonscanTransaction.blockHash,
      blockNumber: parseInt(polygonscanTransaction.blockNumber, 10),
      contractAddress: polygonscanTransaction.contractAddress,
      cumulativeGasUsed: parseInt(polygonscanTransaction.cumulativeGasUsed, 10) * Math.pow(10, -tokenDecimal),
      date: DateTime.fromMillis(1000 * parseInt(polygonscanTransaction.timeStamp, 10)).toUTC().toJSDate(),
      gas: parseInt(polygonscanTransaction.gas, 10) * Math.pow(10, -tokenDecimal),
      gasPrice: parseInt(polygonscanTransaction.gasPrice, 10) * Math.pow(10, -tokenDecimal),
      gasUsed: parseInt(polygonscanTransaction.gasUsed, 10) * Math.pow(10, -tokenDecimal),
      hash: polygonscanTransaction.hash,
      nbConfirmations: parseInt(polygonscanTransaction.confirmations, 10),
      nonce: parseInt(polygonscanTransaction.nonce, 10),
      receiver: polygonscanTransaction.to,
      sender: polygonscanTransaction.from,
      timestamp: 1000 * parseInt(polygonscanTransaction.timeStamp, 10),
      tokenName: polygonscanTransaction.tokenName,
      tokenSymbol: polygonscanTransaction.tokenSymbol,
      transactionIndex: parseInt(polygonscanTransaction.transactionIndex, 10),
      value: parseInt(polygonscanTransaction.value, 10) * Math.pow(10, -tokenDecimal),
    });
  }

  // Solana
  const [solanafmTransactions] = await Promise.all([
    solanafmEndpoints.fetchTransactionsForAddress('usdt', '7gEQ6syDZmyPE4JdfJm4qatawnDqvqdh6i8jJjCXio6h'),
  ]);
  for (const solanafmTransaction of solanafmTransactions) {
    console.log('SOL', solanafmTransaction);

    const payTxFeesOperation = solanafmTransaction.data
      .find(d => (
        d.action === 'pay_tx_fees'
        && d.status === 'Successful'
      ));
    
    const transferOperation = solanafmTransaction.data
      .find(d => (
        d.action === 'transfer'
        && d.status === 'Successful'
      ));
    const token = Object.keys(solanaContractAddresses)
      .find(token => {
        const contractAddress = solanaContractAddresses[token];
        return contractAddress === transferOperation.token;
      });

    await createTransaction({
      blockchain: 'Solana',
      contractAddress: solanafmTransaction.token,
      date: DateTime.fromMillis(1000 * transferOperation.timestamp).toUTC().toJSDate(),
      gas: payTxFeesOperation.amount / 1000000000,
      hash: solanafmTransaction.transactionHash,
      receiver: transferOperation.destination,
      receiverAssociation: transferOperation.destinationAssociation,
      sender: transferOperation.source,
      senderAssociation: transferOperation.sourceAssociation,
      timestamp: 1000 * transferOperation.timestamp,
      tokenName: token,
      tokenSymbol: token,
      value: transferOperation.amount / 1000000,
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
