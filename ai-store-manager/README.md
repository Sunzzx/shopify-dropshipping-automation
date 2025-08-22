# AI Store Manager

AI-powered Shopify store management and automation system for the CJ Dropshipping automation suite.

## Overview

The AI Store Manager provides an intelligent web-based dashboard for managing your Shopify store automation, including:

- **Real-time monitoring** of automation scripts
- **Smart product upload** with AI-optimized SEO
- **Connection testing** for CJ Dropshipping and Shopify APIs
- **Automated logging** and error tracking
- **Interactive dashboard** for store management

## Features

- 🤖 AI-powered store automation
- 📊 Real-time status monitoring
- 🔧 Connection testing and validation
- 📋 Comprehensive logging system
- 🎯 SEO-optimized product uploads
- 💬 Interactive chat interface

## Quick Start

```bash
# Install dependencies
npm install

# Start the AI manager
npm start

# Development mode with auto-reload
npm run dev
```

## API Endpoints

- `GET /` - Main dashboard interface
- `GET /api/status` - Service status and health check
- `POST /api/upload-hoodies` - Upload hoodies with AI optimization
- `GET /api/test-connections` - Test API connections
- `GET /api/logs` - Retrieve automation logs

## Configuration

The AI Store Manager requires the same environment variables as the main automation system:

```env
SHOPIFY_SHOP_DOMAIN=your-shop.myshopify.com
SHOPIFY_ACCESS_TOKEN=your_access_token
CJ_EMAIL=your_cj_email
CJ_PASSWORD=your_cj_password
```

## Usage

1. Start the AI manager: `npm start`
2. Open your browser to `http://localhost:3001`
3. Use the dashboard to monitor and control your store automation
4. Upload products, test connections, and view logs through the web interface

## Dependencies

- Express.js - Web server framework
- CORS - Cross-origin resource sharing
- Helmet - Security middleware
- dotenv - Environment variable management

## License

MIT License - see the main project LICENSE.md for details.
