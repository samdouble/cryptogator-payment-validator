import axios from 'axios';
import http from 'http';
import https from 'https';
import queryString from 'node:querystring';
import contractAddresses from './contractAddresses';

const ApiClient = axios.create({
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
  maxRedirects: 10,
  responseType: 'json',
  timeout: 5000,
  withCredentials: true,
});

export const fetchErc20TransactionsForAddress = async (token, address, filter = {}) => {
  const filterWithCredentials = {
    ...filter,
    apikey: process.env.POLYGONSCAN_API_TOKEN,
    module: 'account',
    action: 'tokentx',
    contractaddress: contractAddresses[token],
    address,
    // page:
    // offset:
    // startblock:
    // endblock:
    sort: 'asc',
  };

  const query = filterWithCredentials && queryString.stringify(filterWithCredentials);
  return ApiClient
    .get(`${process.env.POLYGONSCAN_API_SERVER}/api${query && `?${query}`}`)
    .then((res: any) => res.data)
    .then(data => {
      if (!['0', '1'].includes(data.status)) {
        throw new Error('Error', data.message);
      }
      return data.result;
    })
    .catch(error => console.error(`Fetch transactions error ${error}`));
}

export const fetchLogsForAddress = async (address, filter = {}) => {
  const filterWithCredentials = {
    ...filter,
    apikey: process.env.POLYGONSCAN_API_TOKEN,
    module: 'logs',
    action: 'getLogs',
    address,
    // fromBlock
    // toBlock
    // page:
    // offset:,
  };

  const query = filterWithCredentials && queryString.stringify(filterWithCredentials);
  return ApiClient
    .get(`${process.env.POLYGONSCAN_API_SERVER}/api${query && `?${query}`}`)
    .then((res: any) => res.data)
    .then(data => {
      if (!['0', '1'].includes(data.status)) {
        throw new Error('Error', data.message);
      }
      return data.result;
    })
    .catch(error => console.error(`Fetch events error ${error}`));
}

export default {
  fetchErc20TransactionsForAddress,
  fetchLogsForAddress,
}
