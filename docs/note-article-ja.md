# OSS メンテナーの PR レビューと Issue 対応を軽くする read-only AI 補助ツールを作っています

OSS メンテナー向けの補助ツール、MaintainerOps AI を作っています。

これは Pull Request や Issue を読み、メンテナーが判断するための「レビュー・トリアージ packet」を生成するツールです。

リポジトリに対して勝手に変更を加えるものではありません。merge、close、label、comment、release などは自動では行いません。あくまで、人間が読むための下書きと確認リストを作る read-only の補助ツールです。

GitHub: https://github.com/rtonf/maintainerops-ai  
npm: https://www.npmjs.com/package/maintainerops-ai  
GitHub Marketplace: https://github.com/marketplace/actions/maintainerops-ai

## なぜ作っているのか

OSS のメンテナンスには、目立ちにくいけれど重要な作業が多くあります。

- Pull Request の内容を読む
- 変更のリスクを判断する
- テスト不足を見つける
- Issue の再現情報や不足情報を整理する
- セキュリティに関係する変更を見落とさないようにする
- リリースノートに入れるべき変更を拾う
- 返信文を考える

どれも小さく見えますが、数が増えると大きな負担になります。

MaintainerOps AI は、この「読む・整理する・確認する」部分を軽くするために作っています。

## 何をしてくれるのか

MaintainerOps AI は、PR や Issue から次のような packet を生成します。

- 要約
- リスクレベル
- 推奨ラベル
- レビューチェックリスト
- セキュリティメモ
- リリースノートのヒント
- 返信ドラフト

PR であれば、「この変更はどこが危なそうか」「どのファイルを重点的に見るべきか」「テスト観点として何が足りないか」を、メンテナーが確認しやすい形にまとめます。

Issue であれば、「何が報告されているのか」「追加で聞くべき情報は何か」「bug なのか feature request なのか」「返信するならどう書くか」を整理します。

## 大事にしている設計: read-only

このツールで一番大事にしているのは、メンテナーの判断を置き換えないことです。

MaintainerOps AI は、以下のような操作をしません。

- PR を merge しない
- Issue を close しない
- label を付けない
- comment を投稿しない
- release を作らない
- publish しない

出力はあくまで下書きです。メンテナーが読み、必要なら編集し、使うかどうかを判断します。

## API キーなしでも試せる

MaintainerOps AI は OpenAI API を使う構成にできますが、API キーなしでも offline mode で試せます。

まず CLI の help だけなら、次のコマンドで確認できます。

```bash
npm install -g maintainerops-ai@latest
maintainerops --help
```

ソースから試す場合は次の流れです。

```bash
git clone https://github.com/rtonf/maintainerops-ai.git
cd maintainerops-ai
npm install
npm run demo
```

offline mode では、API 料金やシークレットを気にせず、どのような出力になるかを確認できます。

## GitHub Action としても使える

MaintainerOps AI は GitHub Action としても使えます。

Pull Request や Issue が作られたタイミングで、read-only 権限のままレビュー・トリアージ packet を生成する設定です。

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
      - uses: actions/checkout@v6
        with:
          persist-credentials: false
      - uses: rtonf/maintainerops-ai@v0.1.9
        with:
          mode: ${{ github.event_name == 'pull_request' && 'pull_request' || 'issue' }}
          repo: ${{ github.repository }}
          number: ${{ github.event.pull_request.number || github.event.issue.number }}
          format: markdown
          offline: true
          authorized: true
```

## セキュリティ面で気をつけていること

AI 補助をメンテナンスに入れる場合、便利さだけでなく安全性も重要です。

MaintainerOps AI では、次の点を意識しています。

- dry-run を基本にする
- GitHub 権限を最小限にする
- シークレットを redaction する
- GitHub Actions の stdout コマンド注入を避ける
- 出力を構造化して検証する
- API キーなしの offline mode を用意する
- 自動 merge や自動 close をしない

また、公開リポジトリ内にセキュリティレビューの記録、fix report、rescan report、eval、実際の review packet 例も置いています。

## どういう人に試してほしいか

特に、次のような人に試してもらいたいです。

- OSS リポジトリをメンテナンスしている人
- PR レビューの初動を軽くしたい人
- Issue triage の返信やラベル判断に時間がかかっている人
- Dependabot、CodeQL、Semgrep、npm audit などの結果整理に困っている人
- AI に書き込み権限を渡すのは怖いが、読む補助は使ってみたい人

## feedback がほしいです

現在、初期 feedback を募集しています。

試してもらえる場合は、まず以下だけでも大丈夫です。

```bash
npm install -g maintainerops-ai@latest
maintainerops --help
```

可能であれば、GitHub の Issue #6 に短い感想をもらえると助かります。

Feedback issue: https://github.com/rtonf/maintainerops-ai/issues/6

見てほしい点:

- install / exec が問題なく動くか
- 出力される packet は PR レビューや Issue triage に役立ちそうか
- ノイズが多い部分はあるか
- 足りない観点はあるか
- read-only の GitHub Action としてなら使いたいと思うか

## まとめ

MaintainerOps AI は、OSS メンテナーの判断を AI に任せるためのツールではありません。

メンテナーが判断する前に、読むべき情報を整理し、リスクや確認観点を見落としにくくするための補助ツールです。

OSS のメンテナンスは派手ではないけれど継続的で重要な仕事です。その負担を少しでも下げつつ、メンテナーのコントロールは手放さない。そういう方向で育てていきたいと思っています。

GitHub: https://github.com/rtonf/maintainerops-ai  
npm: https://www.npmjs.com/package/maintainerops-ai  
GitHub Marketplace: https://github.com/marketplace/actions/maintainerops-ai
