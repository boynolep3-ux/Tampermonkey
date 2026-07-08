(async function() {
    'use strict';

    console.log("[Master Loader] Memulai loading sub-scripts...");

    // Nama file sudah diganti menjadi .js biasa tanpa kata .user
    const subScripts = [
        "https://raw.githubusercontent.com/boynolep3-ux/Tampermonkey/main/main/BintangMedia-AutoRefreshListNota.js",
        "https://raw.githubusercontent.com/boynolep3-ux/Tampermonkey/main/BintangMedia-FixTombolBarisBaru.js",
        "https://raw.githubusercontent.com/boynolep3-ux/Tampermonkey/main/BintangMedia-NotaOverhaul.js",
        "https://raw.githubusercontent.com/boynolep3-ux/Tampermonkey/main/main/BintangMedia-RedTheme.js",
        "https://raw.githubusercontent.com/boynolep3-ux/Tampermonkey/main/BintangMedia-SoftwareNota.js",
        "https://raw.githubusercontent.com/boynolep3-ux/Tampermonkey/main/WhatsAppWebCDR&JPEGFileDownloaderFixer.js",
        "https://raw.githubusercontent.com/boynolep3-ux/Tampermonkey/main/WhatsAppWebtoBintangMediaTransaksiBridge.js"
    ];

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
