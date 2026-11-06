# pi-extensions

Monorepo for personal Pi extensions.

![Example](assets/example.png)

This root workspace holds shared tooling. Source-of-truth extension code
and full documentation live in `packages/`.

## Packages

- [`@fgladisch/pi-footer`](packages/pi-footer/README.md): Replaces Pi's footer with a configurable compact model, thinking, context usage, project, git branch, and extension status summary.
- [`@fgladisch/pi-user-select`](packages/pi-user-select/README.md): Adds a `user_select` tool so Pi can ask humans multiple-choice questions in workflow.
- [`@fgladisch/pi-welcome-message`](packages/pi-welcome-message/README.md): Shows a configurable startup and `/new` workspace summary with package info, git status, useful resource links, and optional logo header.
- [`@fgladisch/pi-zsh-shell`](packages/pi-zsh-shell/README.md): Runs Pi user bash commands through zsh and sources Pi-specific functions from `~/.pi/agent/zsh-functions`.

## Development Layout

Each package keeps extension source under `packages/pi-*/extensions/`:

- `index.ts` is the Pi extension entrypoint.
- `utils.ts` (or `utils/*`) contains package-local helpers.
- `models/*.model.ts` contains package-local type aliases/models.
- `models/*.enum.ts` contains package-local enums.
- `models/index.ts` is the package-local barrel; extension files import models/enums from `./models`.
