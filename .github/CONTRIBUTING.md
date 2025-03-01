# Contributing to ModernShop

Thank you for considering contributing to ModernShop! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others.

## How Can I Contribute?

### Reporting Bugs

- Check if the bug has already been reported in the Issues section
- Use the bug report template when creating a new issue
- Include detailed steps to reproduce the bug
- Include screenshots if applicable
- Specify your operating system, browser, and their versions

### Suggesting Features

- Check if the feature has already been suggested in the Issues section
- Use the feature request template when creating a new issue
- Provide a clear description of the feature and its benefits
- Include mockups or examples if possible

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature or bugfix (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Run tests to ensure your changes don't break existing functionality
5. Commit your changes with clear, descriptive commit messages
6. Push your branch to your fork
7. Submit a pull request to the main repository

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/danipabernales/modern-ecommerce.git
   cd modern-ecommerce
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Coding Guidelines

### JavaScript/TypeScript

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Use async/await instead of promises where appropriate

### CSS/Styling

- Use Tailwind CSS classes for styling
- Follow the existing color scheme and design patterns
- Ensure responsive design for all screen sizes

### Components

- Create reusable components when possible
- Use functional components with hooks
- Keep components focused on a single responsibility
- Document component props with TypeScript interfaces

## Testing

- Write tests for new features
- Ensure all tests pass before submitting a pull request
- Test your changes in different browsers

## Documentation

- Update the README.md if your changes require it
- Document new features or changes in behavior
- Add comments to your code where necessary

## Questions?

If you have any questions about contributing, please open an issue with your question.

Thank you for contributing to ModernShop!