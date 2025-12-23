# ReviewHub API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All private endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (in development mode)"
}
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Register a new user or business account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "business" // Optional: "user" or "business", defaults to "user"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4f1a",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "business",
    "businessId": "60d5ec49f1b2c72b8c8e4f1b"
  }
}
```

**Notes:**
- When registering as a business, a business profile and trial subscription are automatically created
- Trial period is 14 days by default

---

### Login

**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d5ec49f1b2c72b8c8e4f1a",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "business",
    "businessId": "60d5ec49f1b2c72b8c8e4f1b"
  }
}
```

---

### Get Current User

**GET** `/auth/me`

Get currently authenticated user details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "business",
    "businessId": {
      "_id": "60d5ec49f1b2c72b8c8e4f1b",
      "name": "John Doe",
      "email": "john@example.com",
      ...
    },
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Business Endpoints

### Get All Businesses

**GET** `/businesses`

Get list of all businesses (Admin only).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1b",
      "name": "My Business",
      "email": "business@example.com",
      "website": "https://mybusiness.com",
      "ownerId": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      ...
    }
  ]
}
```

---

### Get Business

**GET** `/businesses/:id`

Get details of a specific business.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1b",
    "name": "My Business",
    "description": "A great business",
    "industry": "Technology",
    "website": "https://mybusiness.com",
    "email": "business@example.com",
    "phone": "+1234567890",
    "address": {
      "street": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "zipCode": "94105",
      "country": "USA"
    },
    "settings": {
      "allowPublicReviews": true,
      "requireApproval": false,
      "emailNotifications": true
    },
    "subscriptionId": { ... },
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Update Business

**PUT** `/businesses/:id`

Update business information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Updated Business Name",
  "description": "Updated description",
  "website": "https://newwebsite.com",
  "phone": "+1234567890",
  "address": {
    "street": "456 New St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "settings": {
    "allowPublicReviews": true,
    "requireApproval": true,
    "emailNotifications": true
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### Get Business Dashboard

**GET** `/businesses/:id/dashboard`

Get dashboard statistics and recent reviews for a business.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "business": { ... },
    "stats": {
      "totalReviews": 45,
      "approvedReviews": 40,
      "pendingReviews": 5,
      "averageRating": "4.5"
    },
    "recentReviews": [
      {
        "_id": "60d5ec49f1b2c72b8c8e4f1c",
        "customerName": "Jane Smith",
        "rating": 5,
        "title": "Great service!",
        "comment": "Excellent experience...",
        "status": "approved",
        "createdAt": "2024-01-20T15:30:00.000Z"
      }
    ]
  }
}
```

---

## Review Endpoints

### Create Review

**POST** `/reviews`

Submit a new review (Public endpoint - no authentication required).

**Request Body:**
```json
{
  "businessId": "60d5ec49f1b2c72b8c8e4f1b",
  "customerName": "Jane Smith",
  "customerEmail": "jane@example.com",
  "rating": 5,
  "title": "Great service!",
  "comment": "I had an excellent experience with this business."
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1c",
    "businessId": "60d5ec49f1b2c72b8c8e4f1b",
    "customerName": "Jane Smith",
    "customerEmail": "jane@example.com",
    "rating": 5,
    "title": "Great service!",
    "comment": "I had an excellent experience with this business.",
    "status": "approved",
    "isPublic": true,
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

---

### Get Business Reviews

**GET** `/reviews/business/:businessId?page=1&limit=10`

Get reviews for a specific business.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "60d5ec49f1b2c72b8c8e4f1c",
      "customerName": "Jane Smith",
      "rating": 5,
      "title": "Great service!",
      "comment": "Excellent experience...",
      "status": "approved",
      "response": {
        "text": "Thank you for your feedback!",
        "respondedAt": "2024-01-21T10:00:00.000Z"
      },
      "createdAt": "2024-01-20T15:30:00.000Z"
    }
  ]
}
```

**Notes:**
- Public users see only approved and public reviews
- Business owners see all their reviews

---

### Get Review

**GET** `/reviews/:id`

Get details of a specific review.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1c",
    "businessId": {
      "_id": "60d5ec49f1b2c72b8c8e4f1b",
      "name": "My Business"
    },
    "customerName": "Jane Smith",
    "customerEmail": "jane@example.com",
    "rating": 5,
    "title": "Great service!",
    "comment": "Excellent experience...",
    "status": "approved",
    "isPublic": true,
    "createdAt": "2024-01-20T15:30:00.000Z"
  }
}
```

---

### Update Review Status

**PUT** `/reviews/:id/status`

Update the status of a review (Business owner only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "approved" // "approved", "rejected", or "pending"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### Respond to Review

**POST** `/reviews/:id/respond`

Add a response to a review (Business owner only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "text": "Thank you for your feedback! We're glad you enjoyed our service."
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1c",
    ...
    "response": {
      "text": "Thank you for your feedback!...",
      "respondedBy": "60d5ec49f1b2c72b8c8e4f1a",
      "respondedAt": "2024-01-21T10:00:00.000Z"
    }
  }
}
```

---

### Delete Review

**DELETE** `/reviews/:id`

Delete a review (Business owner or Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {}
}
```

---

## Subscription Endpoints

### Get Subscription Plans

**GET** `/subscriptions/plans`

Get available subscription plans (Public endpoint).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "basic": {
      "monthly": {
        "price": 29,
        "maxReviews": 100,
        "maxUsers": 1,
        "analyticsAccess": false,
        "apiAccess": false,
        "prioritySupport": false
      },
      "yearly": {
        "price": 290,
        ...
      }
    },
    "pro": {
      "monthly": {
        "price": 79,
        "maxReviews": 1000,
        "maxUsers": 5,
        "analyticsAccess": true,
        "apiAccess": true,
        "prioritySupport": false
      },
      "yearly": { ... }
    },
    "enterprise": {
      "monthly": {
        "price": 199,
        "maxReviews": -1,
        "maxUsers": -1,
        "analyticsAccess": true,
        "apiAccess": true,
        "prioritySupport": true
      },
      "yearly": { ... }
    }
  }
}
```

---

### Get Business Subscription

**GET** `/subscriptions/business/:businessId`

Get subscription details for a business.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1d",
    "businessId": "60d5ec49f1b2c72b8c8e4f1b",
    "plan": "pro",
    "status": "active",
    "price": 79,
    "billingCycle": "monthly",
    "features": {
      "maxReviews": 1000,
      "maxUsers": 5,
      "analyticsAccess": true,
      "apiAccess": true,
      "prioritySupport": false
    },
    "currentPeriodStart": "2024-01-15T10:30:00.000Z",
    "currentPeriodEnd": "2024-02-15T10:30:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Create or Update Subscription

**POST** `/subscriptions`

Create a new subscription or update existing one.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "businessId": "60d5ec49f1b2c72b8c8e4f1b",
  "plan": "pro",
  "billingCycle": "monthly"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { ... }
}
```

---

### Cancel Subscription

**PUT** `/subscriptions/:id/cancel`

Cancel a subscription.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    ...
    "status": "canceled"
  }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Rate Limiting

Currently no rate limiting is implemented. For production use, consider adding rate limiting middleware.

---

## CORS

CORS is enabled for all origins in development. For production, configure specific origins in the server configuration.

---

## Webhooks

Webhooks are not currently implemented but could be added for:
- New review notifications
- Subscription changes
- Payment events

---

## Support

For API support, please contact support@reviewhub.com or open an issue on GitHub.
