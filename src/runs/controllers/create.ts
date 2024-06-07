import Joi from 'joi';
import { DateTime } from 'luxon';
import validationSchema from './validation';
import Run from '../schemas/Run';

const schema = Joi.object().keys({
  // blockchain: validationSchema.blockchain.required(),
  // blockNumber: validationSchema.blockNumber.required(),
  // contractAddress: validationSchema.contractAddress.required(),
  receiver: validationSchema.receiver.required(),
  // tokenName: validationSchema.tokenName.required(),
  // tokenSymbol: validationSchema.tokenSymbol.required(),
});

export default async function (runInfo, options: { session?: any } = {}) {
  const validation = schema.validate(runInfo, { stripUnknown: true });
  if (validation.error) {
    throw new Error(`Invalid request: ${validation.error}`);
  }
  const validatedRun = validation.value;

  const now = DateTime.now().toUTC().toJSDate();
  return new Run({
    ...validatedRun,
    createdAt: now,
    modifiedAt: now,
  })
    .save({
      session: options.session,
    })
    .then(async run => {
      if (options.session) {
        await options.session.commitRun();
        options.session.endSession();
      }
      return run.getPublicFields();
    })
    .catch(async error => {
      if (options.session) {
        await options.session.abortRun();
        options.session.endSession();
      }
      throw error;
    });
}
