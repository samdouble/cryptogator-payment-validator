import { Schema, model } from 'mongoose';
import omit from 'lodash.omit';
import { v4 as uuidv4 } from 'uuid';
import { EtherscanTransactionSchema, IEtherscanTransaction } from './EtherscanTransaction';
import { PolygonscanTransactionSchema, IPolygonscanTransaction } from './PolygonscanTransaction';
import { SolanafmTransactionSchema, ISolanafmTransaction } from './SolanafmTransaction';

const COLLECTION_NAME = 'transactions';

export interface ITransaction {
  id: string;
  blockchain: string;
  contractAddress: string;
  createdAt: Date;
  date: Date;
  modifiedAt: Date;
  receiver: string;
  sender: string;
  timestamp: number;
  tokenName: string;
  tokenSymbol: string;
  value: number;
  getPublicFields: () => Partial<ITransaction>;
}

const TransactionSchema: Schema = new Schema<ITransaction>(
  {
    id: { type: String, default: uuidv4 },
    blockchain: { type: String, required: true },
    contractAddress: { type: String, required: true },
    createdAt: { type: Date, required: true },
    date: { type: Date, required: true },
    modifiedAt: { type: Date, required: true },
    receiver: { type: String, required: true },
    sender: { type: String, required: true },
    timestamp: { type: Number, required: true },
    tokenName: { type: String, required: true },
    tokenSymbol: { type: String, required: true },
    value: { type: Number, required: true },
  },
  {
    discriminatorKey: 'blockchain',
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
Transaction.discriminator<IEtherscanTransaction>('Ethereum', EtherscanTransactionSchema);
Transaction.discriminator<IPolygonscanTransaction>('Polygon', PolygonscanTransactionSchema);
Transaction.discriminator<ISolanafmTransaction>('Solana', SolanafmTransactionSchema);

export default Transaction;
