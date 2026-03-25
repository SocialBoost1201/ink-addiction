---
name: commit-analyzer
description: Analyzes commit patterns to understand change risk and behavior. Use when reviewing changes before deployment, auditing repository history, or assessing risk of a set of commits.
---

# commit-analyzer

## When to Use
- Before deploying to production
- Reviewing PRs for risk assessment
- Understanding what changed in a date range
- Identifying risky commits

## Analysis Steps

### 1. Gather Commits
```bash
git log --oneline -20
git log --since="1 week ago" --oneline
git log main..HEAD --oneline
```

### 2. Risk Classification
| Risk Level | Indicators |
|------------|------------|
| High | Database migrations, auth changes, breaking API changes |
| Medium | New features, dependency upgrades, config changes |
| Low | Bug fixes, docs, style, tests |

### 3. Change Volume Assessment
```bash
git diff --stat HEAD~10..HEAD
git log --shortstat -10
```

### 4. Output Format
- **Total commits**: N
- **Risk summary**: X high / Y medium / Z low
- **Key changes**: List notable commits
- **Deployment recommendation**: Safe / Review needed / Hold
