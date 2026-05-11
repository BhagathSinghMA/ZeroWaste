# Contributing to EcoFeast

Thank you for your interest in contributing to EcoFeast! This document provides guidelines and instructions for contributing to the project.

## 🤝 Code of Conduct

Be respectful, inclusive, and professional. We're building a community to reduce food waste and help others.

## 🚀 How to Contribute

### 1. Report a Bug

Found a bug? [Open an issue](https://github.com/yourusername/ecofeast/issues/new?template=bug_report.md) with:

- Clear title describing the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Your environment (OS, Node version, etc.)

### 2. Suggest a Feature

Want to improve EcoFeast? [Create a feature request](https://github.com/yourusername/ecofeast/issues/new?template=feature_request.md) with:

- Clear description of the feature
- Use cases and benefits
- Possible implementation approach

### 3. Submit Code Changes

#### Setup Development Environment

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/yourusername/ecofeast.git
cd ecofeast

# 3. Create a feature branch
git checkout -b feature/your-feature-name

# 4. Install dependencies
npm install
cd ai_module && pip install -r requirements.txt && cd ..

# 5. Make your changes
# 6. Test thoroughly
npm run lint
npm run build
```

#### Commit Guidelines

- Use meaningful commit messages: `feat: add waste prediction`, not `update`
- Format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

```bash
git commit -m "feat(ai): improve waste prediction accuracy"
```

#### Push & Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then [create a Pull Request](https://github.com/yourusername/ecofeast/compare) with:

- Clear PR title
- Description of changes
- Linked issue (if applicable)
- Screenshot/demo (for UI changes)
- Checklist of what was tested

### 4. Documentation

Improve docs by:

- Fixing typos or unclear sections
- Adding examples
- Updating API documentation
- Translating to other languages

## 📋 Development Standards

### Frontend (React/TypeScript)

- Use functional components with hooks
- Follow existing code style
- Add TypeScript types (no `any` unless necessary)
- Write comments for complex logic
- Test components before submitting

### Backend (Node.js/Express)

- Use async/await for asynchronous code
- Add proper error handling
- Validate input parameters
- Log important operations
- Follow REST API conventions

### Python/AI Module

- Follow PEP 8 style guide
- Include docstrings for functions
- Add type hints
- Test with sample data
- Document model changes

## 🧪 Testing

Before submitting:

```bash
# Type check
npm run lint

# Build
npm run build

# Test locally
npm run dev
```

For significant changes, add tests and document them in your PR.

## 📦 Pull Request Process

1. **Ensure your code builds**: `npm run build`
2. **No TypeScript errors**: `npm run lint`
3. **Test locally**: `npm run dev`
4. **Update documentation** if needed
5. **Rebase on main**: `git rebase origin/main`
6. **Request review** from maintainers
7. **Address feedback** and push updates

## 🎯 Areas for Contribution

### High Priority

- [ ] Improve ML model accuracy
- [ ] Add more comprehensive error handling
- [ ] Write unit tests
- [ ] Implement JWT authentication
- [ ] Add input validation

### Medium Priority

- [ ] Improve UI/UX
- [ ] Add dark mode
- [ ] Performance optimization
- [ ] Database query optimization
- [ ] API documentation

### Low Priority

- [ ] Code refactoring
- [ ] README improvements
- [ ] TypeScript migration (if applicable)
- [ ] Adding comments

## ❓ Questions?

- Check [Discussions](https://github.com/yourusername/ecofeast/discussions)
- Open an [issue](https://github.com/yourusername/ecofeast/issues)
- Email: contact@ecofeast.example.com

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making food waste reduction possible! 🌿**
