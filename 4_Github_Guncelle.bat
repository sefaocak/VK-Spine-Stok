@echo off
title VK Spine Stok - GitHub'dan Guncelle
color 0B

echo ===================================================
echo   VK SPINE STOK UYGULAMASI GITHUB GUNCELLEME MODU
echo ===================================================
echo Bu islem kodlari otomatik olarak en son surume gunceller.
echo Lutfen bekleyin...
echo ===================================================

echo.
echo 1. GitHub'dan yeni kodlar cekiliyor...
git pull origin main

echo.
echo 2. Eger yeni paketler (kutuphaneler) varsa kuruluyor...
call npm install

echo.
echo 3. Veritabani guncelleniyor...
call npx prisma generate
call npx prisma db push

echo.
echo ===================================================
echo GITHUB GUNCELLEME ISLEMI TAMAMLANDI.
echo Simdi "2_Baslat.bat" dosyasini acabilirsiniz.
echo ===================================================
pause
