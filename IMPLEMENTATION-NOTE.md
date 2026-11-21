# Implementation Note: Badminton Manager

## Keputusan Skor

- Satu match per court/ronde merepresentasikan satu game, bukan best-of-three.
- Target poin mengikuti konfigurasi `Target Poin Game` (default 21, rentang 1–30).
- Sesuai keputusan produk, game dimenangkan oleh sisi pertama yang mencapai target; tidak ada deuce atau syarat selisih dua poin.
- Host memasukkan skor aktual kedua sisi. Skor lawan tidak diturunkan dari `target - skor`.
- Leaderboard menjumlahkan rally point aktual. Menang/kalah, streak, bonus kemenangan, dan penyelesaian ronde ditentukan dari sisi yang mencapai target.

Catatan: aturan target tanpa deuce ini adalah format aplikasi, bukan implementasi penuh aturan pertandingan badminton resmi.

## Perubahan yang Dilakukan

- Menambahkan helper scoring teruji untuk validasi target/hasil, pemenang, dan status selesai.
- Menyimpan versi scoring dan target per match agar perubahan konfigurasi tidak menulis ulang interpretasi hasil yang sudah masuk.
- Mengubah modal skor untuk menginput kedua skor aktual, memvalidasi sebelum penyimpanan, dan mendukung reset.
- Menyelaraskan status selesai di penjadwalan, ronde, tampilan pemenang, statistik, dan penguncian swap.
- Mempertahankan hasil legacy yang sudah tersimpan sebagai hasil selesai; hasil itu tidak dimasukkan ke statistik rally point baru. Saat diedit dan disimpan, hasil memakai format baru.
- Memindahkan history browser ke key `badminton_history`, dengan fallback baca key lama `padel_history`.
- Mengganti branding aplikasi, metadata, dan nama paket menjadi Badminton Manager. Nama `badminton-manager-revamp` hanya digunakan sebagai nama repositori.
- Memperbarui README sesuai perilaku source saat ini dan mengecualikan `.env` dari Git.

## Validasi

- `npm test`: menguji rentang target, skor valid/tidak valid, pemenang, penyelesaian match, dan kompatibilitas skor legacy.
- `npm run lint`
- `npm run build`

## Repo GitHub

- Nama: `badminton-manager-revamp`
- Visibilitas: public
- Riwayat: fresh repository (tanpa riwayat commit repo lama)
