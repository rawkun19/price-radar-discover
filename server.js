const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Common headers to avoid bot detection
const getHeaders = () => ({
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Cache-Control': 'max-age=0'
});

// Utility function to clean price
const cleanPrice = (priceText) => {
  if (!priceText) return 0;
  const cleaned = priceText.replace(/[^\d]/g, '');
  return parseInt(cleaned) || 0;
};

// Utility function to clean title
const cleanTitle = (title) => {
  if (!title) return '';
  return title.trim().substring(0, 100);
};

// Amazon scraper
const scrapeAmazon = async (query) => {
  try {
    const searchUrl = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
    console.log('Scraping Amazon:', searchUrl);
    
    const response = await axios.get(searchUrl, {
      headers: getHeaders(),
      timeout: 15000
    });

    const $ = cheerio.load(response.data);
    const products = [];

    // Multiple selectors for Amazon products
    const productSelectors = [
      '[data-component-type="s-search-result"]',
      '.s-result-item',
      '[data-asin]'
    ];

    let productElements = $();
    for (const selector of productSelectors) {
      productElements = $(selector);
      if (productElements.length > 0) break;
    }

    productElements.slice(0, 5).each((index, element) => {
      try {
        const $element = $(element);
        
        // Title selectors
        const titleSelectors = [
          'h2 a span',
          '.a-size-mini span',
          '.a-size-base-plus',
          'h2 .a-link-normal span'
        ];
        
        let title = '';
        for (const selector of titleSelectors) {
          title = $element.find(selector).first().text().trim();
          if (title) break;
        }

        // Price selectors
        const priceSelectors = [
          '.a-price-whole',
          '.a-price .a-offscreen',
          '.a-price-range .a-price .a-offscreen',
          '.a-price-symbol + .a-price-whole'
        ];
        
        let price = '';
        for (const selector of priceSelectors) {
          price = $element.find(selector).first().text().trim();
          if (price) break;
        }

        // Link selectors
        const linkSelectors = [
          'h2 a',
          '.a-link-normal',
          'a[href*="/dp/"]'
        ];
        
        let link = '';
        for (const selector of linkSelectors) {
          const href = $element.find(selector).first().attr('href');
          if (href) {
            link = href.startsWith('http') ? href : `https://www.amazon.in${href}`;
            break;
          }
        }

        if (title && price && link) {
          products.push({
            platform: 'Amazon',
            title: cleanTitle(title),
            price: cleanPrice(price),
            delivery: 'Free delivery by tomorrow',
            link: link
          });
        }
      } catch (err) {
        console.log('Error parsing Amazon product:', err.message);
      }
    });

    console.log(`Amazon found ${products.length} products`);
    return products;
  } catch (error) {
    console.error('Amazon scraping error:', error.message);
    return [];
  }
};

// Flipkart scraper
const scrapeFlipkart = async (query) => {
  try {
    const searchUrl = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
    console.log('Scraping Flipkart:', searchUrl);
    
    const response = await axios.get(searchUrl, {
      headers: getHeaders(),
      timeout: 15000
    });

    const $ = cheerio.load(response.data);
    const products = [];

    // Multiple selectors for Flipkart products
    const productSelectors = [
      '._1AtVbE',
      '._13oc-S',
      '._2kHMtA',
      '[data-id]',
      '._1fQZEK'
    ];

    let productElements = $();
    for (const selector of productSelectors) {
      productElements = $(selector);
      if (productElements.length > 0) break;
    }

    productElements.slice(0, 5).each((index, element) => {
      try {
        const $element = $(element);
        
        // Title selectors
        const titleSelectors = [
          '._4rR01T',
          '.s1Q9rs',
          '.IRpwTa',
          '._2WkVRV',
          '.KzDlHZ'
        ];
        
        let title = '';
        for (const selector of titleSelectors) {
          title = $element.find(selector).first().text().trim();
          if (title) break;
        }

        // Price selectors
        const priceSelectors = [
          '._30jeq3',
          '._1_WHN1',
          '.Nx9bqj',
          '._3tbKJL'
        ];
        
        let price = '';
        for (const selector of priceSelectors) {
          price = $element.find(selector).first().text().trim();
          if (price) break;
        }

        // Link selectors
        const linkSelectors = [
          'a[href*="/p/"]',
          'a[href]',
          '._1fQZEK a'
        ];
        
        let link = '';
        for (const selector of linkSelectors) {
          const href = $element.find(selector).first().attr('href');
          if (href) {
            link = href.startsWith('http') ? href : `https://www.flipkart.com${href}`;
            break;
          }
        }

        if (title && price && link) {
          products.push({
            platform: 'Flipkart',
            title: cleanTitle(title),
            price: cleanPrice(price),
            delivery: 'Delivery in 2-3 days',
            link: link
          });
        }
      } catch (err) {
        console.log('Error parsing Flipkart product:', err.message);
      }
    });

    console.log(`Flipkart found ${products.length} products`);
    return products;
  } catch (error) {
    console.error('Flipkart scraping error:', error.message);
    return [];
  }
};

// Main search endpoint
app.get('/api/search', async (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  console.log(`\n🔍 Searching for: "${query}"`);
  
  try {
    // Run both scrapers in parallel with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 15000)
    );

    const [amazonResults, flipkartResults] = await Promise.allSettled([
      Promise.race([scrapeAmazon(query), timeoutPromise]),
      Promise.race([scrapeFlipkart(query), timeoutPromise])
    ]);

    // Combine results
    let allProducts = [];
    
    if (amazonResults.status === 'fulfilled') {
      allProducts = [...allProducts, ...amazonResults.value];
    } else {
      console.error('Amazon failed:', amazonResults.reason?.message);
    }
    
    if (flipkartResults.status === 'fulfilled') {
      allProducts = [...allProducts, ...flipkartResults.value];
    } else {
      console.error('Flipkart failed:', flipkartResults.reason?.message);
    }

    // If both failed
    if (allProducts.length === 0) {
      return res.status(500).json({ 
        error: 'Scraping failed for both platforms',
        message: 'Unable to fetch product data at the moment'
      });
    }

    // Sort by price (lowest first)
    allProducts.sort((a, b) => a.price - b.price);

    console.log(`✅ Total products found: ${allProducts.length}`);
    
    res.json(allProducts);
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Price scraper API is running'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'PriceRadar Scraper API',
    endpoints: {
      search: '/api/search?query=product+name',
      health: '/health'
    },
    example: '/api/search?query=iPhone+15'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PriceRadar Scraper API running on port ${PORT}`);
  console.log(`📡 Search endpoint: http://localhost:${PORT}/api/search?query=product+name`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;