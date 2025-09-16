# Polly - Interactive Polling Application

Polly is a modern web application for creating, sharing, and participating in polls. Get instant feedback from your audience with our intuitive polling platform.

## Features

### User Authentication

- **User Registration**: Secure sign-up with email validation and password strength requirements
- **User Login**: Secure authentication with error handling and validation
- **Form Validation**: Real-time validation feedback as users type with field-specific error messages
- **User Sessions**: Persistent login sessions using Supabase authentication

### Poll Management

- **Poll Creation**: Create custom polls with title, description, and multiple options
- **Poll Viewing**: Browse existing polls with information about votes and creation date
- **Poll Participation**: Vote on polls and see real-time results with percentage visualization
- **Poll Navigation**: Intuitive navigation between polls and poll details

### User Interface

- **Modern UI Components**: Custom form fields, buttons, and inputs with consistent styling
- **Responsive Design**: Mobile-friendly interface that works across devices
- **Toast Notifications**: User-friendly notifications for actions like successful login/registration
- **Loading States**: Visual feedback during form submission with loading spinners
- **Error Handling**: Intuitive error messages with clear recovery paths

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies Used

- **Next.js**: React framework for server-side rendering and static site generation
- **TypeScript**: Type-safe JavaScript for better developer experience
- **Supabase**: Backend-as-a-Service for authentication and database
- **Tailwind CSS**: Utility-first CSS framework for styling

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
