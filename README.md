# Shogun Story Academy

Next.js (App Router + TypeScript) と Tailwind CSS で構築した和風ミニマルな英語学習アプリのベース実装です。

## ローカル起動手順

1. 依存パッケージをインストールします。

   ```bash
   npm install
   ```

2. 開発サーバーを起動します。

   ```bash
   npm run dev
   ```

3. ブラウザで `http://localhost:3000` を開いて動作確認します。

## Prisma の初期化手順

Prisma を未導入の場合は、先に Prisma CLI / Client を追加して `prisma/schema.prisma` と `.env` を準備してください。

1. スキーマを DB に反映します。

   ```bash
   npx prisma db push
   ```

2. シードデータを投入します。

   ```bash
   npx prisma db seed
   ```

3. 必要に応じて Prisma Studio でデータを確認します。

   ```bash
   npx prisma studio
   ```

## Stripe 将来導入メモ

### 環境変数

`.env.local` に以下を追加する想定です。

```bash
# クライアント公開可能キー（必要な場合のみ NEXT_PUBLIC_ を付ける）
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# サーバー専用キー（公開しない）
STRIPE_SECRET_KEY=sk_test_xxx

# Webhook 検証用シークレット
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### サーバー側実装方針

- Checkout Session 作成や Subscription 更新は **Next.js の Route Handler / Server Action / API Route** などサーバー側のみで実行する。
- `STRIPE_SECRET_KEY` を使う処理は必ずサーバー側に閉じ込め、クライアントからは内部 API を経由して呼び出す。
- Webhook (`checkout.session.completed` など) を受け取り、DB の課金状態を冪等に更新する。

> ⚠️ **重要:** `STRIPE_SECRET_KEY` は絶対にクライアントへ渡さないでください。`NEXT_PUBLIC_` プレフィックスを付ける、レスポンスに含める、フロントコードへ直書きする、といった実装は禁止です。

## Stripe CLI webhook テスト手順

1. Stripe CLI にログインします。

   ```bash
   stripe login
   ```

2. ローカルの webhook エンドポイントへ転送を開始します（例: `http://localhost:3000/api/stripe/webhook`）。

   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

3. 表示された `whsec_...` を `.env.local` の `STRIPE_WEBHOOK_SECRET` に設定します。

4. テストイベントを送信します。

   ```bash
   stripe trigger checkout.session.completed
   ```

5. サーバーログと DB 更新結果を確認し、重複イベントでも安全に処理されることを確認します。

## ルート

- `/`
- `/chapters`
- `/chapters/[chapterSlug]/scenes/[sceneSlug]`
- `/continue`
- `/upgrade`
