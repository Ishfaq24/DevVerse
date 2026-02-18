# DevVerse - Architecture Documentation

---

## App Description

**DevVerse** is a full-stack social media platform designed specifically for developers. It provides a space where programmers can share their coding journey, ask questions, showcase projects, and connect with other developers worldwide.

### Core Purpose
- A **developer-focused social network** where users can post text, images, and syntax-highlighted code snippets
- Enable **knowledge sharing** through posts with embedded code in 25+ programming languages
- Foster **community engagement** via follows, likes, comments, and real-time messaging
- Provide **OAuth authentication** options (Google & GitHub) for seamless developer onboarding

### Target Users
- Software developers, programmers, and coding enthusiasts
- Tech content creators sharing tutorials and code snippets
- Students and learners seeking developer community
- Open source contributors looking to connect

---

## App Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           CLIENT (React + Vite)                      │
├─────────────────────────────────────────────────────────────────────┤
│  Pages: Auth | Home | User | Post | Chat | Settings | Profile      │
├─────────────────────────────────────────────────────────────────────┤
│  Components: Header | Post | Actions | CreatePost | CodeBlock       │
├─────────────────────────────────────────────────────────────────────┤
│  State: Recoil Atoms (user, posts, messages, auth)                 │
├─────────────────────────────────────────────────────────────────────┤
│  Context: SocketContext (Real-time)                                │
├─────────────────────────────────────────────────────────────────────┤
│  API Layer: REST API calls to backend                               │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SERVER (Express.js)                         │
├─────────────────────────────────────────────────────────────────────┤
│  Routes: /api/users | /api/posts | /api/messages                   │
├─────────────────────────────────────────────────────────────────────┤
│  Controllers: userController | postController | messageController  │
├─────────────────────────────────────────────────────────────────────┤
│  Middleware: protectRoute (JWT Auth) | Passport (OAuth)            │
├─────────────────────────────────────────────────────────────────────┤
│  Socket.io: Real-time messaging & notifications                     │
├─────────────────────────────────────────────────────────────────────┤
│  Services: Cloudinary (images) | Cron (scheduled tasks)            │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     DATABASE (MongoDB + Mongoose)                   │
├─────────────────────────────────────────────────────────────────────┤
│  Collections: users | posts | messages | conversations            │
└─────────────────────────────────────────────────────────────────────┘
```

### Architecture Pattern
- **MVC Pattern** on backend (Models, Controllers, Routes)
- **Component-based Architecture** on frontend (Pages → Components)
- **RESTful API** communication between client and server
- **Real-time bidirectional communication** via WebSockets

---

## Overview

DevVerse is a full-stack social media platform for developers built with the MERN stack (MongoDB, Express, React, Node.js). It enables users to share posts with code snippets, follow other developers, like/reply to posts, and engage in real-time messaging.

---

## Technology Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework for REST API |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **Socket.io** | Real-time bidirectional communication |
| **Passport.js** | Authentication (Local + OAuth) |
| **Cloudinary** | Image upload and storage |
| **JWT** | Token-based authentication |
| **Bcryptjs** | Password hashing |
| **Cron** | Scheduled jobs |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React** | UI library |
| **Vite** | Build tool |
| **Chakra UI** | Component library |
| **Recoil** | State management |
| **React Router DOM** | Client-side routing |
| **React Icons** | Icon library |
| **React Syntax Highlighter** | Code snippet highlighting |
| **date-fns** | Date formatting |
| **Socket.io Client** | Real-time messaging client |

---

## Project Structure

```
devverse/
├── backend/                    # Express.js server
│   ├── config/
│   │   └── passport.js        # Passport OAuth configuration
│   ├── controllers/           # Request handlers
│   │   ├── messageController.js
│   │   ├── postController.js
│   │   └── userController.js
│   ├── cron/
│   │   └── cron.js            # Scheduled jobs
│   ├── db/
│   │   └── connectDB.js       # MongoDB connection
│   ├── middlewares/
│   │   └── protectRoute.js    # Auth middleware
│   ├── models/                # Mongoose schemas
│   │   ├── conversationModel.js
│   │   ├── messageModel.js
│   │   ├── postModel.js
│   │   └── userModel.js
│   ├── routes/                # API routes
│   │   ├── messageRoutes.js
│   │   ├── postRoutes.js
│   │   └── userRoutes.js
│   ├── socket/
│   │   └── socket.js          # Socket.io configuration
│   ├── utils/
│   │   └── helpers/
│   │       └── generateTokenAndSetCookie.js
│   ├── server.js              # Entry point
│   └── package.json
│
├── frontend/                  # React application
│   ├── src/
│   │   ├── atoms/             # Recoil state atoms
│   │   │   ├── authAtom.js
│   │   │   ├── messagesAtom.js
│   │   │   ├── postsAtom.js
│   │   │   └── userAtom.js
│   │   ├── components/       # Reusable components
│   │   │   ├── Actions.jsx       # Like, reply, repost actions
│   │   │   ├── CodeBlock.jsx     # Syntax highlighted code
│   │   │   ├── Comment.jsx
│   │   │   ├── Conversation.jsx
│   │   │   ├── CreatePost.jsx   # Post creation modal
│   │   │   ├── EditPost.jsx      # Post editing modal
│   │   │   ├── Header.jsx
│   │   │   ├── LoginCard.jsx
│   │   │   ├── LogoutButton.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── MessageContainer.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── Post.jsx
│   │   │   ├── SignupCard.jsx
│   │   │   ├── SuggestedUser.jsx
│   │   │   ├── SuggestedUsers.jsx
│   │   │   ├── UserHeader.jsx
│   │   │   └── UserPost.jsx
│   │   ├── context/
│   │   │   └── SocketContext.jsx  # Socket.io context
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useFollowUnfollow.js
│   │   │   ├── useGetUserProfile.js
│   │   │   ├── useLogout.js
│   │   │   ├── usePreviewImg.js
│   │   │   └── useShowToast.js
│   │   ├── pages/             # Route pages
│   │   │   ├── AuthPage.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── PostPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   ├── UpdateProfilePage.jsx
│   │   │   └── UserPage.jsx
│   │   ├── App.jsx            # Root component
│   │   ├── index.css          # Global styles
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── package.json               # Root package.json (scripts)
└── ARCHITECTURE.md            # This file
```

---

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  profilePic: String (URL),
  coverPic: String (URL),
  bio: String,
  followers: [ObjectId],     // User references
  following: [ObjectId],    // User references
  gender: String,
  verified: Boolean,
  googleId: String (OAuth),
  githubId: String (OAuth),
  createdAt: Date
}
```

