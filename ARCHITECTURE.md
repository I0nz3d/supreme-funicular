# ReviewHub System Architecture

## Overview

ReviewHub is a full-stack SaaS application built with Node.js, Express, MongoDB, and vanilla JavaScript for the frontend.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          Client Layer                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │  Landing Page    │  │  Business        │  │  Review      │  │
│  │  (index.html)    │  │  Dashboard       │  │  Form        │  │
│  │                  │  │                  │  │              │  │
│  │  - Features      │  │  - Stats         │  │  - Rating    │  │
│  │  - Pricing       │  │  - Reviews       │  │  - Comment   │  │
│  │  - Auth Modals   │  │  - Management    │  │  - Submit    │  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
│             │                    │                    │          │
│             └────────────────────┴────────────────────┘          │
│                                  │                                │
└──────────────────────────────────┼────────────────────────────────┘
                                   │
                                   │ HTTP/HTTPS
                                   │
┌──────────────────────────────────▼────────────────────────────────┐
│                          API Layer (Express)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Middleware Layer                          │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │  • CORS               • Body Parser      • Static Files     │ │
│  │  • Authentication     • Error Handler    • Route Protection │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Auth Routes  │  │ Business     │  │ Review       │          │
│  │              │  │ Routes       │  │ Routes       │          │
│  │ /api/auth    │  │ /api/        │  │ /api/reviews │          │
│  │              │  │ businesses   │  │              │          │
│  │ • Register   │  │              │  │ • Create     │          │
│  │ • Login      │  │ • Get        │  │ • Get List   │          │
│  │ • Get Me     │  │ • Update     │  │ • Update     │          │
│  │              │  │ • Dashboard  │  │ • Respond    │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         └──────────────────┴──────────────────┘                   │
│                            │                                      │
│  ┌─────────────────────────▼───────────────────────────────────┐ │
│  │                   Controllers Layer                          │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │  • authController      • reviewController                   │ │
│  │  • businessController  • subscriptionController             │ │
│  └─────────────────────────┬───────────────────────────────────┘ │
│                            │                                      │
└────────────────────────────┼──────────────────────────────────────┘
                             │
                             │
┌────────────────────────────▼──────────────────────────────────────┐
│                      Data Layer (MongoDB)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ User Model   │  │ Business     │  │ Review       │          │
│  │              │  │ Model        │  │ Model        │          │
│  │ • email      │  │              │  │              │          │
│  │ • password   │  │ • name       │  │ • rating     │          │
│  │ • name       │  │ • email      │  │ • comment    │          │
│  │ • role       │  │ • settings   │  │ • status     │          │
│  │ • businessId │  │ • ownerId    │  │ • businessId │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌──────────────┐                                                │
│  │ Subscription │                                                │
│  │ Model        │                                                │
│  │              │                                                │
│  │ • plan       │                                                │
│  │ • status     │                                                │
│  │ • price      │                                                │
│  │ • features   │                                                │
│  │ • businessId │                                                │
│  └──────────────┘                                                │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Client Layer
- **Technology**: HTML5, CSS3, Vanilla JavaScript
- **Components**:
  - Landing page with features and pricing
  - Business registration and login modals
  - Business dashboard (stats and recent reviews)
  - Public review submission form

### 2. API Layer
- **Technology**: Node.js, Express.js
- **Key Features**:
  - RESTful API endpoints
  - JWT-based authentication
  - Role-based authorization
  - Error handling middleware
  - CORS support

### 3. Controllers
- **authController**: User registration, login, token management
- **businessController**: Business CRUD operations, dashboard stats
- **reviewController**: Review submission, moderation, responses
- **subscriptionController**: Plan management, subscription CRUD

### 4. Data Models
- **User**: Authentication and profile information
- **Business**: Business profile and settings
- **Review**: Customer reviews and ratings
- **Subscription**: Plan details and billing information

## Data Flow Examples

