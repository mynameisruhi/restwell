# RestWell - Sleep & Caffeine Tracker

A web application to track your sleep and caffeine habits with personalized insights based on your age and gender.

![RestWell Screenshot](screenshot.png)

## Features

- 📊 **Habit Analysis** - Enter your sleep hours and caffeine intake
- 📈 **Visual Chart** - See where you stand compared to averages
- 🎯 **Personalized Results** - Get insights based on your age and gender
- 🤖 **AI Assistant** - Ask questions about sleep and caffeine
- 📱 **Responsive Design** - Works on desktop and mobile

## Quick Start

### Option 1: Open Directly
Just open `index.html` in your browser!

### Option 2: Local Server
```bash
npx serve .
```

## Deployment

### Deploy to Vercel (Recommended)

1. **Create a GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/restwell.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New Project"
   - Import your `restwell` repository
   - Click "Deploy"
   - Done! Your site is live at `https://restwell.vercel.app`

### Deploy to Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login and Initialize**
   ```bash
   firebase login
   firebase init hosting
   ```
   - Select "Use an existing project" or create new
   - Public directory: `.` (current directory)
   - Single-page app: No
   - Don't overwrite index.html

3. **Deploy**
   ```bash
   firebase deploy
   ```

### Deploy to GitHub Pages

1. Push to GitHub (see step 1 above)
2. Go to repository Settings → Pages
3. Source: Deploy from branch
4. Branch: main, folder: / (root)
5. Save - your site will be at `https://YOUR_USERNAME.github.io/restwell`

## Project Structure

```
restwell/
├── index.html      # Main HTML file
├── app.js          # JavaScript application logic
├── package.json    # Project metadata
└── README.md       # This file
```

## Customization

### Change Colors
Edit the CSS variables in `index.html`:
- Background: `#0f172a` (dark blue)
- Cards: `#1e293b` (slate)
- Accent: `#06b6d4` (cyan), `#8b5cf6` (purple), `#ec4899` (pink)

### Add More Age Groups
Edit the `DATA` object in `app.js` to add or modify baseline data.

## AI Chat Setup

The AI assistant uses the Anthropic API. For production use:

1. Create a backend API route to proxy requests
2. Store your API key securely on the server
3. Never expose API keys in client-side code

## License

MIT License - feel free to use and modify!

## Contributing

Pull requests welcome! Please open an issue first to discuss changes.
