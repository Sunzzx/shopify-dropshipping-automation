const axios = require('axios');
const logger = require('../utils/Logger');

class ShopifyService {
  constructor() {
    this.shopDomain = process.env.SHOPIFY_SHOP_DOMAIN;
    this.accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    this.baseURL = `https://${this.shopDomain}/admin/api/2024-01/`;
  }

  async createProduct(productData) {
    try {
      const response = await axios.post(`${this.baseURL}products.json`, {
        product: productData
      }, {
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
          'Content-Type': 'application/json'
        }
      });

      logger.info(`Successfully created product: ${productData.title}`);
      return response.data.product;
    } catch (error) {
      logger.error(`Failed to create product ${productData.title}:`, error.message);
      throw error;
    }
  }

  async updateProduct(productId, updateData) {
    try {
      const response = await axios.put(`${this.baseURL}products/${productId}.json`, {
        product: updateData
      }, {
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
          'Content-Type': 'application/json'
        }
      });

      return response.data.product;
    } catch (error) {
      logger.error(`Failed to update product ${productId}:`, error.message);
      throw error;
    }
  }

  async uploadProductImage(productId, imageUrl, altText) {
    try {
      const response = await axios.post(`${this.baseURL}products/${productId}/images.json`, {
        image: {
          src: imageUrl,
          alt: altText
        }
      }, {
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
          'Content-Type': 'application/json'
        }
      });

      return response.data.image;
    } catch (error) {
      logger.error(`Failed to upload image for product ${productId}:`, error.message);
      throw error;
    }
  }

  async createCollection(collectionData) {
    try {
      const response = await axios.post(`${this.baseURL}custom_collections.json`, {
        custom_collection: collectionData
      }, {
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
          'Content-Type': 'application/json'
        }
      });

      return response.data.custom_collection;
    } catch (error) {
      logger.error(`Failed to create collection:`, error.message);
      throw error;
    }
  }

  async addProductToCollection(productId, collectionId) {
    try {
      const response = await axios.post(`${this.baseURL}collects.json`, {
        collect: {
          product_id: productId,
          collection_id: collectionId
        }
      }, {
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
          'Content-Type': 'application/json'
        }
      });

      return response.data.collect;
    } catch (error) {
      logger.error(`Failed to add product to collection:`, error.message);
      throw error;
    }
  }
}

module.exports = ShopifyService;
