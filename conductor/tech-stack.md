# Technology Stack: Pixmi Obsidian WeChat Publisher

## Core Development
- **Language:** TypeScript
    - Provides strong typing and modern features for a robust and maintainable codebase.
- **Runtime:** Node.js (via Obsidian's Electron environment)
- **Framework:** Obsidian Plugin API
    - The essential framework for building native extensions for Obsidian.

## Build & Package Management
- **Package Manager:** npm
- **Bundler:** Vite
    - Chosen for its exceptional speed and modern developer experience, ensuring fast builds and HMR during development.

## Testing & Quality Assurance
- **Test Runner:** Vitest
    - A Vite-native unit testing framework that is extremely fast and integrates seamlessly with our build tool.
- **Linting:** ESLint
    - To enforce code quality and consistent styling.
- **Formatting:** Prettier
    - To automatically format code and reduce style-related friction in reviews.

## User Interface & Styling
- **Styling Method:** Standard CSS/SCSS with CSS Modules
    - Uses CSS Modules to ensure style encapsulation and prevent conflicts.
- **Theming:** Obsidian CSS Variables
    - Leverages Obsidian's native variables to ensure the plugin perfectly matches the user's active theme (light/dark/custom).

## Network & APIs
- **HTTP Client:** Axios
    - A reliable and feature-rich library for handling communication with the WeChat Official Account API.
