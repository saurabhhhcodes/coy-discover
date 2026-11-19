# Coy SDE Intern Assignment — "Discover" Tab

A mobile-first swipe-based discovery tab built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

---

## 🚀 Live Demo Video
A recorded demonstration showcasing card gestures, mutual match detection, modal celebration, and persistence:
- **Location:** `recordings/coy-discover-demo.mp4`

---

## 🎯 Part A: Core Feature Recommendations for Coy

### 1. Contextual Icebreakers & "Mutual Origin" Prompts
- **What it is:** When a mutual crush match occurs, rather than presenting a blank screen, Coy displays an interactive icebreaker (e.g., *"How do you know each other?"*, *"Guess who confessed first"*, or mutual campus circle prompts).
- **Why it is required:** 
  - Crushes who match often experience post-reveal awkwardness or freeze up when starting a conversation.
  - Because Coy's matches are often existing acquaintances, friends, or campus peers, structured low-pressure icebreakers lower cognitive friction and dramatically boost conversation start rates.

### 2. Campus / Circle Ring-Fencing with Anonymized Signal Hints
- **What it is:** Verified college/institution circles where users receive anonymous aggregate notifications (e.g., *"Someone in 3rd Year CS added you as a crush"* or *"You have 1 pending secret admirer from St. Stephen's"*), without ever disclosing names or identities.
- **Why it is required:**
  - Solves the classic two-sided activation bottleneck: User A adds User B, but User B hasn't downloaded Coy. Anonymized signals trigger viral curiosity and motivate the recipient to install Coy and confess their own crushes.
  - Preserves 100% of Coy's core confidentiality promise: zero identities revealed until mutual.

---

## 🛠️ Part B: Implementation Details

### Architecture & Tech Stack
- **Framework:** Next.js (App Router) + TypeScript
- **Styling & Icons:** Tailwind CSS + Lucide Icons
- **Gestures & Animations:** Framer Motion (gesture drag handling, rotation, opacity, and like/pass stamp feedback)
- **Effects:** Canvas Confetti on mutual match
- **Data & Persistence:** `data/seed_profiles.json` (30 diverse profiles) and persistent file-based JSON store in `data/store.json`.

### Endpoints
- `GET /api/feed`: Fetches profiles the logged-in user hasn't yet swiped on. Strips `hasLikedUser` to preserve Coy's privacy promise.
- `POST /api/swipe`: Records a like or pass. If both like each other, creates a match and returns `isMatch: true`.
- `GET /api/matches`: Returns all mutual matches.
- `POST /api/reset`: Convenience endpoint to reset the demo store.

---

## 🏃 Running the Application

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser (preferably in mobile responsive mode).

3. **Re-generate demo recording:**
   ```bash
   node record.mjs
   ```
