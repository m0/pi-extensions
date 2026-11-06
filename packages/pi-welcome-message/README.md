# @fgladisch/pi-welcome-message

Shows workspace summary in UI when session starts.

Runs on real startup and new sessions (`/new`) in interactive UI. Forks and
headless (`pi -p`) runs are silent. Sections with nothing to show are dropped;
if every section is empty, only the logo header appears when enabled. The welcome
message renders without a custom background, wraps long lines to the terminal
width while preserving leading indentation, and can show a centered gradient Pi
logo header.

The summary is renderer-only: it rides in the message's `details` metadata,
which stays out of the LLM context. The LLM-visible `content` field is empty,
so repo-controlled strings (package.json fields, branch names, commit subjects)
cannot be injected into the conversation via the welcome message.

## Install

From a checkout of this repo:

```bash
pi install ./packages/pi-welcome-message
```

## Example

![Welcome message example](./example.png)

## Summary sections

- **📦 Package**: name, version, and description from `package.json`.
- **🌿 Git**: current branch, working-tree status (clean or dirty shortstat),
  and last 5 commits.
- **Resources**
  - `[Skills]`: registered skill commands.
  - `[Prompts]`: registered prompt commands.
  - `[Extensions]`: extensions installed locally in
    `~/.pi/agent/extensions/` plus any `packages` entries from
    `~/.pi/agent/settings.json`.

## Configuration (`~/.pi/agent/settings.json`)

Configure the welcome message through `welcomeMessage`. A malformed
`settings.json` falls back to defaults and shows a warning notification.

```json
{
  "welcomeMessage": {
    "sections": ["nodePackage", "git", "piResources"],
    "showLogo": true,
    "showOnNewSession": true,
    "logoColor": "orange"
  }
}
```

- `sections`: top-level sections to show.
  - Allowed section names: `nodePackage`, `git`, `piResources`
  - Default when missing/invalid: all sections enabled
  - Empty array (`[]`): disable all welcome output
- `showLogo`: show the centered gradient Pi logo, model line, and surrounding
  header margin, even when no summary sections have content. Defaults to `true`.
- `showOnNewSession`: show the welcome message after `/new`. Defaults to `true`.
- `logoColor`: choose the gradient color family for the Pi logo header.
  - Allowed values: `orange`, `blue`, `green`
  - Default when missing/invalid: `orange`

No slash commands.
