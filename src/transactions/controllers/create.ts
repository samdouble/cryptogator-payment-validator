import Joi from 'joi';
import { DateTime } from 'luxon';
import validationSchema from './validation';
import Transaction from '../schemas/Transaction';

const schema = Joi.object().keys({
  blockchain: validationSchema.blockchain.required(),
  blockNumber: validationSchema.blockNumber.required(),
  timestamp: validationSchema.timestamp.required(),
  date: validationSchema.date.required(),
  hash: validationSchema.hash.required(),
  nonce: validationSchema.nonce.required(),
  blockHash: validationSchema.blockHash.required(),
  sender: validationSchema.sender.required(),
  receiver: validationSchema.receiver.required(),
  contractAddress: validationSchema.contractAddress.required(),
  tokenName: validationSchema.tokenName.required(),
  tokenSymbol: validationSchema.tokenSymbol.required(),
  transactionIndex: validationSchema.transactionIndex.required(),
  value: validationSchema.value.required(),
  gas: validationSchema.gas.required(),
  gasPrice: validationSchema.gasPrice.required(),
  gasUsed: validationSchema.gasUsed.required(),
  cumulativeGasUsed: validationSchema.cumulativeGasUsed.required(),
  nbConfirmations: validationSchema.nbConfirmations.required(),
});

export default async function (transactionInfo, options: { session?: any } = {}) {
  const validation = schema.validate(transactionInfo, { stripUnknown: true });
  if (validation.error) {
    throw new Error(`Invalid request: ${validation}`);
  }
  const validatedTransaction = validation.value;

  const now = DateTime.now().toUTC().toJSDate();
  return new Transaction({
    ...validatedTransaction,
    createdAt: now,
    modifiedAt: now,
  })
    .save({
      session: options.session,
    })
    .then(async transaction => {
      if (options.session) {
        await options.session.commitTransaction();
        options.session.endSession();
      }
      return transaction.getPublicFields();
    })
    .catch(async error => {
      if (options.session) {
        await options.session.abortTransaction();
        options.session.endSession();
      }
      throw error;
    });
}
