import { Schema, model } from 'mongoose';
import omit from 'lodash.omit';
import { v4 as uuidv4 } from 'uuid';

const COLLECTION_NAME = 'transactions';

export interface ITransaction {
  id: string;
  blockchain: string;
  blockHash: string;
  blockNumber: number;
  contractAddress: string;
  createdAt: Date;
  cumulativeGasUsed: number;
  date: Date;
  gas: number;
  gasPrice: number;
  gasUsed: number;
  hash: string;
  modifiedAt: Date;
  nbConfirmations: number;
  nonce: number;
  receiver: string;
  sender: string;
  timestamp: number;
  tokenName: string;
  tokenSymbol: string;
  transactionIndex: number;
  value: number;
  getPublicFields: () => Partial<ITransaction>;
}

const TransactionSchema: Schema = new Schema<ITransaction>(
  {
    id: { type: String, default: uuidv4 },
    blockchain: { type: String, required: true },
    blockHash: { type: String, required: true },
    blockNumber: { type: Number, required: true },
    contractAddress: { type: String, required: true },
    createdAt: { type: Date, required: true },
    cumulativeGasUsed: { type: Number, required: true },
    date: { type: Date, required: true },
    gas: { type: Number, required: true },
    gasPrice: { type: Number, required: true },
    gasUsed: { type: Number, required: true },
    hash: { type: String, required: true },
    modifiedAt: { type: Date, required: true },
    nbConfirmations: { type: Number, required: true },
    nonce: { type: Number, required: true },
    receiver: { type: String, required: true },
    sender: { type: String, required: true },
    timestamp: { type: Number, required: true },
    tokenName: { type: String, required: true },
    tokenSymbol: { type: String, required: true },
    transactionIndex: { type: Number, required: true },
    value: { type: Number, required: true },
  },
  {
    versionKey: '__v',
  },
);

TransactionSchema.methods.getPublicFields = async function () {
  const jsonTransaction = this.toJSON();
  return omit({
    ...jsonTransaction,
  }, ['_id']);
};

const Transaction = model<ITransaction>('Transaction', TransactionSchema, COLLECTION_NAME);

export default Transaction;
