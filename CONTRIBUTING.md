# Contributing to SprintFund

Thank you for your interest in contributing to SprintFund! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- [Clarinet](https://github.com/hirosystems/clarinet) for smart contract development
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mosas2000/SprintFund.git
   cd SprintFund
   ```

2. **Install dependencies**
   ```bash
   # Root dependencies
   npm install
   
   # Frontend dependencies
   cd frontend && npm install
   ```

3. **Run the development server**
   ```bash
   cd frontend && npm run dev
   ```

4. **Run smart contract tests**
   ```bash
   clarinet test
   ```

## Code Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow the existing ESLint configuration
- Run `npm run lint` before committing
- Format code with Prettier: `npm run format`

### Clarity (Smart Contracts)

- Follow Clarity best practices
- Include comprehensive tests for all public functions
- Document all public functions with comments

### Commits

- Use clear, descriptive commit messages
- Follow conventional commits format: `type(scope): description`
- Examples:
  - `feat(frontend): add proposal filtering`
  - `fix(contracts): correct vote tallying logic`
  - `docs: update README with setup instructions`

## How to Contribute

### Reporting Bugs

1. Check existing issues to avoid duplicates
2. Use the bug report template if available
3. Include:
   - Clear description of the issue
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, browser, Node version)

### Suggesting Features

1. Check existing issues and discussions
2. Describe the feature and its use case
3. Explain why it benefits the project

### Submitting Pull Requests

1. **Fork and branch**
   - Fork the repository
   - Create a feature branch: `git checkout -b feat/your-feature`

2. **Make changes**
   - Keep changes focused and minimal
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   # Run frontend tests
   cd frontend && npm test
   
   # Run contract tests
   clarinet test
   
   # Check linting
   npm run lint
   ```

4. **Submit PR**
   - Push to your fork
   - Open a PR against `main`
   - Fill out the PR template
   - Link related issues

5. **Code Review**
   - Address reviewer feedback
   - Keep discussions constructive

## Project Structure

```
sprintfund/
├── contracts/          # Clarity smart contracts
├── frontend/           # Next.js frontend application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions
│   │   ├── services/   # API services
│   │   ├── store/      # Zustand state management
│   │   └── types/      # TypeScript types
├── scripts/            # Deployment and utility scripts
└── tests/              # Integration tests
```

## Getting Help

- Open a GitHub issue for bugs or questions
- Check existing documentation in the `docs/` folder
- Review closed issues for similar problems

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
