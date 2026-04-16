Gym Tracker Web App Architecture

Overview

The architecture is designed to support a static, offline-first PWA with serverless functions for dynamic features.

Components

Frontend: React + Next.js for static site generation.

Styling: Tailwind CSS for responsive and aesthetic UI.

Assets: SVG/WebP for optimized visuals.

State Management: Zustand or Redux Toolkit for managing workout and palette state.

Storage: IndexedDB (Dexie.js) for offline data persistence.

Offline-first: Service workers for caching and PWA installation.

Serverless Functions: Netlify/Vercel/Azure Functions for gym lookup and weather APIs.

Data Flow

Workout Entry: User inputs sets/reps/duration → Stored in IndexedDB.

Palette Selection: User selects manually OR weather API via serverless function → Palette applied.

Location Tagging: User confirms gym workout → Geolocation API → Serverless function fetches gym info → Tag attached.

Export Data: User clicks export → CSV/JSON generated client-side.

Deployment

Hosted on Netlify/Vercel/Azure Static Web Apps.

Static assets served via CDN.

Serverless functions deployed alongside frontend.

Scalability

Future backend integration possible (Firebase, Supabase, Hasura).

Modular design allows adding advanced features without rewriting core logic.