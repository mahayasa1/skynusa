#!/usr/bin/env bash
# Jalankan dari folder proyek (yang berisi artisan):  bash install.sh
set -e
[ -f artisan ] || { echo "Jalankan di folder proyek Laravel (ada file artisan)."; exit 1; }
php artisan migrate --force
php artisan optimize:clear
echo "Selesai. Jalankan ulang 'npm run dev' (atau 'npm run build' untuk production)."
