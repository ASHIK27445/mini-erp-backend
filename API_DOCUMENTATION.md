# API Documentation (Backend)

Base URL: `/api/v1`

Authentication
- The API uses JWT tokens. Include `Authorization: Bearer <token>` header for protected endpoints.

Endpoints

## Auth
- `POST /api/v1/auth/login` — login (returns token)
- `POST /api/v1/auth/register` — create user (admin/manager only as configured)

## Products
- `GET /api/v1/products` — list products (query: `searchTerm`, `page`, `limit`)
- `POST /api/v1/products` — create product
  - Body: JSON with `name, sku, category, purchasePrice, sellingPrice, stockQuantity, image` (image is URL)
  - Requires role: `admin` or `manager`
- `PATCH /api/v1/products/:id` — update product
- `DELETE /api/v1/products/:id` — delete product

## Sales
- `GET /api/v1/sales` — list sales
- `POST /api/v1/sales` — create sale
  - Body: `{ items: [{ product: productId, quantity }] }`

## Dashboard
- `GET /api/v1/dashboard` — aggregated stats for admin/manager (total products, total sales, low stock list)

Data shapes

### Product
```
{
  _id: string,
  name: string,
  sku: string,
  category: string,
  purchasePrice: number,
  sellingPrice: number,
  stockQuantity: number,
  image: string (url),
  createdAt: string
}
```

### Sale
```
{
  _id: string,
  items: [
    { product: string | Product, productSnapshot?: { _id, name, sku, sellingPrice }, quantity: number, priceAtSale: number }
  ],
  grandTotal: number,
  soldBy: { name: string, role: string },
  createdAt: string
}
```

Errors
- API uses standard HTTP status codes and a JSON envelope. Example error response:
```
{ success: false, message: "Description", data: null }
```

Notes
- Image upload is currently client-side to ImgBB; backend expects `image` or `imageUrl` fields in product create/update payloads.
- For any breaking changes, consult the `server/src/modules` route handlers.
