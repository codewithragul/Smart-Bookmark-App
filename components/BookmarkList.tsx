"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Bookmark = {
  id: string;
  title: string;
  url: string;
};

export default function BookmarkList({ userId }: { userId: string }) {
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    if (!userId) return;
    fetchBookmarks();
  }, [userId]);

  async function fetchBookmarks() {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch error:", error.message);
      return;
    }

    if (data) setBookmarks(data);
  }

  async function addBookmark() {
    if (!title || !url || !userId) return;

    const { error } = await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: userId,
    });

    if (error) {
      console.error("Insert error:", error.message);
      return;
    }

    // ✅ Immediately refresh UI
    await fetchBookmarks();

    setTitle("");
    setUrl("");
  }

  async function deleteBookmark(id: string) {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error.message);
      return;
    }

    await fetchBookmarks();
  }

  return (
    <div className="flex flex-col items-center">
      {/* FORM */}
      <div className="w-full max-w-2xl flex flex-col gap-6">
        <input
          type="text"
          placeholder="Bookmark Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full h-14 px-6 rounded-full bg-gray-100 border border-gray-200 shadow-inner text-center focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all duration-300"
        />

        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full h-14 px-6 rounded-full bg-gray-100 border border-gray-200 shadow-inner text-center focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all duration-300"
        />

        <button
          onClick={addBookmark}
          className="w-full h-14 rounded-full font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
        >
          Add Bookmark
        </button>
      </div>

      {/* GAP */}
      <div className="h-10" />

      {/* LIST */}
      <div className="w-full max-w-2xl space-y-6">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="flex justify-between items-center bg-white rounded-full px-6 py-4 shadow-lg transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center flex-1">
              <h2 className="font-semibold text-gray-800">
                {bookmark.title}
              </h2>
              <a
                href={bookmark.url}
                target="_blank"
                className="text-sm text-indigo-600 hover:text-purple-600 transition"
              >
                {bookmark.url}
              </a>
            </div>

            <button
              onClick={() => deleteBookmark(bookmark.id)}
              className="w-20 h-10 rounded-full text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-all duration-300 shadow active:scale-95"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
