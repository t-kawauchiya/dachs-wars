#!/usr/bin/env bash
# GitHub のマージ設定と main のルールセットを、このリポジトリのファイルどおりにする。
# 何度実行しても同じ状態になる。設定の中身は docs/workflow.md の「GitHub の設定」の節を参照。
set -euo pipefail

cd "$(dirname "$0")/.."
repo="$(gh repo view --json nameWithOwner --jq .nameWithOwner)"
ruleset_file=".github/rulesets/main.json"

# マージ方法は Squash だけ。コミットメッセージはプルリクのタイトルと本文。マージ後にブランチを消す
gh api --method PATCH "repos/$repo" \
  -F allow_squash_merge=true \
  -F allow_merge_commit=false \
  -F allow_rebase_merge=false \
  -F delete_branch_on_merge=true \
  -f squash_merge_commit_title=PR_TITLE \
  -f squash_merge_commit_message=PR_BODY \
  --silent

# 同じ名前のルールセットがあれば上書きし、なければ作る
name="$(node -p "require('./$ruleset_file').name")"
id="$(gh api "repos/$repo/rulesets" --jq ".[] | select(.name == \"$name\") | .id")"
if [[ -n "$id" ]]; then
  gh api --method PUT "repos/$repo/rulesets/$id" --input "$ruleset_file" --silent
  echo "ルールセット「${name}」を更新しました"
else
  gh api --method POST "repos/$repo/rulesets" --input "$ruleset_file" --silent
  echo "ルールセット「${name}」を作りました"
fi
echo "マージ設定を更新しました"
