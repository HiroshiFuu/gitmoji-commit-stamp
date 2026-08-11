# Gitmoji Commit Stamp

Adds a `🏷` icon to the Source Control title bar. Clicking it shows a list of gitmoji commit types; picking one stamps a `<ticket> <type><emoji>: ` prefix onto the commit message.

## Features

- Customizable commit type list (emoji + type + description); default emojis and descriptions come from [gitmoji](https://gitmoji.dev/), with types based on [Conventional Commits](https://www.conventionalcommits.org/) (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`, ...) plus expressive extras where the emoji has a sharper meaning (`hotfix`, `init`, `deploy`, `release`, `deps`, `security`, `i18n`, ...)
- Writes a `<type><emoji>: ` prefix into the commit message box
- If the current branch matches `<type>/<ticketPrefix>-<digits>` (e.g. `feat/RADAR-1234` with the default `RADAR` prefix), automatically prepends `RADAR-1234 `
- If the message box already has a `RADAR-xxxx `, `<type><emoji>:`, `<type>:` (e.g. `fix:`), or `<emoji>:` prefix, it is replaced with the newly selected type instead of stacking up

Example: on branch `fix/RADAR-5678` with `feat: login page styles` in the box, selecting `🐛 fix` produces:

```
RADAR-5678 fix🐛: login page styles
```

## Settings

- `gitmojiCommitStamp.customType`: commit type list; each item has `emoji`, `type` (written into the prefix), and `description`
- `gitmojiCommitStamp.ticketPrefix`: ticket number prefix used in branch matching. Default: `RADAR`
- `gitmojiCommitStamp.ticketPattern`: regex to extract the ticket number from the branch name; the first capture group becomes the prefix, and `${prefix}` is replaced with the value of `ticketPrefix`. Default: `^[^/]+/(${prefix}-\d+)`

## Credits

Default commit types are based on [gitmoji](https://gitmoji.dev/) by [Carlos Cuesta](https://github.com/carloscuesta/gitmoji), licensed under MIT.
