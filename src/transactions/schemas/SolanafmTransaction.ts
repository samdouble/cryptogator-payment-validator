import { Schema } from 'mongoose';

export interface ISolanafmTransaction {
  receiverAssociation?: string;
  senderAssociation: string;
}

export const SolanafmTransactionSchema: Schema = new Schema<ISolanafmTransaction>(
  {
    receiverAssociation: { type: String, required: true },
    senderAssociation: { type: String, required: true },
  },
);

export default SolanafmTransactionSchema;
