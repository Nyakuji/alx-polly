# 🔖 Polly - Interactive Polling Application

Polly is a modern web application for creating, sharing, and participating in polls. It's designed for communities, teams, and individuals who need a simple, intuitive platform to gather instant feedback and opinions from their audience.

## ✨ Features

- **User Authentication:** Secure user registration and login.
- **Poll Management:** Create, view, and edit your own polls.
- **Interactive Voting:** Participate in polls by casting votes on different options.
- **Real-time Results:** View the results of polls after voting.

## 🛠️ Tech Stack

- **Programming Language:** TypeScript
- **Framework:** Next.js (with React)
- **Backend & Database:** Supabase
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/UI
- **Testing:** Jest, React Testing Library
- **Formatting:** Prettier
- **Package Manager:** npm

## 📂 Project Structure

The project is organized into the following directories:

```
/
├── app/                # Next.js App Router pages and components
│   ├── auth/           # Authentication pages (login, register)
│   ├── components/     # Shared React components
│   ├── polls/          # Poll-related pages (create, view, edit)
│   └── services/       # Business logic and data access
├── context/            # React context providers (e.g., AuthContext)
├── lib/                # Core utilities, type definitions, and Supabase client
├── public/             # Static assets
└── ...                 # Configuration files
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v20.x or later)
- npm
- A Supabase project

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd alx-polly
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add your Supabase project URL and anon key:
    ```
    NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🧠 AI Integration Strategy

This project will leverage AI, specifically through IDE/CLI agents, to accelerate development, improve code quality, and maintain high-quality documentation.

### Code Generation

I will use AI to scaffold new features and components. This includes:
- **Component Scaffolding:** Generating boilerplate for new React components, including props, state management, and basic JSX structure.
- **API Route Generation:** Creating new API endpoints in Next.js, including request/response types and basic logic for interacting with the Supabase backend.
- **Feature Prototyping:** Quickly building out new features, such as a user profile page or a poll results dashboard, which can then be refined.

### Testing

AI will be a key partner in ensuring the application is robust and reliable.
- **Unit Test Generation:** Creating Jest tests for individual functions and components, ensuring that business logic is correct. For example, generating tests for a service function like `poll-service.ts`.
- **Integration Test Scaffolding:** Generating integration test templates that can be filled in to test user flows, such as creating a poll or casting a vote.
- **Test Refinement:** Analyzing existing tests to suggest improvements, add more edge cases, and increase overall test coverage.

### Documentation

AI will help maintain clear and comprehensive documentation.
- **Docstrings & Inline Comments:** Generating JSDoc comments for functions and clarifying complex code blocks with concise inline comments.
- **README Maintenance:** Assisting in updating this `README.md` with new features, architectural changes, and setup instructions.

### Context-Aware Techniques

To ensure the AI generates accurate and relevant code, I will provide it with specific context:
- **API & Schema Definitions:** Supplying the AI with the Supabase database schema or API specifications to generate correct data-access code.
- **File Trees & Code Snippets:** Providing the project's file structure or the content of relevant files (`lib/types.ts`, `app/polls/[id]/page.tsx`, etc.) to give the AI a clear understanding of the existing codebase.
- **Diffs for Refactoring:** When refactoring code, I will provide a `git diff` to the AI, allowing it to understand the proposed changes and provide more accurate suggestions or implementations.
