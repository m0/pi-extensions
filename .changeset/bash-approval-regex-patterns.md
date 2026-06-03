---
"@fgladisch/pi-bash-approval": minor
---

Add `regex:` pattern support to the bash approval allow-list. Lines starting with
`regex:` are compiled as JavaScript regular expressions and matched against the
normalized command segment with an implicit `^(?:...)$` anchor (full-match,
single-line, case-sensitive). Invalid patterns are dropped on load and surfaced
via `console.warn`, `/bash-approval-reload`, and `/bash-approval-list`.
