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
    fetchBookmarks();

    const channel = supabase
      .channel("bookmarks")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookmarks" },
        () => fetchBookmarks()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchBookmarks() {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (data) setBookmarks(data);
  }

  async function addBookmark() {
    if (!title || !url) return;

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: userId,
    });

    setTitle("");
    setUrl("");
  }

  async function deleteBookmark(id: string) {
    await supabase.from("bookmarks").delete().eq("id", id);
  }

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-gray-50 p-6 rounded-xl border space-y-4">
        <input
          type="text"
          placeholder="Bookmark Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition"
        />

        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none transition"
        />

        <button
          onClick={addBookmark}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition shadow-md"
        >
          Add Bookmark
        </button>
      </div>

      {/* List */}
      {bookmarks.length === 0 && (
        <div className="text-center text-gray-500 py-6">
          No bookmarks yet. Add your first one 🚀
        </div>
      )}

      <div className="space-y-4">
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="flex justify-between items-center bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            <div>
              <h2 className="font-semibold text-gray-800">
                {bookmark.title}
              </h2>
              <a
                href={bookmark.url}
                target="_blank"
                className="text-sm text-indigo-600 hover:underline"
              >
                {bookmark.url}
              </a>
            </div>

            <button
              onClick={() => deleteBookmark(bookmark.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
