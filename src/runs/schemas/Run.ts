import { Schema, model } from 'mongoose';
import omit from 'lodash.omit';
import { v4 as uuidv4 } from 'uuid';

const COLLECTION_NAME = 'runs';

export interface IRun {
  id: string;
  // blockchain: string;
  // blockNumber: number;
  // contractAddress: string;
  createdAt: Date;
  modifiedAt: Date;
  receiver: string;
  // tokenName: string;
  // tokenSymbol: string;
  getPublicFields: () => Partial<IRun>;
}

const RunSchema: Schema = new Schema<IRun>(
  {
    id: { type: String, default: uuidv4 },
    // blockchain: { type: String, required: true },
    // blockNumber: { type: Number, required: true },
    // contractAddress: { type: String, required: true },
    createdAt: { type: Date, required: true },
    modifiedAt: { type: Date, required: true },
    receiver: { type: String, required: true },
    // tokenName: { type: String, required: true },
    // tokenSymbol: { type: String, required: true },
  },
  {
    versionKey: '__v',
  },
);

RunSchema.methods.getPublicFields = async function () {
  const jsonRun = this.toJSON();
  return omit({
    ...jsonRun,
  }, ['_id']);
};

const Run = model<IRun>('Run', RunSchema, COLLECTION_NAME);

export default Run;
