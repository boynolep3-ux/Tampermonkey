// ==UserScript==
// @name         Bintang Media - Auto Refresh List Nota
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Auto refresh tabel data tanpa reload halaman (Fix context & DataTables)
// @author       Gemini
// @match        *://bintangbaru.bintangmedi4.com/datapenjualan/riwayat*
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // PENGATURAN: Jeda refresh dalam milidetik (10000 = 10 detik)
    const REFRESH_INTERVAL = 10000;

    setInterval(() => {
        // Menggunakan jQ/window dari website secara langsung lewat unsafeWindow
        const myWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
        const $ = myWindow.jQuery || myWindow.$;

        if (!$) return; // Lewati jika jQuery belum siap

        // Deteksi input pencarian agar tidak mengganggu user yang sedang mengetik
        const searchInput = document.querySelector('input[aria-controls="my-grid"]');
        const pelangganInput = document.querySelector('#search-pelanggan');

        if (document.activeElement === searchInput || document.activeElement === pelangganInput) {
            console.log('[AutoRefresh] Refresh ditunda karena Anda sedang mengetik.');
            return;
        }

        try {
            const tableElement = $('#my-grid');
            if (tableElement.length > 0) {

                // Opsi 1: Panggil API DataTables Modern
                if ($.fn.DataTable && $.fn.DataTable.isDataTable('#my-grid')) {
                    const table = tableElement.DataTable();
                    if (table.ajax && typeof table.ajax.reload === 'function') {
                        table.ajax.reload(null, false);
                        console.log('[AutoRefresh] Tabel berhasil di-refresh (Metode Ajax).');
                        return;
                    } else if (typeof table.draw === 'function') {
                        table.draw(false);
                        console.log('[AutoRefresh] Tabel berhasil di-refresh (Metode Draw).');
                        return;
                    }
                }

                // Opsi 2: Jalur alternatif untuk DataTables versi lama/klasik
                const legacyTable = tableElement.dataTable();
                if (legacyTable && typeof legacyTable.fnReloadAjax === 'function') {
                    legacyTable.fnReloadAjax();
                    console.log('[AutoRefresh] Tabel berhasil di-refresh (Metode Legacy fnReloadAjax).');
                } else if (legacyTable && legacyTable.api) {
                    legacyTable.api().draw(false);
                    console.log('[AutoRefresh] Tabel berhasil di-refresh (Metode Legacy API Draw).');
                }
            }
        } catch (error) {
            console.error('[AutoRefresh] Error saat mencoba refresh tabel:', error);
        }

    }, REFRESH_INTERVAL);
})();
