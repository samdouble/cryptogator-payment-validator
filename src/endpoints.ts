import axios from 'axios';
import http from 'http';
import https from 'https';

const ApiClient = axios.create({
  headers: {
    Authorization: `Bearer ${process.env.ETHERSCAN_API_TOKEN}`,
  },
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
  maxRedirects: 10,
  responseType: 'json',
  timeout: 5000,
  withCredentials: true,
});

export const fetchOneEvent = async (filter = {}) => {
  const pFilter = filter && `filter=${JSON.stringify(filter)}`;
  const query = [pFilter]
    .filter(q => !!q)
    .join('&');
  return ApiClient
    .get(`${process.env.ETHERSCAN_API_SERVER}/v1/events${query && `?${query}`}`)
    .then(res => res.data.events[0])
    .catch(error => console.error(`Fetch events error ${error}`));
}
