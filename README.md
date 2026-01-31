# EduSync AI - Frontend Source

This includes the full React + Vite frontend for EduSync AI.

## Quick Start

1.  Open your terminal in this folder.
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

## Features Included

-   **Student Portal**: Dashboard, Syllabus Intelligence, Study Sprint (Pomodoro).
-   **Admin Portal**: Retention Intelligence, Faculty Alerts.
-   **Theming**: Light, Dark, and Low-Stimulation (Accessible) modes.
-   **Architecture**: Context-based state, Clean React components, Vanilla CSS variables.

## Note on Backend

This is a frontend-only build with rich mock data located in `src/data/mock.js`.
To connect a backend, replace the direct imports from `mock.js` with API calls.
