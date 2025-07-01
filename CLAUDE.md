# Claude Instructions

## Branch Management

- Always create branches using the structure: `users/<github-username>/<feature-name>`
- Example: `users/calebzearing/add-recipe-search`
- Always base new branches off of `main` branch

## Development Workflow

- Always pull from main before committing changes
- Run tests before committing changes
- Check for lint/typecheck commands and run them before completing tasks

## Code Organization

- Abstract code into individual functions, each in their own file when possible
- Write unit tests for each function
- Each function should have a corresponding test file

## Project Commands

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn test` - Run Jest tests
- `yarn test:coverage` - Run tests with coverage
- `yarn lint` - Run ESLint
- `yarn lint:fix` - Fix ESLint issues automatically
- `yarn` - To install package dependencies

## Tech Stack

- Next.js (React framework)
- TypeScript
- Jest for testing
- ESLint for linting
- Fluent UI components
- MongoDB for database

## Security & Best Practices

- Never commit secrets, API keys, or sensitive data
- Use environment variables for configuration
- Follow TypeScript strict mode practices
- Prefer functional components with hooks over class components

## File Naming Conventions

- Use camel casing for component files: `RecipeCard.tsx`
- Use camelCase for utility files: `formatDate.ts`
- Test files should match their source: `RecipeCard.test.tsx`

## Code Quality

- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep functions small and focused (single responsibility)
- Use TypeScript types instead of `any`
