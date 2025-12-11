# W&RSETA Learner Management Front-End

Nuxt 3 + Vuetify 3 front-end (Options API) for capturing and monitoring W&RSETA assessors, moderators, and learners. All data is mocked in Pinia stores while waiting for real service integration.

## Features
- SA ID validation with derived age/gender and fallbacks for non-South African IDs (passport + country + document type).
- Mock registration for assessors/moderators and learners with duplicate prevention.
- Flagging workflow that records reasons for failed or suspicious records.
- Reports with status filters and summary counts.
- Mock service layer using `setTimeout` to show where real API calls can be plugged in.

## Tech
- Nuxt 3 (Options API components)
- Vuetify 3 (minimal custom CSS)
- Pinia for state & mock data

## Running locally
- Install dependencies: `npm install`
- Start the dev server: `npm run dev` (Nuxt auto-picks an open port and provides a local preview URL).
- Build for production: `npm run build` then `npm run preview` to verify the static build.

## How it works
- Mock data lives in Pinia stores to simulate assessors, moderators, learners, and reports until real APIs are wired in.
- Nuxt 3 + Vuetify 3 handle routing, layouts, and UI components with minimal custom styling.
- Client-side validation (e.g., SA ID parsing) drives most of the business logic before any network calls.
