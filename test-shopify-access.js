const axios = require('axios');

// Test Shopify store access
async function testShopifyAccess() {
    const storeDomain = 'jxxkq2-wt.myshopify.com';
    
    try {
        console.log('🔍 Testing Shopify store access...');
        console.log(`📍 Store: ${storeDomain}`);
        
        // Test public store access
        const publicResponse = await axios.get(`https://${storeDomain}`, {
            timeout: 5000,
            headers: {
                'User-Agent': 'Store-Settings-Checker/1.0'
            }
        });
        
        if (publicResponse.status === 200) {
            console.log('✅ Store is publicly accessible');
            console.log('🏪 Store appears to be active');
            
            // Check if we can access some public endpoints
            try {
                const productsResponse = await axios.get(`https://${storeDomain}/products.json?limit=1`);
                console.log('✅ Products API accessible');
            } catch (err) {
                console.log('⚠️  Products API may be restricted');
            }
            
            console.log('\n📋 TO ACCESS SETTINGS, YOU NEED:');
            console.log('   1. Shopify Admin access');
            console.log('   2. Private app credentials');
            console.log('   3. API permissions for store settings');
            
        } else {
            console.log('❌ Store access issue');
        }
        
    } catch (error) {
        console.log('❌ Connection failed:', error.message);
        
        if (error.code === 'ENOTFOUND') {
            console.log('🔍 Store domain may be incorrect or store is private');
        }
    }
}

testShopifyAccess();
