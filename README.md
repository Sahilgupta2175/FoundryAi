# FoundryAI Website

A modern, professional MERN stack website for FoundryAI - an AI-native startup studio.

![FoundryAI](https://img.shields.io/badge/FoundryAI-AI%20Native%20Startup%20Studio-blue)

## 🚀 Features

- **Modern Design**: Premium, minimal design with professional color palette
- **Smooth Animations**: Framer Motion powered animations throughout
- **Responsive**: Fully responsive across all devices
- **MERN Stack**: MongoDB, Express, React, Node.js
- **Custom Cursor**: Interactive cursor effect on desktop
- **Contact Forms**: Working contact and career application forms

## 🎨 Design Highlights

- Deep navy and electric blue color scheme
- Gradient text effects and glowing elements
- Grid background patterns
- Hover effects on cards and buttons
- Scroll-triggered animations
- Custom scrollbar styling

## 📁 Project Structure

```
foundryai-website/
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/     # Reusable components
│       │   ├── Navbar.js
│       │   ├── Footer.js
│       │   ├── CustomCursor.js
│       │   └── ScrollToTop.js
│       ├── pages/          # Page components
│       │   ├── Home.js
│       │   ├── About.js
│       │   ├── OurModel.js
│       │   ├── Portfolio.js
│       │   ├── Careers.js
│       │   └── Contact.js
│       ├── styles/
│       │   └── index.css   # Global styles & design tokens
│       ├── App.js
│       └── index.js
├── server/                 # Express backend
│   ├── routes/
│   │   ├── contact.js
│   │   └── careers.js
│   └── index.js
├── package.json
└── README.md
```

## 🛠️ Installation

1. **Clone or navigate to the project directory**

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

   Or manually:
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your settings:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/foundryai
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

## 🚀 Running the Application

### Development Mode (Frontend + Backend)
```bash
npm run dev
```

### Backend Only
```bash
npm run server
```

### Frontend Only
```bash
npm run client
```

### Production Build
```bash
npm run build
npm start
```

## 📱 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero section, services, portfolio preview |
| About | `/about` | Mission, vision, founder info, values |
| Our Model | `/our-model` | Partnership process, benefits |
| Portfolio | `/portfolio` | Featured ventures (Addzipzz) |
| Careers | `/careers` | Job listings, application form |
| Contact | `/contact` | Contact form, info cards |

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Submit contact form |
| GET | `/api/careers` | Get job listings |
| POST | `/api/careers` | Submit job application |

## 🎨 Design System

### Colors
- Primary: `#0066ff` (Electric Blue)
- Accent: `#f59e0b` (Warm Gold)
- Background: `#0a0f1c` (Deep Navy)
- Text Primary: `#ffffff`
- Text Secondary: `#94a3b8`

### Typography
- Display Font: Space Grotesk
- Body Font: Inter

### Animations
- Entrance animations on page load
- Scroll-triggered fade-in effects
- Hover states on interactive elements
- Custom cursor tracking

## 📦 Key Dependencies

### Frontend
- React 18
- React Router DOM
- Framer Motion
- React Icons
- React Intersection Observer

### Backend
- Express
- Mongoose
- Nodemailer
- CORS
- dotenv

## 🔧 Configuration

### MongoDB (Optional)
The app works without MongoDB. If you want to store form submissions, configure the `MONGODB_URI` in `.env`.

### Email Notifications
To enable email notifications for form submissions:
1. Create a Gmail App Password
2. Add credentials to `.env`:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

## 📄 License

MIT License - Feel free to use for your own projects!

## 🤝 Contact

- **Email**: foundryai.india@gmail.com
- **Phone**: +91 90594 67267
- **Location**: Bangalore, Karnataka, India

---

Built with ❤️ by FoundryAI Team
