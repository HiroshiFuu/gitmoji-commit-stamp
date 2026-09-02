const vscode = require('vscode');

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('gitmojiCommitStamp.selectType', selectType)
  );
}

function deactivate() {}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function getRepository() {
  const gitExt = vscode.extensions.getExtension('vscode.git');
  if (!gitExt) {
    vscode.window.showErrorMessage('Built-in Git extension not found');
    return undefined;
  }
  const git = (await gitExt.activate()).getAPI(1);
  const repos = git.repositories;
  if (repos.length === 0) {
    vscode.window.showErrorMessage('No Git repository is open');
    return undefined;
  }
  if (repos.length === 1) {
    return repos[0];
  }
  // With multiple repos, prefer the one containing the active editor file,
  // otherwise ask the user
  const activeUri = vscode.window.activeTextEditor?.document.uri;
  if (activeUri) {
    const match = repos.find((r) =>
      activeUri.fsPath.toLowerCase().startsWith(r.rootUri.fsPath.toLowerCase())
    );
    if (match) return match;
  }
  const picked = await vscode.window.showQuickPick(
    repos.map((r) => ({ label: r.rootUri.fsPath, repo: r })),
    { placeHolder: 'Select a Git repository' }
  );
  return picked?.repo;
}

async function selectType() {
  const repo = await getRepository();
  if (!repo) return;

  const config = vscode.workspace.getConfiguration('gitmojiCommitStamp');
  const types = config.get('customType') || [];
  if (types.length === 0) {
    vscode.window.showWarningMessage(
      'gitmojiCommitStamp.customType is empty; configure commit types first'
    );
    return;
  }

  const picked = await vscode.window.showQuickPick(
    types.map((t) => ({
      label: `${t.emoji} ${t.type}`,
      description: t.description,
      commitType: t,
    })),
    { placeHolder: 'Select a commit type', matchOnDescription: true }
  );
  if (!picked) return;

  repo.inputBox.value = buildMessage(
    repo.inputBox.value || '',
    repo.state.HEAD?.name || '',
    picked.commitType,
    config.get('ticketPattern'),
    config.get('ticketPrefix')
  );

  vscode.commands.executeCommand('workbench.scm.focus');
}

// Matches one emoji: a pictographic (with optional variation selector),
// optionally extended by ZWJ sequences (e.g. 🧑‍💻)
const EMOJI_RE_SRC =
  '\\p{Extended_Pictographic}\\uFE0F?(?:\\u200D\\p{Extended_Pictographic}\\uFE0F?)*';

/**
 * Build the new commit message:
 * 1. If the branch name matches ticketPattern (default <type>/<ticketPrefix>-<digits>),
 *    prefix the message with "<ticketPrefix>-<digits> "
 * 2. If the current message already starts with "<ticket> ", "<emoji>:",
 *    "<type>:", "<type>(<scope>):", "<type>[<scope>]:", or "<type><emoji>:",
 *    strip the old prefix (scope included) and replace it with the selected
 *    type and emoji
 */
function buildMessage(current, branch, selected, ticketPattern, ticketPrefix) {
  let ticket = '';
  if (ticketPattern) {
    const resolved = ticketPattern.replace(
      /\$\{prefix\}/g,
      escapeRegExp(ticketPrefix || 'RADAR')
    );
    try {
      const m = branch.match(new RegExp(resolved));
      if (m) ticket = m[1] || m[0];
    } catch (e) {
      vscode.window.showWarningMessage(`ticketPattern is not a valid regex: ${e.message}`);
    }
  }

  let rest = current;

  // Strip an existing ticket prefix, e.g. "RADAR-1234 "
  const ticketMatch = rest.match(/^([A-Z][A-Z0-9]*-\d+)[ :]\s*/);
  if (ticketMatch) {
    if (!ticket) ticket = ticketMatch[1];
    rest = rest.slice(ticketMatch[0].length);
  }

  // Strip an existing prefix: "<type><emoji>:", a bare type word like "fix:",
  // a scoped "<type>(<scope>):" / "<type>[<scope>]:", or a bare "<emoji>:";
  // full-width colon supported
  const prefixRe = new RegExp(
    `^(?:[\\w-]+(?:\\([^()]*\\)|\\[[^\\[\\]]*\\])?\\s*(?:${EMOJI_RE_SRC})?|${EMOJI_RE_SRC})\\s*[:：]\\s*`,
    'u'
  );
  rest = rest.replace(prefixRe, '');

  const prefix = ticket ? `${ticket} ` : '';
  return `${prefix}${selected.type}${selected.emoji}: ${rest}`;
}

module.exports = { activate, deactivate, buildMessage };
