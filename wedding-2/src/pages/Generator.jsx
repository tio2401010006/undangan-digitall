import { useState, useEffect } from "react";
import { FiShare2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

function GuestGenerator() {
  const [guestName, setGuestName] = useState("");
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ambil daftar tamu saat pertama kali render
  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/guests");
      setGuests(res.data);
    } catch (err) {
      setError("Gagal memuat daftar tamu, coba lagi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addGuest = async () => {
    if (!guestName.trim()) {
      setError("Nama tamu tidak boleh kosong.");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/guests", { name: guestName.trim() });
      setGuests([res.data, ...guests]);
      setGuestName("");
    } catch (err) {
      setError("Gagal menambah tamu.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteGuest = async (id) => {
    if (!confirm("Yakin ingin hapus tamu ini?")) return;
    try {
      setLoading(true);
      await api.delete(`/guests/${id}`);
      setGuests((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      setError("Gagal menghapus tamu.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Share link stabil untuk mobile
  // Share link stabil untuk mobile
  const shareGuest = async (guest) => {
    const url = `${window.location.origin}/?guest=${encodeURIComponent(
      guest.name
    )}`;

    const message = `Tanpa mengurangi rasa hormat.
Kami sangat mengharapkan kehadiran Bapak/Ibu/Saudara/i untuk memberikan doa restu dalam acara kami, 
dalam Upacara Manusa Yadnya Pawiwahan ( Pernikahan ) dan dalam Upacara Manusa Yadnya Mepandes (Potong Gigi) kami yang di laksanakan pada :

Hari/tgl  : Kamis, 01 Oktober 2026
Waktu   : 10:00 Wita - Selesai
Tempat : Link. Kelod Kauh, Abianbase, Gianyar

Undangan dapat diakses melalui link berikut:

${url}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir memberikan doa & restu.

Terima Kasih 🙏
Om Shanti Shanti Shanti Om`;

    try {
      if (navigator.share) {
        // Web Share API (HP biasanya ada opsi WA, IG, dll.)
        await navigator.share({
          title: "Undangan Pernikahan",
          text: message,
        });
      }
    } catch (err) {
      console.error("Gagal share:", err);
      alert("Gagal melakukan share undangan. Silakan coba lagi.");
    }
  };

  const testShare = async () => {
    try {
      await navigator.share({
        title: "Tes Share",
        text: "Hallo untuk tes saja",
        url: "https://contoh.com",
      });
      console.log("Berhasil share (tidak force close).");
    } catch (err) {
      console.error("Gagal share saat tes:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-center mb-4 text-4xl font-semibold font-qwitcher text-amber-400 ">
        ByO.Digital
      </h1>
      <h2 className="text-lg text-black font-semibold mb-3">nama tamu:</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-3 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError("")}>
            <FiX />
          </button>
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Nama Teman/Saudara/Keluarga"
          className="flex-1 text-black border border-gray-300 rounded px-3 py-2 focus:outline-none"
        />
        <button
          onClick={addGuest}
          disabled={loading}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:opacity-50"
        >
          <FiPlus size={20} />
        </button>
      </div>

      {loading && <p className="text-sm text-gray-500 mb-2">Loading...</p>}

      <p className="mb-2 text-sm">{guests.length} nama tamu</p>
      <div className="space-y-2">
        {guests.map((guest) => (
          <div
            key={guest.id}
            className="flex items-center justify-between bg-white shadow px-3 py-2 rounded"
          >
            <span className="text-gray-800">{guest.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => deleteGuest(guest.id)}
                disabled={loading}
                className="bg-gray-200 p-2 rounded hover:bg-gray-300 disabled:opacity-50"
              >
                <FiTrash2 size={18} className="text-red-600" />
              </button>
              <button
                onClick={() => shareGuest(guest)}
                className="bg-green-600 p-2 rounded hover:bg-green-700"
              >
                <FiShare2 size={18} className="text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-sm text-gray-600 text-center">
        Masukkan nama tamu sebanyak kamu mau, dan siap untuk di-share!
      </p>
    </div>
  );
}

export default GuestGenerator;
