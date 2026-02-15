Smart Bookmark App
🚀 Overview

Smart Bookmark App is a full-stack web application that allows users to save and manage bookmarks efficiently.
It is built using Next.js (App Router) and Supabase for backend services.

The application supports creating, viewing, and deleting bookmarks with real-time UI updates.

🛠 Tech Stack

Next.js 14 (App Router)

TypeScript

Supabase (PostgreSQL + API)

Tailwind CSS

ESLint

✨ Features

Add new bookmarks

Delete bookmarks

Automatic UI refresh after insert

Clean and responsive UI

Organized folder structure

Modular components

⚙️ Project Structure
app/            → Routing and pages
components/     → Reusable UI components
lib/supabase/   → Supabase configuration
public/         → Static assets

🧠 Challenges Faced

One of the main challenges was ensuring that the UI refreshed correctly after inserting a new bookmark. Initially, the component did not reflect the updated data immediately.

I resolved this by restructuring the data-fetching logic and ensuring proper re-rendering after insert operations. This improved state consistency and user experience.

▶️ How to Run Locally
git clone <your-repo-url>
cd smart-bookmark-app
npm install
npm run dev


Open http://localhost:3000 in your browser.

🔮 Future Improvements

User authentication

Bookmark categories/tags

Search & filtering

Pagination

Improved validation and error handling

📌 Conclusion

This project helped strengthen my understanding of full-stack development, component structure, and database integration using Supabase.