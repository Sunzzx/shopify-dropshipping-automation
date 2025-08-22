#!/usr/bin/env node

require('dotenv').config();
const ProductSyncService = require('../services/ProductSyncService');
const logger = require('../utils/Logger');

async function uploadHoodies() {
  try {
    logger.info('🚀 Starting CJ Dropshipping Hoodie Upload Automation...');
    
    // Validate environment variables
    const requiredEnvVars = [
      'CJ_EMAIL',
      'CJ_PASSWORD', 
      'SHOPIFY_SHOP_DOMAIN',
      'SHOPIFY_ACCESS_TOKEN'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
    
    const syncService = new ProductSyncService();
    
    // Upload 10 hoodies with professional SEO optimization
    const uploadedProducts = await syncService.uploadHoodiesToShopify(10);
    
    logger.info('✅ Upload completed successfully!');
    logger.info(`📊 Results Summary:`);
    logger.info(`   • Products uploaded: ${uploadedProducts.length}/10`);
    logger.info(`   • SEO optimized titles and descriptions`);
    logger.info(`   • Professional product collection created`);
    logger.info(`   • Images optimized with alt text`);
    logger.info(`   • Variants created with competitive pricing`);
    
    console.log('\n🎉 Uploaded Products:');
    uploadedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title}`);
      console.log(`   Shopify ID: ${product.shopifyId}`);
      console.log(`   Handle: ${product.handle}`);
      console.log('');
    });
    
    logger.info('🎯 Next Steps:');
    logger.info('   1. Review products in Shopify admin');
    logger.info('   2. Adjust pricing if needed');
    logger.info('   3. Set up inventory tracking');
    logger.info('   4. Configure shipping settings');
    logger.info('   5. Run SEO audit on new products');
    
  } catch (error) {
    logger.error('❌ Upload failed:', error.message);
    console.error('\n💡 Troubleshooting Tips:');
    console.error('1. Check your .env file for correct API credentials');
    console.error('2. Verify CJ Dropshipping account access');
    console.error('3. Ensure Shopify store permissions are correct');
    console.error('4. Check internet connection and API rate limits');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  uploadHoodies();
}

module.exports = uploadHoodies;
