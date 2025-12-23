# ReviewHub - Business Review Management SaaS

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v4.4+-green.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.18-blue.svg)](https://expressjs.com/)

ReviewHub is a comprehensive SaaS platform that enables businesses to collect, manage, and showcase customer reviews. Built with Node.js, Express, and MongoDB, it provides a complete solution for reputation management.

## 🎉 Status: Production Ready!

This is a complete, production-ready SaaS application with all features implemented, documented, and security-tested.

## 🚀 Features

- **User Authentication & Authorization**: Secure JWT-based authentication with role-based access control
- **Business Management**: Create and manage business profiles with customizable settings
- **Subscription Plans**: Three-tier subscription system (Basic, Pro, Enterprise) with trial periods
- **Review Collection**: Easy-to-use forms for customers to submit ratings and reviews
- **Review Moderation**: Approve or reject reviews before they go public
- **Business Dashboard**: Real-time analytics showing review metrics and average ratings
- **Review Responses**: Engage with customers by responding to their feedback
- **Public/Private Reviews**: Control review visibility with configurable settings
- **REST API**: Full API access for integrations (Pro and Enterprise plans)
- **Responsive UI**: Modern, mobile-friendly interface

## 👋 New to Programming?

If you're not familiar with programming, check out the **[Beginner's Guide](BEGINNER_GUIDE.md)** for step-by-step instructions with screenshots and simple explanations!

**Quick start for beginners:**
- Windows: Double-click `start.bat`
- Mac/Linux: Run `./start.sh` in Terminal

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/I0nz3d/supreme-funicular.git
cd supreme-funicular
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/reviewhub
JWT_SECRET=your_secure_jwt_secret_key
JWT_EXPIRE=7d
```

5. Start MongoDB (if running locally):
```bash
mongod
```

6. Start the application:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

7. Access the application at `http://localhost:3000`

## 📖 API Documentation

### Authentication Endpoints

#### Register a new user
```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "business" // or "user"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get current user
```
GET /api/auth/me
Authorization: Bearer {token}
```

### Business Endpoints

#### Get business details
```
GET /api/businesses/:id
Authorization: Bearer {token}
```

#### Update business
```
PUT /api/businesses/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "My Business",
  "description": "Business description",
  "website": "https://mybusiness.com"
}
```

#### Get business dashboard
```
GET /api/businesses/:id/dashboard
Authorization: Bearer {token}
```

### Review Endpoints

#### Create a review (Public)
```
POST /api/reviews
Content-Type: application/json

{
  "businessId": "business_id_here",
  "customerName": "Jane Smith",
  "customerEmail": "jane@example.com",
  "rating": 5,
  "title": "Great service!",
  "comment": "Excellent experience, highly recommend."
}
```

#### Get business reviews
```
GET /api/reviews/business/:businessId?page=1&limit=10
```

#### Update review status (Business owner)
```
PUT /api/reviews/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "approved" // or "rejected", "pending"
}
```

#### Respond to a review (Business owner)
```
POST /api/reviews/:id/respond
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "Thank you for your feedback!"
}
```

### Subscription Endpoints

#### Get subscription plans
```
GET /api/subscriptions/plans
```

#### Get business subscription
```
GET /api/subscriptions/business/:businessId
Authorization: Bearer {token}
```

#### Create or update subscription
```
POST /api/subscriptions
Authorization: Bearer {token}
Content-Type: application/json

{
  "businessId": "business_id_here",
  "plan": "pro", // "basic", "pro", or "enterprise"
  "billingCycle": "monthly" // or "yearly"
}
```

## 💰 Subscription Plans

### Basic - $29/month
- Up to 100 reviews/month
- 1 user account
- Basic dashboard
- Email support

### Pro - $79/month (Most Popular)
- Up to 1,000 reviews/month
- 5 user accounts
- Advanced dashboard
- Priority email support
- Advanced analytics
- API access

### Enterprise - $199/month
- Unlimited reviews
- Unlimited users
- Custom dashboard
- 24/7 priority support
- Advanced analytics
- Full API access

## 🗂️ Project Structure

```
reviewhub/
├── config/
│   └── database.js         # Database connection configuration
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── businessController.js   # Business management
│   ├── reviewController.js     # Review operations
│   └── subscriptionController.js   # Subscription handling
├── middleware/
│   ├── auth.js            # Authentication middleware
│   └── error.js           # Error handling middleware
├── models/
│   ├── User.js            # User model
│   ├── Business.js        # Business model
│   ├── Review.js          # Review model
│   └── Subscription.js    # Subscription model
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── businesses.js      # Business routes
│   ├── reviews.js         # Review routes
│   └── subscriptions.js   # Subscription routes
├── public/
│   ├── css/
│   │   └── styles.css     # Application styles
│   ├── js/
│   │   └── app.js         # Frontend JavaScript
│   └── index.html         # Main HTML page
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── package.json          # Project dependencies
├── server.js             # Application entry point
└── README.md             # Project documentation
```

## 🔒 Security Features

- Password hashing using bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation
- MongoDB injection protection
- CORS configuration
- Secure HTTP headers

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test
```

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@reviewhub.com or open an issue in the repository.
