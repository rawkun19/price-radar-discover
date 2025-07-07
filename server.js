const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Enhanced headers to better mimic real browsers
const getHeaders = () => ({
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Cache-Control': 'max-age=0',
  'DNT': '1',
  'Sec-CH-UA': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
  'Sec-CH-UA-Mobile': '?0',
  'Sec-CH-UA-Platform': '"Windows"'
});

// Utility function to clean price with better regex
const cleanPrice = (priceText) => {
  if (!priceText) return 0;
  
  // Remove currency symbols, commas, and non-numeric characters
  const cleaned = priceText
    .replace(/[₹,\s]/g, '') // Remove rupee symbol, commas, spaces
    .replace(/[^\d.]/g, '') // Keep only digits and decimal points
    .split('.')[0]; // Take only the integer part
  
  const price = parseInt(cleaned) || 0;
  
  // Validate price range (₹100 to ₹10,00,000)
  return (price >= 100 && price <= 1000000) ? price : 0;
};

// Utility function to clean title
const cleanTitle = (title) => {
  if (!title) return '';
  return title
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .substring(0, 120); // Increased length limit
};

// Enhanced Amazon scraper with better selectors
const scrapeAmazon = async (query) => {
  try {
    const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}&ref=sr_pg_1`;
    console.log('🛒 Scraping Amazon:', searchUrl);
    
    const response = await axios.get(searchUrl, {
      headers: getHeaders(),
      timeout: 20000,
      maxRedirects: 5
    });

    // Check if we got blocked
    if (response.data.includes('Robot Check') || response.data.includes('captcha')) {
      console.log('❌ Amazon blocked the request (captcha/robot check)');
      return [];
    }

    const $ = cheerio.load(response.data);
    const products = [];

    // Updated Amazon selectors (as of 2024)
    const productSelectors = [
      '[data-component-type="s-search-result"]',
      '.s-result-item[data-asin]',
      '.sg-col-inner .s-widget-container'
    ];

    let productElements = $();
    for (const selector of productSelectors) {
      productElements = $(selector);
      if (productElements.length > 0) {
        console.log(`✅ Amazon: Found elements with selector: ${selector}`);
        break;
      }
    }

    if (productElements.length === 0) {
      console.log('❌ Amazon: No product elements found');
      return [];
    }

    productElements.slice(0, 6).each((index, element) => {
      try {
        const $element = $(element);
        
        // Enhanced title selectors
        const titleSelectors = [
          'h2 a span[aria-label]',
          'h2 .a-link-normal span',
          'h2 a span',
          '.a-size-mini span',
          '.a-size-base-plus',
          '[data-cy="title-recipe-title"]'
        ];
        
        let title = '';
        for (const selector of titleSelectors) {
          const titleEl = $element.find(selector).first();
          title = titleEl.attr('aria-label') || titleEl.text().trim();
          if (title && title.length > 10) break;
        }

        // Enhanced price selectors
        const priceSelectors = [
          '.a-price-whole',
          '.a-price .a-offscreen',
          '.a-price-range .a-price .a-offscreen',
          '.a-price-symbol + .a-price-whole',
          '[data-a-color="price"] .a-offscreen'
        ];
        
        let price = '';
        for (const selector of priceSelectors) {
          price = $element.find(selector).first().text().trim();
          if (price && cleanPrice(price) > 0) break;
        }

        // Enhanced link selectors
        const linkSelectors = [
          'h2 a[href]',
          '.a-link-normal[href]',
          'a[href*="/dp/"]',
          'a[href*="/gp/product/"]'
        ];
        
        let link = '';
        for (const selector of linkSelectors) {
          const href = $element.find(selector).first().attr('href');
          if (href) {
            link = href.startsWith('http') ? href : `https://www.amazon.in${href}`;
            break;
          }
        }

        // Validate and add product
        const cleanedPrice = cleanPrice(price);
        const cleanedTitle = cleanTitle(title);
        
        if (cleanedTitle && cleanedPrice > 0 && link) {
          products.push({
            platform: 'Amazon',
            title: cleanedTitle,
            price: cleanedPrice,
            delivery: 'Free delivery by tomorrow',
            link: link
          });
        }
      } catch (err) {
        console.log('⚠️ Error parsing Amazon product:', err.message);
      }
    });

    console.log(`✅ Amazon found ${products.length} valid products`);
    return products;
  } catch (error) {
    console.error('❌ Amazon scraping error:', error.message);
    
    // Check for specific error types
    if (error.code === 'ENOTFOUND') {
      console.log('🌐 Network error: Check internet connection');
    } else if (error.code === 'ECONNABORTED') {
      console.log('⏰ Request timeout: Amazon took too long to respond');
    }
    
    return [];
  }
};

