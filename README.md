# Medical Platform

This is a full-stack web application that connects patients with certified doctors. The app features AI-powered doctor recommendations, session bookings, secure payments, and a knowledge base of medical articles

## Features
- Patients: Describe symptoms, get AI doctor recommendations, book sessions, and pay via Stripe.
- Doctors: Register, edit their profile, get certified via AI, set consultation prices, view booked patients.

## Pages Overview
1. Login/Register
- Doctors can create accounts.
- Doctors must fill out professional and personal details.
- Firebase Auth used for secure authentication.

2. Home
- Public-facing page with general info.
- Displays doctors, articles written by certified doctors.

3. Session
- Patients can:
  - Enter symptoms in a form powered by AI to get doctor recommendations.
  - Or directly select a doctor from the list.
- Once selected, the patient books a session.
- Payment handled via Stripe Checkout if doctor has set a consultation fee.

4. Doctors
- List of all certified doctors.
- Filters: Specialization, and Search by Name.
- Certification badge if doctor certified.
  - Click a doctor to view /doctors/:id:
  - More information about doctors
  - Leave review
  - “Question to doctor” button.

6. Profile
- Doctors can:
  - Edit profile.
  - Upload photo and certifications.
  - Set consultation price.
  - See a list of booked patients.

7. Articles
- Doctors can publish articles via their profiles.
- Patients can browse, search, and filter articles.
- Clicking on an article title opens the Article Detail Page at /articles/:id, which includes:
  - The full article content.
  - An option to download the article as a PDF for offline reading or sharing.

## Installation
```
git clone https://github.com/Hasmik-Gevorgyan/Medical-Form-App
cd Medical-Form-App
npm install
```

## Environment Variables
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_MEASUREMENT_ID
VITE_STRIPE_PUBLIC_KEY
OPENAI_KEY 
```

## Run locally
```
npm run dev
```
## Tech Stack
- Frontend
  - React,
  - Redux Toolkit,
  - Ant Design
- Backend
  - Firebase Auth,
  - Firestore,
  - Firebase Functions
- AI Integration
  - OpenAI 
- Payments
  - Stripe
- Email
  - EmailJS
- Hosting
  - Firebase Hosting 
