# TemanBelajar | Implementasi Komponen Dasar Antarmuka (M07)

Proyek ini merupakan implementasi komponen dasar antarmuka web menggunakan **HTML5 Semantik, CSS3 (Custom Properties, Grid, dan Flexbox), serta Vanilla JavaScript** berdasarkan rancangan wireframe **Tugas 1 (5 Halaman Utama: Dashboard Kelompok, Task Manager, Schedule Matcher, Forum Q&A Anonim, dan Peer Evaluation)** pada aplikasi kolaborasi tugas kelompok mahasiswa **TemanBelajar**.

## Deskripsi Proyek

Berdasarkan riset kebutuhan pengguna (PT M2) dan spesifikasi kebutuhan fungsional/non-fungsional (PT M4), mahasiswa sering mengalami kesulitan saat berkoordinasi mengerjakan tugas kelompok: **80%** bingung dan merasa sungkan (*"nggak enakan"*) saat membagi tugas, **66,7%** kesulitan mencocokkan jadwal luang (rata-rata membuang 39,2 menit di grup chat), **46,7%** sering lupa jadwal, serta merasa canggung (*"beda kasta"*) saat ingin bertanya materi.

Implementasi ini menyajikan kelima halaman utama **TemanBelajar** dalam satu antarmuka web interaktif:
1. **Dashboard Kelompok**: Menampilkan banner pengingat otomatis H-2 jam (**KF-3**), 3 kartu ringkasan metrik, daftar sub-tugas belum diklaim, dan distribusi beban anggota.
2. **Task Manager**: Menampilkan kapasitas beban tugas anggota secara *real-time*, filter status, kartu sub-tugas berkode (`TB-01` s/d `TB-04`) dengan tombol mandiri **Klaim Tugas** (**KF-1**), serta form tambah sub-tugas baru.
3. **Schedule Matcher**: Menyediakan matriks input jadwal kosong interaktif di sisi kiri dan peta irisan waktu kelompok (lengkap dengan inisial anggota per slot jam) dengan sorotan warna hijau pada slot **4/4 Anggota Cocok** di sisi kanan (**KF-2**).
4. **Forum Diskusi & Q&A Anonim**: Menyediakan form komposer pertanyaan dengan validasi JavaScript, sakelar geser (*toggle switch*) **Kirim sebagai Anonim**, balasan otomatis **AI Helper**, serta tombol reaksi terbantu (**KF-4**).
5. **Peer Evaluation**: Menyediakan kartu penilaian kontribusi anggota menggunakan *rating* bintang interaktif (1 sampai 5 bintang) beserta label makna dinamis dan riwayat tugas anggota secara rahasia di akhir proyek (**KF-5**).

## 5 Komponen Utama yang Diimplementasikan

1. **Navigasi Sidebar Kiri & Top Header Bar Responsif (`aside#sidebar` & `header.top-header`)**
   - Menggunakan elemen semantik `<aside>`, `<nav>`, dan `<header>` dengan ikon vektor SVG untuk berpindah antar ke-5 halaman utama secara instan di desktop serta menyediakan *drawer menu* (`#btn-menu-toggle`) pada layar ponsel hingga lebar `360px` (**KNF-3**).
2. **Kartu Ringkasan Dashboard & Banner Pengingat Otomatis H-2 Jam (`#dashboard-reminder-banner` & `.summary-cards-grid`)**
   - Menampilkan informasi pengingat jadwal kumpul terdekat dengan tombol pintasan langsung (`#btn-goto-schedule` & `#btn-goto-task-manager`) serta kartu indikator progres proyek yang tersinkronisasi otomatis saat tugas diklaim.
3. **Panel Beban Anggota, Kartu Sub-Tugas Interaktif, & Form Tambah Tugas (`#workload-panel`, `#task-cards-container`, `#add-task-form`)**
   - Mengimplementasikan klaim tugas mandiri (**KF-1**), pembatalan klaim, penyelesaian tugas, *tab filter* status (`Semua`, `Tersedia`, `Dikerjakan`, `Selesai`), serta form tambah sub-tugas baru dengan validasi JavaScript.
4. **Matriks Interaktif Schedule Matcher & Peta Irisan Waktu Kelompok (`.schedule-split-grid` & `.slot-btn`)**
   - Memungkinkan pengguna memilih slot waktu luang (`Bisa` / `Kosong`), menghitung total slot terpilih secara otomatis, dan langsung memperbarui sel irisan kelompok beserta inisial anggota hingga menyorot warna hijau (`4/4 Anggota Cocok`) sesuai **KF-2**.
5. **Form Komposer Forum Q&A Anonim (Validasi JS) & Rating Bintang Peer Evaluation (`form#qna-form` & `form#peer-eval-form`)**
   - Mencakup validasi input pertanyaan minimal 10 karakter dengan pesan peringatan `role="alert"`, sakelar geser privasi anonim, pembuatan kartu diskusi baru beserta kotak **AI Helper**, serta pemilih *rating* 1 sampai 5 bintang interaktif pada halaman evaluasi anggota.

## Struktur Proyek

```text
.
├── index.html   # Struktur HTML5 semantik (5 halaman utama & komponen antarmuka di folder akar)
├── styles.css   # Styling terpisah dengan CSS Custom Properties (--color-*, --space-*)
├── script.js    # Logika interaktivitas Vanilla JavaScript (navigasi, klaim tugas, matriks jadwal, validasi form, rating bintang)
└── README.md    # Dokumentasi deskripsi, struktur proyek, dan cara menjalankan
```

## Cara Menjalankan Proyek

1. Unduh atau *clone* repositori ini ke komputer Anda:
   ```bash
   git clone <URL_REPO_GITHUB_ANDA>
   ```
2. Buka berkas **`index.html`** langsung menggunakan peramban web modern (Chrome, Edge, atau Firefox), atau jalankan melalui ekstensi **Live Server** di VS Code.
3. Gunakan menu **Sidebar Kiri** untuk berpindah dan mencoba interaktivitas di kelima halaman (**Dashboard Kelompok**, **Task Manager**, **Schedule Matcher**, **Forum Q&A Anonim**, dan **Peer Evaluation**).
