---
title: Nuxt デプロイとGitLab Runner
description: Nuxt、Gitlab Runner、Docker、Kaniko、Dockerfile、Node.js、musl-libc、glibc
icon: 'lucide:alarm-clock-check'
gitTalk: false
date: 2025-01-19 15:32:20
read: '10'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

> Nuxt デプロイとGitLab Runner

仕事の要件で、NuxtアプリケーションをGitLab Runnerにデプロイする必要がありました。この記事では、デプロイの過程、遭遇した問題、および解決策を記録します。同じ問題に直面している人々の助けとなり、私のように夜遅くまでトラブルシューティングに時間を費やすことを避けられることを願っています🥲。

## 現代のフロントエンドの複雑なアプリケーション

Nuxt Templateのようなツールがなければ、ウェブページのテキストや画像をどのように更新するでしょうか？従来のフロントエンド開発では、次のようにする必要があるかもしれません。

JavaScriptを使ってそのウェブ要素を見つける（例：`document.getElementById('myText')`）。

そして、手動でその内容を変更する（例：`element.innerHTML = '新しいテキスト'`）。

::alert{type="warning" icon="lucide:siren"}
ウェブページが複雑で、データに基づいて多くの場所を更新する必要がある場合、このような手動操作は非常に苦痛で、間違いを犯しやすくなります。データが更新されるたびに、開発者は各関連するDOM要素をどのように更新するかを正確にブラウザに指示するコードを書かなければなりません。このような命令型のプログラミング方法は面倒なだけでなく、アプリケーションの規模が拡大するにつれて、コードの保守性が著しく低下します。
::

## Nuxt TemplateとReact JSXは何をしているのか？

上記の問題を解決するため、VueやReactのような現代のフロントエンドフレームワークは、より高度なUI構築方法を導入しました。Vue Template（およびReactのJSX）の核心的な目標は、より\*\*「宣言的」\*\*な方法で開発できるようにすることです。

::alert{type="success" icon="lucide:siren"}
「結果」に集中し、「過程」には集中しない：あなたはフレームワークに「この場所にこのデータをこのように表示したい」と伝えるだけでよく、フレームワークが内部でどのように要素を見つけて更新するかを気にする必要はありません。フレームワークがこれらの面倒なDOM操作を自動的に処理してくれます。
::

  - **データ駆動型UI**: データが変更されると、画面が自動的に更新されます。これは、フレームワークの強力な\*\*「リアクティブシステム」\*\*によって実現されます。手動で画面を更新する必要がなくなり、時間と労力を節約できます！

  - **より簡潔で分かりやすいコード**: Nuxt TemplateはHTMLに基づいています。これは、すべてのNuxtテンプレートがそれ自体で有効なHTMLであることを意味します。通常のHTMLを書くようにNuxtテンプレートを書くことができ、ブラウザもそれを正しく解析できます。これにより、非常に習得しやすく、強化されたHTMLのように見え、非常に直感的です。

  - **コンポーネント指向開発**: 現代のフレームワークは、ウェブページを再利用可能な\*\*「コンポーネント」\*\*に分解することを推奨しています。テンプレート構文は、コンポーネント内で構造と内容を定義する役割を果たし、コンポーネント指向開発をより容易にします。

  - **高パフォーマンス**: フレームワークは舞台裏で多くの最適化を行っています。例えば、「仮想DOM」や「コンパイル時最適化」により、複雑なアプリケーションでも画面更新が高効率に保たれるようにしています。

Nuxt.jsは3つのレンダリングモードをサポートしています。

  - **SPA (シングルページアプリケーション)**：JavaScriptを介してページの切り替えを制御し、APIを通じてデータを取得します。管理バックエンドやソーシャルメディアサイトのような、インタラクティブ性の高いシングルページアプリケーションの構築に適しています。
  - **SSG (静的サイト生成)**：`nuxt generate`を使用して静的サイトを生成し、APIを通じてデータを取得します。高速な読み込み速度とSEOの利点があり、ブログや公式ウェブサイトのような高速読み込みが必要な静的サイトの構築に適しています。将来的には、このブログを`Nuxt SSG`アーキテクチャにアップグレードする予定です。
  - **SSR (サーバーサイドレンダリング)**：サーバーサイドでページをレンダリングし、APIを通じてデータを取得します。SSRは、サーバーが完全なHTMLページをブラウザに送信するため、SEO効果と最初の画面の読み込み速度を向上させることができます。これにより、ブラウザはすぐに表示できます。SEOとユーザーエクスペリエンスの両方を考慮する必要があるウェブサイトに適しています。

