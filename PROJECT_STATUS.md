# Youth Connect: Project Status & Documentation

Welcome to the Youth Connect project documentation! Below is a comprehensive overview of the architecture we have built so far, completely integrating the frontend interface with a secure database backend, alongside a roadmap of what remains to be implemented.

## 🟢 What We Have Done So Far

### 1. Robust Architecture Setup
- Built a split-stack architecture consisting of a **React (Vite)** frontend and a **Node.js (Express)** backend.
- Refined routing and styling to yield a fluid, modern, glassmorphism-inspired UI.

### 2. Live Database Integration
- Successfully eliminated the local local mock database and linked the application securely to a cloud-hosted **MongoDB Atlas** cluster (`youthconnect`).
- Architected environment variables (`.env`) to safely protect connection credentials and hide JWT secret keys.

### 3. Authentication & Security Pipeline
- Constructed a rock-solid `User` schema in Mongoose.
- Implemented real user registration and login endpoints (`/api/auth/register` and `/api/auth/login`).
- Locked down the system so no "fake" or unauthenticated users can access the system.
- Implemented **`bcryptjs`** to heavily encrypt and hash user passwords before they are saved to MongoDB.
- Used **`jsonwebtoken` (JWT)** to negotiate and track user login sessions across browser reloads via Local Storage.

### 4. Core Ecosystem Layout
- Engineered initial API layouts for Opportunity fetching.
- Built foundational database schemas including `Application`, `UserProfile`, and `Opportunity`.
- Created robust UI components (`Dashboard.jsx`, `NGOPortal.jsx`, `OpportunitiesBrowser.jsx`, `Profile.jsx`).

---

## 🟡 What Is Left To Do 

While the security protocol and layout are running flawlessly, there are still layers necessary to make this a true production-level product.

### 1. Connecting UI Data to the Live Database
- Currently, the frontend layout (Dashboard, NGO Portal) heavily relies on static hardcoded variables (`mockOpportunities.jsx`). 
- **Next Step:** We must replace the local React state hooks with `fetch` requests pointing to our backend (for example, triggering `GET /api/opportunities` to pull actual data). 

### 2. Building Real AI Functionality
- Currently, generating personalized opportunity "match scores" for a given user relies on a *Mock AI Engine* (a randomized math tool).
- **Next Step:** We need to integrate an external language learning model API (such as Google Gemini or OpenAI) or build our own algorithms within Python that specifically scrape the user's `skills` array and genuinely compute alignment scores against jobs.

### 3. Fortifying Middleware
- Ensure all backend API routes (like `/api/opportunities`) wrap inside the `authenticateToken` middleware, so entirely unregistered guests cannot silently pull dashboard data using API debugging tools like Postman.

### 4. The Application Lifecycle
- Complete the "Application Flow" workflow where users click "Apply" on an Opportunity, the data writes to the MongoDB `applications` collection, and the linked NGO sees that pending submission populate directly on their NGO Portal for approval or rejection.

### 5. Proper File Uploading
- Integrate cloud storage (like AWS S3 or Cloudinary) so users and NGOs can upload custom, real-life profile avatars and company banners instead of pulling placeholder web images.
