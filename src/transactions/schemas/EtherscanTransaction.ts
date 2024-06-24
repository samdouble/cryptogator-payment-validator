import { Schema } from 'mongoose';

export interface IEtherscanTransaction {
  blockHash: string;
  blockNumber: number;
  cumulativeGasUsed: number;
  gasPrice: number;
  gasUsed: number;
  nbConfirmations: number;
  nonce: number;
  transactionIndex: number;
}

export const EtherscanTransactionSchema: Schema = new Schema<IEtherscanTransaction>(
  {
    blockHash: { type: String, required: true },
    blockNumber: { type: Number, required: true },
    cumulativeGasUsed: { type: Number, required: true },
    gasPrice: { type: Number, required: true },
    gasUsed: { type: Number, required: true },
    nbConfirmations: { type: Number, required: true },
    nonce: { type: Number, required: true },
    transactionIndex: { type: Number, required: true },
  },
);

export default EtherscanTransactionSchema;
