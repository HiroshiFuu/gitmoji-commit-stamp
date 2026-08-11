# Change Log

## 0.0.1

Initial release.

- Source Control title bar icon that opens a quick pick of commit types (defaults based on [gitmoji](https://gitmoji.dev/))
- Stamps a `<type><emoji>: ` prefix onto the commit message
- Prepends the ticket number (e.g. `RADAR-1234 `) when the branch name matches `<type>/<ticketPrefix>-<digits>`
- Replaces an existing ticket / type prefix instead of stacking
- Configurable via `gitmojiCommitStamp.customType`, `gitmojiCommitStamp.ticketPrefix`, and `gitmojiCommitStamp.ticketPattern`
