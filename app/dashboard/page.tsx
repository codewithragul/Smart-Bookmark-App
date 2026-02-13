import { createClient } from "@/lib/supabase/server";
import BookmarkList from "@/components/BookmarkList";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  return (
   <main className="dashboard-container">
  <h1 className="dashboard-title">Your Bookmarks</h1>

  <BookmarkList userId={user.id} />
</main>

  );
}
