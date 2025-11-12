# Backend API Documentation

This document describes the backend API for the OneDTU project.
Place this file at: `documentation/backend-docs.md`

Includes:

- REST endpoints grouped by route
- Request/response examples
- Authentication notes (JWT)
- Socket.IO events used for real-time chat
- Models summary
- Postman import notes

---

## Base URL

Assuming local development:

```
http://localhost:3000/api/v1
```

Root health endpoint:

```
GET http://localhost:3000/
Response: { "msg": "Welcome to OneDTU API" }
```

---

## Authentication (Auth)

All auth endpoints are under `/auth`

### Register

**POST** `/api/v1/auth/register`

**Request (JSON)**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success (201)**

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "64c4e...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors (400/409)**

- Email already exists
- Validation errors

---

### Login

**POST** `/api/v1/auth/login`

**Request (JSON)**

```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success (200)**

```json
{
  "token": "JWT_TOKEN_HERE",
  "user": {
    "_id": "64c4e...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### Google Login

**POST** `/api/v1/auth/google`

**Request (JSON)**

```json
{
  "idToken": "<google-id-token>"
}
```

**Success (200)** — returns JWT like login.

---

## Admin routes (`/api/v1/admin`)

Protected by `authenticationAdmin` middleware. Admins manage societies, society admins, and PG entries.

### Admin auth

- **POST** `/api/v1/admin/register` — create admin account
- **POST** `/api/v1/admin/login` — admin login (returns admin JWT)

### Society admin management (admin only)

- **POST** `/api/v1/admin/create-societyadmin` — create society admin
- **PUT** `/api/v1/admin/update-societyadmin` — update society admin
- **DELETE** `/api/v1/admin/delete-societyadmin` — delete society admin

### Society management (admin only)

- **POST** `/api/v1/admin/create-society`  
  Body: form-data (name, description, images[]). Uses multer memory storage.
- **PUT** `/api/v1/admin/update-society`
- **DELETE** `/api/v1/admin/delete-society`

### PG (paying guest) management (admin only)

- **POST** `/api/v1/admin/create-pg` — multipart/form-data with up to 5 images (`images`)
- **PUT** `/api/v1/admin/update-pg`
- **DELETE** `/api/v1/admin/delete-pg`

---

## User routes (`/api/v1/user`)

Protected by `authentication` middleware.

### Update phone number

**PATCH** `/api/v1/user/update-phone`

- Body (JSON):

```json
{ "phoneNumber": "9876543210" }
```

- Requires authentication header:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## Chat routes (`/api/v1/chat`)

Protected by `auth` middleware.

### Access or create chat between two users

**GET** `/api/v1/chat/access-chat?userId=<otherUserId>`  
Returns chat object or creates a private chat.

### Fetch all chats for authenticated user

**GET** `/api/v1/chat/fetch-chats`  
Returns list of chats the user is a member of.

### Get all messages in a chat

**GET** `/api/v1/chat/messages/:chatId`  
Returns messages for chat with id `chatId`.

### Send a message

**POST** `/api/v1/chat/message`  
Body example:

```json
{
  "chatId": "64d...",
  "messageType": "text",
  "messageText": "Hello!"
}
```

Authenticated user will be recorded as sender.

### Mark messages as read

**PATCH** `/api/v1/chat/mark-read/:chatId`  
Marks all messages in chat as read for the authenticated user.

---

## FindMySpace routes (`/api/v1/findmyspace`)

Routes for Flat, PG, and PG posts. Use multer memory storage for images (field `images` or `roomImage`).

### Flats

- **GET** `/api/v1/findmyspace/flats` — list all flats
- **GET** `/api/v1/findmyspace/my/flats` — get flats created by authenticated user (auth required)
- **GET** `/api/v1/findmyspace/flat/:id` — get flat by id
- **POST** `/api/v1/findmyspace/flat` — create flat (auth + `images` up to 6)
  - Form-data fields: `title`, `address`, `description`, `pricePerPerson`, `distanceFromDtu`, `electricityRate`, `googleMapLink`, `images[]`
- **PUT** `/api/v1/findmyspace/flat/:id` — update flat (auth + images)
- **DELETE** `/api/v1/findmyspace/flat/:id` — delete flat (auth)

### PGs

- **GET** `/api/v1/findmyspace/PGs/` — list all PGs
- **GET** `/api/v1/findmyspace/PG/:id` — get PG details by id

### PG Posts

- **GET** `/api/v1/findmyspace/PGposts` — list posts
- **GET** `/api/v1/findmyspace/PGposts/:postId` — get post by id
- **POST** `/api/v1/findmyspace/PGposts` — create post (auth + `images[]` up to 6)
- **PUT** `/api/v1/findmyspace/PGposts/:postId` — update post (auth + images)
- **DELETE** `/api/v1/findmyspace/PGposts/:postId` — delete post (auth)

---

## HostelCart routes (`/api/v1/hostelcart`)

Marketplace for items and categories. Images via `images` field.

### Public

- **GET** `/api/v1/hostelcart/all-items` — list all items
- **GET** `/api/v1/hostelcart/categories` — get categories

### Protected (auth required)

- **POST** `/api/v1/hostelcart/items` — create item (auth + `images` up to 5)
- **PATCH** `/api/v1/hostelcart/items` — update item (auth + `updatedImages`)
- **DELETE** `/api/v1/hostelcart/items` — delete item (auth)
- **GET** `/api/v1/hostelcart/items` — get user's items (auth)
- **GET** `/api/v1/hostelcart/items/others` — get other users items (auth)
- **GET** `/api/v1/hostelcart/items/by-category` — filter by category (query param e.g. `?category=<id>`)

---

## SocietyConnect routes (`/api/v1/societyconnect`)

Community and posts inside societies. Uses `authenticationSocietyAdmin` for society-admin-only actions.

### Society endpoints

- **GET** `/api/v1/societyconnect/societies` — list societies
- **GET** `/api/v1/societyconnect/societies/:id` — get society by id
- **PUT** `/api/v1/societyconnect/society/:id` — update society (society admin only)

### Society admin auth

- **POST** `/api/v1/societyconnect/society-admin/login` — login for society admin

### Posts

- **GET** `/api/v1/societyconnect/societies/:societyId/posts` — posts in a society (pagination supported by controllers)
- **POST** `/api/v1/societyconnect/societies/:societyId/posts` — create post (society admin only, images up to 6)
- **PUT** `/api/v1/societyconnect/societies/:societyId/posts` — update post (society admin only)
- **DELETE** `/api/v1/societyconnect/societies/:societyId/posts` — delete post (society admin only)

### All posts / single post

- **GET** `/api/v1/societyconnect/posts` — list all posts
- **GET** `/api/v1/societyconnect/posts/:postId` — get post by id

### Like / Unlike

- **POST** `/api/v1/societyconnect/posts/:postId/like` — auth required
- **POST** `/api/v1/societyconnect/posts/:postId/unlike` — auth required

### Comments

- **POST** `/api/v1/societyconnect/posts/:postId/comments` — add comment (auth)
- **GET** `/api/v1/societyconnect/posts/:postId/comments` — list comments
- **POST** `/api/v1/societyconnect/comments/:commentId/like` — like comment (auth)
- **POST** `/api/v1/societyconnect/comments/:commentId/unlike` — unlike comment (auth)
- **DELETE** `/api/v1/societyconnect/comments/:commentId` — delete comment (comment owner or auth)
- **DELETE** `/api/v1/societyconnect/comments/:commentId/admin` — delete comment (society admin only)

---

## Models summary (mongoose)

### User (`users`)

Key fields:

- `name`, `email` (unique), `password` (hashed), `googleId` (optional)
- `phoneNumber` validated (10 digits)
- `Accomodations` holds refs to PG and Flat posts
- `item` refs to hostelcart items

JWT: created with `user_schema.methods.createJWT()` — includes `userId`, `name`, `email`, `phoneNumber`.

### Admin (`admins`)

- `name`, `email` (unique), `password` (hashed), `role`
- `createJWT()` returns admin token including role

### SocietyAdmin (`SocietyAdmin`)

- `name`, `phoneNumber` (unique), `password` (hashed), `society` ref

### Chat (`Chat`)

- `chatType`: enum `['private','group','ai']`
- `members`: array of user refs
- `messages`: array of Message refs
- `lastMessage`, `lastMessageAt`

### Message (`Message`)

- `chatId` ref to Chat
- `senderType`: `['user','ai']`
- `senderId` ref to `users` (nullable for ai)
- `messageType`: `['text','image','file']`
- `messageText` or `attachmentUrl`
- `isRead` boolean

### FlatPost / PGPost / PG / Item / Post / Comment

- Schemas for listings, posts, items and comments with fields shown in code: title, description, images (array of URLs), price fields, createdBy refs, and timestamps.

---

## Socket.IO (real-time chat)

Server attaches to the same HTTP server. CORS allowed for FRONTEND_ORIGIN (env).

**Client must connect to** `ws://localhost:3000` (or `https://...` in prod) and emit/handle the following events.

### Events emitted by client

- `setup` — payload: `userId`  
  Server joins the socket to a personal room named after `userId`.

- `join chat` — payload: `chatId`  
  Join a chat room.

- `leave chat` — payload: `chatId`  
  Leave chat room.

- `new message` — payload: full `message` object  
  Example message:
  ```json
  {
    "_id": "msgid",
    "chat": { "_id": "chatid", "members": ["user1", "user2"] },
    "sender": "userId",
    "messageType": "text",
    "messageText": "Hello"
  }
  ```

### Events emitted by server

- `message received` — sent to room `chatId` excluding sender; payload: `message` object
- Note: server logs connection and disconnection.

---

## Error handling and status codes

Common responses:

- `200 OK` — success
- `201 Created` — resource created
- `400 Bad Request` — validation error or missing fields
- `401 Unauthorized` — missing or invalid JWT
- `403 Forbidden` — not allowed (e.g., non-admin accessing admin route)
- `404 Not Found` — resource not found
- `500 Internal Server Error` — unexpected server error

Error body format (example used by controllers/middleware):

```json
{
  "success": false,
  "message": "Detailed error message"
}
```

---

## Postman Collection & Testing

To create an easy import for reviewers:

1. Open Postman and create a new collection `OneDTU-API`.
2. For each endpoint above, add a request with:
   - URL: `{{baseUrl}}/api/v1/...`
   - Auth: Bearer Token (set to `{{jwt}}` environment variable for protected routes)
   - For file uploads, choose `form-data` and add `images` or `roomImage` fields with type `file`.
3. Export the collection as `OneDTU-API.postman_collection.json` and include it in the repo root or `/documentation`.

Suggested Postman environment variables:

```
baseUrl = http://localhost:3000
jwt = <paste token after login>
```

---

## How to deliver your PR (what to include)

- Add `documentation/backend-docs.md` with this content
- (Optional) Add `OneDTU-API.postman_collection.json`
- Add sample screenshots of Postman requests/responses (optional)
- Create PR with title: `docs: Add backend API documentation using Postman (#17)`
- In PR description include steps to reproduce and mention tested endpoints

---

## Author & Notes

Author: @Amanc77

Notes:

- Update any request/response samples to match exact field names from controllers if they differ.
- For any protected routes, include sample JWT tokens and clarify roles (user vs admin vs societyAdmin) when generating Postman examples.
