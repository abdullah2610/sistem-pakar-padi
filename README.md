# Implementasi Desain Baru — Sistem Pakar Padi Kalbar

File-file di folder ini adalah implementasi desain baru (nuansa padi + ornamen Kalimantan Barat) untuk codebase React + TypeScript + Vite Anda.

## Cara apply

Copy/replace file-file berikut ke folder `sistem-pakar-padi/` Anda:

```
sistem-pakar-padi/
├── index.html              ← REPLACE (font Google Fonts diganti)
└── src/
    ├── App.tsx             ← REPLACE (rewrite total dengan struktur komponen baru)
    ├── App.css             ← REPLACE (kosong; semua style di index.css)
    ├── index.css           ← REPLACE (palet + ornamen + responsive)
    ├── Ornaments.tsx       ← NEW    (SVG ornamen: padi, pucuk rebung, corak insang, kelawit, dll)
    │
    ├── data.ts             ← TIDAK BERUBAH
    └── main.tsx            ← TIDAK BERUBAH
```

## Yang Berubah

- **Top band**: "BRMP · Kalimantan Barat · Kementerian Pertanian"
- **Tipografi**: Cormorant Garamond (display) + Plus Jakarta Sans (body)
- **Palet warna**: cream/ivory, ink hijau gelap, emas padi, terracotta Sambas
- **Ornamen**: SVG hand-drawn — padi (mengapit judul), Pucuk Rebung (latar), Corak Insang (pita result card), Kelawit Dayak (sudut kartu fase), Tampuk Manggis (rosette divider)
- **Ilustrasi 4 fase padi**: SVG untuk semai → vegetatif → bunting → generatif
- **Mobile-responsive**: breakpoints di 720px / 520px / 380px

## Dependensi

Tidak ada package baru. `lucide-react` masih ada di `package.json` tapi tidak dipakai App.tsx baru — Anda bisa hapus dari package.json jika mau, atau biarkan saja.

## Setelah copy

```bash
cd sistem-pakar-padi
npm install   # kalau belum
npm run dev
```
