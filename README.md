# RAB Bangunan

Aplikasi estimasi Rencana Anggaran Biaya bangunan berbasis Next.js dan Google Sheets API.

## Stack
- Next.js App Router + TypeScript
- Responsive UI (mobile & desktop)
- Google Sheets API sebagai penyimpanan tahap awal
- Vercel untuk hosting
- Role Admin dan Operator (implementasi autentikasi pada tahap berikutnya)

## Menjalankan lokal
```bash
npm install
cp .env.example .env.local
npm run dev
```

## Google Sheets
1. Buat Google Cloud project dan aktifkan Google Sheets API.
2. Buat service account.
3. Buat Google Spreadsheet lalu bagikan ke email service account sebagai Editor.
4. Isi `GOOGLE_SHEETS_SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, dan `GOOGLE_PRIVATE_KEY`.
5. Set `SETUP_TOKEN` di environment.
6. Panggil `POST /api/setup` dengan header `x-setup-token` untuk membuat tab dan header database.

**Keamanan:** private key dan setup token hanya di server. Jangan gunakan prefix `NEXT_PUBLIC_` untuk rahasia. Endpoint setup wajib dilindungi dan token diganti setelah inisialisasi.

## Struktur sheet
USERS, PROYEK, PEKERJAAN, MATERIAL, UPAH, ALAT, AHSP, AHSP_DETAIL, RAB, DETAIL_RAB, REALISASI, LOG_AKTIVITAS, PENGATURAN.

## Tahapan berikutnya
- Login/session dan role Admin/Operator
- CRUD proyek dan RAB
- Mesin analisa AHSP dan rekap biaya
- Cetak PDF dan ekspor Excel
- Audit log, validasi, dan concurrency control
