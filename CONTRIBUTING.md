# Contributing to LeakJar

First off, thank you for considering contributing to LeakJar! It's people like you that make LeakJar such a great tool.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Git
- A Supabase account
- Access to a ClickHouse database

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/leakjar_nextjs.git
   cd leakjar_nextjs
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your actual values
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Development Process

### Branching Strategy

We use a simplified Git Flow:

- `master` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Creating a Feature Branch

```bash
# Update your local master
git checkout master
git pull origin master

# Create a new feature branch
git checkout -b feature/your-feature-name
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Avoid using `any` type
- Use interfaces over types when possible
- Document complex types with comments

Example:
```typescript
// Good
interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

// Bad
type User = {
  id: any;
  email: string;
}
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use meaningful component names
- Extract reusable logic into custom hooks

Example:
```typescript
// Good
export function UserProfile({ userId }: { userId: string }) {
  const { user, loading } = useUser(userId);
  
  if (loading) return <Skeleton />;
  return <div>{user.name}</div>;
}

// Bad
export default function UP(props: any) {
  // ...
}
```

### File Naming

- Components: PascalCase (`UserProfile.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Hooks: camelCase with "use" prefix (`useAuth.ts`)
- Constants: UPPER_SNAKE_CASE (`API_ROUTES.ts`)

### Code Organization

```typescript
// 1. Imports (external first, then internal)
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. Types/Interfaces
interface Props {
  name: string;
}

// 3. Constants
const MAX_RETRIES = 3;

// 4. Component
export function MyComponent({ name }: Props) {
  // 4a. Hooks
  const [state, setState] = useState();
  
  // 4b. Functions
  const handleClick = () => {
    // ...
  };
  
  // 4c. Effects
  useEffect(() => {
    // ...
  }, []);
  
  // 4d. Render
  return <div>{name}</div>;
}
```

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Use CSS variables for theme colors
- Keep custom CSS minimal

```typescript
// Good
<div className="flex items-center gap-4 p-4 md:p-6">

// Avoid inline styles
<div style={{ padding: '16px' }}>
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples

```bash
# Feature
git commit -m "feat(dashboard): add real-time leak notifications"

# Bug fix
git commit -m "fix(auth): resolve session timeout issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactoring
git commit -m "refactor(api): simplify domain stats endpoint"
```

## Pull Request Process

### Before Submitting

1. **Update your branch** with the latest from master:
   ```bash
   git checkout master
   git pull origin master
   git checkout your-branch
   git rebase master
   ```

2. **Run linting**:
   ```bash
   npm run lint
   ```

3. **Test your changes** thoroughly

4. **Update documentation** if needed

### PR Template

When creating a PR, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
```

### Review Process

1. At least one maintainer must approve
2. All CI checks must pass
3. No unresolved comments
4. Branch must be up-to-date with master

## Project Structure

### Key Directories

```
app/                    # Next.js app directory
├── (auth)/            # Auth-related pages
├── (protected)/       # Protected routes
└── api/               # API routes

components/            # Reusable components
├── ui/               # shadcn/ui components
└── ...               # Feature components

lib/                  # Utilities and configs
├── auth.ts          # Auth utilities
├── clickhouse.ts    # Database client
└── utils.ts         # General utilities

hooks/               # Custom React hooks
```

### Adding New Features

1. **UI Components**: Add to `components/`
2. **Pages**: Add to appropriate `app/` subdirectory
3. **API Routes**: Add to `app/api/`
4. **Utilities**: Add to `lib/` or `utils/`
5. **Hooks**: Add to `hooks/`

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- UserProfile.test.tsx

# Run with coverage
npm test -- --coverage
```

### Writing Tests

- Write tests for new features
- Update tests when modifying existing code
- Aim for meaningful test coverage
- Test edge cases and error scenarios

Example:
```typescript
import { render, screen } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  it('renders user name', () => {
    render(<UserProfile userId="123" />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

## Documentation

### Code Documentation

- Add JSDoc comments for public APIs
- Document complex logic
- Include usage examples for utilities

```typescript
/**
 * Formats a date string to a human-readable format
 * @param date - ISO date string
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted date string
 * @example
 * formatDate('2024-01-01') // "January 1, 2024"
 */
export function formatDate(date: string, locale = 'en-US'): string {
  // ...
}
```

### README Updates

- Update README.md for significant changes
- Document new features
- Update API documentation
- Keep setup instructions current

## Questions?

Feel free to:
- Open an issue for bugs
- Start a discussion for questions
- Reach out to maintainers

Thank you for contributing to LeakJar! 🎉

