# Patch SKYNUSA: semua konten bisa diedit dari admin

Menu baru di Admin > Management: **Konten Situs**, **Tim**, dan **Pesan Masuk**.

Bug yang ikut diperbaiki:
- Tambah portfolio dari admin gagal (companies_id/categories_id tidak ada di $fillable).
- Gambar unggahan admin (portfolio, layanan, klien) rusak di situs publik.
- Link /portfolio/{slug} dan /layanan/{slug} membuka halaman yang salah/tidak ada.
- Pesan dari form kontak tidak bisa dibaca di admin.
