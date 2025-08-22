#!/usr/bin/env node

require('dotenv').config();
const logger = require('../utils/Logger');

// Demo data for hoodies when CJ API is not available
const DEMO_HOODIES = [
  {
    pid: 'demo-001',
    productName: 'Premium Comfort Hoodie',
    productNameEn: 'Premium Comfort Hoodie',
    categoryName: 'Hoodies',
    sellPrice: 29.99,
    productWeight: 450,
    description: 'Ultra-soft premium cotton blend hoodie perfect for everyday comfort',
    productImage: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
    ]
  },
  {
    pid: 'demo-002', 
    productName: 'Urban Style Pullover',
    productNameEn: 'Urban Style Pullover',
    categoryName: 'Hoodies',
    sellPrice: 34.99,
    productWeight: 480,
    description: 'Modern streetwear hoodie with contemporary design elements',
    productImage: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'
    ]
  },
  {
    pid: 'demo-003',
    productName: 'Classic Zip-Up Hoodie',
    productNameEn: 'Classic Zip-Up Hoodie', 
    categoryName: 'Hoodies',
    sellPrice: 39.99,
    productWeight: 520,
    description: 'Timeless zip-up design with premium construction and comfort',
    productImage: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
    ]
  },
  {
    pid: 'demo-004',
    productName: 'Oversized Comfort Hoodie',
    productNameEn: 'Oversized Comfort Hoodie',
    categoryName: 'Hoodies', 
    sellPrice: 32.99,
    productWeight: 550,
    description: 'Relaxed oversized fit hoodie for maximum comfort and style',
    productImage: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'
    ]
  },
  {
    pid: 'demo-005',
    productName: 'Athletic Performance Hoodie',
    productNameEn: 'Athletic Performance Hoodie',
    categoryName: 'Hoodies',
    sellPrice: 44.99,
    productWeight: 420,
    description: 'Moisture-wicking performance hoodie perfect for active lifestyles',
    productImage: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
    ]
  },
  {
    pid: 'demo-006',
    productName: 'Vintage Wash Hoodie',
    productNameEn: 'Vintage Wash Hoodie',
    categoryName: 'Hoodies',
    sellPrice: 37.99,
    productWeight: 465,
    description: 'Pre-washed vintage style hoodie with authentic worn-in feel',
    productImage: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'
    ]
  },
  {
    pid: 'demo-007',
    productName: 'Minimalist Design Hoodie',
    productNameEn: 'Minimalist Design Hoodie',
    categoryName: 'Hoodies',
    sellPrice: 31.99,
    productWeight: 440,
    description: 'Clean, minimalist design hoodie for the modern wardrobe',
    productImage: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
    ]
  },
  {
    pid: 'demo-008',
    productName: 'Fleece-Lined Winter Hoodie',
    productNameEn: 'Fleece-Lined Winter Hoodie',
    categoryName: 'Hoodies',
    sellPrice: 42.99,
    productWeight: 580,
    description: 'Extra warm fleece-lined hoodie perfect for cold weather',
    productImage: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'
    ]
  },
  {
    pid: 'demo-009',
    productName: 'Eco-Friendly Organic Hoodie',
    productNameEn: 'Eco-Friendly Organic Hoodie',
    categoryName: 'Hoodies',
    sellPrice: 46.99,
    productWeight: 470,
    description: '100% organic cotton hoodie with sustainable manufacturing',
    productImage: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
    ]
  },
  {
    pid: 'demo-010',
    productName: 'Graphic Print Hoodie',
    productNameEn: 'Graphic Print Hoodie',
    categoryName: 'Hoodies',
    sellPrice: 35.99,
    productWeight: 460,
    description: 'Eye-catching graphic design hoodie for standout style',
    productImage: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'
    ]
  }
];

async function uploadHoodiesDemo() {
  try {
    console.log('🎭 DEMO MODE: Uploading Sample Hoodies with SEO Optimization\n');
    console.log('📝 This demo shows what the automation would create:\n');
    
    const SEOOptimizer = require('../utils/SEOOptimizer');
    
    for (let i = 0; i < DEMO_HOODIES.length; i++) {
      const hoodie = DEMO_HOODIES[i];
      
      console.log(`🔄 Processing Hoodie ${i + 1}/10: ${hoodie.productName}`);
      console.log('─'.repeat(60));
      
      // Generate SEO-optimized content
      const seoTitle = SEOOptimizer.generateSEOTitle(hoodie.productName, '', 'Hoodie');
      const seoDescription = SEOOptimizer.generateSEODescription(hoodie);
      const tags = SEOOptimizer.generateTags(hoodie);
      const handle = SEOOptimizer.generateHandle(hoodie.productName);
      const optimizedPrice = SEOOptimizer.optimizePricing(hoodie.sellPrice);
      
      console.log(`📊 SEO Title: ${seoTitle}`);
      console.log(`📝 Meta Description: ${seoDescription.substring(0, 80)}...`);
      console.log(`🏷️  Handle: /products/${handle}`);
      console.log(`💰 Optimized Price: $${optimizedPrice}`);
      console.log(`🏷️  Tags: ${tags.slice(0, 5).join(', ')}...`);
      
      // Show what variants would be created
      console.log('📦 Variants:');
      const sizes = ['S', 'M', 'L', 'XL'];
      const colors = ['Black', 'White'];
      
      sizes.slice(0, 2).forEach(size => {
        colors.forEach(color => {
          console.log(`   • ${size} / ${color} - $${optimizedPrice}`);
        });
      });
      
      console.log(`🖼️  Images: ${hoodie.productImage.length} image(s) with SEO alt text`);
      console.log(''); // Empty line for spacing
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('✅ DEMO COMPLETED!\n');
    
    console.log('📊 Demo Results Summary:');
    console.log(`   • ${DEMO_HOODIES.length} products processed`);
    console.log('   • SEO-optimized titles and descriptions');
    console.log('   • Professional pricing strategy applied');
    console.log('   • Smart variant creation (4 variants per product)');
    console.log('   • Collection organization ready');
    console.log('   • Image optimization with alt text');
    
    console.log('\n🎯 What happens with real credentials:');
    console.log('   1. Products uploaded to your Shopify store');
    console.log('   2. Professional collection created');
    console.log('   3. SEO meta tags configured');
    console.log('   4. Images uploaded with optimization');
    console.log('   5. Inventory tracking set up');
    
    console.log('\n🔧 To run with real data:');
    console.log('   1. Configure your .env file with API credentials');
    console.log('   2. Run: npm run upload-hoodies');
    console.log('   3. Check your Shopify admin for uploaded products');
    
  } catch (error) {
    logger.error('Demo failed:', error.message);
    console.error('❌ Demo encountered an error:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  uploadHoodiesDemo();
}

module.exports = uploadHoodiesDemo;
