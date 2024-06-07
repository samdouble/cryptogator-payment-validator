import Joi from 'joi';

export default {
  // blockchain: Joi.string().valid('Ethereum', 'Polygon'),
  // blockNumber: Joi.number().integer().positive(),
  // contractAddress: Joi.string(),
  receiver: Joi.string(),
  // tokenName: Joi.string(),
  // tokenSymbol: Joi.string(),
};
