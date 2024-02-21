// countryExplorerService.js
import axios from 'axios';
import { serviceUrl } from '../../src/test/fixtures.js'; 

export const countryExplorerService = {
  baseUrl: serviceUrl,

  async createAccount(account) {
    const response = await axios.post(`${this.baseUrl}/api/accounts`, account);
    return response.data;
  },
};
