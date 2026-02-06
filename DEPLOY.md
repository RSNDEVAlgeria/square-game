# Deploying Square Coffee Game

Your personalized Square Coffee game is ready for deployment! Here are the easiest ways to get it online.

## 1. Deploy to Vercel (Recommended)

Vercel is free, fast, and optimized for Vite projects.

1.  **Create a GitHub Repository:**
    *   Push your code to a new GitHub repository.
2.  **Sign up/Log in to Vercel:** Go to [vercel.com](https://vercel.com).
3.  **Add New Project:**
    *   Click "Add New..." -> "Project".
    *   Select your 'square-game' repository.
4.  **Configure Project:**
    *   Framework Preset: `Vite` (should be detected automatically).
    *   Root Directory: `square-game` (IMPORTANT: since your root folder contains 'square-game', set this if you pushed the entire 'code' folder. If you pushed just the contents of 'square-game', leave as `./`).
    *   Build Command: `npm run build`
    *   Output Directory: `dist`
5.  **Deploy:** Click "Deploy".

## 2. Deploy to Netlify

1.  **Create a GitHub Repository** (same as above).
2.  **Log in to Netlify:** Go to [netlify.com](https://netlify.com).
3.  **Add New Site:** "Import from Git".
4.  **Settings:**
    *   Base directory: `square-game` (if applicable)
    *   Build command: `npm run build`
    *   Publish directory: `dist`
5.  **Deploy Site.**

## 3. Manual Build (Static Hosting)

If you want to host it on a standard web server (like Apache/Nginx):

1.  Run the build command locally:
    ```bash
    npm run build
    ```
2.  This creates a `dist` folder in your project directory.
3.  Upload the **contents** of the `dist` folder to your web server's public html folder.

## Troubleshooting

-   **"Module not found" errors:** Ensure all dependencies are in `package.json` (we just fixed `canvas-confetti`).
-   **Blank page on deploy:** Ensure your `base` path in `vite.config.ts` is correct. If deploying to a subdirectory (like github pages), set `base: '/your-repo-name/'`. For root domains (vercel/netlify), the default `/` is fine.
