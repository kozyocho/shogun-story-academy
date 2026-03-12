# CLAUDE.md

このファイルは Claude Code がこのリポジトリで作業する際のガイドラインです。

## プロジェクト概要

**Shogun Story Academy** — 英語学習者向けに日本の侍文化・戦国時代を短編ストーリーで学べる教育プラットフォーム。

## 技術スタック

| 分類 | 技術 |
|---|---|
| フレームワーク | Next.js 14 (App Router) |
| 言語 | TypeScript |
| スタイル | Tailwind CSS v4 |
| 認証 | NextAuth.js v5 (Google OAuth) |
| DB | Prisma 5 + libSQL (開発: SQLite, 本番: Turso) |
| 課金 | Stripe (月額 $7 / 年額 $49) |
| デプロイ | Vercel |

## 開発コマンド

```bash
npm run dev          # 開発サーバー起動 (0.0.0.0:3000)
npm run build        # 本番ビルド
npm run lint         # ESLint
npx tsc --noEmit     # 型チェック

npm run db:push      # DBスキーマ適用
npm run db:seed      # サンプルデータ投入
npm run db:studio    # Prisma Studio 起動
```

## 環境変数

`.env.local` に以下を設定（`.env.local` は `.gitignore` 済み）：

```
DATABASE_URL=file:./dev.db          # 開発用
DATABASE_AUTH_TOKEN=                # Turso 本番用のみ

AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_ANNUAL_PRICE_ID=price_...

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## ディレクトリ構成

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth ハンドラ
│   │   ├── stripe/checkout/      # Stripe Checkout セッション作成
│   │   ├── stripe/portal/        # Stripe 請求ポータル
│   │   └── webhook/stripe/       # Stripe Webhook 処理
│   ├── stories/
│   │   ├── [slug]/page.tsx       # ストーリー詳細（認証・課金ゲート付き）
│   │   └── page.tsx              # ストーリー一覧
│   ├── pricing/page.tsx          # 料金ページ
│   ├── layout.tsx
│   └── page.tsx                  # ホーム
├── components/
│   └── Navigation.tsx            # ナビゲーション（Server Component）
└── lib/
    ├── auth.ts                   # NextAuth 設定
    ├── prisma.ts                 # Prisma クライアント (libSQL アダプタ)
    └── stripe.ts                 # Stripe クライアント + プラン定義
prisma/
├── schema.prisma                 # DB スキーマ
└── seed.ts                       # サンプルストーリー 2 本
```

## DB スキーマの主要モデル

- `User` / `Account` / `Session` — NextAuth 管理
- `Story` — ストーリー本文・isPremium フラグ
- `VocabularyNote` — 語彙・文化的注記
- `ComprehensionQuestion` — 理解度テスト（options は JSON 配列）
- `TimelineEvent` — 年表イベント
- `Subscription` — Stripe サブスクリプション状態（status: FREE / ACTIVE / CANCELED 等）
- `StoryProgress` — ユーザーの読了記録

## 課金フロー

1. `/pricing` でプラン選択 → `POST /api/stripe/checkout`
2. Stripe Checkout にリダイレクト
3. 支払い完了 → Stripe Webhook (`/api/webhook/stripe`) が `Subscription` を更新
4. `/stories` でプレミアムストーリーの表示可否を `subscription.status` で判定

## CI/CD

- **PR → main**: GitHub Actions が型チェック + lint を実行
- **main へのマージ**: GitHub Actions が Vercel に自動デプロイ

必要な GitHub Secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## 開発ブランチルール

- 作業ブランチは `claude/` プレフィックスを使用
- `main` への直接プッシュは不可。PR 経由でマージする

## コンテンツ追加方法

新しいストーリーは `prisma/seed.ts` または Prisma Studio で追加する。
`isPremium: true` にするとプレミアム会員のみ閲覧可能になる。
