// ==UserScript==
// @name         WhatsApp Web to Bintang Media Transaksi Bridge
// @namespace    BintangMediaBridge System
// @version      2.0
// @description  Otomatis pindah tab ke Transaksi saat klik Copy di WA memakai trik Hash-Click Navigation (Tanpa Reload)
// @author       Anda & AI
// @match        https://web.whatsapp.com/*
// @match        https://bintangbaru.bintangmedi4.com/penjualan/transaksi*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // =========================================================================
    // SISI 1: Berjalan di Halaman WhatsApp Web
    // =========================================================================
    if (window.location.hostname === 'web.whatsapp.com') {

        function injectCopyButton() {
            const spans = document.querySelectorAll('span.x140p0ai.x1gufx9m, span.x13faqbe.x1lliihq');

            spans.forEach(targetSpan => {
                const text = targetSpan.innerText.trim();
                const isPhoneNumber = /^\+\d[\d\s-]{7,20}$/.test(text);

                if (isPhoneNumber && !targetSpan.classList.contains('copy-btn-loaded')) {
                    targetSpan.classList.add('copy-btn-loaded');

                    if (targetSpan.parentElement) {
                        targetSpan.parentElement.style.display = 'flex';
                        targetSpan.parentElement.style.alignItems = 'center';
                    }

                    const copyBtn = document.createElement('button');
                    copyBtn.innerText = '📋 Copy';

                    // Style Tombol
                    copyBtn.style.marginLeft = '10px';
                    copyBtn.style.padding = '2px 8px';
                    copyBtn.style.fontSize = '12px';
                    copyBtn.style.fontWeight = 'bold';
                    copyBtn.style.backgroundColor = '#00a884';
                    copyBtn.style.color = '#ffffff';
                    copyBtn.style.border = 'none';
                    copyBtn.style.borderRadius = '4px';
                    copyBtn.style.cursor = 'pointer';

                    copyBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        // 1. Salin nomor ke clipboard
                        navigator.clipboard.writeText(text).then(() => {
                            copyBtn.innerText = '✅ Copied!';
                            copyBtn.style.backgroundColor = '#1fa855';

                            // 2. Kirim pemicu ke tab transaksi dengan tanda waktu unik
                            GM_setValue('pemicu_pindah_transaksi', {
                                number: text,
                                timestamp: new Date().getTime()
                            });

                            setTimeout(() => {
                                copyBtn.innerText = '📋 Copy';
                                copyBtn.style.backgroundColor = '#00a884';
                            }, 2000);
                        });
                    });

                    targetSpan.after(copyBtn);
                }
            });
        }

        const observer = new MutationObserver(() => injectCopyButton());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // =========================================================================
    // SISI 2: Berjalan di Halaman Transaksi (bintangmedi4.com)
    // =========================================================================
    if (window.location.href.includes('bintangbaru.bintangmedi4.com/penjualan/transaksi')) {

        GM_addValueChangeListener('pemicu_pindah_transaksi', function(key, oldValue, newValue, remote) {
            if (remote && newValue) {

                // KUNCI UTAMA: Gunakan simbol # + timestamp agar URL-nya selalu unik di mata browser.
                // Trik ini memaksa browser memproses klik navigasi internal, tapi AMAN tanpa reload halaman!
                const linkTujuan = 'https://bintangbaru.bintangmedi4.com/penjualan/transaksi#go_' + newValue.timestamp;

                const linkRahasia = document.createElement('a');
                linkRahasia.href = linkTujuan;
                linkRahasia.style.display = 'none';
                document.body.appendChild(linkRahasia);

                // Eksekusi urutan persis seperti script Overhaul andalanmu
                linkRahasia.click();
                window.focus();

                // Bersihkan elemen link rahasia dan auto-fokus ke kolom input (jika ada)
                setTimeout(() => {
                    linkRahasia.remove();

                    // Opsional: Langsung arahkan kursor ke kotak text input biar tinggal Ctrl+V
                    const inputForm = document.querySelector('input[type="text"], input[type="search"]');
                    if (inputForm) inputForm.focus();
                }, 300);
            }
        });
    }

})();