### Example 1: User Registration Flow
```
1. User fills registration form → Frontend
2. POST /api/auth/register → API Layer
3. authController.register() → Controller
4. User.create() → Database
5. Business.create() (if business role) → Database
6. Subscription.create() (trial) → Database
7. JWT token generated → Controller
8. Response with token → Frontend
9. Store token in localStorage → Frontend
```

### Example 2: Review Submission Flow
```
1. Customer fills review form → Frontend
2. POST /api/reviews → API Layer
3. reviewController.createReview() → Controller
4. Validate business exists → Database
5. Check business settings → Database
6. Review.create() → Database
7. Response with review → Frontend
8. Display success message → Frontend
```

### Example 3: Business Dashboard Flow
```
1. Business owner logs in → Frontend
2. GET /api/businesses/:id/dashboard → API Layer
3. JWT verification → Middleware
4. businessController.getDashboard() → Controller
5. Aggregate review stats → Database
6. Fetch recent reviews → Database
7. Response with dashboard data → Frontend
8. Display stats and reviews → Frontend
```

## Security Architecture

### Authentication
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens for session management
- Token expiration (7 days default)

### Authorization
- Role-based access control (user, business, admin)
- Route protection middleware
- Owner verification for business operations

### Data Validation
- Schema-level validation (Mongoose)
- Controller-level validation
- Input sanitization

## Scalability Considerations

### Current Implementation
- Single server architecture
- MongoDB for persistence
- Session-based authentication with JWT

### Future Improvements
- Load balancing for multiple server instances
- Redis for session caching
- CDN for static assets
- Database read replicas
- Rate limiting
- API versioning

## Deployment Architecture

```
┌─────────────────────────────────────────────┐
│             Load Balancer (Optional)         │
└──────────────────┬──────────────────────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
┌──────▼──────┐       ┌───────▼──────┐
│  App Server │       │  App Server  │
│  (Node.js)  │       │  (Node.js)   │
└──────┬──────┘       └───────┬──────┘
       │                      │
       └──────────┬───────────┘
                  │
        ┌─────────▼─────────┐
        │   MongoDB Atlas   │
        │   or Local DB     │
        └───────────────────┘
```

## Technology Stack Summary

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcryptjs for password hashing

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Responsive design, flexbox, grid
- **JavaScript**: Vanilla JS (no framework)
- **API Communication**: Fetch API

### Development Tools
- **Package Manager**: npm
- **Environment**: dotenv for configuration
- **Development Server**: nodemon for auto-reload

## API Design Principles

1. **RESTful**: Standard HTTP methods and status codes
2. **Consistent**: Uniform response format
3. **Versioned**: Ready for API versioning
4. **Secure**: Authentication and authorization
5. **Documented**: Comprehensive API documentation

## Database Schema Design

### Relationships
- User → Business (one-to-one for business owners)
- Business → Subscription (one-to-one)
- Business → Reviews (one-to-many)
- User → Business → Reviews (for review responses)

### Indexes
- Email indexes on User and Business models
- businessId indexes on Review model
- Compound indexes for review queries

## Performance Optimizations

1. **Database Indexes**: Fast query performance
2. **Pagination**: Limit data transfer
3. **Selective Population**: Load only needed relations
4. **Lean Queries**: Return plain objects when possible
5. **Connection Pooling**: Mongoose default pooling

## Monitoring & Logging

Current implementation:
- Console logging for development
- Error logging to console

Recommended additions:
- Winston or Bunyan for structured logging
- Application monitoring (PM2, New Relic)
- Database query monitoring
- Error tracking (Sentry)

## Future Architecture Enhancements

1. **Microservices**: Split into dedicated services
2. **Message Queue**: Async task processing (Bull/Redis)
3. **Caching Layer**: Redis for frequently accessed data
4. **Search**: Elasticsearch for advanced review search
5. **File Storage**: S3 for business logos and media
6. **Analytics**: Dedicated analytics pipeline
7. **Real-time**: WebSocket for live updates
