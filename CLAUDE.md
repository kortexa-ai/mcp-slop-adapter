# MCP-SLOP-ADAPTER Development Reference

## Commands
```
npm start         # Start development server with hot reload
npm run dev       # Alias for npm start
npm run build     # Build production version
npm run lint      # Run ESLint
npm run lint:fix  # Fix linting issues
npm run typecheck # Run TypeScript type checking
npm run test      # Run tests (vitest)
npm run test:watch # Run tests in watch mode
npm test -- path/to/file.test.ts # Run single test file
npm run validate  # Run typecheck, lint, and tests
```

## Code Style Guidelines
- **TypeScript**: Use strict typing with no explicit `any`
- **Imports**: Use type imports with `import type` syntax
- **Naming**: camelCase for variables/functions, PascalCase for classes/types
- **Error Handling**: Prefer explicit error handling over try/catch
- **Formatting**: ESNext modules, modern JS features
- **Convention**: Unused variables/parameters should use `_` prefix
- **Files**: Use .ts extension for TypeScript files
- **Structure**: Keep related code in appropriate directories