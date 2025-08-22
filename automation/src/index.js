require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const ProductSyncService = require('./services/ProductSyncService');
const logger = require('./utils/Logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'CJ Dropshipping to Shopify Automation API',
    version: '1.0.0',
    endpoints: {
      '/upload-hoodies': 'POST - Upload hoodies from CJ to Shopify',
      '/health': 'GET - Health check',
      '/status': 'GET - Service status'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/status', (req, res) => {
  res.json({
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    shopify_domain: process.env.SHOPIFY_SHOP_DOMAIN ? 'configured' : 'missing',
    cj_credentials: process.env.CJ_EMAIL ? 'configured' : 'missing'
  });
});

app.post('/upload-hoodies', async (req, res) => {
  try {
    const { limit = 10 } = req.body;
    
    logger.info(`API request to upload ${limit} hoodies`);
    
    const syncService = new ProductSyncService();
    const results = await syncService.uploadHoodiesToShopify(limit);
    
    res.json({
      success: true,
      message: `Successfully uploaded ${results.length} hoodies`,
      products: results,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    logger.error('API upload failed:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  logger.info(`🚀 Automation server running on port ${PORT}`);
  logger.info(`📊 Dashboard available at http://localhost:${PORT}`);
});

module.exports = app;
