const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

class AIStoreManager {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;
    this.automationPath = path.join(__dirname, '../automation');
    
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.static('dashboard'));
    
    // CORS for development
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
  }

  setupRoutes() {
    // Dashboard
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'dashboard/index.html'));
    });

    // AI Manager API
    this.app.get('/api/status', (req, res) => {
      res.json({
        status: 'running',
        timestamp: new Date().toISOString(),
        services: {
          automation: this.checkAutomationService(),
          shopify: this.checkShopifyConnection(),
          cj: this.checkCJConnection()
        }
      });
    });

    // Upload hoodies automation
    this.app.post('/api/upload-hoodies', async (req, res) => {
      try {
        const { count = 10, mode = 'demo' } = req.body;
        
        console.log(`🚀 AI Manager: Starting hoodie upload (${mode} mode, ${count} products)`);
        
        const command = mode === 'demo' 
          ? 'npm run demo'
          : 'npm run upload-hoodies';
        
        const result = await this.runAutomationCommand(command);
        
        res.json({
          success: true,
          mode,
          count,
          message: `Successfully processed ${count} hoodies`,
          output: result,
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        console.error('❌ Upload failed:', error.message);
        res.status(500).json({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Test connections
    this.app.get('/api/test-connections', async (req, res) => {
      try {
        const result = await this.runAutomationCommand('npm run test');
        res.json({
          success: true,
          output: result,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Get automation logs
    this.app.get('/api/logs', (req, res) => {
      try {
        const logsPath = path.join(this.automationPath, 'logs');
        const logFiles = ['automation.log', 'errors.log'].map(file => {
          const filePath = path.join(logsPath, file);
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            return {
              file,
              content: content.split('\n').slice(-50).join('\n') // Last 50 lines
            };
          }
          return { file, content: 'No logs found' };
        });

        res.json({
          success: true,
          logs: logFiles,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    });

    // AI Chat Interface (placeholder)
    this.app.post('/api/chat', (req, res) => {
      const { message } = req.body;
      
      // Simple AI responses for common requests
      const responses = {
        'upload hoodies': 'I can help you upload hoodies! Use the upload-hoodies endpoint or run the demo mode first.',
        'test connections': 'Let me test your API connections. Check the test-connections endpoint.',
        'show status': 'All systems are running normally. Check the status endpoint for details.',
        'help': 'I can help you with: uploading products, testing connections, viewing logs, and store management.'
      };
      
      const response = responses[message.toLowerCase()] || 
                      'I understand you want to manage your store. What specific task would you like to perform?';
      
      res.json({
        success: true,
        response,
        timestamp: new Date().toISOString()
      });
    });
  }

  async runAutomationCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, { 
        cwd: this.automationPath,
        timeout: 300000 // 5 minutes
      }, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Command failed: ${error.message}`));
          return;
        }
        
        resolve({
          stdout: stdout.toString(),
          stderr: stderr.toString()
        });
      });
    });
  }

  checkAutomationService() {
    const packageJsonPath = path.join(this.automationPath, 'package.json');
    return fs.existsSync(packageJsonPath) ? 'available' : 'unavailable';
  }

  checkShopifyConnection() {
    return process.env.SHOPIFY_ACCESS_TOKEN ? 'configured' : 'not_configured';
  }

  checkCJConnection() {
    return process.env.CJ_EMAIL && process.env.CJ_PASSWORD ? 'configured' : 'not_configured';
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`🤖 AI Store Manager running on http://localhost:${this.port}`);
      console.log(`📊 Dashboard: http://localhost:${this.port}`);
      console.log(`🔧 API: http://localhost:${this.port}/api/status`);
      console.log('');
      console.log('🚀 Available Commands:');
      console.log('   • POST /api/upload-hoodies - Upload hoodies to Shopify');
      console.log('   • GET /api/test-connections - Test API connections');
      console.log('   • GET /api/logs - View automation logs');
      console.log('   • POST /api/chat - AI chat interface');
    });
  }
}

// Start the AI Manager if run directly
if (require.main === module) {
  const manager = new AIStoreManager();
  manager.start();
}

module.exports = AIStoreManager;