# AGENTS.md

Guidance for coding agents working in this repository. See [CLAUDE.md](CLAUDE.md) for architecture and commands.

## Shipping workflow

After making changes and before `git push`, run `npm run build` from the project root. Resolve all build errors before pushing. Treat a green production build as a gate for pushes (alongside lint when relevant).
