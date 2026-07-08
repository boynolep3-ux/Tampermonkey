(async function() {
    'use strict';

    console.log("[Master Loader] Memulai loading sub-scripts...");

    // Daftar seluruh script dari Bintang Media & WhatsApp Web sesuai image_dabbe8.png
    const subScripts = [
        "https://raw.githubusercontent.com/boynolep3-ux/Tampermonkey/main/BintangMedia-AutoRefreshListNota.user.js",
        "https://raw.githubusercontent.com/boynolep3-ux/Tampermonkey/main/BintangMedia-FixTombolBarisBaru.user.js",
        "https://raw.githubusercontent.com/boynolep3-ux/Tampermonkey/main/BintangMedia-NotaOverhaul.user.js",
        "https://raw.githubusercontent.com/boynolep3-ux/Tampermonkey/main/BintangMedia-RedTheme.user.js",
        "https://raw.githubusercontent.com/boynolep3-ux/Tampermonkey/main/BintangMedia-SoftwareNota.user.js",
        "https://raw.githubusercontent.com/boynolep3-ux/Tampermonkey/main/WhatsAppWebCDR&JPEGFileDownloaderFixer.user.js",
        "https://raw.githubusercontent.com/boynolep3-ux/Tampermonkey/main/WhatsAppWebtoBintangMediaTransaksiBridge.user.js"
    ];

    // Meload dan mengeksekusi sub-scripts satu per satu secara berurutan
    for (const url of subScripts) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Gagal mendownload file: ${url}`);
            
            const code = await response.text();
            new Function(code)();
            console.log(`[Master Loader] Berhasil meload: ${url}`);
        } catch (err) {
            console.error(`[Master Loader] Gagal meload script (${url}):`, err);
        }
    }
})();
