# Next.js Asset Tracker - A To-Do & Finance Management Application

An all-in-one full-stack application that combines a to-do list with personal finance tracking. This project demonstrates proficiency in building robust and responsive web applications with **Next.js 15 (App Router)** and modern web technologies.

## ✨ Features

  * **Comprehensive To-Do List:** Create, edit, and delete tasks with completion status tracking.
  * **Detailed Asset Tracking:** Record income and expenses with customizable categories and descriptions.
  * **Advanced Data Management:**
      * **Dynamic Calculations:** Automatically computes and displays total income, total expenses, and current balance in real-time.
      * **Filtering & Sorting:** Efficiently filter assets by date, category, and type (income/expense).
  * **Full-Stack Architecture:**
      * **Client-Side:** Utilizes **React Query** for efficient data fetching and caching, ensuring a smooth user experience.
      * **Server-Side:** Leverages **Next.js API Routes** to handle data transactions securely.
  * **User Authentication:** Secure user sessions with **NextAuth.js**.
  * **Responsive UI:** A clean, mobile-first design built with **Tailwind CSS** and **Shadcn UI** for a consistent and accessible user experience across all devices.

## 🛠️ Tech Stack

This project was built using the following technologies:

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Next.js 15** | App Router architecture for robust routing and server-side rendering. |
| **Styling** | **Tailwind CSS** | Utility-first CSS framework for rapid UI development. |
| **Components** | **Shadcn UI** | Reusable, accessible UI components. |
| **State Management** | **React Query** | Handles server state management, caching, and background data synchronization. |
| **Authentication** | **NextAuth.js** | Manages secure user authentication and sessions. |
| **Forms** | **React Hook Form** | Efficient and flexible form management. |
| **Validation** | **Zod** | Schema validation for secure and type-safe data handling. |
| **UI Utilities** | **Radix UI** | Primitives for building accessible and high-quality UI components. |
| **Deployment** | **Vercel** | Seamless deployment and continuous integration. |

## 💡 Key Learnings & Challenges

The most significant technical challenge was developing the complex logic within the `src/app/(asset)/asset-list/page.tsx` page. This required careful planning to ensure data integrity and provide a performant user experience.

  * **Challenge:** Implementing dynamic and instant calculations for a user's financial overview (total income, expenses, balance) while allowing for real-time filtering and sorting.
  * **Solution:**
      * Utilized **React Query's** `useQuery` to fetch asset data and `useMutation` for creating/updating/deleting records, ensuring the UI always reflects the latest state from the server.
      * Engineered a data processing pipeline that efficiently recalculates financial summaries client-side, using optimized array methods to prevent performance bottlenecks.
      * Implemented robust error handling and loading states to provide clear feedback to the user during data fetching.

This process solidified my understanding of efficient client-server data synchronization and performance optimization in a modern React application.

## 🚀 Getting Started

Follow these steps to get a copy of the project up and running on your local machine.

### Prerequisites

You must have **Node.js** and **npm** installed.

### Installation 
1.  Clone the repository:
    ```bash
    git clone https://github.com/joanchiung/asset-tracker.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd asset-tracker
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Create a `.env.local` file in the root directory and add your environment variables.
    ```
    # Example:
    DATABASE_URL="your_database_connection_string"
    NEXTAUTH_SECRET="your_nextauth_secret"
    ```

### Running the Development Server

Start the development server with:

```bash
npm run dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser to see the result.