// Enhanced Flipkart scraper with better selectors
const scrapeFlipkart = async (query) => {
  try {
    const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
    console.log('🛍️ Scraping Flipkart:', searchUrl);
    
    const response = await axios.get(searchUrl, {
      headers: getHeaders(),
      timeout: 20000,
      maxRedirects: 5
    });

    // Check if we got blocked
    if (response.data.includes('blocked') || response.data.includes('captcha')) {
      console.log('❌ Flipkart blocked the request');
      return [];
    }

    const $ = cheerio.load(response.data);
    const products = [];

    // Updated Flipkart selectors (as of 2024)
    const productSelectors = [
      '._1AtVbE',
      '._13oc-S',
      '._2kHMtA',
      '[data-id]',
      '._1fQZEK',
      '.cPHDOP',
      '._2B099V'
    ];

    let productElements = $();
    for (const selector of productSelectors) {
      productElements = $(selector);
      if (productElements.length > 0) {
        console.log(`✅ Flipkart: Found elements with selector: ${selector}`);
        break;
      }
    }

    if (productElements.length === 0) {
      console.log('❌ Flipkart: No product elements found');
      return [];
    }

    productElements.slice(0, 6).each((index, element) => {
      try {
        const $element = $(element);
        
        // Enhanced title selectors
        const titleSelectors = [
          '._4rR01T',
          '.s1Q9rs',
          '.IRpwTa',
          '._2WkVRV',
          '.KzDlHZ',
          '.wjcEIp',
          '._25b18c'
        ];
        
        let title = '';
        for (const selector of titleSelectors) {
          title = $element.find(selector).first().text().trim();
          if (title && title.length > 10) break;
        }

        // Enhanced price selectors
        const priceSelectors = [
          '._30jeq3',
          '._1_WHN1',
          '.Nx9bqj',
          '._3tbKJL',
          '._25b18c',
          '.CEmiEU'
        ];
        
        let price = '';
        for (const selector of priceSelectors) {
          price = $element.find(selector).first().text().trim();
          if (price && cleanPrice(price) > 0) break;
        }

        // Enhanced link selectors
        const linkSelectors = [
          'a[href*="/p/"]',
          'a[href*="/product/"]',
          'a[href]',
          '._1fQZEK a',
          '.IRpwTa a'
        ];
        
        let link = '';
        for (const selector of linkSelectors) {
          const href = $element.find(selector).first().attr('href');
          if (href) {
            link = href.startsWith('http') ? href : `https://www.flipkart.com${href}`;
            break;
          }
        }

        // Validate and add product
        const cleanedPrice = cleanPrice(price);
        const cleanedTitle = cleanTitle(title);
        
        if (cleanedTitle && cleanedPrice > 0 && link) {
          products.push({
            platform: 'Flipkart',
            title: cleanedTitle,
            price: cleanedPrice,
            delivery: 'Delivery in 2-3 days',
            link: link
          });
        }
      } catch (err) {
        console.log('⚠️ Error parsing Flipkart product:', err.message);
      }
    });

    console.log(`✅ Flipkart found ${products.length} valid products`);
    return products;
  } catch (error) {
    console.error('❌ Flipkart scraping error:', error.message);
    
    // Check for specific error types
    if (error.code === 'ENOTFOUND') {
      console.log('🌐 Network error: Check internet connection');
    } else if (error.code === 'ECONNABORTED') {
      console.log('⏰ Request timeout: Flipkart took too long to respond');
    }
    
    return [];
  }
};

