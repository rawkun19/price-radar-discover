# PriceRadar Scraper API

Real-time price comparison scraper for Amazon India and Flipkart India.

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## 📡 API Endpoints

### Search Products
```
GET /api/search?query=product+name
```

**Example:**
```bash
curl "http://localhost:3000/api/search?query=iPhone+15"
```

**Response:**
```json
[
  {
    "platform": "Amazon",
    "title": "iPhone 15 (128GB, Midnight)",
    "price": 52999,
    "delivery": "Free delivery by tomorrow",
    "link": "https://amazon.in/product-page"
  },
  {
    "platform": "Flipkart", 
    "title": "iPhone 15 128GB – Flipkart",
    "price": 51999,
    "delivery": "Delivery in 2-3 days",
    "link": "https://flipkart.com/product-page"
  }
]
```

### Health Check
```
GET /health
```

## 🔧 Features

- ✅ Real-time scraping from Amazon India & Flipkart India
- ✅ Anti-bot protection with proper headers
- ✅ Fallback selectors for DOM changes
- ✅ 15-second timeout per platform
- ✅ Error handling & graceful failures
- ✅ Price sorting (lowest first)
- ✅ CORS enabled for frontend integration

## 🧪 Testing

Run the test suite:
```bash
npm test
```

This will test:
- Health endpoint
- Search functionality with sample queries
- Error handling

## 🌐 Frontend Integration

### Fetch from React/JavaScript:
```javascript
const searchProducts = async (query) => {
  try {
    const response = await fetch(`http://localhost:3000/api/search?query=${encodeURIComponent(query)}`);
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
};
```

### Update your existing frontend:
Replace the mock API call in `src/pages/Index.tsx`:

```javascript
// Replace this mock code:
await new Promise(resolve => setTimeout(resolve, 2000));

// With this real API call:
const response = await fetch(`http://localhost:3000/api/search?query=${encodeURIComponent(query)}`);
const apiResults = await response.json();

if (response.ok) {
  const formattedResults = apiResults.map((item, index) => ({
    id: (index + 1).toString(),
    platform: item.platform,
    platformLogo: item.platform === 'Amazon' ? '🛒' : '🛍️',
    title: item.title,
    price: item.price,
    deliveryTime: item.delivery,
    url: item.link,
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop',
    isLowestPrice: index === 0 // First item (lowest price)
  }));
  
  setResults(formattedResults);
} else {
  throw new Error(apiResults.error || 'Search failed');
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Railway
1. Connect your GitHub repo to Railway
2. Deploy automatically

### Render
1. Connect your GitHub repo to Render
2. Set build command: `npm install`
3. Set start command: `npm start`

## ⚠️ Important Notes

- This scraper is for educational purposes
- Respect robots.txt and rate limits
- Consider using official APIs when available
- Monitor for DOM structure changes
- Add request delays if needed

## 🔧 Troubleshooting

### Common Issues:

1. **No results found:**
   - Check if the websites are accessible
   - Verify DOM selectors are still valid
   - Check console logs for errors

2. **Timeout errors:**
   - Increase timeout in server.js
   - Check internet connection
   - Verify target websites are responsive

3. **CORS errors:**
   - Ensure CORS is enabled in server.js
   - Check frontend URL is allowed

## 📝 License

MIT License - see LICENSE file for details.