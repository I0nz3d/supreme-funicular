#!/usr/bin/env node

/**
 * ReviewHub Setup Script
 * Helps initialize the ReviewHub application
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('🚀 ReviewHub Setup Wizard\n');
  console.log('This wizard will help you set up your ReviewHub installation.\n');

  // Check if .env already exists
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const overwrite = await question('.env file already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }

  console.log('\n📝 Configuration\n');

  // Get configuration
  const port = await question('Server port (default: 3000): ') || '3000';
  const mongoUri = await question('MongoDB URI (default: mongodb://localhost:27017/reviewhub): ') || 'mongodb://localhost:27017/reviewhub';
  
  // Generate random JWT secret
  const jwtSecret = require('crypto').randomBytes(32).toString('hex');
  console.log(`Generated JWT Secret: ${jwtSecret.substring(0, 20)}...`);
  
  const jwtExpire = await question('JWT token expiry (default: 7d): ') || '7d';

  // Create .env file
  const envContent = `# Server Configuration
PORT=${port}
NODE_ENV=development

# Database
MONGODB_URI=${mongoUri}

# JWT Authentication
JWT_SECRET=${jwtSecret}
JWT_EXPIRE=${jwtExpire}

# Stripe Payment (for subscriptions)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Email Configuration (for notifications)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
EMAIL_FROM=noreply@reviewhub.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3001
`;

  fs.writeFileSync(envPath, envContent);
  console.log('\n✅ .env file created successfully!\n');

  console.log('📦 Next Steps:\n');
  console.log('1. Make sure MongoDB is running');
  console.log('2. Install dependencies: npm install');
  console.log('3. Start the server: npm start');
  console.log('4. Access the application at: http://localhost:' + port + '\n');

  console.log('💡 Optional:\n');
  console.log('- Update Stripe keys in .env for payment processing');
  console.log('- Configure email settings for notifications\n');

  rl.close();
}

setup().catch(error => {
  console.error('Error during setup:', error);
  rl.close();
  process.exit(1);
});
