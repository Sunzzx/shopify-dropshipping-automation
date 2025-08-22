const CJService = require('../services/CJService');
const ShopifyService = require('../services/ShopifyService');
const SEOOptimizer = require('../utils/SEOOptimizer');
const logger = require('../utils/Logger');

class ProductSyncService {
  constructor() {
    this.cjService = new CJService();
    this.shopifyService = new ShopifyService();
    this.hoodieCollectionId = null;
  }

  async ensureHoodieCollection() {
    if (this.hoodieCollectionId) return this.hoodieCollectionId;

    try {
      const collectionData = {
        title: 'Premium Hoodies & Sweatshirts',
        handle: 'premium-hoodies',
        body_html: `
          <div style="text-align: center; padding: 20px;">
            <h2>Premium Hoodies & Sweatshirts Collection</h2>
            <p>Discover our curated selection of high-quality hoodies and sweatshirts. Each piece is carefully selected for comfort, style, and durability.</p>
            <p><strong>Features:</strong> Premium materials • Comfortable fit • Versatile styling • Quality construction</p>
          </div>
        `,
        image: {
          alt: 'Premium hoodies and sweatshirts collection banner'
        },
        published: true,
        sort_order: 'best-selling',
        template_suffix: '',
        metafields_global_title_tag: 'Premium Hoodies & Sweatshirts - Comfortable Style Collection',
        metafields_global_description_tag: 'Shop our premium collection of hoodies and sweatshirts. High-quality, comfortable, and stylish pieces perfect for any casual occasion. Free shipping available.'
      };

      const collection = await this.shopifyService.createCollection(collectionData);
      this.hoodieCollectionId = collection.id;
      logger.info(`Created hoodies collection with ID: ${this.hoodieCollectionId}`);
      return this.hoodieCollectionId;
    } catch (error) {
      logger.error('Failed to create hoodies collection:', error.message);
      throw error;
    }
  }

  async uploadHoodiesToShopify(limit = 10) {
    try {
      logger.info(`Starting upload of ${limit} hoodies from CJ Dropshipping...`);
      
      // Ensure hoodie collection exists
      await this.ensureHoodieCollection();
      
      // Get hoodies from CJ Dropshipping
      const hoodies = await this.cjService.searchHoodies(limit);
      
      if (!hoodies || hoodies.length === 0) {
        logger.warn('No hoodies found from CJ Dropshipping');
        return [];
      }

      const uploadedProducts = [];
      
      for (let i = 0; i < hoodies.length; i++) {
        try {
          const hoodie = hoodies[i];
          logger.info(`Processing hoodie ${i + 1}/${hoodies.length}: ${hoodie.productName}`);
          
          // Get detailed product information
          const productDetails = await this.cjService.getProductDetails(hoodie.pid);
          const variants = await this.cjService.getProductVariants(hoodie.pid);
          
          // Create Shopify product data with SEO optimization
          const shopifyProduct = await this.createOptimizedShopifyProduct(productDetails, variants);
          
          // Upload to Shopify
          const createdProduct = await this.shopifyService.createProduct(shopifyProduct);
          
          // Add to hoodies collection
          await this.shopifyService.addProductToCollection(createdProduct.id, this.hoodieCollectionId);
          
          // Upload images with optimized alt text
          await this.uploadProductImages(createdProduct.id, productDetails);
          
          uploadedProducts.push({
            cjId: hoodie.pid,
            shopifyId: createdProduct.id,
            title: createdProduct.title,
            handle: createdProduct.handle
          });
          
          logger.info(`Successfully uploaded: ${createdProduct.title}`);
          
          // Rate limiting - wait 1 second between uploads
          await new Promise(resolve => setTimeout(resolve, 1000));
          
        } catch (error) {
          logger.error(`Failed to upload hoodie ${hoodie.productName}:`, error.message);
          continue; // Continue with next product
        }
      }
      
      logger.info(`Upload completed! ${uploadedProducts.length}/${hoodies.length} products uploaded successfully.`);
      return uploadedProducts;
      
    } catch (error) {
      logger.error('Failed to upload hoodies:', error.message);
      throw error;
    }
  }

