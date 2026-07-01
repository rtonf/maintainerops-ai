# OSS メンテナーの PR レビューと Issue 対応を軽くする read-only AI 補助ツールを作っています

OSS メンテナー向けの補助ツール、MaintainerOps AI を作っています。

これは Pull Request や Issue を読み、メンテナーが判断するための「レビュー・トリアージ packet」を生成するツールです。リポジトリに勝手に変更を加えるものではありません。merge、close、label、comment、release、publish は自動で行いません。

GitHub: https://github.com/rtonf/maintainerops-ai  
npm: https://www.npmjs.com/package/maintainerops-ai  
GitHub Marketplace: https://github.com/marketplace/actions/maintainerops-ai

## 何を解決したいのか

OSS メンテナンスには、小さいけれど重い作業が多くあります。

- Pull Request の内容を読む
- 変更のリスクを判断する
- テスト不足を見つける
- Issue の不足情報を整理する
- security-sensitive な変更を見逃さないようにする
- release note に入れるべき変更を拾う
- 返信文を考える

MaintainerOps AI は、この「読む・整理する・確認する」部分を軽くするためのツールです。

## 何を出力するのか

MaintainerOps AI は、PR や Issue から次のような packet を作ります。

- summary
- risk level
- suggested labels
- review checklist
- security notes
- release-note hints
- draft response

出力は最終判断ではありません。メンテナーが読み、必要なら編集し、採用するかどうかを決めるための下書きです。

## read-only を重視しています

このツールで一番大事にしているのは、メンテナーの判断を置き換えないことです。

MaintainerOps AI は以下を自動で行いません。

- PR を merge しない
- Issue を close しない
- label を付けない
- comment を投稿しない
- release を作らない
- npm publish しない
- 許可されていない repository を scan しない

AI に権限を渡すのではなく、メンテナーが判断する前に必要な情報を整理する、という立ち位置です。

## API key なしで試せます

最新版は npm `0.1.11` です。まずは API key なしで CLI の起動確認ができます。

```bash
npm exec --yes --package maintainerops-ai@latest -- maintainerops --help
```

ソースから試す場合:

```bash
git clone https://github.com/rtonf/maintainerops-ai.git
cd maintainerops-ai
npm install
npm run demo
```

OpenAI API key を設定すると、model-backed な review packet 生成も使えます。API key がない場合は deterministic offline heuristic で動きます。

## GitHub Action としても使えます

read-only 権限で PR / Issue イベントから packet を生成できます。

```yaml
name: MaintainerOps AI

on:
  pull_request:
    types: [opened, synchronize, reopened]
  issues:
    types: [opened, edited]

permissions:
  contents: read
  pull-requests: read
  issues: read

jobs:
  review-packet:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
        with:
          persist-credentials: false
      - uses: rtonf/maintainerops-ai@v0.1.11
        with:
          mode: ${{ github.event_name == 'pull_request' && 'pull_request' || 'issue' }}
          repo: ${{ github.repository }}
          number: ${{ github.event.pull_request.number || github.event.issue.number }}
          format: markdown
          offline: true
          authorized: true
```

## 信頼性のためにやっていること

MaintainerOps AI では、AI 補助を OSS メンテナンスに入れる上で次の点を重視しています。

- dry-run / read-only を基本にする
- GitHub 権限を最小化する
- secrets を redaction する
- GitHub Actions stdout command injection を避ける
- structured output を validation する
- deterministic eval と model-backed eval を分ける
- npm Trusted Publishing で provenance 付き publish を行う
- SECURITY、EVALS、Codex Security reports、usage log、review packets を公開する

## どんな feedback がほしいか

現在、外部メンテナーからの feedback を集めています。

まずは次のコマンドだけでも十分です。

```bash
npm exec --yes --package maintainerops-ai@latest -- maintainerops --help
```

可能であれば、Issue #6 に短く感想を残してもらえると助かります。

Feedback issue: https://github.com/rtonf/maintainerops-ai/issues/6

特に知りたいこと:

- install / exec が問題なく動いたか
- packet は PR review や Issue triage に役立ちそうか
- noisy な部分はあるか
- 足りない観点はあるか
- read-only の GitHub Action として使いたいと思うか

## まとめ

MaintainerOps AI は、OSS メンテナーの判断を AI に任せるためのツールではありません。

メンテナーが判断する前に、読むべき情報を整理し、リスクや確認観点を見やすくするための補助ツールです。OSS メンテナンスは派手ではないけれど継続的で重要な仕事です。その負担を少しでも下げつつ、メンテナーのコントロールは手放さない方向で育てていきます。
