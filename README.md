# Maison by Kimberly

A full-stack e-commerce project with a React + Vite frontend and an Express backend.

## Project Structure

- `frontend/` - React app built with Vite and Tailwind CSS
- `backend/` - Express server with file upload support and MySQL integration

## Frontend

### Install dependencies

```bash
cd frontend
npm install
```

### Run development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Backend

### Install dependencies

```bash
cd backend
npm install
```

### Run server

```bash
npm start
```

### Run in development mode

```bash
npm run dev
```

### Email configuration

Copy `backend/.env.example` to `backend/.env` and set the private `RESEND_API_KEY`, verified `EMAIL_FROM`, and `MERCHANT_NOTIFICATION_EMAIL` values. The checkout posts to `/api/orders`; the backend sends a buyer invoice and a separate merchant order notification through Resend. Connect a real payment provider webhook to this endpoint before treating an order as paid.

The browser may use `frontend/.env` for non-secret `VITE_*` values such as `VITE_API_BASE_URL`. Never place Resend keys, SMTP credentials, or the merchant email in frontend environment variables: Vite exposes `VITE_*` values in the browser bundle.

## Notes

- `node_modules/` is excluded from version control.
- `.gitattributes` is added for consistent line endings.
- `backend/package-lock.json` and `frontend/package-lock.json` are tracked to lock dependency versions.

## GitHub

This repository is pushed to:

`https://github.com/Kimberly2710/Maison-by-Kimberly`
