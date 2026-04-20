# Rise Stock — E-Commerce API Documentation

This document describes every API endpoint available for the Astro e-commerce frontend. All routes live under `/api/clients/*` and `/api/products/*` on the Next.js backend.

---

## Base URL

```
http://localhost:3000          (development)
https://your-production-domain (production)
```

Set this as an environment variable in your Astro project:

```env
PUBLIC_API_URL=http://localhost:3000
```

---

## Authentication

All protected endpoints require a **Bearer JWT access token** in the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

### Token lifecycle

| Token          | Expiry     | Purpose                                 |
| -------------- | ---------- | --------------------------------------- |
| `accessToken`  | 15 minutes | Sent with every protected request       |
| `refreshToken` | 30 days    | Used only to obtain a new `accessToken` |

**Flow:**

1. Login → receive `accessToken` + `refreshToken`
2. Store both securely (e.g., `localStorage` or cookies)
3. On any `401` response → call `/api/clients/auth/refresh` with `refreshToken`
4. Replace stored `accessToken` with the new one and retry the request
5. If refresh also returns `401` → session expired, redirect to login

---

## Response Format

All endpoints return a consistent shape:

```ts
// Success
{ ok: true, data: { ... } }
{ ok: true, data: { ..., pagination: { page, pageSize, total, totalPages } } }
{ ok: true, message: "..." }

// Error
{ ok: false, message: "Human-readable error message" }
```

---

## Status Codes

| Code  | Meaning                                                         |
| ----- | --------------------------------------------------------------- |
| `200` | OK                                                              |
| `201` | Created                                                         |
| `204` | No content (OPTIONS preflight)                                  |
| `400` | Validation error                                                |
| `401` | Not authenticated or wrong credentials                          |
| `403` | Authenticated but forbidden (e.g. account not confirmed)        |
| `404` | Resource not found                                              |
| `409` | Conflict (e.g. email already registered)                        |
| `422` | Business logic error (e.g. out of stock, invalid discount code) |
| `500` | Internal server error                                           |

---

## Public Endpoints (no auth required)

### Get all products

```
GET /api/products
GET /api/products?collection=Verano,Básicos
```

**Query params:**

- `collection` — comma-separated collection names to filter

**Response `200`:**

```json
[
  {
    "id": "uuid",
    "design": "Camiseta Oversize",
    "color": "Blanco",
    "description": "...",
    "price": 80000,
    "discount": 1,
    "isActive": true,
    "collectionId": "uuid",
    "collection": { "id": "uuid", "name": "Verano", "createdAt": "..." },
    "variants": [
      {
        "id": "uuid",
        "size": "S",
        "stock": 10,
        "clothesId": "uuid",
        "createdAt": "..."
      },
      {
        "id": "uuid",
        "size": "M",
        "stock": 5,
        "clothesId": "uuid",
        "createdAt": "..."
      }
    ],
    "clothesImage": [
      {
        "id": "uuid",
        "secureUrl": "https://res.cloudinary.com/...",
        "publicId": "...",
        "clothesId": "uuid"
      }
    ]
  }
]
```

> Note: `discount` is a multiplier. `1` = no discount. `0.8` = 20% off. Display price = `price * discount`.

---

### Get single product

```
GET /api/products/:id
```

**Response `200`:** Same shape as a single item from the list above.

---

## Auth Endpoints

### Register

```
POST /api/clients/auth/register
Content-Type: application/json
```

**Body:**

```json
{
  "name": "Juan",
  "lastname": "Pérez",
  "email": "juan@example.com",
  "phone": "3001234567",
  "password": "MiContra@123",
  "confirmPassword": "MiContra@123"
}
```

**Validation rules:**

- `name` / `lastname`: 2–50 characters
- `email`: valid email format
- `phone`: 7–20 characters
- `password`: 8–32 chars, must contain uppercase, lowercase, digit, and special char (`@$!%*?&`)
- `confirmPassword`: must match `password`

**Response `201`:**

```json
{
  "ok": true,
  "data": {
    "client": {
      "id": "uuid",
      "name": "Juan",
      "lastname": "Pérez",
      "email": "juan@example.com",
      "phone": "3001234567",
      "createdAt": "2026-04-19T..."
    }
  }
}
```

**Errors:**

- `400` — validation failed
- `409` — email already registered

> **Important:** `isConfirmed` defaults to `false`. Login returns `403` until the account is confirmed. If you haven't implemented email confirmation, set `isConfirmed: true` in the database manually or adjust the login route.

---

### Login

```
POST /api/clients/auth/login
Content-Type: application/json
```

