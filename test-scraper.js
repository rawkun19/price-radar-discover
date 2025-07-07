const axios = require('axios');

// Test the scraper API
const testAPI = async () => {
  const baseURL = 'http://localhost:3000';
  
  console.log('🧪 Testing PriceRadar Scraper API...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${baseURL}/health`);
    console.log('✅ Health check:', healthResponse.data.status);
    
    // Test search endpoint
    console.log('\n2. Testing search endpoint...');
    const searchQueries = ['iPhone 15', 'Samsung Galaxy S24', 'MacBook Air'];
    
    for (const query of searchQueries) {
      console.log(`\n🔍 Searching for: "${query}"`);
      
      try {
        const searchResponse = await axios.get(`${baseURL}/api/search`, {
          params: { query },
          timeout: 20000
        });
        
        const products = searchResponse.data;
        console.log(`✅ Found ${products.length} products`);
        
        if (products.length > 0) {
          console.log('📦 Sample results:');
          products.slice(0, 3).forEach((product, index) => {
            console.log(`   ${index + 1}. ${product.platform}: ${product.title}`);
            console.log(`      Price: ₹${product.price.toLocaleString()}`);
            console.log(`      Delivery: ${product.delivery}`);
          });
        }
      } catch (error) {
        console.log(`❌ Search failed for "${query}":`, error.message);
      }
    }
    
    console.log('\n🎉 API testing completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running: npm run dev');
  }
};

// Run tests
testAPI();