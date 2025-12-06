# Tendra
An RFP application for request and approval services.

# Installing dependencies
This project is based on Turbo.js so it maintains all it's dependencies

```
npm install
```

# Running the application
To run the application, use the following command:

```
npm run dev
```

# Frontend
The apps/web folder has a Next.js application for the frontend of the application.

# Backend
The apps/api folder has a Express application for the backend of the application.

# Database
the database is a postgresql database

# LLM
Currently, the application uses Gemini Flash 2.0 model for generating responses.

# Webhooks
The `/proposals` endpoint is used to receive proposals from the email service.
