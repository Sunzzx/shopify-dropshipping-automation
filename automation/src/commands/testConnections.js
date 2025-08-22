#!/usr/bin/env node

require('dotenv').config();
const logger = require('../utils/Logger');

async function testConnections() {
  console.log('🔧 Testing CJ Dropshipping & Shopify Connections...\n');
  
  // Check environment variables
  console.log('📋 Environment Configuration:');
  const envVars = {
    'CJ_EMAIL': process.env.CJ_EMAIL ? '✅ Configured' : '❌ Missing',
    'CJ_PASSWORD': process.env.CJ_PASSWORD ? '✅ Configured' : '❌ Missing',
    'SHOPIFY_SHOP_DOMAIN': process.env.SHOPIFY_SHOP_DOMAIN ? '✅ Configured' : '❌ Missing',
    'SHOPIFY_ACCESS_TOKEN': process.env.SHOPIFY_ACCESS_TOKEN ? '✅ Configured' : '❌ Missing'
  };
  
  Object.entries(envVars).forEach(([key, status]) => {
    console.log(`   ${key}: ${status}`);
  });
  
  console.log('\n🔗 Connection Tests:');
  
  // Test CJ Dropshipping connection
  try {
    if (process.env.CJ_EMAIL && process.env.CJ_PASSWORD) {
      const CJService = require('../services/CJService');
      const cjService = new CJService();
      
      console.log('   Testing CJ Dropshipping API...');
      await cjService.authenticate();
      console.log('   ✅ CJ Dropshipping: Connected successfully');
      
      // Test product search
      const hoodies = await cjService.searchHoodies(1);
      console.log(`   ✅ CJ Product Search: Found ${hoodies.length} hoodie(s)`);
      
    } else {
      console.log('   ❌ CJ Dropshipping: Missing credentials');
    }
  } catch (error) {
    console.log(`   ❌ CJ Dropshipping: ${error.message}`);
  }
  
  // Test Shopify connection
  try {
    if (process.env.SHOPIFY_SHOP_DOMAIN && process.env.SHOPIFY_ACCESS_TOKEN) {
      const axios = require('axios');
      const shopDomain = process.env.SHOPIFY_SHOP_DOMAIN;
      const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
      
      console.log('   Testing Shopify API...');
      const response = await axios.get(`https://${shopDomain}/admin/api/2024-01/shop.json`, {
        headers: {
          'X-Shopify-Access-Token': accessToken
        }
      });
      
      console.log('   ✅ Shopify: Connected successfully');
      console.log(`   ✅ Store: ${response.data.shop.name} (${response.data.shop.domain})`);
      
    } else {
      console.log('   ❌ Shopify: Missing credentials');
    }
  } catch (error) {
    console.log(`   ❌ Shopify: ${error.message}`);
  }
  
  console.log('\n📖 Setup Instructions:');
  
  if (!process.env.CJ_EMAIL || !process.env.CJ_PASSWORD) {
    console.log('\n🔑 CJ Dropshipping Setup:');
    console.log('   1. Sign up/login to CJ Dropshipping: https://cjdropshipping.com');
    console.log('   2. Go to API section in your account');
    console.log('   3. Generate API credentials');
    console.log('   4. Add them to your .env file');
  }
  
  if (!process.env.SHOPIFY_SHOP_DOMAIN || !process.env.SHOPIFY_ACCESS_TOKEN) {
    console.log('\n🏪 Shopify Setup:');
    console.log('   1. Login to your Shopify admin');
    console.log('   2. Go to Apps > Manage private apps');
    console.log('   3. Create a private app with these permissions:');
    console.log('      • Products: Read and write');
    console.log('      • Inventory: Read and write');
    console.log('      • Orders: Read and write');
    console.log('   4. Copy the access token to your .env file');
  }
  
  console.log('\n🚀 Ready to Upload?');
  const allConfigured = process.env.CJ_EMAIL && process.env.CJ_PASSWORD && 
                       process.env.SHOPIFY_SHOP_DOMAIN && process.env.SHOPIFY_ACCESS_TOKEN;
  
  if (allConfigured) {
    console.log('   ✅ All credentials configured! Run: npm run upload-hoodies');
  } else {
    console.log('   ❌ Please configure missing credentials first');
  }
}

// Run if called directly
if (require.main === module) {
  testConnections().catch(console.error);
}

module.exports = testConnections;
