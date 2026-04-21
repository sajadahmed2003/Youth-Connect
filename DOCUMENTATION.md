# Campaign Connect: Project Documentation (v3.0)

Welcome to the **Campaign Connect** (formerly Youth Connect) Project Documentation. The platform has pivoted from an NGO-volunteer matching site to a **Campaign-based Social Impact Platform**.

---

## 1. Project Overview & Architecture

Campaign Connect is a full-stack web application designed to empower movements through collective action. It connects campaigners with volunteers using AI-driven match scoring and social engagement features (videos, likes, comments).

- **Frontend**: React 19 (Vite)
- **Backend**: Node.js v20+ with Express 5
- **Database**: MongoDB Atlas
- **AI Engine**: Google Gemini AI
- **Social Engine**: Custom Video Feed with Engagement Metrics

---

## 2. Key Transformations (NGO -> Campaign)

### 2.1. Terminology Shift
- "NGO" is now **Campaign Manager** or **Organizer**.
- "Opportunities" are now **Campaigns**.
- "Volunteers" are now **Campaigners** or **Joiners**.

### 2.2. Functional Changes
- **Capacity Management**: Campaigns now specify the number of people needed.
- **Dynamic Fulfillment**: When an organizer accepts a join request, the `filledPositions` count increases automatically.
- **Social Feed**: A new "Feed" section displays campaign videos where users can like and comment.

---

## 3. Database Modeling

### 3.1. `Campaign` Schema
- **title**: `String`
- **creatorName**: `String` (Organizer)
- **description**: `String`
- **neededPositions**: `Number`
- **filledPositions**: `Number`
- **videoUrl**: `String` (For Social Feed)
- **likes**: `[ObjectId]` (User IDs)
- **comments**: `[{ userId, userName, text, date }]`
- **requiredSkills**: `[String]`
- **matchScore**: (AI Generated)

### 3.2. `Application` Schema
- **userId**: `ObjectId` (Ref to User)
- **campaignId**: `ObjectId` (Ref to Campaign)
- **status**: `Pending`, `Accepted`, `Rejected`

---

## 4. Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/campaigns` | Fetches all campaigns with AI match scores. |
| POST | `/api/campaigns` | Creates a new campaign (Manager/Admin). |
| DELETE| `/api/campaigns/:id`| Deletes a campaign. |
| POST | `/api/campaigns/:id/like`| Toggles a like on a campaign. |
| POST | `/api/campaigns/:id/comment`| Adds a comment to a campaign. |
| POST | `/api/applications` | Request to join a campaign. |
| PUT | `/api/applications/:id`| Accept/Reject join requests (Updates campaign count). |

---

## 5. UI Structure

1. **Dashboard**: High-level impact stats and AI-recommended campaigns.
2. **Discover**: A searchable grid of active campaigns with progress bars.
3. **Feed**: A TikTok-style video feed for social engagement.
4. **Campaign Portal**: A dedicated workspace for managers to launch campaigns and review join requests.
5. **Profile**: Skill management and personal impact tracking.

---

## 6. Execution Flow
1. **Launch**: Manager creates a Campaign with `neededPositions` = 20.
2. **Discover**: Volunteers see the campaign and their AI Match Score.
3. **Join**: Volunteer clicks "Join", creating a `Pending` application.
4. **Acceptance**: Manager clicks "Accept". The Campaign's `filledPositions` increments to 1.
5. **Engagement**: The campaign post appears in the Feed for social interaction.
