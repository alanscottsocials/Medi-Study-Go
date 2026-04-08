# Project Structure Reference

This document explains the folder structure used in the **Medi-Study-Go** project. Following this structure ensures consistency and help both human developers and AI assistants navigate the codebase efficiently.

## Directory Overview

`Medi-Study-Go/`
├── `public/`             # Static assets (favicon, icons, etc.)
├── `src/`                # Main source code
│   ├── `assets/`         # Images, fonts, and global icons
│   ├── `components/`     # Reusable UI components
│   │   ├── `common/`     # Shared, low-level components (Buttons, Inputs)
│   │   └── `layout/`     # Global layout components (Header, Navbar, Footer)
│   ├── `pages/`          # Components representing entire pages/routes
│   ├── `features/`       # Business logic grouped by feature (e.g., Auth, Tests)
│   ├── `hooks/`          # Custom React hooks
│   ├── `services/`       # API integration, fetch/axios logic
│   ├── `utils/`          # Helper functions, formatters, and constants
│   ├── `context/`        # React Context providers for global state
│   ├── `store/`          # State management (if using Zustand/Redux)
│   ├── `types/`          # TypeScript type definitions (if applicable)
│   ├── `App.jsx`         # Main App component
│   ├── `main.jsx`        # Application entry point
│   └── `index.css`       # Global styles (Tailwind v4)
├── `vite.config.js`      # Vite configuration
├── `package.json`        # Dependencies and scripts
└── `README.md`           # Project overview

## Best Practices

1. **Keep Components Small**: Break down large components into smaller, reusable ones in `components/common`.
2. **Feature Grouping**: If a component or logic is only used by one feature, place it in `features/[feature-name]`.
3. **Lazy Loading**: Import pages using `React.lazy` to optimize performance.
4. **Service Isolation**: Keep API calls in `services/` instead of directly in components.

> [!TIP]
> When adding a new file, refer to this guide to decide where it belongs. If you're unsure, ask!
