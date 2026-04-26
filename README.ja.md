# Dockerman

Language: [🇺🇸 English](./README.md) | [🇨🇳 简体中文](./README.zh-CN.md) | 🇯🇵 日本語 | [🇪🇸 Español](./README.es.md)

[![Version](https://img.shields.io/badge/version-v5.2.0-blue.svg?style=flat-square)](https://github.com/dockerman/dockerman/releases/tag/v5.2.0)
[![Release Date](https://img.shields.io/badge/release%20date-Apr%2026%2C%202026-green.svg?style=flat-square)](https://github.com/dockerman/dockerman/releases/tag/v5.2.0)

Docker **と** Kubernetes をまとめて管理できるネイティブデスクトップ UI。Tauri + Rust 製で、起動が速く、軽量、完全ローカル動作――データはマシンの外に出ません。

![Dashboard](apps/landing/public/screenshots/readme/dashboard.png)
![Kubernetes](apps/landing/public/screenshots/readme/k8s.png)

## ハイライト

- 🐳 **コンテナ・イメージ** — フルライフサイクル、Compose 対応、バックアップ／リストア（bind マウント含む）、アップグレード検出
- ☸️ **Kubernetes** — マルチクラスタ、主要リソース、Helm、ポートフォワード、dry-run 付き YAML エディタ
- 🖥️ **組み込みツール** — ターミナル、検索可能なログビューア、CPU/メモリ履歴、編集可能なファイルブラウザ
- 🔔 **イメージ更新監視** — バックグラウンド購読サービスでアップデートを通知
- ☁️ **Cloudflared トンネル** — ワンクリックで公開 URL、自動クリーンアップ
- 🐙 **Podman と WSL2 エンジン** — Docker Desktop の代替を一級でサポート
- 🌐 多言語：English、中文、日本語、Español、フルダークモード対応

## コンテナ・イメージ

シェルに落ちなくてもアプリ内で完結します：

- Compose プロジェクト単位でグループ化、または平坦リストで閲覧。名前・ポート・ステータスでクイックフィルタ
- ガイド付きフォームから作成、または `docker run` コマンドを貼り付け――内蔵エディタで Compose YAML に変換
- リアルタイムログ、キーワード／正規表現検索、大文字小文字切替；CPU/メモリ履歴、最大 6 コンテナの並列比較
- テーマ可能なターミナル、プロセス一覧、ファイルブラウザ（インライン編集、テキスト/コード/画像/PDF/動画プレビュー、フォルダ アップロード/ダウンロード）
- 設定、ファイルシステム、ボリューム、対応する bind マウントまでまとめてバックアップ・リストア
- イメージビルド（Dockerfile またはコマンド解析）、プライベートレジストリへの push、Docker Hub 検索、Trivy セキュリティスキャン、レイヤサイズ分析
- バックグラウンドのイメージ更新監視、チャネル単位の購読、レジストリ資格情報リゾルバ、`dockerman://` ディープリンク

![コンテナログ](apps/landing/public/screenshots/readme/logs.png)
![イメージ分析](apps/landing/public/screenshots/readme/image-analysis.png)

## Kubernetes

`kubectl` 相当の能力を、すべて GUI で：

- kubeconfig 接続、もしくはローカル k3d クラスタを自動インストールして起動。Docker ホストとは独立にクラスタを切替
- ワークロード、ネットワーク、Config & Storage、RBAC、CRDs、加えて Node / Persistent Volume / Namespace 専用ページ
- フィルタ可能なクラスタイベント、概要ページの CPU / メモリカード
- 内蔵 YAML エディタ（ディープリンクとサーバサイド dry-run プレビュー）
- Helm の releases、リポジトリ、chart インストール
- Pods/Services/Deployments のポートフォワードと、フォワード先サービスのローカル DNS 自動登録
- Pod のデバッグアシスタント、terminating で固まった Pod の強制削除
- 型付き 403 ハンドリングで権限エラーを一覧で明示

## Docker の枠を超えて

- **Cloudflared トンネル** — 任意のコンテナポートをワンクリックで公開、停止／削除で自動クリーンアップ、クラッシュ後も復旧
- **Podman** — ランタイム自動検出、ホスト単位の優先設定、Compose 系操作の機能ゲート
- **Windows の WSL2 エンジン** — Docker Desktop 不要、Alpine をワンクリックでセットアップ、クラッシュ自動復旧、レジストリミラー対応
- **リモートデーモン** — カスタム socket、TCP、SSH 転送、ハートビート再接続とホスト別レイテンシ表示

## 運用と使い心地

- 🚨 プリセットアラート（restart loop、コンテナクラッシュ）と、コンテナ／時刻／ルール名付きの最近のアラート一覧
- 🧰 ワンクリックの診断バンドル（ログ、inspect、ホスト状態）でサポート対応がスムーズ
- 📝 コメント保持＋アトミック適用のビジュアル `.env` エディタ
- 🔍 グローバルコマンドパレット（Cmd/Ctrl+;）、システムトレイのリアルタイム CPU/メモリ
- 🔐 プライベートレジストリ資格情報の管理、pull 時に自動マッチ
- 🔑 リモートホスト機能のためのライセンス認証

## なぜ速いか

Tauri + Rust によるネイティブデスクトップアプリ――Electron でもブラウザタブでもありません。完全ローカル動作、テレメトリなし、コア機能はリモート依存ゼロ。

## その他のスクリーンショット

![ダークモード](apps/landing/public/screenshots/readme/dark.png)
![ターミナル](apps/landing/public/screenshots/readme/terminal.png)
![ターミナル設定](apps/landing/public/screenshots/readme/terminal-settings.png)
![プロセス一覧](apps/landing/public/screenshots/readme/process.png)
![Inspect](apps/landing/public/screenshots/readme/inspect.png)
![統計](apps/landing/public/screenshots/readme/stats.png)
![マルチコンテナ比較](apps/landing/public/screenshots/readme/stats-compare.png)
![SSH](apps/landing/public/screenshots/readme/ssh.png)
![ビルドログ](apps/landing/public/screenshots/readme/build-log.png)
![ビルド履歴](apps/landing/public/screenshots/readme/build-log-history.png)
![ファイルブラウザ](apps/landing/public/screenshots/readme/file.png)
![ファイルプレビュー](apps/landing/public/screenshots/readme/file-preview.png)
![Compose ビュー](apps/landing/public/screenshots/readme/compose.png)
![イベント](apps/landing/public/screenshots/readme/event.png)
![ボリュームブラウザ](apps/landing/public/screenshots/readme/volume-browse.png)
![ストレージ](apps/landing/public/screenshots/readme/storage.png)
![コマンドパレット](apps/landing/public/screenshots/readme/cmd.png)
![Docker Hub](apps/landing/public/screenshots/readme/dockerhub.png)
![イメージセキュリティ](apps/landing/public/screenshots/readme/image-security.png)
