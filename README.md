# Youth Connect (Minoor) - Complete Project Documentation

Welcome to the comprehensive documentation for the **Youth Connect** platform (also known as Minoor). This platform is a modern, cyberpunk-styled web application designed to bridge the gap between NGOs and Volunteers. It operates as a dual-purpose ecosystem for **Volunteer Recruitment** and secure **Crowdfunding**.

---

## 1. Project Overview
Youth Connect aims to digitize and gamify social work. NGOs can create campaigns, recruit volunteers, and raise funds. Volunteers can find personalized opportunities using AI, donate to causes, and earn gamified rewards (points and badges) for their contributions. The platform also includes a built-in social network (Community Feed) to keep everyone connected.

---

## 2. Core Platform Features

This project includes a wide array of advanced features built into both the frontend and backend:

### 🔐 Authentication & Security (`Auth.jsx`)
* **Role-Based Access Control (RBAC):** Users choose their role during signup (`volunteer`, `ngo`, `admin`). The dashboard and features dynamically adapt to the user's role.
* **JWT Authentication:** Secure login using JSON Web Tokens. Sessions are persistent across page reloads.
* **Password Hashing:** Secure backend authentication flows.

### 🎮 Gamification & Badge System (`Profile.jsx` & API)
* **Points System:** Volunteers earn points for donating funds and actively participating in campaigns.
* **Dynamic Badges:** Based on their activity, users automatically unlock badges such as `Rising Star`, `Eco Warrior`, `Community Pillar`, and `Global Helper`.
* **Profile Strength Meter:** A visual indicator showing how complete a user's profile is based on uploaded avatars, bio, skills, and contact info.

### 🧠 AI Compatibility Matching
* **Smart Recommendations:** When viewing a campaign, the platform communicates with a backend AI algorithm (`/api/ai/match`) to calculate a compatibility percentage between the volunteer's listed skills and the campaign's requirements.

### 🌐 Community Social Feed (`CommunityFeed.jsx`)
* **Interactive Feed:** A built-in social media feed where users and NGOs can post updates, thoughts, or pictures.
* **Engagement:** Real-time **Like** and **Comment** functionalities on every post to foster a strong community environment.

### 💰 Comprehensive Crowdfunding System
* **Secure Donations:** Integrated donation flow allowing users to contribute funds to specific campaigns.
* **Dynamic Visibility:** Campaigns that do not require funds (Target Amount = 0) automatically hide the donation UI.
* **Goal Achieved Interceptor:** Prevents over-funding by intercepting donations for campaigns that have hit 100% of their target, displaying a "Goal Achieved 😊" pop-up instead.

### 🔎 Search & Discovery (`CampaignBrowser.jsx`)
* **Real-time Filtering:** Search for campaigns by title/keywords or filter them strictly by categories (`Environment`, `Education`, `Health`, `Social`).
* **Campaign Details (`CampaignDetail.jsx`):** Dedicated landing pages for campaigns featuring embedded Video Players (`videoUrl`), organizer details, and live progress bars showing required vs. recruited volunteers.

---

## 3. User Roles & Dashboards

### A. Volunteer Profile
* **Browse & Apply:** Can browse all active campaigns and send applications to join as a volunteer. Applications are tracked (Pending, Accepted, Rejected).
* **Donate:** Can financially contribute to campaigns and track their donation history.
* **Profile Management:** Can upload profile pictures (saved instantly as Base64 data), list skills, and track earned badges.

### B. NGO / Manager Dashboard (`ManagerDashboard.jsx`)
* **Analytics:** Visual counters for Total Campaigns, Total Recruits, and Total Funds Raised for their specific organization.
* **Campaign Management:** Can create new campaigns, specify the number of volunteers needed, and set financial targets.
* **Recruitment Desk:** A centralized table to view all incoming volunteer applications. The NGO can `Accept`, `Reject`, or `Remove` volunteers.
* **Unified Profile UI:** Uses the exact same Profile component as volunteers, ensuring a consistent editing experience.

### C. Admin Portal (`AdminDashboard.jsx`)
* **Platform Analytics:** Tracks global money circulation, calculates platform revenue (3.5% commission fee on donations), and monitors total user count.
* **Financial Ledger:** A highly detailed ledger showing every donation made on the platform. Displays the **Amount Donated**, **Target Amount**, **Raised Amount**, and exactly **How much is left** for that campaign. Includes safe fallbacks to prevent crashes on legacy data.
* **Campaign Moderation:** Admins can oversee all campaigns across the platform, with the power to forcefully delete inappropriate campaigns.
* **Support Desk & Chat Streams:** A built-in ticketing system. Admins can view user queries, which are automatically categorized into `General Platform` issues or `Campaign Logistics` (if tied to a specific campaign).

---

## 4. Technology Stack

### Frontend (Client-side)
* **Framework:** React.js powered by Vite.
* **Routing:** `react-router-dom` for Protected Routes and SPA navigation.
* **Styling:** Custom CSS with a "Cyberpunk/Modern Dark" aesthetic (`var(--bg-surface)`, `var(--gradient-primary)`).
* **Icons:** `lucide-react` library.

### Backend (Server-side)
* **Runtime:** Node.js
* **Framework:** Express.js for REST API routing.
* **Database:** MongoDB (via Mongoose ODM).
  * **Collections:** `Users`, `Campaigns`, `Applications`, `SupportQueries`, `Posts`, `Comments`.
* **Data Processing:** Base64 encoding for image persistence directly in MongoDB, bypassing third-party storage complexities.

---

## 5. Recent Custom Enhancements & Bug Fixes

The following specific improvements were recently implemented to polish the platform:

1. **Profile Image Persistence:** Fixed the `PUT /api/profile` endpoint so uploaded Base64 avatars save permanently to MongoDB and survive page refreshes.
2. **Ledger Crash Prevention:** Added extensive fallback logic (`d.amount || 0`) to the Admin Dashboard's financial ledger to prevent the entire page from crashing when reading corrupted or empty legacy donation data.
3. **Advanced Ledger Data:** Upgraded the Admin donation table to show exactly how much money a campaign needed vs. how much it has raised during a specific transaction.
4. **Smart Donation UI:** Wrote logic in `VolunteerHome.jsx` to completely hide the "Donate Funds" button and progress bar if an NGO sets their campaign target to `0` or leaves it blank.
5. **Goal Achieved Pop-up:** Created a beautiful interceptor modal (😊) that stops users from donating to a campaign that is already 100% funded, encouraging them to discover other campaigns instead.
6. **Unified Profile Codebase:** Refactored `ManagerDashboard.jsx` to directly import the standalone `<Profile />` component, guaranteeing that the "Profile" tab looks and functions identically for all roles.
7. **Support Filter Visibility:** Fixed a CSS bug where inactive filter buttons ("All Threads", "General Platform") in the Admin Dashboard had invisible white text. They now dynamically switch to a readable dark gray.
