<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-Stack-blue?logo=mongodb&logoColor=green" alt="MERN Stack">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/License-ISC-blue" alt="License">
</p>

> A developer-focused social media platform for sharing code, connecting with developers, and real-time messaging.

DevVerse is a full-stack social media application built with the MERN stack, designed specifically for developers to share posts with code snippets, follow other developers, and engage in real-time conversations with voice and video call capabilities.

## 🚀 Features

### Core Features
- **📝 Post Creation** - Share text posts with optional images and code snippets
- **💻 Code Highlighting** - Syntax highlighting for 25+ programming languages
- **👥 Social Interactions** - Follow/unfollow developers, like and reply to posts
- **💬 Real-time Messaging** - Instant messaging with Socket.io
- **📞 Voice & Video Calls** - WebRTC-powered peer-to-peer calls
- **🔐 Authentication** - Multiple login options including OAuth (Google & GitHub)
- **📱 Responsive Design** - Mobile-friendly with dark/light mode

### User Features
- Customizable profile with avatar and cover photo
- User search and follow suggestions
- Real-time notifications for messages and interactions
- Code snippet sharing with syntax highlighting

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB | Database |
| Mongoose | ODM |
| Socket.io | Real-time communication |
| Passport.js | OAuth authentication |
| Cloudinary | Image storage |
| JWT | Authentication |

### Frontend
| Technology | Purpose |
|------------|---------|
| React | UI library |
| Vite | Build tool |
| Chakra UI | Component library |
| Recoil | State management |
| React Router | Routing |
| Simple-Peer | WebRTC calls |

## 📁 Project Structure

```
devverse/
├── backend/              # Express.js server
│   ├── config/         # Passport configuration
│   ├── controllers/    # Route handlers
│   ├── cron/          # Scheduled jobs
│   ├── db/            # Database connection
│   ├── middlewares/   # Express middleware
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API routes
│   ├── socket/        # Socket.io setup
│   └── utils/        # Helper functions
│
├── frontend/           # React application
│   ├── src/
│   │   ├── atoms/     # Recoil state
│   │   ├── components/ # Reusable components
│   │   ├── context/    # React context
│   │   ├── hooks/      # Custom hooks
│   │   └── pages/      # Route pages
│   └── public/         # Static assets
│
├── package.json        # Root scripts
└── README.md          # This file
```

## ⚡ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/devverse.git
cd devverse
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Environment Setup**

Create a `.env` file in the `backend` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

4. **Run the application**

```bash
# Run backend (from root)
npm run dev

# Or run separately
cd backend && npm run dev    # Terminal 1
cd frontend && npm run dev   # Terminal 2
```

5. **Open in browser**
```
http://localhost:5173
```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/auth/signup` | Register user |
| POST | `/api/users/auth/login` | Login user |
| GET | `/api/users/me` | Get current user |
| PUT | `/api/users/update` | Update profile |
| GET | `/api/users/auth/google` | Google OAuth |
| GET | `/api/users/auth/github` | GitHub OAuth |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts/feed` | Get feed posts |
| POST | `/api/posts/create` | Create post |
| PUT | `/api/posts/:id` | Update post |
| DELETE | `/api/posts/:id` | Delete post |
| PUT | `/api/posts/like/:id` | Like/unlike post |
| PUT | `/api/posts/reply/:id` | Reply to post |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/conversations` | Get all conversations |
| GET | `/api/messages/:userId` | Get messages with user |
| POST | `/api/messages/send/:userId` | Send message |

## 🎯 Key Features in Detail

### Code Sharing
DevVerse supports posting code snippets in 25+ programming languages including:
- JavaScript, TypeScript, Python, Java, C/C++
- Go, Rust, Ruby, PHP, Swift, Kotlin
- HTML, CSS, SQL, Bash, JSON, YAML
- And many more...

### Real-time Features
- Live message delivery with Socket.io
- Online user status
- Typing indicators
- Message read receipts
- Voice and video calls (WebRTC)

### Responsive Design
- Works seamlessly on desktop, tablet, and mobile
- Dark and light mode support
- Custom Chakra UI theme with brand colors

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Ishfaq Ahmad Bhat**

- GitHub: [@ishfaq24https://github.com/ishfaq24]
- Email: ishfaqnazir24@gmail.com

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by developer communities
- Built with modern web technologies

---

<p align="center">Made with ❤️ for developers</p>
