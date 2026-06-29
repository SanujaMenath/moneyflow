# Contributing to MoneyFlow

Thank you for considering contributing to MoneyFlow. Please follow these guidelines to keep the process smooth.

## Getting Started

1. Fork the repository.
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/moneyflow.git
   ```
3. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

See the [README](README.md) for platform-specific prerequisites and installation steps.

## Code Style

- **Desktop:** TypeScript + React with strict TSConfig (noUnusedLocals, noUnusedParameters).
- **Mobile:** TypeScript + Expo with the same strict conventions.
- Run `npm run build` before committing to verify no type or lint errors.
- Avoid `console.log` in committed code — use proper error handling instead.
- Keep components focused and colocated with their styles.

## Commit Messages

Follow conventional commits:

- `feat:` — new feature
- `fix:` — bug fix
- `chore:` — maintenance
- `docs:` — documentation
- `refactor:` — code restructuring

## Pull Requests

- Open your PR against the `main` branch.
- Describe what your change does and why.
- Ensure all CI checks pass.
- Keep PRs focused — one feature/fix per PR.

## Reporting Issues

Open an issue [here](https://github.com/SanujaMenath/moneyflow/issues) with:

- A clear title and description.
- Steps to reproduce (if bug).
- Expected vs actual behavior.
- Screenshots if applicable.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
