`````md path="README.md"
# BlogMine

**BlogMine** is a full‑stack blogging platform built with a modern React + Vite front‑end and an Express/MongoDB back‑end. Users can register, log in, create, edit, and delete blog posts, comment on posts, like posts, bookmark their favourite blogs, and report inappropriate content.

---

## Table of Contents

- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## Demo

A live demo is hosted at: **https://blogmine-4g9z.onrender.com** (backend) & **http://localhost:5173** (frontend when running locally).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Client** | React 19, Vite 6, Tailwind CSS 4, React Router v7, Axios |
| **Server** | Node.js, Express 5, MongoDB (Mongoose), Cloudinary (image storage), JWT, bcrypt |
| **Dev Tools** | ESLint, Prettier, concurrently, nodemon |
| **Deployment** | Render (or any Node‑compatible host) |

---

## Features

- **User Authentication** – Register, login, logout with JWT & HTTP‑only cookies.
- **Blog CRUD** – Create, read, update, delete blog posts (with optional image upload via Cloudinary).
- **Likes & Bookmarks** – Like blogs, save them for later.
- **Comments** – Add, edit, delete comments on any blog.
- **Reporting** – Users can report blogs or comments for spam, harassment, etc.
- **Responsive UI** – Tailwind‑styled components, mobile‑first design.
- **Protected Routes** – Private routes guarded by `CheckAuth`.
- **Context API** – Global state handling for auth and blog data.

---

## Project Structure

```
/
├── .gitignore
├── client
│   ├── src
│   │   ├── api
│   │   ├── assets
│   │   ├── components
│   │   ├── config
│   │   ├── contexts
│   │   ├── pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public
│   ├── vite.config.js
│   └── package.json
├── server
│   ├── config
│   ├── controllers
│   ├── models
│   ├── routes
│   └── index.js
├── package.json
└── README.md   ← (this file)
```

---

## Prerequisites

- **Node.js** >= 20.x
- **npm** (comes with Node) or **yarn**
- **MongoDB Atlas** account (or local MongoDB instance)
- **Cloudinary** account (for image uploads)

---

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/rajbhar-suraj/BlogMine.git
   cd BlogMine
   ```

2. **Create a `.env` file in the `server` directory**

   ```bash
   cd server
   cp .env.example .env   # if an example file exists, otherwise create manually
   ```

   Add the following variables (replace placeholders with your own values):

   ```dotenv
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=development
   ```

3. **Install dependencies for both client and server**

   ```bash
   # From the repository root
   npm run install-all
   ```

   This runs `npm install` inside `client` and `server` automatically.

---

## Running the Application

### Development (hot‑reload)

```bash
npm run dev
```

- The **client** runs on `http://localhost:5173`.
- The **server** runs on `http://localhost:5000`.
- `concurrently` starts both processes and watches for changes.

### Production Build

```bash
npm run build
```

- Builds the React app (`client/dist`).
- Installs server dependencies.
- You can then start the server with `npm start` (or `node server/index.js`) – it will serve the static React build in production mode.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Port on which the Express server listens (default `5000`). |
| `MONGO_URI` | MongoDB connection string. |
| `JWT_SECRET` | Secret key for signing JWT tokens. |
| `CLOUDINARY_NAME` | Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret. |
| `NODE_ENV` | `development` or `production`. |

---

## API Endpoints

### Auth (`/auth`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/register` | Register a new user. |
| `POST` | `/login`   | Log in, sets HTTP‑only cookie. |
| `GET`  | `/me`      | Get current user (protected). |
| `POST` | `/logout`  | Log out, clears cookie. |
| `PUT`  | `/userprofile/:id` | Update user profile (protected). |

### Blogs (`/auth/blog`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/create` | Create a blog (image optional). |
| `GET`  | `/getallblogs` | Get all blogs. |
| `GET`  | `/myblogs` | Get blogs authored by the logged‑in user (protected). |
| `PUT`  | `/edit/:id` | Edit a blog. |
| `DELETE`| `/delete/:id` | Delete a blog. |
| `POST` | `/:id/like` | Like/unlike a blog (protected). |
| `POST` | `/addComment/:id` | Add comment to a blog (protected). |
| `GET`  | `/fetchComment/:id` | Fetch comments for a blog. |
| `PUT`  | `/editComment/:blogId/:commentId` | Edit a comment (protected). |
| `DELETE`| `/deleteComment/:blogId/:commentId` | Delete a comment (protected). |
| `POST` | `/bookmarks/:blogId` | Bookmark/unbookmark a blog (protected). |
| `GET`  | `/saved-blogs` | Get all bookmarked blogs for the user (protected). |

### Reports (`/auth/blog/comment`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/report` | Submit a report for a blog or comment (protected). |

All protected routes require the JWT cookie set by the login endpoint.

---

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Make your changes, add tests if applicable.
4. Commit with a clear message and push to your fork.
5. Open a Pull Request describing the changes.

Please follow the existing ESLint rules (`npm run lint`) and keep code formatting consistent.

---

## License

This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---

**Happy coding! 🎉**
