@echo off
setlocal enabledelayedexpansion
title VK Spine Stok - Otomatik Kurulum ve Baslatma 
color 0B

echo ===================================================
echo     VK SPINE STOK - AKILLI KURULUM VE BASLATMA
echo ===================================================
echo.

:: 1. Adim: Node.js Kontrolu
echo [1/5] Node.js sistem uzerinde araniyor...
node -v >nul 2>&1
if !errorlevel! neq 0 (
    color 0C
    echo.
    echo [HATA] Node.js bulunamadi!
    echo Lutfen https://nodejs.org/ adresinden Node.js indirip kurun.
    echo Kurulum sirasinda "Add to PATH" secenegini isaretlediginizden emin olun.
    echo Eger az once kurduysaniz, bu pencereyi kapatip yeniden acin.
    echo.
    pause
    exit /b 1
) else (
    echo [BASARILI] Node.js bulundu.
)

:: 2. Adim: Bagimliliklarin (npm install) yuklenmesi
echo.
echo [2/5] Gerekli yazilim paketleri (node_modules) yukleniyor...
echo Bu islem internet hiziniza bagli olarak birkac dakika surebilir.
call npm install
if !errorlevel! neq 0 (
    color 0C
    echo.
    echo [HATA] npm install sirasinda bir sorun olustu!
    echo Lutfen internet baglantinizi kontrol edin.
    echo Konsoldaki kirmizi hata mesajlarini okuyun.
    echo.
    pause
    exit /b 1
) else (
    echo [BASARILI] Paketler yuklendi.
)

:: 3. Adim: Veritabani hazirligi (Prisma generate & db push)
echo.
echo [3/5] Veritabani baglantilari ayarlaniyor...
call npx prisma generate
if !errorlevel! neq 0 (
    color 0C
    echo.
    echo [HATA] npx prisma generate komutunda sorun yasandi!
    echo "prisma/schema.prisma" dosyaniz bozuk olabilir.
    echo.
    pause
    exit /b 1
)

call npx prisma db push --accept-data-loss
if !errorlevel! neq 0 (
    color 0C
    echo.
    echo [HATA] Veritabani dosyalari olusturulurken sorun yasandi!
    echo Eski veritabani dosyalari (dev.db) kilitli veya bozuk olabilir.
    echo.
    pause
    exit /b 1
) else (
    echo [BASARILI] Veritabani hazir.
)

:: 4. Adim: Eger daha once seed edilmediyse (ilk kurulumsa) ornek verilerin eklenmesi
echo.
echo [4/5] Gerekli ise varsayilan veriler (Yonetici vb.) olusturuluyor...
call npx prisma db seed >nul 2>&1
:: Burada hata kontrolu yapmiyoruz, seed zaten daha once veritabani varsa unique constraint hatasi verebilir ki bu onemli bir sorun degil.
echo [BILGI] Veri kontrolu tamamlandi.

:: 5. Adim: Baslatma
echo.
echo [5/5] Sistem baslatiliyor...
echo.
echo ===================================================
echo TEBRIKLER! SISTEM BASARIYLA KURULDU.
echo Birazdan tarayicinizda "http://localhost:3000" otomatik acilacak.
echo Lutfen sistem calisirken bu siyah pencereyi KAPATMAYIN.
echo Kapatirsaniz proje durur.
echo ===================================================
echo.

start http://localhost:3000
call npm run dev

:: Eger sistem dev modunda baglanti koparsa (beklenmedik sekilde durursa):
color 0C
echo.
echo [DIKKAT] Sistem beklenmedik sekilde durduruldu veya kapatildi.
echo Baglanti noktasi (3000. port) baska bir uygulama tarafindan kullaniliyor olabilir.
pause
