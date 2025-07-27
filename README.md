# 🌟 Shooting the Star

An interactive space-themed web game where players shoot falling stars to earn points, unlock constellations, and learn interesting space facts. Combines fun gameplay with astronomical education.

## 🎮 Game Features

- **Interactive Shooting Gameplay**: Aim and shoot falling stars with precision timing
- **Constellation Unlocking**: Discover beautiful constellations as you progress through levels
- **Educational Content**: Learn fascinating facts about space and astronomy
- **Leaderboard System**: Compete with other players and track your progress
- **Achievement System**: Unlock achievements for various accomplishments
- **User Authentication**: Secure login/registration with JWT tokens
- **Responsive Design**: Play on desktop, tablet, or mobile devices

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Phaser.js 3** - 2D game engine
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **TypeScript** - Type safety

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Hosting
- **Vercel** - Frontend deployment
- **Render/Railway** - Backend deployment
- **MongoDB Atlas** - Cloud database

## 📁 Project Structure

```
shooting-the-star/
├── game-client/                  # Frontend (Next.js + Phaser)
│   ├── pages/                    # Routes
│   │   ├── index.tsx             # Home page
│   │   ├── game.tsx              # Game page
│   │   ├── leaderboard.tsx       # Leaderboard page
│   │   ├── login.tsx             # Auth page
│   │   └── api/                  # API routes
│   ├── components/               # Reusable components
│   │   ├── GameWrapper.tsx       # Phaser game instance
│   │   ├── FactModal.tsx         # Constellation facts modal
│   │   └── ScorePanel.tsx        # Game HUD
│   ├── styles/                   # Global styles
│   ├── utils/                    # Utilities and helpers
│   └── public/                   # Static assets
├── api-server/                   # Backend (Node.js/Express)
│   ├── models/                   # Database models
│   │   ├── User.js              # User schema
│   │   └── GameScore.js         # Game scores schema
│   ├── routes/                   # API routes
│   │   ├── auth.js              # Authentication routes
│   │   ├── game.js              # Game-related routes
│   │   └── leaderboard.js       # Leaderboard routes
│   ├── middleware/               # Custom middleware
│   │   └── auth.js              # JWT authentication
│   └── index.js                 # Server entry point
└── README.md                    # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/shooting-the-star.git
   cd shooting-the-star
   ```

2. **Set up the backend**
   ```bash
   cd api-server
   npm install
   cp ../env.example .env
   # Edit .env with your configuration
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd ../game-client
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Environment Configuration

Copy `env.example` to `.env` in the `api-server` directory and configure:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/shooting-star

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Server
PORT=5000
NODE_ENV=development

# Client
CLIENT_URL=http://localhost:3000
```

## 🎯 Game Mechanics

### Core Gameplay
1. **Star Shooting**: Click on falling stars to score points
2. **Accuracy Tracking**: Your accuracy is calculated based on hits vs. shots
3. **Level Progression**: Complete levels to unlock new constellations
4. **Educational Breaks**: Learn space facts between levels

### Scoring System
- **Base Points**: 10 points per star hit
- **Accuracy Bonus**: Higher accuracy = more points
- **Level Multiplier**: Higher levels = more challenging and rewarding
- **Combo System**: Consecutive hits earn bonus points

### Constellations
- **Orion** (Easy) - The Hunter constellation
- **Ursa Major** (Easy) - The Great Bear
- **Cassiopeia** (Medium) - The Queen
- **Leo** (Medium) - The Lion
- **Scorpius** (Hard) - The Scorpion

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Game
- `POST /api/game/score` - Save game score
- `GET /api/game/stats` - Get user statistics
- `GET /api/game/history` - Get game history
- `GET /api/game/constellations` - Get constellation data

### Leaderboard
- `GET /api/leaderboard` - Get global leaderboard
- `GET /api/leaderboard/global-stats` - Get global statistics
- `GET /api/leaderboard/daily` - Get daily top scores
- `GET /api/leaderboard/constellation/:name` - Get constellation-specific leaderboard

## 🎨 UI/UX Features

### Design System
- **Space Theme**: Dark backgrounds with star animations
- **Gradient Text**: Gold/silver/bronze gradients for titles
- **Smooth Animations**: Framer Motion for fluid interactions
- **Responsive Layout**: Works on all device sizes

### Components
- **Animated Starfield**: CSS-based background animation
- **Interactive Buttons**: Hover effects and micro-interactions
- **Modal System**: Smooth transitions for facts and menus
- **Loading States**: Skeleton screens and spinners

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `.next`
4. Deploy!

### Backend (Render/Railway)
1. Connect your repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables
5. Deploy!

### Database (MongoDB Atlas)
1. Create a free cluster
2. Get connection string
3. Update `MONGODB_URI` in environment variables

## 🧪 Testing

```bash
# Backend tests
cd api-server
npm test

# Frontend tests (when implemented)
cd game-client
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Phaser.js** - For the excellent 2D game engine
- **NASA** - For space facts and educational content
- **Astronomy Community** - For constellation information
- **Open Source Community** - For all the amazing tools and libraries

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/shooting-the-star/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/shooting-the-star/discussions)
- **Email**: your-email@example.com

---

**Made with ❤️ and ☄️ by the Shooting the Star Team** 