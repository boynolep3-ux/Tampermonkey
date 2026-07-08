(async function() {
    'use strict';

    console.log("[Master Loader] Memulai loading sub-scripts via CDN...");

    // Link yang sudah disesuaikan dengan folder /main/ di GitHub kamu
    const subScripts = [
        "https://cdn.jsdelivr.net/gh/boynolep3-ux/Tampermonkey@latest/main/BintangMedia-XXAutoRefreshListNota.js",
        "https://cdn.jsdelivr.net/gh/boynolep3-ux/Tampermonkey@latest/main/BintangMedia-XXFixTombolBarisBaru.js",
        "https://cdn.jsdelivr.net/gh/boynolep3-ux/Tampermonkey@latest/main/BintangMedia-XXSoftwareNota.js",
        "https://cdn.jsdelivr.net/gh/boynolep3-ux/Tampermonkey@latest/main/WhatsAppWebCDR&JPEGFileDownloaderFixer.js",
        "https://cdn.jsdelivr.net/gh/boynolep3-ux/Tampermonkey@latest/main/XXBintangMedia-Save&RestoreTransaksi.js",
    ];

    for (const url of subScripts) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Gagal mendownload file: ${url}`);
            
            const code = await response.text();
            eval(code); // Mengeksekusi kode script anak
            console.log(`[Master Loader] Berhasil meload: ${url}`);
        } catch (err) {
            console.error(`[Master Loader] Gagal meload script (${url}):`, err);
        }
    }
})();
