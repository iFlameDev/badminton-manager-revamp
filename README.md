# Badminton Manager

Web app untuk mengelola turnamen badminton ganda: susun pemain dan tim, atur court, jadwalkan ronde, catat skor, dan lihat klasemen. Dibangun dengan React 19, Vite, Tailwind CSS, Zustand, dan Framer Motion.

## Fitur

- Format turnamen Mexicano/Americano, termasuk opsi marked dengan tier pemain.
- Input pemain satu per satu atau secara bulk, pengelolaan pasangan tetap, dan status pemain aktif/nonaktif.
- Pengaturan jumlah serta nama court.
- Penjadwalan empat pemain per court dengan ronde serentak atau staggered.
- Input skor aktual kedua tim; skor tidak lagi dihitung sebagai komplemen dari total poin.
- Leaderboard dengan total rally point, menang/kalah, selisih poin, dan bonus kemenangan/istirahat.
- Riwayat turnamen lokal yang disimpan di browser.

## Aturan Skor

Satu match pada satu court dalam satu ronde merepresentasikan **satu game**. Nilai `Target Poin Game` dapat diatur dari 1 sampai 30 (default 21). Host memasukkan skor aktual kedua tim; tim yang mencapai target lebih dulu menang. Tidak ada deuce atau aturan harus menang dengan selisih dua poin. Skor dan selisih pada leaderboard dihitung dari angka aktual yang dimasukkan.

Aturan target tanpa deuce ini adalah format aplikasi yang dapat dikonfigurasi, bukan implementasi penuh aturan pertandingan resmi badminton best-of-three.

Hasil pertandingan baru dinyatakan selesai jika satu sisi mencapai target. Untuk menjaga data turnamen lama, skor tersimpan dari format sebelumnya tetap dikenali sebagai hasil legacy dan tidak dimasukkan ke statistik rally point baru. Mengedit lalu menyimpan ulang hasil lama akan menerapkannya sebagai skor badminton.

## Menjalankan Secara Lokal

Prasyarat: Node.js 20 atau lebih baru.

```powershell
npm install
npm run dev
```

Perintah lain:

```powershell
npm test
npm run lint
npm run build
```

## Penyimpanan

State dan riwayat turnamen disimpan di `localStorage` browser dengan key `badminton_history`. Saat key ini belum ada, aplikasi membaca key lama `padel_history` agar riwayat sebelumnya masih dapat dibuka; penyimpanan berikutnya menggunakan key baru.

File `.env` tidak diperlukan untuk alur aplikasi saat ini dan dikecualikan dari Git. Jangan memasukkan kredensial atau rahasia ke repositori publik.
