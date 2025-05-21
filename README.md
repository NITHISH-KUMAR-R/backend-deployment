# Mini-Facebook App (Backend)

A robust backend service for a Mini-Facebook social networking application built using **Node.js**, **Express.js**, **MongoDB**, and **JWT**. It supports core features such as user authentication, friend management, post creation, likes/dislikes, and more.

## 🔧 Features

- ✅ User Sign-up and Login (JWT Authentication)
- 👥 Send and Accept Friend Requests
- 📝 Create, View, and Delete Posts
- 👍 Like and Dislike Posts
- 🔒 Secure API access with Middleware and Token Validation
- 🌐 Modular and Scalable Express Routing
- 🗂️ MongoDB data modeling with Mongoose (including relationships)
- 📦 Docker-ready and deployable backend

## 📁 Project Structure

backend-deployment/
├── Controller/
│ ├── friendController.js
│ ├── postController.js
│ ├── postLikesDislikes.js
│ ├── userAuthController.js
│ └── userReqController.js
├── Middleware/
│ └── authentication.js
├── Router/
│ ├── friendRouter.js
│ ├── indexRoute.js
│ ├── likeDisLikeRouter.js
│ ├── postRouter.js
│ └── userRouter.js
├── Schema/
│ ├── friendRequestSchema.js
│ ├── friendSchema.js
│ ├── likesDlikeSchema.js
│ ├── postSchema.js
│ ├── tokenSchema.js
│ └── userData.js
├── api/
│ └── index.ts
├── config/
│ └── config.js
├── public/
├── test/
├── types/
├── app.js
├── package.json
├── package-lock.json
├── .gitignore
├── .dockerignore
├── Notes.txt
