(async function() {
    'use strict';

    // Daftar semua link JS anak yang ingin di-load (wajib pakai jsDelivr)
    const scriptUrls = [
        "https://cdn.jsdelivr.net/gh/username/repo@main/script1.js",
        "https://cdn.jsdelivr.net/gh/username/repo@main/script2.js",
        "https://cdn.jsdelivr.net/gh/username/repo@main/script3.js"
    ];

    // Meload script secara berurutan
    for (const url of scriptUrls) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Gagal mengambil ${url}`);
            const code = await response.text();
            
            // Menjalankan kode JS di dalam konteks Tampermonkey
            new Function(code)(); 
            console.log(`Successfully loaded: ${url}`);
        } catch (error) {
            console.error("Error loading script:", error);
        }
    }
})();
