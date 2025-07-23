# Claude Instructions

## Branch Management

- Always create branches using the structure: `users/<github-username>/<feature-name>`
- Example: `users/calebzearing/add-recipe-search`
- Always base new branches off of `main` branch

## Development Workflow

- **CRITICAL**: Always pull from main IMMEDIATELY after creating a branch and before making any changes
- Always pull from main before committing changes
- Run tests before committing changes
- Check for lint/typecheck commands and run them before completing tasks
- **REQUIREMENT**: All PRs must have 0 lint warnings - fix ALL lint issues in files you create/modify

## Branch Workflow Steps

1. Create branch from main: `git checkout main && git pull origin main && git checkout -b users/<username>/<feature>`
2. **IMMEDIATELY** pull main again: `git pull origin main` (to avoid conflicts)
3. Make your changes
4. Pull main one more time before committing: `git pull origin main --rebase`
5. Run yarn build, yarn test, and yarn lint to verify that the CI will succeed.
6. **ALWAYS** run `yarn lint --fix` before committing to auto-fix linting issues
7. **CRITICAL**: Ensure 0 lint warnings in all files you created/modified before final commit
8. Commit and push changes

## Code Organization & Component Abstraction

- **CRITICAL**: Always abstract UI logic into reusable components to minimize code duplication
- Create standardized components for common patterns (search, filtering, galleries, forms)
- Pages should be thin wrappers that use abstracted components (see recipes.tsx vs discover.tsx examples)
- Abstract code into individual functions, each in their own file when possible
- Write unit tests for each function
- Each function should have a corresponding test file
- Before creating inline UI logic, check if similar functionality exists and can be abstracted
- Maintain consistent UI patterns across the application by using shared components

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
