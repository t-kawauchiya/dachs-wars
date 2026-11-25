#!/usr/bin/env bash
# Claude Code が Bash を実行する前に呼ばれる（.claude/settings.json の PreToolUse）。
# main の上で git commit か git push を実行しようとしたら止める。
# 標準入力には、実行しようとしているコマンドを含む JSON が渡される。
# jq や Node.js が見つからずに素通りしないよう、文字列の検索だけで判断する。

input="$(cat)"

if ! grep -qE 'git[^"]*[[:space:]](commit|push)([[:space:]"]|$)' <<<"$input"; then
  exit 0
fi

# コマンドを実行するディレクトリ（JSON の cwd）のブランチを見る。ワークツリーでは別のブランチのことがあるため
cwd="$(sed -n 's/.*"cwd"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' <<<"$input")"
branch="$(git -C "${cwd:-${CLAUDE_PROJECT_DIR:-.}}" branch --show-current 2>/dev/null)"
if [[ "$branch" == "main" ]]; then
  echo "main の上では git commit も git push もしない（docs/workflow.md の「ブランチ」の節）。/start-issue でブランチを切ってから作業する。" >&2
  exit 2
fi

exit 0
