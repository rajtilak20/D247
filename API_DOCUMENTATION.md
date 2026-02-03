# Deals247 API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

Admin endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Public Endpoints

### Health Check
```
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-03T...",
  "uptime": 123.45,
  "environment": "development"
}
```

---

### Get Deals
```
GET /deals
```
**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 12)
- `category` (string) - Category slug
- `store` (string) - Store slug
- `minDiscount` (number) - Minimum discount percentage
- `maxPrice` (number) - Maximum deal price
- `q` (string) - Search query (searches title and description)

**Example:**
```
GET /deals?page=1&limit=12&category=electronics&minDiscount=10
```

**Response:**
```json
{
  "deals": [
    {
      "id": 1,
      "title": "iPhone 15 Pro Max - 256GB",
      "slug": "iphone-15-pro-max-256gb",
      "storeId": 1,
      "shortDescription": "Latest iPhone...",
      "productImageUrl": "https://...",
      "affiliateUrl": "https://...",
      "couponCode": null,
      "originalPrice": 159900,
      "dealPrice": 144990,
      "currency": "INR",
      "discountPercent": 9.33,
      "isFeatured": true,
      "status": "PUBLISHED",
      "createdAt": "2026-02-03T...",
      "store": {
        "id": 1,
        "name": "Amazon",
        "slug": "amazon",
        "logoUrl": "..."
      },
      "dealCategories": [...],
      "dealTags": [...]
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 12,
  "totalPages": 3
}
```

---

### Get Single Deal
```
GET /deals/:idOrSlug
```
**Parameters:**
- `idOrSlug` - Deal ID (number) or slug (string)

**Example:**
```
GET /deals/iphone-15-pro-max-256gb
GET /deals/1
```

**Response:**
```json
{
  "id": 1,
  "title": "iPhone 15 Pro Max - 256GB",
  "slug": "iphone-15-pro-max-256gb",
  ...full deal data with relations
}
```

---

### Record Deal Click
```
POST /deals/:id/click
```
**Parameters:**
- `id` - Deal ID (number)

**Body (optional):**
```json
{
  "subId": "custom-tracking-id"
}
```

**Response:**
```json
{
  "success": true,
  "affiliateUrl": "https://amazon.in/..."
}
```

---

### Get Categories
```
GET /categories
```
**Response:**
```json
[
  {
    "id": 1,
    "name": "Electronics",
    "slug": "electronics",
    "parentId": null,
    "sortOrder": 1,
    "parent": null,
    "children": [
      {
        "id": 6,
        "name": "Smartphones",
        "slug": "smartphones",
        "parentId": 1,
        "sortOrder": 1
      }
    ]
  }
]
```

---

### Get Stores
```
GET /stores
```
**Query Parameters:**
- `status` (string) - Filter by status (ACTIVE/INACTIVE)

**Response:**
```json
[
  {
    "id": 1,
    "name": "Amazon",
    "slug": "amazon",
    "logoUrl": "https://...",
    "websiteUrl": "https://amazon.in",
    "affiliateProgramName": "Amazon Associates",
    "status": "ACTIVE",
    "createdAt": "2026-02-03T...",
    "updatedAt": "2026-02-03T..."
  }
]
```

---

## Admin Endpoints

All admin endpoints require authentication.

### Admin Login
```
POST /admin/auth/login
```
**Body:**
```json
{
  "email": "admin@deals247.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@deals247.com",
    "role": "ADMIN"
  }
}
```

---

### Get Current Admin
```
GET /admin/auth/me
```
**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "name": "Admin User",
  "email": "admin@deals247.com",
  "role": "ADMIN",
  "status": "ACTIVE",
  "lastLoginAt": "2026-02-03T...",
  "createdAt": "2026-02-03T...",
  "updatedAt": "2026-02-03T..."
}
```

---

### Get All Deals (Admin)
```
GET /admin/deals
```
Same query parameters as public `/deals` but can see all statuses.

**Query Parameters:**
- Same as public deals endpoint
- `status` (string) - Filter by status (DRAFT/PUBLISHED/EXPIRED/ARCHIVED)

---

### Create Deal
```
POST /admin/deals
```
**Body:**
```json
{
  "title": "Product Title",
  "slug": "product-title",
  "storeId": 1,
  "shortDescription": "Brief description",
  "longDescription": "<p>HTML description</p>",
  "productImageUrl": "https://...",
  "productUrl": "https://...",
  "affiliateUrl": "https://... (REQUIRED)",
  "couponCode": "SAVE20",
  "originalPrice": 1999,
  "dealPrice": 1599,
  "currency": "INR",
  "discountPercent": 20,
  "startsAt": "2026-02-03T00:00:00Z",
  "expiresAt": "2026-02-10T23:59:59Z",
  "status": "PUBLISHED",
  "isFeatured": true,
  "categoryIds": [1, 6],
  "tagIds": [1, 2]
}
```

**Response:** Complete deal object with relations

---

### Update Deal
```
PUT /admin/deals/:id
```
**Body:** Same as create, all fields optional

---

### Delete Deal
```
DELETE /admin/deals/:id
```
Soft deletes (sets status to ARCHIVED)

**Response:**
```json
{
  "success": true,
  "message": "Deal archived successfully"
}
```

---

### Create Store
```
POST /admin/stores
```
**Body:**
```json
{
  "name": "Store Name",
  "slug": "store-name",
  "websiteUrl": "https://store.com",
  "logoUrl": "https://...",
  "affiliateProgramName": "Program Name",
  "affiliateBaseUrl": "https://...",
  "status": "ACTIVE"
}
```

---

### Update Store
```
PUT /admin/stores/:id
```

---

### Delete Store
```
DELETE /admin/stores/:id
```

---

### Create Category
```
POST /admin/categories
```
**Body:**
```json
{
  "name": "Category Name",
  "slug": "category-name",
  "parentId": 1,  // optional, for subcategories
  "sortOrder": 10
}
```

---

### Update Category
```
PUT /admin/categories/:id
```

---

### Delete Category
```
DELETE /admin/categories/:id
```

---

### Create Tag
```
POST /admin/tags
```
**Body:**
```json
{
  "name": "Tag Name",
  "slug": "tag-name"
}
```

---

### Update Tag
```
PUT /admin/tags/:id
```

---

### Delete Tag
```
DELETE /admin/tags/:id
```

---

## Error Responses

**400 Bad Request:**
```json
{
  "status": "error",
  "message": "Missing required fields"
}
```

**401 Unauthorized:**
```json
{
  "status": "error",
  "message": "Invalid or expired token"
}
```

**403 Forbidden:**
```json
{
  "status": "error",
  "message": "Admin access required"
}
```

**404 Not Found:**
```json
{
  "status": "error",
  "message": "Deal not found"
}
```

**500 Internal Server Error:**
```json
{
  "status": "error",
  "message": "Something went wrong"
}
```

---

## Database Seeding

To populate the database with sample data:

```bash
npm run db:seed
```

This creates:
- 1 admin user (admin@deals247.com / admin123)
- 5 stores (Amazon, Flipkart, Myntra, Ajio, Croma)
- 5 main categories + 4 subcategories
- 4 tags
- 5 sample deals

---

## Testing with cURL

**Get deals:**
```bash
curl http://localhost:3000/api/deals
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@deals247.com","password":"admin123"}'
```

**Create deal (with token):**
```bash
curl -X POST http://localhost:3000/api/admin/deals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{...deal data...}'
```