Nuxt.jsは、開発プロセスを簡素化するために多くの機能を提供しています。例えば、以下のようなものがあります。

  - **ファイルシステムルーティング**: `pages`フォルダのファイル構造に基づいてルーティングを自動生成します。
  - **自動インポート**: コンポーネント、Composable、モジュールを自動的にインポートし、コードの冗長性を減らします。
  - **サーバーサイドAPI**: `asyncData`、`fetch`、`useFetch`、`useAsyncData`など、開発者がサーバーサイドでデータを取得するのに便利です。
  - **その他の機能**: サーバーサイドミドルウェア、プラグイン、モジュール、ストアなど。
  - **Nitroエンジン**: Nuxt.jsのサーバーエンジンで、以下の利点があります。
      - クロスプラットフォームサポート: Node.js、ブラウザ、Service Workersなどのプラットフォームで実行できます。
      - サーバーAPI: APIルートとミドルウェアをサポートします。
      - 自動コード分割: アプリケーションのパフォーマンスを向上させます。
      - ハイブリッドレンダリングモード: 静的レンダリングとサーバーレンダリングのハイブリッドモードをサポートします。
      - 開発サーバー: ホットモジュールリロード(HMR)機能を提供し、開発効率を向上させます。
      - デプロイ: デプロイプロセスを簡素化し、サーバーデプロイ、静的デプロイなど、複数のデプロイ方法をサポートします。
      - パフォーマンス最適化: プリレンダリングとキャッシュ戦略を通じてアプリケーションのパフォーマンスを向上させます。
      - デバッグツール: パフォーマンス分析およびデバッグツールを提供し、開発者がパフォーマンスのボトルネックを見つけるのに便利です。

::alert{type="danger" icon="lucide:lightbulb" title="辛い教訓"}
今回は、NuxtのSSRモードアプリケーションをGitLab Runnerにデプロイし、GitLab Runnerを介して自動デプロイを行うことを目標とします。
まさか、これがトラブルの始まりになるとは🥲。
::

## GitLab Runner

GitLab Runnerは、オペレーティングシステム上でジョブを実行するためのオープンソースプロジェクトであり、継続的インテグレーション/継続的デプロイ(CI/CD)エージェントまたはジョブエグゼキューターと見なすことができます。GitLab CI/CDと連携して使用され、GitLab CI/CDパイプライン内で指定されたジョブを実行できます。GitLab RunnerはWindows、Linux、macOS上で実行でき、コンテナ内で実行することも可能です。GitLab RunnerはDocker、Kubernetes、Podmanなどのコンテナプラットフォームをサポートしています。

これが私たちがそれを使用することを選択した理由でもあります。NuxtアプリケーションをDockerにカプセル化し、指定された環境にデプロイします。

### GitLab Runnerのインストール

ここでは、Runnerのバージョンと環境を管理しやすくするために、Dockerを使用してGitLab Runnerをインストールします。

```bash
docker run -d --name gitlab-runner --restart always \
  -v /srv/gitlab-runner/config:/etc/gitlab-runner \
  -v /var/run/docker.sock:/var/run/docker.sock \
  gitlab/gitlab-runner:latest
```

これでGitLab Runnerのインストールが完了しました。次に、Runnerを登録する必要があります。

### GitLab Runnerの登録