// Fallback mock data for when scraping fails
const getMockData = (query) => {
  return [
    {
      platform: 'Amazon',
      title: `${query} - Premium Edition (Mock Data)`,
      price: Math.floor(Math.random() * 50000) + 10000,
      delivery: 'Free delivery by tomorrow',
      link: 'https://amazon.in'
    },
    {
      platform: 'Flipkart',
      title: `${query} - Best Seller (Mock Data)`,
      price: Math.floor(Math.random() * 50000) + 10000,
      delivery: 'Delivery in 2-3 days',
      link: 'https://flipkart.com'
    }
  ];
};

// Main search endpoint with enhanced error handling
app.get('/api/search', async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ 
      error: 'Query parameter is required',
      example: '/api/search?query=iPhone+15'
    });
  }

  if (query.length < 2) {
    return res.status(400).json({ 
      error: 'Query must be at least 2 characters long'
    });
  }

  console.log(`\n🔍 Searching for: "${query}"`);
  const startTime = Date.now();
  
  try {
    // Run both scrapers in parallel with individual timeouts
    const amazonPromise = scrapeAmazon(query).catch(err => {
      console.log('Amazon promise rejected:', err.message);
      return [];
    });
    
    const flipkartPromise = scrapeFlipkart(query).catch(err => {
      console.log('Flipkart promise rejected:', err.message);
      return [];
    });

    // Wait for both with overall timeout
    const results = await Promise.race([
      Promise.all([amazonPromise, flipkartPromise]),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Overall timeout')), 25000)
      )
    ]);

    const [amazonResults, flipkartResults] = results;

    // Combine results
    let allProducts = [...amazonResults, ...flipkartResults];

    // If no results found, use mock data for demo
    if (allProducts.length === 0) {
      console.log('⚠️ No real results found, using mock data for demo');
      allProducts = getMockData(query);
    }

    // Sort by price (lowest first) and remove duplicates
    allProducts = allProducts
      .filter((product, index, self) => 
        index === self.findIndex(p => p.title === product.title)
      )
      .sort((a, b) => a.price - b.price)
      .slice(0, 10); // Limit to top 10 results

    const endTime = Date.now();
    console.log(`✅ Search completed in ${endTime - startTime}ms`);
    console.log(`📦 Total products found: ${allProducts.length}`);
    
    res.json({
      success: true,
      query: query,
      count: allProducts.length,
      searchTime: `${endTime - startTime}ms`,
      products: allProducts
    });

  } catch (error) {
    console.error('❌ Search error:', error.message);
    
    // Return mock data on error for demo purposes
    const mockProducts = getMockData(query);
    
    res.status(200).json({
      success: false,
      error: 'Scraping failed, showing demo data',
      message: error.message,
      query: query,
      count: mockProducts.length,
      products: mockProducts
    });
  }
});

// Health check endpoint with more details
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'PriceRadar Scraper API is running',
    version: '1.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Root endpoint with better documentation
app.get('/', (req, res) => {
  res.json({
    name: 'PriceRadar Scraper API',
    version: '1.0.0',
    description: 'Real-time price comparison for Amazon India & Flipkart India',
    endpoints: {
      search: {
        url: '/api/search?query=product+name',
        method: 'GET',
        example: '/api/search?query=iPhone+15'
      },
      health: {
        url: '/health',
        method: 'GET'
      }
    },
    status: 'Running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: ['/', '/health', '/api/search']
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PriceRadar Scraper API running on port ${PORT}`);
  console.log(`📡 Search endpoint: http://localhost:${PORT}/api/search?query=product+name`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 Documentation: http://localhost:${PORT}/`);
});

module.exports = app;