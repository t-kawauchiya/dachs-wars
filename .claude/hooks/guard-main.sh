#!/usr/bin/env bash
# Claude Code が Bash を実行する前に呼ばれる（.claude/settings.json の PreToolUse）。
# main の上で git commit か git push を実行しようとしたら止める。
# 標準入力には、実行しようとしているコマンドと作業ディレクトリ（cwd）を含む JSON が渡される。
#
# うっかり防止のためのもので、すべての書き方は見抜かない。
# 「cd 別の場所 && git commit」や、同じコマンドの中で main に切り替えてからのコミットは止めない。
# main への push は、GitHub のルールセットが必ず拒否する。

input="$(</dev/stdin)"

block() {
  echo "$1" >&2
  exit 2
}

# jq がないと JSON を正しく読めない。素通りさせず、commit か push を含むコマンドは止める
if ! command -v jq >/dev/null 2>&1; then
  if [[ "$input" == *commit* || "$input" == *push* ]]; then
    block "jq が見つからないため、main の上での git commit と git push を見分けられない。jq を入れるか、オーナーに頼む。"
  fi
  exit 0
fi

command="$(jq -r '.tool_input.command // empty' <<<"$input")"
cwd="$(jq -r '.cwd // empty' <<<"$input")"
cwd="${cwd:-${CLAUDE_PROJECT_DIR:-.}}"

# ; & | ( ) と改行で区切った1つ1つのコマンドを見る
while IFS= read -r segment; do
  read -ra words <<<"$segment"
  i=0
  # 先頭の環境変数の設定（FOO=1 git commit）を飛ばす
  while [[ $i -lt ${#words[@]} && "${words[$i]}" =~ ^[A-Za-z_][A-Za-z0-9_]*= ]]; do
    i=$((i + 1))
  done
  [[ "${words[$i]:-}" == "git" || "${words[$i]:-}" == */git ]] || continue
  i=$((i + 1))

  # git のオプションを飛ばし、サブコマンドを探す。-C があれば、その場所のブランチを見る
  dir="$cwd"
  while [[ $i -lt ${#words[@]} ]]; do
    case "${words[$i]}" in
      -C)
        path="${words[$((i + 1))]:-}"
        [[ "$path" == /* ]] && dir="$path" || dir="$cwd/$path"
        i=$((i + 2))
        ;;
      -c) i=$((i + 2)) ;;
      -*) i=$((i + 1)) ;;
      *) break ;;
    esac
  done

  case "${words[$i]:-}" in
    commit | push)
      if [[ "$(git -C "$dir" branch --show-current 2>/dev/null)" == "main" ]]; then
        block "main の上では git commit も git push もしない（docs/workflow.md の「ブランチ」の節）。/start-issue でブランチを切ってから作業する。"
      fi
      ;;
  esac
done < <(tr ';&|()' '\n\n\n\n\n' <<<"$command")

exit 0
