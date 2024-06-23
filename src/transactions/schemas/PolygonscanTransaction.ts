import { Schema } from 'mongoose';

export interface IPolygonscanTransaction {
  blockHash: string;
  blockNumber: number;
  cumulativeGasUsed: number;
  gas: number;
  gasPrice: number;
  gasUsed: number;
  hash: string;
  nbConfirmations: number;
  nonce: number;
  transactionIndex: number;
}

export const PolygonscanTransactionSchema: Schema = new Schema<IPolygonscanTransaction>(
  {
    blockHash: { type: String, required: true },
    blockNumber: { type: Number, required: true },
    cumulativeGasUsed: { type: Number, required: true },
    gas: { type: Number, required: true },
    gasPrice: { type: Number, required: true },
    gasUsed: { type: Number, required: true },
    hash: { type: String, required: true },
    nbConfirmations: { type: Number, required: true },
    nonce: { type: Number, required: true },
    transactionIndex: { type: Number, required: true },
  },
);

export default PolygonscanTransactionSchema;
