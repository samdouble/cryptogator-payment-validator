import Joi from 'joi';

export default {
  blockchain: Joi.string().valid('Ethereum', 'Polygon'),
  blockNumber: Joi.number().integer().positive(),
  timestamp: Joi.number().integer().positive(),
  date: Joi.date(),
  hash: Joi.string(),
  nonce: Joi.number().integer(),
  blockHash: Joi.string(),
  sender: Joi.string(),
  receiver: Joi.string(),
  contractAddress: Joi.string(),
  tokenName: Joi.string(),
  tokenSymbol: Joi.string(),
  transactionIndex: Joi.number().integer(),
  value: Joi.number(),
  gas: Joi.number(),
  gasPrice: Joi.number(),
  gasUsed: Joi.number(),
  cumulativeGasUsed: Joi.number(),
  nbConfirmations: Joi.number().integer(),
};