[GitLab Runner](https://docs.gitlab.com/runner/)

```bash
docker exec -it gitlab-runner gitlab-runner register
```

その後、プロンプトに従って登録を進めます。ここでは、GitLabのURL、トークン、Runner名、説明、タグなどの情報を入力する必要があります。

### Runner 設定 (config.toml)

[TOML](https://zh.wikipedia.org/zh-tw/TOML)

TOML設定ファイルはGitLab Runnerの設定ファイルであり、Runnerの実行環境や実行方法などをここで設定できます。[例](https://gitlab.com/gitlab-org/gitlab-runner/-/blob/main/config.toml.example)

`RunnerがDockerを使用してジョブを実行する必要がある場合、Docker関連の設定を行う必要があります。`

```toml
[[runners]]
name = "docker-runner"
url = "[https://gitlab.com/](https://gitlab.com/)" # 実際のGitLab接続URL（例：[https://gitlab.com/](https://gitlab.com/) または自社GitLabサーバーアドレス）を入力します。
token = "xxxxxxxxxxxxxxxxxxxx" # ここにGitLabのRunnerトークンを入力します。
executor = "docker"

# エグゼキュータータイプはDocker
[runners.docker]
network_mode = "host" # ホストネットワークモードを使用し、コンテナがホストネットワークに直接アクセスできるようにします。
privileged = true # 特権モードを有効にし、コンテナがDocker Socketなどのホストリソースにアクセスできるようにします。
disable_entrypoint_overwrite = false
oom_kill_disable = false
disable_cache = false
volumes = [ "/cache" ] # ホストの/cacheディレクトリをコンテナの/cacheディレクトリにマウントします。
shm_size = 0
```

Runnerの概念は、CI/CDのエージェントやジョブエグゼキューターのようなもので、設定された環境に基づいて指定されたタスクを実行します。ここでは`docker-runner`を設定しました。当初は`node:lts`のDockerイメージを使用してタスクを実行する予定でした。`node:lts`はNode.jsの長期サポートバージョンであり、安定性に優れています。しかし、実際にはNuxtのSSRモードアプリケーションをデプロイする必要があるため、独自のDockerイメージを定義する必要がありました。

## 最初の落とし穴: Kanikoと`docker build`の誤解

この問題を解決するために、まずローカル開発環境とCI/CD環境の違いを明確にする必要がありました。ローカル開発では、`docker build`コマンドを使ってイメージを構築することに慣れていました。しかし、CI/CD環境ではKanikoを使用することを選択していました。

KanikoはGoogleがオープンソースで公開しているDockerイメージ構築ツールで、Docker DaemonなしでDockerイメージを構築できるため、Docker Daemonがもたらす可能性のあるセキュリティリスクを回避できます。そのため、CI/CD環境でよく使用されます。

CI環境がDocker Daemonに依存しないようにしたかったため、同僚はKanikoを使用することを選択しました。その結果、私はローカルで`docker build`を使ってイメージを構築しようとしましたが、gitlab-ci.ymlではKanikoが使われていたため、ずっと失敗し続けていました。しかし、何が問題なのか半日考えても分かりませんでした。

::alert{type="danger" icon="lucide:lightbulb" title="辛い教訓"}
実際、KanikoはDocker Daemonに依存しないため、`docker build`コマンドを使用することはできません。
しかし、Dockerfileを使ってイメージを定義し構築することは依然として可能です。ただし、コマンドをKanikoの`executor`に変更する必要があります。例えば、元の`docker build -t my-image .`は`/kaniko/executor --dockerfile Dockerfile --context . --destination my-image:latest`に変更する必要があります。
私は最初、`docker build`を使ってNuxtイメージを構築しようとし、その結果、半日も立ち往生してしまいました🥲。
::

### Docker Daemonのセキュリティ問題

Docker DaemonはDockerのコアコンポーネントであり、Dockerイメージ、コンテナ、ネットワーク、ストレージなどのリソースを管理します。Docker Daemonはデフォルトでroot権限で実行されるため、コンテナエスケープやコンテナ内部からの攻撃などのセキュリティ問題を引き起こす可能性があります。したがって、セキュリティを向上させるために、Kanikoを使用してDocker Daemonのセキュリティ問題を回避することができます。

## 2番目の落とし穴: Dockerfileのビルド失敗

Kanikoの問題を解決した後、無事にデプロイできると思ったのですが、また新たな問題にぶつかりました。ローカルで構築したNuxt Imageは正常に動作するのに、GitLab Runner上での構築がずっと失敗していました。

### 1\. マルチステージビルドの失敗

Dockerfileでは、最終イメージのサイズを減らすためにマルチステージビルドを使用しましたが、GitLab Runner上での構築がずっと失敗していました。

::alert{type="note" icon="lucide:pencil" title="解決策"}
マルチステージビルドでは、まず最初のステージですべての開発依存関係（devDependencies）をインストールしてビルドを実行し、次に2番目のステージで本番環境の依存関係（dependencies）のみをインストールし、最初のステージのビルド成果物をコピーします。これにより、最終イメージのサイズを大幅に削減し、潜在的な依存関係の競合問題を減らすことができます。
具体的な方法は、「ビルドフェーズですべてのdevDepsをインストールしてビルドし、その後devDepsを削除し、prodDepsをインストールする」ことです。
::

### 2\. Node.jsのバージョン差（`node:20` vs `node:alpine`/`node:lts`）

最初は`node:alpine`をベースイメージとして使用しましたが、GitLab Runner上での構築がずっと失敗し、ページが正しく表示されませんでした。

異なるNode.jsバージョンには、異なるnpm / corepack / Python / g++ / makeなどの基底パッケージバージョンが含まれている可能性があります。Node 20、19、18間では、一部のネイティブモジュール（native addons）やパッケージのインストール動作にわずかな違いがあります。例えば、Node 20ではより高いバージョンの特定のコンパイルツールが必要となる場合や、pnpmの動作が若干異なる場合があります。`node:alpine`環境では、glibcではなくmusl-libcを使用しているため、一部のパッケージ（特にネイティブコンパイルが必要なパッケージ）がインストールに失敗することがあります。

#### musl-libcとglibcの違い

Alpine LinuxはC標準ライブラリとしてmusl-libcを使用しますが、ほとんどのLinuxディストリビューションはglibcを使用しています。これら2つにはいくつかの違いがあり、特にネイティブモジュールのコンパイル時に問題が発生する可能性があります。

::alert{type="note" icon="lucide:pencil" title="解決策"}
Dockerfileで`node:lts`を使用するか、または明示的にNode.jsのバージョン（例：`node:18`）をベースイメージとして指定することで、一部のパッケージインストール問題を回避できます。
::

## まとめ

今回のデプロイプロセスでは、多くの落とし穴にはまりましたが、多くのことを学びました。

  - `docker build`を使用する場合はDocker Daemonを使用し、Docker Daemonに依存したくない場合はKanikoを使用してイメージを構築します。その際のコマンドは`/kaniko/executor --dockerfile <Dockerfileのパス> --context <構築コンテキストのパス> --destination <ターゲットイメージ名>`です。
  - マルチステージビルドでは、まずすべての依存パッケージをインストールしてビルドを実行し、その後開発依存パッケージを削除して本番環境の依存パッケージのみをインストールすることで、最終イメージのサイズを大幅に削減し、依存パッケージの競合を減らすことができます。
  - Node.jsのバージョン差がパッケージのインストール問題を引き起こす可能性があるため、環境の一貫性を確保するために`node:lts`を使用するか、または明示的にNode.jsのバージョンをベースイメージとして指定することをお勧めします。

これは短い文章の記述に過ぎませんが、私が夜遅くまでトラブルシューティングに費やした血と涙の経験です。この記事が、同じ問題を抱える人々の助けとなり、同じ過ちを繰り返さないように願っています。ううう🥲

## 参考文献

  - [Nuxt.js](https://nuxtjs.org/)
  - [GitLab Runner](https://docs.gitlab.com/runner/)
  - [Dockerfile](https://docs.docker.com/engine/reference/builder/)
  - [Kaniko](https://github.com/GoogleContainerTools/kaniko)
  - [Alpine Linux](https://alpinelinux.org/)
  - [musl-libc](https://musl.libc.org/)
  - [glibc](https://www.gnu.org/software/libc/)
