# StudioSpace — Cat Harry

StudioSpace is a creative studio booking platform where users can explore creative spaces, view studio details, book studios, manage their listings, and share reviews.

## Features

- **Authentication:** Sign up and sign in using email/password or Google.
- **Explore Studios:** Browse available creative studios and search for spaces.
- **Category Filtering:** Filter studios by category.
- **Studio Details:** View studio information, images, amenities, hourly rates, and ratings.
- **Studio Management:** Add, edit, and delete your own studio listings.
- **Booking System:** Book studios by selecting a date and time.
- **Booking Management:** View your bookings and cancel bookings when permitted.
- **Double-booking Prevention:** Prevent conflicting confirmed bookings for the same studio.
- **Reviews & Ratings:** Submit reviews and ratings for studios.
- **User Dashboard:** Access dashboard information, listings, and bookings.
- **Profile Management:** View and update profile information.
- **Dark/Light Mode:** Switch between light and dark themes.
- **Responsive Design:** Designed for mobile, tablet, and desktop screens.

## Technologies Used

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Lucide React
- Swiper

### Authentication
- Better Auth
- Google Authentication
- JWT

### Backend & Database
- Express.js
- MongoDB

## Project Structure

```text
cat-harry-client/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   └── lib/
├── .env.local
├── package.json
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_CLIENT_REPOSITORY_URL
cd cat-harry-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file and configure the required environment variables for authentication, MongoDB-backed authentication, and the backend API.

Never commit secret keys, database credentials, or OAuth secrets to GitHub.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev
npm run lint
npm run build
```

- `npm run dev` — Starts the development server.
- `npm run lint` — Checks code quality.
- `npm run build` — Creates an optimized production build.

## Backend

The frontend communicates with the separate StudioSpace Express.js backend.

Make sure the backend server and MongoDB connection are running before using features that require API data.

## Responsive Design

StudioSpace supports:
- Mobile devices
- Tablets
- Desktop screens

## Security

- Authentication is handled by Better Auth.
- Protected API operations use JWT verification.
- Sensitive credentials are stored in environment variables.

## License

This project was developed as part of an academic assignment.