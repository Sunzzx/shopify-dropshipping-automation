const slugify = require('slugify');

class SEOOptimizer {
  static generateSEOTitle(productName, brand = '', category = 'Hoodie') {
    // Clean and optimize the product name
    const cleanName = productName
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();

    // Create SEO-optimized title
    const keywords = ['Premium', 'Comfortable', 'Stylish'];
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    
    const title = brand 
      ? `${keyword} ${cleanName} - ${category} | ${brand}`
      : `${keyword} ${cleanName} - ${category}`;
    
    // Ensure title is under 60 characters for SEO
    return title.length > 60 ? title.substring(0, 57) + '...' : title;
  }

  static generateSEODescription(productData) {
    const { name, description, category = 'hoodie' } = productData;
    const productName = name || productData.productName || productData.productNameEn || 'hoodie';
    
    const templates = [
      `Discover premium comfort with our ${productName.toLowerCase()}. Perfect for casual wear and layering. ${this.extractKeyFeatures(description)} Free shipping and easy returns available.`,
      `Elevate your style with our ${productName.toLowerCase()}. Made with quality materials for lasting comfort. ${this.extractKeyFeatures(description)} Shop now for fast delivery.`,
      `Experience ultimate comfort in our ${productName.toLowerCase()}. Versatile design perfect for any occasion. ${this.extractKeyFeatures(description)} Order today with confidence.`
    ];
    
    const description_text = templates[Math.floor(Math.random() * templates.length)];
    
    // Ensure meta description is under 160 characters
    return description_text.length > 160 ? description_text.substring(0, 157) + '...' : description_text;
  }

  static extractKeyFeatures(description) {
    if (!description) return 'High-quality materials and comfortable fit.';
    
    const features = [];
    const keywords = ['cotton', 'polyester', 'soft', 'comfortable', 'breathable', 'durable', 'warm', 'cozy'];
    
    keywords.forEach(keyword => {
      if (description.toLowerCase().includes(keyword)) {
        features.push(keyword);
      }
    });
    
    return features.length > 0 
      ? `Features ${features.slice(0, 2).join(' and ')} materials.`
      : 'High-quality materials and comfortable fit.';
  }

  static generateProductDescription(cjProduct) {
    const { productName, productNameEn, description, categoryName } = cjProduct;
    
    const productTitle = productNameEn || productName;
    
    return `
**Experience Ultimate Comfort & Style**

Transform your wardrobe with our premium ${productTitle.toLowerCase()}. Designed for those who value both comfort and style, this versatile piece is perfect for any casual occasion.

**What Makes This Special:**
• Premium quality materials for lasting comfort
• Versatile design suitable for layering or standalone wear
• Perfect fit that flatters all body types
• Easy care instructions for everyday convenience
• Available in multiple sizes and colors

**Perfect For:**
• Casual daily wear and weekend relaxation
• Layering during transitional seasons
• Comfortable work-from-home attire
• Outdoor activities and light exercise
• Gift-giving for friends and family

**Quality You Can Trust**
Our ${categoryName?.toLowerCase() || 'hoodie'} is crafted with attention to detail and quality materials. Each piece is designed to maintain its shape, color, and comfort wash after wash.

**Customer Satisfaction Guarantee**
We stand behind our products with a satisfaction guarantee. If you're not completely happy with your purchase, we offer easy returns and exchanges.

**Care Instructions:**
• Machine wash cold with like colors
• Tumble dry low heat
• Do not bleach or iron directly on design
• Hang to dry for best results

${description ? `\n**Additional Details:**\n${description.replace(/<[^>]*>/g, '').substring(0, 200)}...` : ''}

**Order Today** and experience the perfect blend of comfort, style, and quality that our customers love. Fast shipping and exceptional customer service included with every purchase.
    `.trim();
  }

  static generateTags(productData) {
    const { categoryName, productName, productNameEn } = productData;
    
    const baseTags = [
      'hoodie',
      'sweatshirt',
      'casual wear',
      'comfortable',
      'premium quality',
      'unisex',
      'streetwear',
      'layering piece'
    ];
    
    // Add category-specific tags
    if (categoryName) {
      baseTags.push(categoryName.toLowerCase());
    }
    
    // Add size tags
    const sizeTags = ['small', 'medium', 'large', 'xl', 'xxl'];
    baseTags.push(...sizeTags);
    
    // Add seasonal tags
    const seasonalTags = ['fall fashion', 'winter wear', 'spring style'];
    baseTags.push(...seasonalTags.slice(0, 2));
    
    return baseTags.slice(0, 12); // Shopify recommends max 12 tags
  }

  static generateHandle(productName) {
    return slugify(productName, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }

  static generateAltText(productName, variantInfo = '') {
    const baseAlt = `${productName} hoodie premium quality comfortable wear`;
    return variantInfo 
      ? `${baseAlt} ${variantInfo}`.toLowerCase()
      : baseAlt.toLowerCase();
  }

  static optimizePricing(cjPrice, markup = 2.5) {
    const basePrice = parseFloat(cjPrice);
    const markedUpPrice = basePrice * markup;
    
    // Round to .99 or .95 for psychological pricing
    const rounded = Math.floor(markedUpPrice);
    return rounded > 50 ? `${rounded}.99` : `${rounded}.95`;
  }
}

module.exports = SEOOptimizer;
