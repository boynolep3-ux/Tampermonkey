// ==UserScript==
// @name         Bintang Media - Nota Overhaul
// @namespace    BintangMediaBridge System
// @version      19.2
// @description  Layar penuh Nota, Otomatis Baca Nomor Tanpa Teks Indikator, Pindah Tab WA, dan Auto-Paste Gambar (Fit & Crop)
// @author       Anda
// @match        *https://bintangbaru.bintangmedi4.com/penjualan/transaksi_cetaks/*
// @match        https://web.whatsapp.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @require      https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    let nomorTerdeteksiGlobal = null;

    // DAFTAR NOMOR YANG WAJIB DIABAIKAN (Format bersih hanya angka)
    const DAFTAR_BLACKLIST = [
        "081286379191",
        "081357612888",
        "0215222221",
        "1130013032861",
        "034201112222564"
    ];

    // =========================================================================
    // SISI 1: Berjalan di Halaman Cetak Nota (bintangmedi4.com)
    // =========================================================================
    if (window.location.href.includes('bintangmedi4.com')) {

        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

        GM_addStyle(`
            #island-overlay {
                position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                background: #000 !important; z-index: 999999;
                display: flex; flex-direction: column; align-items: center; justify-content: center;
            }
            #nota-frame { position: relative; background: #fff; line-height: 0; border-radius: 2px; box-shadow: 0 0 100px rgba(0,0,0,1); }
            #the-canvas { max-height: 78vh; width: auto; display: block; }
            .action-container { margin-top: 20px; display: flex; gap: 12px; }
            .btn-work {
                padding: 12px 20px; border: 1px solid #fff; border-radius: 8px;
                cursor: pointer; font-weight: 800; font-family: sans-serif;
                text-transform: uppercase; color: white; font-size: 12px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.5); transition: 0.2s;
            }
            #btn-copy { background: #0083B0; }
            #btn-download { background: #d35400; }
            #btn-print { background: #7f8c8d; }
            .btn-work:active { transform: scale(0.95); }
            #btn-close-overlay {
                position: absolute; top: -15px; right: -15px; width: 32px; height: 32px;
                background: #c0392b; color: #fff; border: 2px solid #fff; border-radius: 50%;
                font-size: 16px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center;
                box-shadow: 0 4px 10px rgba(0,0,0,0.5); transition: 0.2s; z-index: 1000000;
            }
            #btn-close-overlay:hover { background: #e74c3c; transform: scale(1.1); }

            /* Indikator status disembunyikan total */
            #status-pembaca { display: none !important; }
        `);

        async function mulaiMembacaPDF(pdfUrl, percobaanke = 1) {
            try {
                const loadingTask = pdfjsLib.getDocument(pdfUrl);
                const pdf = await loadingTask.promise;
                const page = await pdf.getPage(1);
                const textContent = await page.getTextContent();
                const gabunganTeks = textContent.items.map(item => item.str).join(" ");

                const polaKandidat = /(?:\+?\d{1,4}[- ]?)?0\d{2,4}[- ]?\d{3,4}[- ]?\d{3,6}|(?:\+?62[- ]?|62[- ]?)?8\d{1,4}[- ]?\d{3,4}[- ]?\d{3,6}/g;
                const semuaKandidat = gabunganTeks.match(polaKandidat);

                if (semuaKandidat && semuaKandidat.length > 0) {
                    for (let kandidat of semuaKandidat) {
                        let angkaBersih = kandidat.replace(/[^0-9]/g, '');

                        if (DAFTAR_BLACKLIST.includes(angkaBersih)) {
                            continue;
                        }

                        if (angkaBersih.length >= 10 && angkaBersih.length <= 14) {
                            if (angkaBersih.startsWith('0')) {
                                angkaBersih = '62' + angkaBersih.slice(1);
                            } else if (angkaBersih.startsWith('8')) {
                                angkaBersih = '62' + angkaBersih;
                            }

                            nomorTerdeteksiGlobal = angkaBersih;
                            console.log(`[Sistem Nota] Nomor berhasil didapatkan di background.`);
                            return;
                        }
                    }
                }
            } catch (e) {
                console.error("Gagal membaca dokumen pada percobaan ke-" + percobaanke, e);
            }

            if (percobaanke < 5) {
                setTimeout(() => { mulaiMembacaPDF(pdfUrl, percobaanke + 1); }, 1200);
            }
        }

        async function startOverhaul() {
            const pdfUrl = window.location.href;
            const overlay = document.createElement('div');
            overlay.id = 'island-overlay';
            overlay.innerHTML = `
                <div id="nota-frame">
                    <button id="btn-close-overlay" title="Keluar / Tutup">✕</button>
                    <canvas id="the-canvas"></canvas>
                    <div id="status-pembaca"></div>
                </div>
                <div class="action-container">
                    <button id="btn-print" class="btn-work">🖨️ PRINT</button>
                    <button id="btn-download" class="btn-work">📂 DOWNLOAD</button>
                    <button id="btn-copy" class="btn-work">📋 COPY NOTA & KE WA</button>
                </div>
            `;
            document.body.appendChild(overlay);

            try {
                const loadingTask = pdfjsLib.getDocument(pdfUrl);
                const pdf = await loadingTask.promise;
                const page = await pdf.getPage(1);
                const canvas = document.getElementById('the-canvas');
                const ctx = canvas.getContext('2d');

                // REVISI UTAMA: Hitung skala secara dinamis agar pas dengan lebar 786 px
                const unscaledViewport = page.getViewport({ scale: 1 });
                const dynamicScale = 786 / unscaledViewport.width;
                const viewport = page.getViewport({ scale: dynamicScale });

                // Set ukuran canvas tujuan
                canvas.width = 786;
                canvas.height = 1300;

                // Render ke canvas. PDF otomatis melebar pas ke samping, dan bagian bawah terpotong di batas 1300 px
                await page.render({ canvasContext: ctx, viewport: viewport }).promise;
            } catch (err) {
                console.error("Gagal merender canvas visual:", err);
            }

            mulaiMembacaPDF(pdfUrl);

            document.getElementById('btn-close-overlay').onclick = () => overlay.remove();

            document.getElementById('btn-copy').onclick = function() {
                const canvas = document.getElementById('the-canvas');
                canvas.toBlob(async (blob) => {
                    try {
                        const item = new ClipboardItem({ "image/png": blob });
                        await navigator.clipboard.write([item]);

                        let nomorTujuan = '';
                        const dataRiwayat = GM_getValue('klik_wa_data');

                        if (nomorTerdeteksiGlobal) {
                            nomorTujuan = nomorTerdeteksiGlobal;
                        } else if (dataRiwayat && dataRiwayat.phone) {
                            nomorTujuan = dataRiwayat.phone.replace(/[^0-9]/g, '');
                        }

                        const reader = new FileReader();
                        reader.readAsDataURL(blob);
                        reader.onloadend = function() {
                            const base64data = reader.result;

                            GM_setValue('pemicu_pindah_cepat', {
                                phone: nomorTujuan,
                                imageData: base64data,
                                timestamp: new Date().getTime()
                              });
                        };

                        this.innerHTML = '✅ COPIED & SWITCHING...';
                        this.style.background = '#27ae60';

                        setTimeout(() => {
                            this.innerHTML = '📋 COPY NOTA & KE WA';
                            this.style.background = '#0083B0';
                        }, 1500);

                    } catch (err) {
                        this.innerHTML = '❌ FAILED';
                        this.style.background = '#c0392b';
                        console.error(err);
                    }
                });
            };

            document.getElementById('btn-download').onclick = () => {
                const canvas = document.getElementById('the-canvas');
                const a = document.createElement('a');
                a.href = canvas.toDataURL('image/png');
                a.download = 'Nota_Bintang_Media.png';
                a.click();
            };
            document.getElementById('btn-print').onclick = () => window.print();
        }

        setTimeout(startOverhaul, 500);
    }

    // =========================================================================
    // SISI 2: Berjalan di Web WhatsApp
    // =========================================================================
    if (window.location.href.includes('whatsapp.com')) {

        function base64ToFile(base64Str, filename) {
            var arr = base64Str.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){ u8arr[n] = bstr.charCodeAt(n); }
            return new File([u8arr], filename, {type:mime});
        }

        function eksekusiAutoPaste(base64Gambar) {
            setTimeout(() => {
                const chatbox = document.querySelector('div[contenteditable="true"][data-tab="10"]') || document.querySelector('footer div[contenteditable="true"]');

                if (chatbox) {
                    chatbox.focus();

                    const fileNota = base64ToFile(base64Gambar, "nota.png");
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(fileNota);

                    const pasteEvent = new ClipboardEvent('paste', {
                        clipboardData: dataTransfer,
                        bubbles: true,
                        cancelable: true
                    });

                    chatbox.dispatchEvent(pasteEvent);
                } else {
                    setTimeout(() => { eksekusiAutoPaste(base64Gambar); }, 1000);
                }
            }, 1800);
        }

        GM_addValueChangeListener('pemicu_pindah_cepat', function(key, oldValue, newValue, remote) {
            if (remote && newValue) {
                let nomorClean = newValue.phone ? newValue.phone.replace(/[^0-9]/g, '') : '';
                let linkTujuan = `https://web.whatsapp.com/`;

                if (nomorClean) {
                    linkTujuan = `https://web.whatsapp.com/send/?phone=${nomorClean}&app_absent=1`;
                }

                const linkRahasia = document.createElement('a');
                linkRahasia.href = linkTujuan;
                linkRahasia.style.display = 'none';
                document.body.appendChild(linkRahasia);

                linkRahasia.click();
                window.focus();

                if (newValue.imageData) {
                    eksekusiAutoPaste(newValue.imageData);
                }

                setTimeout(() => { linkRahasia.remove(); }, 500);
            }
        });
    }

})();
