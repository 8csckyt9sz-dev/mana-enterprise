# マナエンタープライズ（株）

Cloudflare Workers + D1 で動く中古車・中古家具家電の在庫サイトです。公開ページは誰でも閲覧でき、`/admin/` と `/admin/api/` はSecretパスワードと署名付きHttpOnly Cookieで保護します。画像もD1へ保存するためR2契約は不要です。

## 初回セットアップ

1. `pnpm install` と `pnpm check`
2. `npx wrangler login`
3. `npx wrangler d1 create mana-enterprise-db` を実行し、返されたIDを `wrangler.jsonc` の `database_id` に設定
4. `npx wrangler secret put ADMIN_PASSWORD`
5. `npx wrangler secret put SESSION_SECRET`
6. `pnpm db:migrate:remote`
7. `pnpm deploy`

管理画面は8時間有効の署名付きセッションCookieで保護されます。パスワードと署名鍵はCloudflare Secretだけに保存し、ソースコードやGitHubへ保存しません。

GitHub自動デプロイは Workers & Pages > Create > Import a repository から `8csckyt9sz-dev/mana-enterprise` の main を選び、Build command `pnpm build`、Deploy command `npx wrangler deploy` を指定します。Cloudflareのビルド環境では Account ID と API Token を暗号化変数に保存してください。

## 画像と店舗情報

- 正式ロゴを `public/assets/logo.png` に置き、加工せず表示します。店長紹介は後日追加します。
- 電話・LINE、営業時間、住所は `src/config.ts` の1か所で変更できます。
- 管理画面の画像はブラウザで長辺1200px・最大1MBへ圧縮し、D1へ保存します。

## 既存データ

マイグレーションは `CREATE TABLE IF NOT EXISTS` のみで、既存テーブルや在庫を削除しません。既存データ移行時は先にバックアップを取得し、追加マイグレーションとして取り込みます。
