# MaintainerOps AI 拡散プラン

この文書は、MaintainerOps AI を OSS メンテナー、セキュリティ意識の高いプロジェクト所有者、GitHub Action 利用者へ届けるための実行計画です。

## まず伝える価値

- PR レビューと Issue トリアージの下書きを作る。
- 自動で merge、close、label、release、publish はしない。
- npm CLI で 1 コマンド試用できる。
- GitHub Action として read-only 権限で導入できる。
- OpenAI API キーなしでも offline mode で動作確認できる。
- eval、セキュリティレビュー、実例 packet、Marketplace release 証跡を公開している。

## 優先アクション

1. GitHub Marketplace が最新 Action release を表示していることを確認する。
2. README、npm、Marketplace、Issue #6 の導線をそろえる。
3. 所有している公開 repo で実際の review packet 例を追加する。
4. X、note、LinkedIn、Mastodon、Dev.to などに短い紹介文を投稿する。
5. OSS メンテナー 5-10 人に個別 DM またはメールで試用依頼を送る。
6. 反応が出たら、良い feedback を README や case study に反映する。
7. Hacker News の Show HN は、npm、Marketplace、README、実例がさらに揃ってから投稿する。

## 短い日本語投稿

OSS メンテナー向けの read-only AI 補助ツール、MaintainerOps AI を作っています。

PR や Issue から、人間が確認して使うレビュー・トリアージ packet を生成します。

- 要約
- リスクレベル
- 推奨ラベル
- レビューチェックリスト
- セキュリティメモ
- リリースノートのヒント
- 返信ドラフト

自動で merge、close、label、release はしません。OpenAI API キーなしでも offline mode で試せます。

```bash
npm install -g maintainerops-ai@latest
maintainerops --help
```

GitHub: https://github.com/rtonf/maintainerops-ai  
npm: https://www.npmjs.com/package/maintainerops-ai  
Marketplace: https://github.com/marketplace/actions/maintainerops-ai

## 英語投稿

I built MaintainerOps AI for open-source maintainers who need help reviewing PRs and triaging issues without giving automation write access.

It generates structured, human-reviewed packets with a summary, risk level, suggested labels, review checklist, security notes, release-note hints, and an optional draft response.

It is read-only by design, works offline for safe CI validation, and only uses the OpenAI API when explicitly configured.

```bash
npm install -g maintainerops-ai@latest
maintainerops --help
```

GitHub: https://github.com/rtonf/maintainerops-ai  
npm: https://www.npmjs.com/package/maintainerops-ai  
Marketplace: https://github.com/marketplace/actions/maintainerops-ai

## 個別依頼文

MaintainerOps AI の初期 feedback を集めています。

OSS メンテナー向けに、PR や Issue から read-only のレビュー・トリアージ packet を作るツールです。勝手に merge、close、label、comment はしません。

もしよければ、以下だけ試して Issue #6 に短い感想をもらえると助かります。

```bash
npm install -g maintainerops-ai@latest
maintainerops --help
```

Feedback issue: https://github.com/rtonf/maintainerops-ai/issues/6

見てほしい点:

- install / exec が通るか
- 実際の PR / Issue triage に役立ちそうか
- ノイズや不足があるか
- read-only GitHub Action として使いたいか

## 投稿前チェック

- [ ] npm の最新バージョンと README の説明が一致している。
- [ ] GitHub Action の最新 release が Marketplace に反映されている。
- [ ] Issue #6 が開いていて README から辿れる。
- [ ] `npm install -g maintainerops-ai@latest`後に`maintainerops --help`が動く。
- [ ] demo GIF または screenshot が GitHub 上で表示される。
- [ ] 外部投稿に使う URL がすべて公開ページになっている。