**Body:**

```json
{
  "email": "juan@example.com",
  "password": "MiContra@123"
}
```

**Response `200`:**

```json
{
  "ok": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "client": {
      "id": "uuid",
      "name": "Juan",
      "lastname": "Pérez",
      "email": "juan@example.com",
      "phone": "3001234567",
      "isConfirmed": true,
      "isUserDeleted": false,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

**Errors:**

- `401` — wrong email/password or account deleted
- `403` — account not confirmed

---

### Refresh access token

```
POST /api/clients/auth/refresh
Content-Type: application/json
```

**Body:**

```json
{
  "refreshToken": "eyJ..."
}
```

**Response `200`:**

```json
{
  "ok": true,
  "data": {
    "accessToken": "eyJ..."
  }
}
```

**Errors:**

- `400` — missing refreshToken
- `401` — invalid, expired, or tampered token

---

### Get current session (auth check)

```
GET /api/clients/auth/me
Authorization: Bearer <accessToken>
```

**Response `200`:**

```json
{
  "ok": true,
  "data": {
    "client": {
      "id": "uuid",
      "name": "Juan",
      "lastname": "Pérez",
      "email": "juan@example.com",
      "phone": "3001234567",
      "isConfirmed": true,
      "createdAt": "...",
      "updatedAt": "...",
      "savedAddresses": [ ... ]
    }
  }
}
```

**Errors:**

- `401` — missing or invalid token

---

## Profile Endpoints

All require `Authorization: Bearer <accessToken>`.

---

### Get profile

```
GET /api/clients/profile
Authorization: Bearer <accessToken>
```

**Response `200`:**

```json
{
  "ok": true,
  "data": {
    "client": {
      "id": "uuid",
      "name": "Juan",
      "lastname": "Pérez",
      "email": "juan@example.com",
      "phone": "3001234567",
      "isConfirmed": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

> Email is read-only via the API. Changing it requires a separate email-verification flow (not implemented).

---

### Update profile info

```
PUT /api/clients/profile
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Body (all fields required):**

```json
{
  "name": "Juan Carlos",
  "lastname": "Pérez López",
  "phone": "3109876543"
}
```

**Response `200`:** Same shape as Get profile.

**Errors:**

- `400` — validation failed

---

### Change password

```
PATCH /api/clients/profile/password
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Body:**

```json
{
  "oldPassword": "MiContra@123",
  "password": "NuevaClave@456",
  "confirmPassword": "NuevaClave@456"
}
```

**Validation rules:**

- `oldPassword`: must match the currently stored password
- `password`: same rules as registration (8–32 chars, uppercase, lowercase, digit, special char)
- `confirmPassword`: must match `password`
- `password` must be different from `oldPassword`

**Response `200`:**

```json
{ "ok": true, "message": "Password updated successfully" }
```

**Errors:**

- `400` — validation failed
- `401` — `oldPassword` is incorrect

---

## Address Endpoints

All require `Authorization: Bearer <accessToken>`.

An address is a shipping address saved to the client's profile. Addresses are **snapshots** — they are copied into each order at purchase time, so editing a saved address does not change past orders.

### Address object shape

```ts
{
  id: string
  firstName: string
  lastName: string
  city: string
  typeOfIdentification: string // e.g. "CC", "CE", "Pasaporte"
  identification: string // ID number
  phone: string
  address: string // Street address
  address2: string | null // Apartment, unit, etc. (optional)
  postalCode: string
  department: string // Colombian department/state
  additionalData: string | null // Any extra notes (optional)
  isDefault: boolean
  clientId: string
  createdAt: string
  updatedAt: string
}
```

---

### List addresses

```
GET /api/clients/addresses
Authorization: Bearer <accessToken>
```

**Response `200`:**

```json
{
  "ok": true,
  "data": {
    "addresses": [ ... ]   // default address always first
  }
}
```

---

### Create address

```
POST /api/clients/addresses
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Body:**

```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "city": "Bogotá",
  "typeOfIdentification": "CC",
  "identification": "1023456789",
  "phone": "3001234567",
  "address": "Calle 123 # 45-67",
  "address2": "Apto 301",
  "postalCode": "110111",
  "department": "Cundinamarca",
  "additionalData": "Portería principal",
  "isDefault": true
}
```

**Notes:**

- `address2` and `additionalData` are optional
- `isDefault` defaults to `false` if omitted
- If this is the **first** address, it becomes default automatically regardless of `isDefault`
- If `isDefault: true`, all other addresses are unset as default

**Response `201`:** `{ "ok": true, "data": { "address": { ... } } }`

---

### Get single address

```
GET /api/clients/addresses/:id
Authorization: Bearer <accessToken>
```

**Response `200`:** `{ "ok": true, "data": { "address": { ... } } }`

**Errors:** `404` — address not found or does not belong to this client

---

### Update address

```
PUT /api/clients/addresses/:id
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Body:** Any subset of address fields (all are optional in an update):

```json
{
  "city": "Medellín",
  "department": "Antioquia",
  "postalCode": "050001"
}
```

**Response `200`:** `{ "ok": true, "data": { "address": { ... } } }`

---

### Set address as default

```
PATCH /api/clients/addresses/:id
Authorization: Bearer <accessToken>
```

No body required. Marks this address as default and unsets all others.

**Response `200`:** `{ "ok": true, "data": { "address": { ... } } }`

---

### Delete address

```
DELETE /api/clients/addresses/:id
Authorization: Bearer <accessToken>
```

**Response `200`:** `{ "ok": true, "message": "Address deleted" }`

**Note:** If the deleted address was the default, the most recently created remaining address is automatically promoted to default.

---

## Order Endpoints

All require `Authorization: Bearer <accessToken>`.

### Order statuses

| Status       | Description                        |
| ------------ | ---------------------------------- |
| `PENDING`    | Order created, awaiting processing |
| `PROCESSING` | Being prepared                     |
| `APPROVED`   | Payment confirmed                  |
| `SHIPPED`    | Dispatched to carrier              |
| `DELIVERED`  | Delivered to client                |
| `CANCELLED`  | Cancelled                          |

---

### List orders (paginated)

```
GET /api/clients/orders?page=1
Authorization: Bearer <accessToken>
```

**Query params:**

- `page` — page number, default `1`, page size is `10`

**Response `200`:**

```json
{
  "ok": true,
  "data": {
    "orders": [
      {
        "id": "uuid",
        "itemsInOrder": 3,
        "subtotal": 240000,
        "tax": 240000,
        "delivery": 10000,
        "discount": 1,
        "total": 490000,
        "orderStatus": "PENDING",
        "paidAt": null,
        "transactionId": null,
        "createdAt": "...",
        "updatedAt": "...",
        "orderItems": [
          {
            "id": "uuid",
            "quantity": 2,
            "size": "M",
            "price": 80000,
            "discount": 1,
            "clothes": {
              "id": "uuid",
              "design": "Camiseta Oversize",
              "color": "Blanco",
              "clothesImage": [ { "secureUrl": "https://..." } ]
            }
          }
        ],
        "orderAddress": { ... },
        "orderTracking": null
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 23,
      "totalPages": 3
    }
  }
}
```

---

### Create order

```
POST /api/clients/orders
Authorization: Bearer <accessToken>
Content-Type: application/json
```

**Body — using a saved address:**

```json
{
  "items": [
    { "clothesId": "uuid", "size": "M", "quantity": 2 },
    { "clothesId": "uuid", "size": "L", "quantity": 1 }
  ],
  "savedAddressId": "uuid",
  "discountCode": "PROMO10",
  "delivery": 10000
}
```

**Body — using a new address (not saved):**

```json
{
  "items": [{ "clothesId": "uuid", "size": "S", "quantity": 1 }],
  "address": {
    "firstName": "Juan",
    "lastName": "Pérez",
    "city": "Bogotá",
    "typeOfIdentification": "CC",
    "identification": "1023456789",
    "phone": "3001234567",
    "address": "Calle 123 # 45-67",
    "postalCode": "110111",
    "department": "Cundinamarca"
  },
  "delivery": 10000
}
```

**Field rules:**

- `items`: array of at least 1 item
  - `size`: must be one of `"S"`, `"M"`, `"L"`, `"XL"`
  - `quantity`: integer, 1–50
- Either `savedAddressId` **or** `address` object is required (not both)
- `discountCode`: optional coupon code string
- `delivery`: number ≥ 0, defaults to `0`

**Total calculation:**

```
lineSubtotal     = price × quantity (per item)
lineDiscount     = lineSubtotal × (1 − clothes.discount)
subtotal         = Σ lineSubtotal
itemsDiscount    = Σ lineDiscount
afterDiscounts   = subtotal − itemsDiscount
couponDiscount   = afterDiscounts × (1 − coupon.discount)   [if code provided]
tax              = afterDiscounts × TAX_RATE
total            = afterDiscounts − couponDiscount + tax + delivery
```

**Response `201`:**

```json
{
  "ok": true,
  "data": {
    "orderId": "uuid",
    "total": 490000,
    "orderStatus": "PENDING"
  }
}
```

**Errors:**

- `400` — validation failed
- `404` — `savedAddressId` not found
- `422` — product not found/inactive, size unavailable, insufficient stock, invalid/expired discount code
- `500` — race condition on stock (two simultaneous purchases)

**What happens internally:**

1. Products and variants loaded and validated
2. Discount code validated (active + not expired)
3. Shipping address resolved (saved or new)
4. Totals calculated
5. In a single DB transaction:
   - Stock decremented per variant
   - Negative stock check (race condition guard)
   - `Order` created
   - `OrderItem` rows created (price + discount snapshot)
   - `OrderAddress` created (address snapshot)

---

### Get order detail

```
GET /api/clients/orders/:id
Authorization: Bearer <accessToken>
```

**Response `200`:**

```json
{
  "ok": true,
  "data": {
    "order": {
      "id": "uuid",
      "itemsInOrder": 3,
      "subtotal": 240000,
      "tax": 240000,
      "delivery": 10000,
      "discount": 0.9,
      "total": 441000,
      "orderStatus": "SHIPPED",
      "paidAt": "2026-04-19T...",
      "transactionId": "txn_abc123",
      "createdAt": "...",
      "updatedAt": "...",
      "orderItems": [
        {
          "id": "uuid",
          "quantity": 2,
          "size": "M",
          "price": 80000,
          "discount": 1,
          "clothes": {
            "id": "uuid",
            "design": "Camiseta Oversize",
            "color": "Blanco",
            "collection": { "id": "uuid", "name": "Verano" },
            "clothesImage": [{ "secureUrl": "https://res.cloudinary.com/..." }]
          }
        }
      ],
      "orderAddress": {
        "id": "uuid",
        "firstName": "Juan",
        "lastName": "Pérez",
        "city": "Bogotá",
        "typeOfIdentification": "CC",
        "identification": "1023456789",
        "phone": "3001234567",
        "address": "Calle 123 # 45-67",
        "address2": null,
        "postalCode": "110111",
        "department": "Cundinamarca",
        "additionalData": null
      },
      "orderTracking": {
        "id": "uuid",
        "company": "Servientrega",
        "trackingCode": "SRV123456789"
      },
      "orderDiscount": {
        "code": "PROMO10",
        "description": "10% off spring collection",
        "discount": 0.9
      }
    }
  }
}
```

**Notes:**

- `orderTracking` is `null` until the admin assigns a tracking number
- `orderDiscount` is `null` if no coupon was used
- `order.discount` stores the coupon multiplier (`1` = no coupon, `0.9` = 10% off)

---

## Suggested Astro implementation patterns

### Fetch utility

```ts
// src/lib/api.ts
const BASE = import.meta.env.PUBLIC_API_URL

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  accessToken?: string
): Promise<{ ok: true; data: T } | { ok: false; message: string }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>)
  }

  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })

  if (res.status === 204) return { ok: true, data: null as T }

  return res.json()
}
```

### Token refresh interceptor

```ts
// src/lib/auth-fetch.ts
import { apiFetch } from "./api"

export async function authFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ ok: true; data: T } | { ok: false; message: string }> {
  let accessToken = localStorage.getItem("accessToken") ?? ""

  let result = await apiFetch<T>(path, options, accessToken)

  if (!result.ok && result.message === "Unauthorized") {
    const refreshToken = localStorage.getItem("refreshToken")
    if (!refreshToken) {
      window.location.href = "/login"
      return result
    }

    const refresh = await apiFetch<{ accessToken: string }>(
      "/api/clients/auth/refresh",
      { method: "POST", body: JSON.stringify({ refreshToken }) }
    )

    if (!refresh.ok) {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      window.location.href = "/login"
      return result
    }

    accessToken = refresh.data.accessToken
    localStorage.setItem("accessToken", accessToken)

    result = await apiFetch<T>(path, options, accessToken)
  }

  return result
}
```

### Typical checkout flow

```
1. GET /api/products                    → show catalog
2. (user adds to cart — client side)
3. POST /api/clients/auth/login         → get tokens
4. GET /api/clients/addresses           → pre-fill checkout with saved address
5. POST /api/clients/orders             → create order after payment confirmation
6. GET /api/clients/orders/:id          → show order confirmation page
```

---

## CORS

The backend allows cross-origin requests from the domain set in `ASTRO_APP_URL` env var on the Next.js side. Default is `http://localhost:4321`.

To change it, update the Next.js `.env`:

```env
ASTRO_APP_URL=https://mi-tienda.com
```
