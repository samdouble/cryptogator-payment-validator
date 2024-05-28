import axios from 'axios';
import http from 'http';
import https from 'https';
import contractAddresses from './contractAddresses';

const ApiClient = axios.create({
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
  maxRedirects: 10,
  responseType: 'json',
  timeout: 5000,
  withCredentials: true,
});

export const fetchErc20TransactionForAddress = async (erc20Token, address, filter = {}) => {
  const filterWithCredentials = {
    ...filter,
    apikey: process.env.ETHERSCAN_API_TOKEN,
    module: 'account',
    action: 'tokentx',
    contractaddress: contractAddresses[erc20Token],
    address,
    // page:
    // offset:
    // startblock:
    // endblock:
    sort: 'asc',
  };

  const pFilter = filterWithCredentials && `filter=${JSON.stringify({filterWithCredentials})}`;
  const query = [pFilter]
    .filter(q => !!q)
    .join('&');

  return ApiClient
    .get(`${process.env.ETHERSCAN_API_SERVER}/api${query && `?${query}`}`)
    .then((res: any) => res.result)
    .catch(error => console.error(`Fetch events error ${error}`));
}

export const fetchLogsForAddress = async (address, filter = {}) => {
  const filterWithCredentials = {
    ...filter,
    apikey: process.env.ETHERSCAN_API_TOKEN,
    module: 'logs',
    action: 'getLogs',
    address,
    // fromBlock
    // toBlock
    // page:
    // offset:,
  };

  const pFilter = filterWithCredentials && `filter=${JSON.stringify({filterWithCredentials})}`;
  const query = [pFilter]
    .filter(q => !!q)
    .join('&');

  return ApiClient
    .get(`${process.env.ETHERSCAN_API_SERVER}/api${query && `?${query}`}`)
    .then((res: any) => res.result)
    .catch(error => console.error(`Fetch events error ${error}`));
}