  async createOptimizedShopifyProduct(productDetails, variants) {
    const { productName, productNameEn, description, categoryName, productImage, productWeight } = productDetails;
    
    // Generate SEO-optimized content
    const seoTitle = SEOOptimizer.generateSEOTitle(productNameEn || productName, '', 'Hoodie');
    const seoDescription = SEOOptimizer.generateSEODescription({
      name: productNameEn || productName,
      description,
      category: 'hoodie'
    });
    const productDescription = SEOOptimizer.generateProductDescription(productDetails);
    const tags = SEOOptimizer.generateTags(productDetails);
    const handle = SEOOptimizer.generateHandle(productNameEn || productName);
    
    // Create variants with SEO-optimized pricing
    const shopifyVariants = this.createShopifyVariants(variants, productDetails);
    
    return {
      title: seoTitle,
      body_html: productDescription,
      vendor: 'Premium Collection',
      product_type: 'Hoodies & Sweatshirts',
      handle: handle,
      tags: tags.join(', '),
      published: true,
      template_suffix: '',
      metafields_global_title_tag: seoTitle,
      metafields_global_description_tag: seoDescription,
      variants: shopifyVariants,
      options: [
        { name: 'Size', values: ['S', 'M', 'L', 'XL', 'XXL'] },
        { name: 'Color', values: ['Black', 'White', 'Gray', 'Navy'] }
      ],
      images: [] // Will be populated separately
    };
  }

  createShopifyVariants(cjVariants, productDetails) {
    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    const colors = ['Black', 'White', 'Gray', 'Navy'];
    const variants = [];
    
    // If CJ has specific variants, use them; otherwise create standard variants
    if (cjVariants && cjVariants.length > 0) {
      cjVariants.slice(0, 10).forEach((variant, index) => {
        const price = SEOOptimizer.optimizePricing(variant.sellPrice || productDetails.sellPrice || 29.99);
        variants.push({
          title: `${sizes[index % sizes.length]} / ${colors[index % colors.length]}`,
          price: price,
          compare_at_price: (parseFloat(price) * 1.3).toFixed(2),
          inventory_management: 'shopify',
          inventory_quantity: 100,
          requires_shipping: true,
          taxable: true,
          barcode: variant.sku || `HOD${Date.now()}${index}`,
          weight: productDetails.productWeight || 500,
          weight_unit: 'g',
          option1: sizes[index % sizes.length],
          option2: colors[index % colors.length]
        });
      });
    } else {
      // Create standard variants
      const basePrice = SEOOptimizer.optimizePricing(productDetails.sellPrice || 39.99);
      sizes.forEach((size, sizeIndex) => {
        colors.slice(0, 2).forEach((color, colorIndex) => {
          variants.push({
            title: `${size} / ${color}`,
            price: basePrice,
            compare_at_price: (parseFloat(basePrice) * 1.25).toFixed(2),
            inventory_management: 'shopify',
            inventory_quantity: 50,
            requires_shipping: true,
            taxable: true,
            barcode: `HOD${Date.now()}${sizeIndex}${colorIndex}`,
            weight: productDetails.productWeight || 500,
            weight_unit: 'g',
            option1: size,
            option2: color
          });
        });
      });
    }
    
    return variants;
  }

  async uploadProductImages(productId, productDetails) {
    try {
      const { productImage, productName } = productDetails;
      
      if (productImage && productImage.length > 0) {
        for (let i = 0; i < Math.min(productImage.length, 5); i++) {
          const image = productImage[i];
          const altText = SEOOptimizer.generateAltText(productName, `image ${i + 1}`);
          
          await this.shopifyService.uploadProductImage(productId, image, altText);
          
          // Small delay between image uploads
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    } catch (error) {
      logger.error(`Failed to upload images for product ${productId}:`, error.message);
    }
  }
}

module.exports = ProductSyncService;
