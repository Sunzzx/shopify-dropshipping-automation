const axios = require('axios');
const logger = require('../utils/Logger');

class CJService {
  constructor() {
    this.baseURL = 'https://developers.cjdropshipping.com/api2.0/v1';
    this.apiKey = process.env.CJ_API_KEY;
    this.apiSecret = process.env.CJ_API_SECRET;
    this.accessToken = null;
  }

  async authenticate() {
    try {
      const response = await axios.post(`${this.baseURL}/authentication`, {
        email: process.env.CJ_EMAIL,
        password: process.env.CJ_PASSWORD
      });
      
      this.accessToken = response.data.data.accessToken;
      logger.info('Successfully authenticated with CJ Dropshipping');
      return this.accessToken;
    } catch (error) {
      logger.error('Failed to authenticate with CJ Dropshipping:', error.message);
      throw error;
    }
  }

  async searchHoodies(limit = 10) {
    try {
      if (!this.accessToken) {
        await this.authenticate();
      }

      const response = await axios.get(`${this.baseURL}/product/list`, {
        headers: {
          'CJ-Access-Token': this.accessToken
        },
        params: {
          categoryId: '1043', // Hoodies category
          pageNum: 1,
          pageSize: limit,
          sellStatus: 1, // Available for sale
          keywords: 'hoodie sweatshirt pullover',
          sortType: 2 // Sort by popularity
        }
      });

      const products = response.data.data.list || [];
      logger.info(`Found ${products.length} hoodies from CJ Dropshipping`);
      return products;
    } catch (error) {
      logger.error('Failed to search hoodies from CJ:', error.message);
      throw error;
    }
  }

  async getProductDetails(productId) {
    try {
      const response = await axios.get(`${this.baseURL}/product/query`, {
        headers: {
          'CJ-Access-Token': this.accessToken
        },
        params: {
          pid: productId
        }
      });

      return response.data.data;
    } catch (error) {
      logger.error(`Failed to get product details for ${productId}:`, error.message);
      throw error;
    }
  }

  async getProductVariants(productId) {
    try {
      const response = await axios.get(`${this.baseURL}/product/variant/query`, {
        headers: {
          'CJ-Access-Token': this.accessToken
        },
        params: {
          pid: productId
        }
      });

      return response.data.data || [];
    } catch (error) {
      logger.error(`Failed to get variants for product ${productId}:`, error.message);
      throw error;
    }
  }
}

module.exports = CJService;
