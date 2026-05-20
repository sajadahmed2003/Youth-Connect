# Campaign Connect: Implemented System Objectives & Architecture

Welcome to the definitive system objectives and architecture documentation for **Campaign Connect** (formerly Youth Connect). This document represents the **exact** objectives, operational workflows, and technology stack implemented within the active codebase.

---

## 1. Actual Implemented Project Objectives

### Objective 1: Dynamic Capacity-Based Campaign Enrollment (Capacity Management)
* **Goal**: Automate volunteer tracking and ensure real-time slot optimization for ongoing campaigns.
* **How it works in the code**:
  - The `Campaign` schema stores `neededPositions` (total required) and `filledPositions` (current accepted).
  - When a Campaign Manager updates a volunteer's application status to `'Accepted'` (`PUT /api/applications/:id`), the backend triggers a transaction: `Campaign.findByIdAndUpdate(..., { $inc: { filledPositions: 1 } })`.
  - Conversely, if an accepted application is cancelled or removed (`DELETE /api/applications/:id`), the backend decrements the counter (`$inc: { filledPositions: -1 }`).
* **Value**: Ensures absolute transparency and real-time capability metrics for organizers without manual bookkeeping.

### Objective 2: Multi-Role Secure Authorization (Role-Based Workspaces)
* **Goal**: Segment application views, access control, and routing based on user identity (Volunteer, NGO Manager, Admin).
* **How it works in the code**:
  - Users sign up or login (`/api/auth/register`, `/api/auth/login`) with designated roles: `'volunteer'`, `'ngo'`, or `'admin'`.
  - The backend issues a signed **JSON Web Token (JWT)** storing the user's role and identity.
  - In `App.jsx`, React routes are dynamically loaded based on `user.role` (e.g., `<AdminDashboard>` for Admin, `<ManagerDashboard>` for NGOs, and `<VolunteerHome>` for Volunteers).
* **Value**: Secures RESTful endpoints and provides a tailor-made user experience for each persona.

### Objective 3: Interactive Community Activity Feed (Social Micro-Interactions)
* **Goal**: Build community engagement by allowing users to share, interact, and discuss.
* **How it works in the code**:
  - **Community Posts**: Users can create posts (`POST /api/posts`) featuring text content and image attachments.
  - **Reactions**: Post-liking is implemented via `/api/posts/:id/like`, which toggles the user's ID inside the post's `likes` array.
  - **Campaign Engagement**: Volunterers can like campaigns (`POST /api/campaigns/:id/like`) and write custom reviews/comments (`POST /api/campaigns/:id/comment`).
* **Value**: Converts the utility platform into a social platform, driving daily user retention.

### Objective 4: Categorical Campaign Discovery & Live Search
* **Goal**: Allow volunteers to seamlessly locate opportunities that match their location, availability, and specific domain interest.
* **How it works in the code**:
  - `CampaignBrowser.jsx` and `VolunteerHome.jsx` support instant search by matching input text against campaign `title` or `location`.
  - Allows category-specific filtering (`'Environment'`, `'Education'`, `'Health'`, `'Social'`).
* **Value**: Reduces search friction and enables volunteers to pinpoint campaigns instantly.

### Objective 5: Administrative Command & Stats Aggregator
* **Goal**: Provide Global Admins with complete operational observability over the entire network.
* **How it works in the code**:
  - The endpoint `/api/admin/stats` calculates database metrics like `totalUsers`, `totalCampaigns`, `totalApplications`, `volunteerCount`, and `managerCount`.
  - Incorporates an **Activity Log** (`ActivityLog.js` model) that records system events (e.g. `New volunteer entered the network`, `Campaign Approved`, `Inquiry sent`) in a unified backend audit log.
* **Value**: Gives administrators a transparent, real-time audit trail and quantitative health metrics of the application.

### Objective 6: Unified Inquiry & Contact Management Pipeline
* **Goal**: Capture and route external inquiries and feedback directly to system administrators.
* **How it works in the code**:
  - The contact form on the home page hits `/api/contact`, parsing the sender's details and message.
  - Rather than relying on simple emails, it registers the message directly inside the backend's `ActivityLog` schema as a `SYSTEM INQUIRY` for Admin action.
* **Value**: Streamlines support tickets and records guest feedback inside the persistent database.

---

## 2. Implemented Technology Stack & Working

### 1. Frontend: React 19 & Vite
* **Working**: React 19 manages the client-side rendering. Pages like `ManagerDashboard`, `AdminDashboard`, `VolunteerHome`, and `CommunityFeed` are built as modular components. Vite is the super-fast development build server that bundles these modules. `react-router-dom` handles Role-Based routing seamlessly.

### 2. Backend: Node.js (v20+) & Express 5
* **Working**: Express 5 forms the API layers. It defines endpoints to authenticate users, manage campaigns, approve applications, and register likes/comments. It parses payloads, validates JWT signatures via authorization headers, and formats database outputs into clean JSON payloads.

### 3. Database: MongoDB Atlas (Mongoose ODM)
* **Working**: MongoDB Atlas holds the collections of the platform. Using Mongoose schemas:
  - **User**: Name, email, password, role, profile stats.
  - **Campaign**: Title, creatorName, location, category, positions, comments, likes.
  - **Application**: Joint schema linking User ID to Campaign ID with statuses (`'Pending'`, `'Accepted'`, `'Rejected'`, `'Removed'`).
  - **Post**: Text, image, likes array, and creator name for the community feed.
  - **ActivityLog**: Server audit logs for monitoring logins, signups, and admin actions.

### 4. Authentication Layer: JWT (JSON Web Tokens)
* **Working**: When a user logs in, the backend signs a payload with the user's `_id`, `email`, and `role` using a secure JWT key. The client stores this in `localStorage` and appends it to subsequent request headers as a Bearer Token.
