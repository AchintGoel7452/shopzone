# 🛒 ShopZone — Full-Stack E-Commerce Platform

A complete, production-ready e-commerce web application with customer shopping, seller business accounts, and admin management.

---

## 🏗️ Tech Stack

| Layer        | Technology                              |
|-------------|------------------------------------------|
| **Backend**  | Spring Boot 3.2, Spring Security, JWT   |
| **Database** | MySQL 8.0, Spring Data JPA / Hibernate  |
| **Frontend** | React.js 18, Bootstrap 5, JavaScript    |
| **Auth**     | JWT Tokens (Role-based: CUSTOMER/SELLER/ADMIN) |
| **Files**    | Multipart image upload                  |

---

## 📁 Project Structure

```
shopzone/
├── backend/                    # Spring Boot Java Application
│   ├── pom.xml
│   └── src/main/java/com/shopzone/
│       ├── entity/             # JPA Entities (User, Product, Order, etc.)
│       ├── repository/         # Spring Data JPA Repositories
│       ├── service/            # Business Logic
│       ├── controller/         # REST API Controllers
│       ├── dto/                # Data Transfer Objects
│       ├── security/           # JWT Auth, Security Filters
│       └── config/             # Security & CORS Config
│
├── frontend/                   # React.js Application
│   └── src/
│       ├── pages/              # Page Components
│       │   ├── Home.js
│       │   ├── Login.js
│       │   ├── Register.js
│       │   ├── RegisterSeller.js
│       │   ├── ProductList.js
│       │   ├── ProductDetail.js  # With Specs, Warranty tabs
│       │   ├── Cart.js
│       │   ├── Checkout.js
│       │   ├── Orders.js
│       │   └── seller/
│       │       ├── SellerDashboard.js
│       │       ├── AddProduct.js    # Full product form
│       │       ├── EditProduct.js
│       │       └── SellerProducts.js
│       ├── components/         # Reusable Components
│       ├── context/            # Auth & Cart Context
│       └── services/           # API calls (Axios)
│
└── database/
    └── schema.sql              # Complete MySQL schema + seed data
```

---

## 🚀 Setup Instructions

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+

---

### Step 1: Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source /path/to/shopzone/database/schema.sql
```

---

### Step 2: Backend Setup

```bash
cd shopzone/backend

# Edit database credentials in:
# src/main/resources/application.properties
# Change: spring.datasource.password=your_password_here

# Run the application
mvn spring-boot:run

# Backend starts at: http://localhost:8080
```

---

### Step 3: Frontend Setup

```bash
cd shopzone/frontend

# Install dependencies
npm install

# Start development server
npm start

# Frontend starts at: http://localhost:3000
```

---

## 🔑 Default Credentials

| Role  | Email                 | Password  |
|-------|-----------------------|-----------|
| Admin | admin@shopzone.com    | Admin@123 |

---

## 🌐 REST API Endpoints

### Auth
```
POST /api/auth/register         → Customer registration
POST /api/auth/register/seller  → Seller registration  
POST /api/auth/login            → Login (returns JWT)
```

### Products (Public)
```
GET  /api/products              → Get all products (paginated)
GET  /api/products/{id}         → Get single product
GET  /api/products/search       → Search products (?keyword=&categoryId=)
GET  /api/categories            → Get all categories
```

### Seller (Requires SELLER role JWT)
```
GET    /api/seller/products          → Get seller's products
POST   /api/seller/products          → Create product (multipart/form-data)
PUT    /api/seller/products/{id}     → Update product
DELETE /api/seller/products/{id}     → Delete product
```

### Orders (Requires auth)
```
POST /api/orders      → Place order
GET  /api/orders      → Get user's orders
GET  /api/orders/{id} → Get single order
```

---

## ✨ Features

### Customer Features
- ✅ Customer sign up / sign in
- ✅ Browse products by category
- ✅ Search products by keyword
- ✅ View product details with specifications
- ✅ Warranty & Guarantee information tabs
- ✅ Product rating and reviews display
- ✅ Add to cart / manage cart
- ✅ Checkout and order placement
- ✅ View order history

### Seller / Business Features
- ✅ Dedicated seller account registration
- ✅ Seller dashboard with stats
- ✅ Add products with full details:
  - Name, Description, Category
  - Price & Original Price (for discount display)
  - Stock Quantity
  - Brand, Model, Color, Size, Weight, Dimensions
  - Technical Specifications (free text)
  - **Warranty Period**
  - **Guarantee / Return Policy**
  - **Warranty Terms & Conditions**
  - Multiple product image uploads
- ✅ Edit and update listings
- ✅ Remove / deactivate products
- ✅ View all my listings

### Security
- ✅ JWT authentication (stateless)
- ✅ Role-based access control (CUSTOMER, SELLER, ADMIN)
- ✅ BCrypt password hashing
- ✅ CORS configured for frontend

---

## 📱 Pages

| Page                  | URL                          | Access       |
|-----------------------|------------------------------|--------------|
| Home                  | /                            | Public       |
| Product Listing       | /products                    | Public       |
| Product Detail        | /products/:id                | Public       |
| Cart                  | /cart                        | Public       |
| Login                 | /login                       | Public       |
| Customer Register     | /register                    | Public       |
| Seller Register       | /register/seller             | Public       |
| Checkout              | /checkout                    | Customer     |
| My Orders             | /orders                      | Customer     |
| My Profile            | /profile                     | Customer     |
| Seller Dashboard      | /seller                      | Seller       |
| Add Product           | /seller/products/add         | Seller       |
| My Products           | /seller/products             | Seller       |
| Edit Product          | /seller/products/edit/:id    | Seller       |

---

## 🔧 Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/shopzone_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
jwt.secret=YourSecretKey
file.upload-dir=./uploads
```
