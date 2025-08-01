
# Ajio Backend Server

This repository contains the backend server for the Ajio e-commerce application. It handles user authentication, product management, cart operations, order processing, and more.

## Features

- User Authentication (Signup, Login, Google OAuth)
- Product Management (CRUD operations for products)
- Shopping Cart Functionality
- Wishlist Management
- Order Processing
- Admin Panel for managing users and products
- RESTful API

## Technologies Used

- Node.js
- Express.js
- MongoDB (via Mongoose)
- JWT for authentication
- bcrypt for password hashing

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/Ajio-backend.git
    ```
2.  **Navigate to the server directory:**
    ```bash
    cd Ajio-backend/server
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Create a `.env` file in the `server` directory with the following variables:**
    ```
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    ```
5.  **Start the server:**
    ```bash
    npm start
    ```

## API Endpoints

Base URL: `http://localhost:5000/api` (or your configured PORT)

### Authentication

-   `POST /api/auth/register` - Register a new user
-   `POST /api/auth/login` - Login a user
-   `GET /api/auth/google` - Initiate Google OAuth login
-   `GET /api/auth/google/callback` - Google OAuth callback

### Products

-   `GET /api/products` - Get all products
-   `GET /api/products/:id` - Get a single product by ID
-   `POST /api/products` - Add a new product (Admin only)
-   `PUT /api/products/:id` - Update a product by ID (Admin only)
-   `DELETE /api/products/:id` - Delete a product by ID (Admin only)

### Cart

-   `GET /api/cart` - Get user's cart
-   `POST /api/cart` - Add item to cart
-   `PUT /api/cart/:id` - Update cart item quantity
-   `DELETE /api/cart/:id` - Remove item from cart

### Wishlist

-   `GET /api/wishlist` - Get user's wishlist
-   `POST /api/wishlist` - Add item to wishlist
-   `DELETE /api/wishlist/:id` - Remove item from wishlist

### Orders

-   `GET /api/orders` - Get user's orders
-   `POST /api/orders` - Create a new order

### Admin

-   `GET /api/admin/users` - Get all users
-   `PUT /api/admin/users/:id` - Update user details
-   `DELETE /api/admin/users/:id` - Delete a user

## Database Schema

### User Model

```javascript
{
  username: String,
  email: String,
  password: String,
  isAdmin: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model

```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  imageUrl: String,
  stock: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Model

```javascript
{
  userId: ObjectId,
  products: [
    {
      productId: ObjectId,
      quantity: Number
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model

```javascript
{
  userId: ObjectId,
  products: [
    {
      productId: ObjectId,
      quantity: Number
    }
  ],
  amount: Number,
  address: Object,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Address Model

```javascript
{
  userId: ObjectId,
  street: String,
  city: String,
  state: String,
  zip: String,
  country: String,
  createdAt: Date,
  updatedAt: Date
}
```
