# X 投稿案

## 投稿案 1: ローンチ告知

OSS メンテナー向けの read-only AI 補助ツール「MaintainerOps AI」を作っています。

PR や Issue から、要約、リスクレベル、推奨ラベル、レビューチェックリスト、セキュリティメモ、返信ドラフトを生成します。

自動で merge / close / label / release はしません。API キーなしでも offline mode で試せます。

```bash
npm install -g maintainerops-ai@latest
maintainerops --help
```

https://github.com/rtonf/maintainerops-ai

## 投稿案 2: 課題訴求

OSS の PR レビューや Issue triage は、地味だけど重い作業です。

MaintainerOps AI は、メンテナーの代わりに判断するツールではなく、判断前に読むための「レビュー・トリアージ packet」を作る read-only 補助ツールです。

要約、リスク、ラベル案、確認項目、セキュリティメモ、返信ドラフトまで出します。

https://github.com/rtonf/maintainerops-ai

## 投稿案 3: feedback 募集

MaintainerOps AI の初期 feedback を募集しています。

OSS メンテナー向けに、PR / Issue を read-only で分析してレビュー・トリアージ packet を作るツールです。

```bash
npm install -g maintainerops-ai@latest
maintainerops --help
```

感想はこちらにお願いします:
https://github.com/rtonf/maintainerops-ai/issues/6

## 投稿案 4: 英語

I built MaintainerOps AI for OSS maintainers.

It turns PRs and issues into read-only, human-reviewed triage packets:

- summary
- risk level
- suggested labels
- review checklist
- security notes
- release-note hints
- draft response

It does not merge, close, label, or publish automatically.

https://github.com/rtonf/maintainerops-ai
