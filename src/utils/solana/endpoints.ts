import axios from 'axios';
import http from 'http';
import https from 'https';
import queryString from 'node:querystring';
     
const ApiClient = axios.create({
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
  maxRedirects: 10,
  responseType: 'json',
  timeout: 5000,
  withCredentials: true,
  headers: {
    accept: 'application/json',
    ApiKey: process.env.SOLANAFM_API_TOKEN,
  },
});

export const fetchTransactionsForAddress = async (token, hash, filter = {}) => {
  const filterWithCredentials = {
    ...filter,
    inflow: true,
    outflow: false,
    page: 1,
  };

  const query = filterWithCredentials && queryString.stringify(filterWithCredentials);
  return ApiClient
    .get(`${process.env.SOLANAFM_API_SERVER}/v0/accounts/${hash}/transactions${query && `?${query}`}`)
    .then((res: any) => res.data)
    .then(data => {
      if (!['success'].includes(data.status)) {
        throw new Error('Error', data.message);
      }
      return data.result;
    })
    .catch(error => console.error(`Fetch transactions error ${error}`));
}

export default {
  fetchTransactionsForAddress,
}
