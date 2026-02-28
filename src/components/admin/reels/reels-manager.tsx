"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface Reel {
  id: string;
  videoUrl: string;
}

export default function ReelsManager() {
  const [file, setFile] = useState<File | null>(null);
  const [reels, setReels] = useState<Reel[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadReels();
  }, []);

  async function loadReels() {
    const res = await axios.get("/api/reels/list");
    setReels(res.data.reels);
  }

  function getVideoDimensions(file: File) {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        resolve({ width: video.videoWidth, height: video.videoHeight });
      };
      video.src = URL.createObjectURL(file);
    });
  }

  async function handleUpload() {
    if (!file) return alert("Select a video first.");
    if (!file.type.startsWith("video/")) return alert("File must be a video.");
    if (file.size > 50 * 1024 * 1024) return alert("Max size is 50MB!");

    const dim: any = await getVideoDimensions(file);
    const ratio = dim.height / dim.width;
    const expected = 16 / 9;

    if (Math.abs(ratio - expected) > 0.08) {
      return alert("Video must be 9:16 vertical format!");
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "reels");

    const uploadRes = await axios.post("/api/media/upload", formData);

    await axios.post("/api/reels/save", {
      mediaId: uploadRes.data.id,
      videoUrl: uploadRes.data.url
    });

    setFile(null);
    setUploading(false);
    await loadReels();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this reel?")) return;
    await axios.post("/api/reels/delete", { id });
    await loadReels();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {uploading ? "Uploading..." : "Upload Reel"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {reels.map((reel) => (
          <div key={reel.id} className="relative">
            <video src={reel.videoUrl} controls className="w-full rounded" />
            <button
              onClick={() => handleDelete(reel.id)}
              className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
