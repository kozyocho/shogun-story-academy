import { createClient } from "./supabase/server";

/**
 * サーバーサイドで現在のログインユーザーを取得する。
 * 未ログインの場合は null を返す。
 */
export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}
