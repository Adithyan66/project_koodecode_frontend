# External Systems & Services Used in Project

This document lists all external systems and services used in the project, especially those running on different ports.

## 🎥 **Jitsi Meet** (Video Conferencing)

**Ports Used:**
- **Port 8443** (HTTPS) - Main Jitsi Meet server for external API
- **Port 8000** (HTTP) - Proxy server for Jitsi resources

**Configuration:**
- Domain: `localhost:8443`
- External API script loaded from: `https://localhost:8443/external_api.js`
- Proxy configured in `vite.config.ts`:
  ```typescript
  proxy: {
    '/jitsi': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/jitsi/, '')
    }
  }
  ```
- Also loaded from: `http://localhost:8000/external_api.js` (fallback/proxy)

**Location in Code:**
- `src/components/user/room/VideoCallTab.tsx`
- `index.html` (external API script loading)
- `vite.config.ts` (proxy configuration)

---

## 🔌 **Socket.IO Server** (Real-time Communication)

**Port Used:**
- **Port 3000** (HTTP) - Socket.IO server for real-time features

**Configuration:**
- URL: `http://localhost:3000`
- Used for: Room collaboration (code sync, whiteboard, chat, permissions)
- Transport: WebSocket

**Location in Code:**
- `src/services/roomSocketService.ts` (line 16)
- `src/app/hooks/contest/useContestSolving.ts` (line 174 - auto-submit endpoint)

**Events Handled:**
- Code updates
- Whiteboard updates
- Chat messages
- Permission changes
- Room state synchronization

---

## 🌐 **Backend API Server**

**Port:**
- Configured via environment variable `VITE_API_URL`
- Not directly specified in frontend code (must be set in `.env` file)

**Location in Code:**
- `src/services/axios/httpClient.ts` (line 5, 9)

**API Endpoints Used:**
- `/auth/*` - Authentication
- `/user/*` - User-specific endpoints
- `/user/problems/*` - Problem solving and submissions
- `/user/contests/*` - Contest-related endpoints
- `/user/rooms/*` - Room management

---

## ⚖️ **Judge0** (Code Execution Engine)

**Port:**
- Not directly accessed from frontend
- Likely accessed through backend API
- Referenced as `judge0Token` in submission responses

**Configuration:**
- Judge0 tokens are returned in API responses but not directly configured in frontend
- Backend likely handles Judge0 API communication

**Location in Code:**
- `src/types/problem.ts` (line 10) - `judge0Token` field
- `src/types/contest-problems.ts` (line 10) - `judge0Token` field
- `docs/SUBMISSION_API_SAMPLES.md` - Documentation mentions Judge0 tokens
- `src/data/submissionsMockData.ts` - Mock data includes Judge0 tokens

**Note:** Judge0 is used indirectly - the backend processes code submissions and uses Judge0 for execution.

---

## 🖼️ **ImageKit** (Image CDN)

**Type:** External cloud service (not running on local port)

**Configuration:**
- Environment Variables:
  - `VITE_IMAGEKIT_URL_ENDPOINT` - ImageKit URL endpoint
  - `VITE_IMAGEKIT_PUBLIC_KEY` - ImageKit public key
- Default: `https://ik.imagekit.io/your_imagekit_id/`

**Location in Code:**
- `src/services/ImageKitService.ts`

**Usage:**
- Contest thumbnails
- Room thumbnails
- Profile images
- Problem images
- Image optimization and transformations

---

## 💳 **Razorpay** (Payment Gateway)

**Type:** External cloud service (not running on local port)

**Configuration:**
- Script loaded from: `https://checkout.razorpay.com/v1/checkout.js`
- Used for coin purchases and in-app payments

**Location in Code:**
- `src/components/user/store/CoinPurchaseModal.tsx`
- `src/services/axios/user/payment.ts`
- `src/types/payment.ts`
- `package.json` - `razorpay` dependency

---

## 🔄 **Redis** (Cache/Queue Service)

**Status:** Not directly visible in frontend code
- Likely used by backend for:
  - Caching
  - Session management
  - Real-time data synchronization
  - Queue management for code execution

**Note:** Redis would be accessed only by the backend server, not directly from the frontend.

---

## 🔐 **OAuth Services**

### Google OAuth
- Environment Variable: `VITE_GOOGLE_CLIENT_ID`
- Location: `src/app/App.tsx` (line 34)

### GitHub OAuth
- Environment Variable: `VITE_GITHUB_CLIENT_ID`
- Location: `src/components/user/buttons/Auth0Buttons.tsx` (line 66)

---

## 📱 **Push Notifications**

**Type:** Browser-based service workers
- Uses Service Worker API
- No external port required
- Configured through backend API

**Location in Code:**
- `src/utils/pushNotifications.ts`
- `src/app/hooks/usePushNotifications.ts`
- `src/services/axios/user/notifications.ts`

---

## 📋 **Summary of Local Ports**

| Service | Port | Protocol | Purpose |
|---------|------|----------|---------|
| Jitsi Meet | 8443 | HTTPS | Video conferencing API |
| Jitsi Proxy | 8000 | HTTP | Proxy for Jitsi resources |
| Socket.IO | 3000 | HTTP/WebSocket | Real-time collaboration |
| Vite Dev Server | 5173 | HTTP | Frontend development server |
| Backend API | * | HTTP | Configured via `VITE_API_URL` |

---

## 🔧 **Required Environment Variables**

```env
VITE_API_URL=<backend-api-url>
VITE_IMAGEKIT_URL_ENDPOINT=<imagekit-endpoint>
VITE_IMAGEKIT_PUBLIC_KEY=<imagekit-public-key>
VITE_GOOGLE_CLIENT_ID=<google-oauth-client-id>
VITE_GITHUB_CLIENT_ID=<github-oauth-client-id>
```

---

## 🚀 **External Services (Cloud-based)**

These services don't run on local ports but are accessed over the internet:

1. **ImageKit** - Image CDN and optimization
2. **Razorpay** - Payment processing
3. **Google OAuth** - Authentication
4. **GitHub OAuth** - Authentication

---

## 📝 **Notes**

- Judge0 is used indirectly through the backend API
- Redis is backend-only and not accessible from frontend
- All local services (Jitsi, Socket.IO) should be running before starting the frontend
- Backend API must be configured and running for full functionality
- Environment variables must be set in `.env` file for proper configuration

