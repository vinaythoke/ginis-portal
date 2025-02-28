# Contributing to GINIS Portal

Thank you for your interest in contributing to the GINIS Portal project! This document provides guidelines for contributions and development.

## Development Setup

1. Fork the repository and clone it to your local machine
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Code Structure

Please follow the existing code structure:

- Functional React components (not class components)
- TypeScript for type safety
- Tailwind CSS for styling
- Component-based architecture

## Component Guidelines

### UI Components

- Place base UI components in `/components/ui`
- Follow the shadcn/ui pattern for component design
- Include proper TypeScript typing
- Add JSDoc comments for component props

### Functional Components

- Add clear comments explaining functionality
- Use custom hooks for complex logic
- Use React context for state that needs to be shared across components

## Pull Request Process

1. Create a branch with a descriptive name (e.g., `feature/improved-date-picker`)
2. Make your changes with appropriate tests and documentation
3. Run `npm run lint` to ensure code quality
4. Submit a pull request with a clear description of changes
5. Update the README.md if necessary

## Styling Guidelines

- Use Tailwind CSS classes
- Follow mobile-first approach
- Test on multiple screen sizes
- Ensure proper color contrasts for accessibility

## Commit Guidelines

Use clear, descriptive commit messages:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting, missing semi-colons, etc.
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for updating build tasks, package manager configs, etc.

Example: `feat: add custom date range picker with improved styling`

## Testing

Before submitting your changes, please ensure:

1. The application runs without errors
2. Any new features work as expected
3. Existing functionality is not broken

## License

By contributing, you acknowledge that your contributions will become part of a proprietary software product owned exclusively by the District Planning Commission of Pune District. All contributions must be authorized in writing, and contributors must sign appropriate agreements before their code can be accepted. 