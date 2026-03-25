---
name: conventional-commits
description: Formats commit messages to the Conventional Commits standard. Use when committing code changes, creating git commit messages, or when user asks to commit, save changes, or push code. Ensures messages follow the pattern type(scope):description
---

# conventional-commits

## Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

## Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Formatting (no logic change)
- **refactor**: Code restructuring
- **perf**: Performance improvement
- **test**: Adding/fixing tests
- **chore**: Build process, dependencies
- **ci**: CI/CD changes
- **revert**: Reverting a commit

## Rules
1. Description: imperative, present tense ("add" not "added")
2. No period at end of description
3. Breaking changes: add `!` after type or `BREAKING CHANGE:` in footer
4. Scope: optional, describes affected area (e.g., auth, api, ui)

## Examples
```
feat(auth): add OAuth2 login support
fix(api): resolve null pointer in user endpoint
docs: update README with installation steps
chore(deps): upgrade Next.js to 15.3.0
feat!: redesign API response format
```

## Workflow
1. Review staged changes with `git diff --staged`
2. Identify primary change type
3. Determine scope from affected files
4. Write concise description
5. Add body if change needs explanation
6. Add footer for breaking changes or issue references
