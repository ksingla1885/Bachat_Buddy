# Deployment Guide for Bachat Buddy

This guide explains how to deploy the **Bachat Buddy** application using Docker.

## 1. Local Deployment (Testing)

To run the application on your local machine:

1.  **Ensure Docker Desktop is running.**
2.  Open a terminal in the project root directory.
3.  Run the following command to build and start the services:

    ```bash
    docker-compose up --build
    ```

4.  Access the application:
    -   **Frontend**: http://localhost:3000
    -   **Backend**: Internal (proxy via frontend)

5.  Stop the app:
    ```bash
    docker-compose down
    ```

## 2. Accessing from Local Network (LAN)

To access the app from your phone or another computer on the same Wi-Fi:

1.  Find your computer's IP address:
    -   **Windows**: Run `ipconfig` in terminal. Look for `IPv4 Address` (e.g., `192.168.1.15`).
    -   **Mac/Linux**: Run `ifconfig` or `ip a`.
2.  On your phone, visit: `http://<YOUR_IP_ADDRESS>:3000` (e.g., `http://192.168.1.15:3000`).

*Note: You may need to allow Node.js/Docker through your Windows Firewall.*

## 3. Public Deployment (Vercel-like)

To get a public URL (e.g., `https://bachat-buddy.onrender.com`), you should use a Cloud PaaS that supports Docker. **Render** is recommended as a free/cheap "Vercel for Docker" alternative.

### Option A: Deploy to Render (Recommended)

1.  Push your code to **GitHub**.
2.  Sign up at [render.com](https://render.com).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  Render will automatically detect the `Dockerfile`.
    -   **Root Directory**: `.` (default)
    -   **Runtime**: Docker
6.  **Environment Variables**: Add your `MONGODB_URI` and any others from `.env`.
7.  Click **Create Web Service**.

### Option B: Temporary Public URL (Tunneling)

If you just want to share your running `localhost` with someone temporarily:

1.  Keep Docker running (`docker-compose up`).
2.  Open a new terminal.
3.  Run **LocalTunnel** (requires Node.js):
    ```bash
    npx localtunnel --port 3000
    ```
4.  It will give you a generic URL (e.g., `https://fluffy-cat-42.loca.lt`) that connects to your local PC.

## 4. Production on VPS (DigitalOcean/AWS)

See the previous version of this file for VPS instructions if you prefer managing your own server.
