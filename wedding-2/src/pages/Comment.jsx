import { useEffect, useState } from "react";

// Ambil URL dari env
const API_URL = import.meta.env.VITE_API_URL;

function CommentSection() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isPresent, setIsPresent] = useState(null); // null = belum pilih
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Ambil komentar dari API saat pertama kali render
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${API_URL}/comments`);
        const data = await res.json();

        // Pastikan data adalah array
        if (Array.isArray(data)) {
          setComments(data);
        } else {
          console.error("Data comments bukan array:", data);
          setComments([]);
        }
      } catch (err) {
        console.error("Gagal fetch comments:", err);
        setComments([]);
      }
    };

    fetchComments();
  }, []);

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !message.trim() || isPresent === null) {
      alert("Nama, pesan, dan kehadiran wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          message,
          isPresent,
        }),
      });

      const data = await res.json();

      if (res.ok && data.id) {
        // Tambahkan komentar baru ke list
        setComments([data, ...comments]);
        setName("");
        setMessage("");
        setIsPresent(null);
      } else {
        console.error("Gagal submit:", data);
        alert(data.error || "Gagal mengirim komentar");
      }
    } catch (err) {
      console.error("Error submit:", err);
      alert("Terjadi kesalahan server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-lg font-semibold text-black mb-4">
        Ucapan & Kehadiran
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Nama Anda"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none"
        />

        <textarea
          placeholder="Tulis ucapan Anda..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:outline-none"
          rows="3"
        />

        {/* Radio Kehadiran */}
        <div className="flex gap-4 text-black">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="kehadiran"
              checked={isPresent === true}
              onChange={() => setIsPresent(true)}
            />
            Hadir
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="kehadiran"
              checked={isPresent === false}
              onChange={() => setIsPresent(false)}
            />
            Tidak Hadir
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#D4AF37] text-white py-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? "Mengirim..." : "Kirim"}
        </button>
      </form>

      {/* List komentar */}
      <div className="mt-5 space-y-3">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div
              key={c.id}
              className="border border-gray-200 rounded p-3 bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-black">{c.name}</h4>
                <span
                  className={`text-xs px-2 py-1 rounded bg-slate-200 text-black`}
                >
                  {c.is_present ? "Hadir" : "Tidak Hadir"}
                </span>
              </div>
              <p className="text-gray-700 mt-1">{c.message}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">Belum ada komentar.</p>
        )}
      </div>
    </div>
  );
}

export default CommentSection;