### Post Model
```javascript
{
  _id: ObjectId,
  postedBy: ObjectId (User ref),
  text: String,
  img: String (URL),
  codeSnippet: String,
  codeLanguage: String,
  likes: [ObjectId],        // User references
  replies: [{
    userId: ObjectId,
    text: String,
    userProfilePic: String,
    username: String
  }],
  createdAt: Date
}
```

### Message Model
```javascript
{
  _id: ObjectId,
  sender: ObjectId (User ref),
  receiver: ObjectId (User ref),
  text: String,
  img: String (URL),
  seen: Boolean,
  createdAt: Date
}
```

### Conversation Model
```javascript
{
  _id: ObjectId,
  participants: [ObjectId],   // User references
  lastMessage: String,
  lastMessageAt: Date,
  createdAt: Date
}
```

---

## API Endpoints

### Authentication (`/api/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/logout` | Logout user |
| GET | `/me` | Get current user |
| PUT | `/update` | Update profile |
| GET | `/google` | Google OAuth |
| GET | `/google/callback` | Google OAuth callback |
| GET | `/github` | GitHub OAuth |
| GET | `/github/callback` | GitHub OAuth callback |

### Users (`/api/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile/:username` | Get user profile |
| GET | `/suggested` | Get suggested users |
| PUT | `/follow/:userId` | Follow/unfollow user |
| PUT | `/block/:userId` | Block user |

### Posts (`/api/posts`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/feed` | Get feed posts |
| GET | `/:id` | Get single post |
| GET | `/user/:username` | Get user posts |
| POST | `/create` | Create post |
| PUT | `/:id` | Update post |
| DELETE | `/:id` | Delete post |
| PUT | `/like/:id` | Like/unlike post |
| PUT | `/reply/:id` | Reply to post |

### Messages (`/api/messages`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/:userId` | Get conversation |
| GET | `/conversations` | Get all conversations |
| POST | `/send/:userId` | Send message |

---

## Authentication Flow

### Local Authentication
1. User registers with username, email, password
2. Password hashed with bcryptjs
3. JWT generated and stored in cookie
4. Protected routes check JWT via middleware

### OAuth Authentication
1. User clicks Google/GitHub login
2. Passport.js handles OAuth flow
3. User profile created/updated in database
4. Session established with express-session
5. User redirected to home with `?oauth=true`

---

## Real-time

### Socket.io Features Events
| Event | Direction | Description |
|-------|-----------|-------------|
| `setup` | Client→Server | User connects |
| `join chat` | Client→Server | Join conversation room |
| `new message` | Server→Client | Message received |
| `message received` | Client→Server | Acknowledge receipt |
| `typing` | Both | User typing indicator |
| `stop typing` | Both | Stop typing indicator |

---

## State Management (Recoil)

### Atoms
- **userAtom**: Current logged-in user
- **postsAtom**: Global posts state
- **messagesAtom**: Chat messages
- **authAtom**: Authentication state

---

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://...
JWT_SECRET=...
SESSION_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
NODE_ENV=development
```

---

## Key Features

1. **Post Creation**: Text posts with optional images and code snippets
2. **Code Highlighting**: Syntax highlighting for 25+ languages
3. **Social Interactions**: Follow/unfollow, likes, replies
4. **Real-time Messaging**: Socket.io powered chat
5. **User Profiles**: Customizable profile with bio, avatar, cover
6. **OAuth Integration**: Google and GitHub login
7. **Responsive Design**: Mobile-friendly with Chakra UI

---

## Deployment

- **Frontend**: Vercel (production build in `frontend/dist`)
- **Backend**: Render/Heroku/Vercel
- **Database**: MongoDB Atlas
- **Images**: Cloudinary CDN

Production build serves static files from Express when `NODE_ENV=production`.
