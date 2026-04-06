# Social Feed Platform

## Description
A modern, responsive, and dynamic social media feed platform built with Next.js. This frontend application provides users with an intuitive interface to authenticate, view a personalized social feed, create posts with privacy settings, interact through comments and replies, and express reactions with likes. The UI is designed to be sleek and fast, delivering a premium user experience across all devices.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS.
- **UI Components:** Shadcn UI, Lucide React Icons
- **Data Fetching & State:** TanStack React Query, Axios
- **Authentication:** NextAuth.js
- **Form Management & Validation:** Zod
- **Date Handling:** dayjs, relative-time

## Features
- **User Authentication:** Secure Login and Registration flows using NextAuth.
- **Social Feed:** Real-time generation of posts with content visualization.
- **Post Creation:** Users can create posts and manage their visibility (Public / Private).
- **Interactive Comments System:** Multi-level comment sections including threaded replies.
- **Reactions (Likes):** Users can like posts, comments, and specific replies. Includes interactive "Likes Modals" to see who reacted.
- **Responsive Navigation:** Sidebar integrations and interactive layout optimized for both mobile and desktop views.
- **Optimistic UI Updates:** Fast and seamless state updates, smooth modal animations, and skeleton loaders for exceptional user experience.

## Installation Instructions
To get this project up and running locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd front-end
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and configure necessary environment variables.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## Usage Instructions
- **Sign Up / Log In:** Start by creating a new account on the `/register` page or logging in via `/login`.
- **Browsing the Feed:** Navigate to the home page `/` to explore public posts and your tailored feed.
- **Creating a Post:** Use the "Create Post" interface to write content, set the audience to "Private" or "Public", and publish.
- **Engaging:** Click on the comment to open the comment modal, read existing discussions, leave a main comment, or reply to others directly.
- **Liking:** Click the like on any post or comment to like it. Click the likes count to view a modal showing who reacted.

## Folder Structure
A brief overview of the main directories in the `src/` folder:

```text
src/
├── app/               # Next.js App Router including primary routes (/, /login, /register)
├── components/        # React components (Organized by modules, shared parts, and UI primitives)
│   ├── modules/       # Complex feature-specific components
│   ├── share/         # Reusable features (e.g., CommentModal, PostedFeed)
│   └── ui/            # Base visual components (Shadcn UI)
├── hooks/             # Custom React Hooks (e.g., usePost, React Query hooks)
├── services/          # API layer with Axios configurations (e.g., postService)
├── providers/         # Global Context Providers (Theme, React Query)
├── lib/               # Shared utilities (e.g., tailwind-merge utils)
├── types/             # Shared TypeScript interfaces and types
└── data/              # Static data and constants
```

## Notes / Additional Information
- **Environment Variables:** You will need to define variables for `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and the primary backend API URL. Example:
  ```env
  NEXT_PUBLIC_BASE_URL=http://localhost:5000/api/v1
  NEXTAUTH_URL=http://localhost:3000
  NEXTAUTH_SECRET=your_super_secret_string
  ```

## Author
Sajjad
