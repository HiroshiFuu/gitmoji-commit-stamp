# Change Log

## 0.1.1

- Also recognize square-bracket scoped prefixes like `feat[extension]:` / `fix[bug]:`

## 0.1.0

- Recognize scoped Conventional Commits prefixes like `feat(extension):` / `fix(bug)🐛:` and replace them with the newly selected type

## 0.0.2

- Fix: a bare type prefix without emoji (e.g. `fix: something`) is now replaced when picking a new type, instead of getting a second prefix stacked in front
- Rename the `name` field of `gitmojiCommitStamp.customType` items to `description`
- Map default commit types to [Conventional Commits](https://www.conventionalcommits.org/) / Angular convention types (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`)
- Replace strictly conventional default types with more expressive ones where the emoji has a sharper meaning: `hotfix` (🚑️), `init` (🎉), `deploy` (🚀), `release` (🔖), `deps` (⬆️⬇️📌➕➖), `security` (🔒️🔐), `wip` (🚧), `merge` (🔀), `config` (🔧), `i18n` (🌐), `typo` (✏️), and more

## 0.0.1

Initial release.

- Source Control title bar icon that opens a quick pick of commit types (defaults based on [gitmoji](https://gitmoji.dev/))
- Stamps a `<type><emoji>: ` prefix onto the commit message
- Prepends the ticket number (e.g. `RADAR-1234 `) when the branch name matches `<type>/<ticketPrefix>-<digits>`
- Replaces an existing ticket / type prefix instead of stacking
- Configurable via `gitmojiCommitStamp.customType`, `gitmojiCommitStamp.ticketPrefix`, and `gitmojiCommitStamp.ticketPattern`
