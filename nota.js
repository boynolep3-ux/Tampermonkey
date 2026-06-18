// ==UserScript==
// @name         SoftwareNotabyMJ
// @namespace    http://tampermonkey.net/
// @version      8.90
// @description  Rounded Save Button + San Francisco Font + Realtime Storage Event Sync + Compact 2-Column Layout + Auto-Add Rows + Fast Typing + FA Trash Icon + Strict Separation Hidden Iframe Background Auto Sync (5s Refresh + High Speed Clock Error Suppressor) + Premium Smooth Slower Panel Expansion Transition + Fix LocalStorage Collision Anti Rollback + Extra Blank Loading Guard Multi-Page + Premium Smooth Rounded Modal Expansion + Fix Ghost XDSoft Monthpicker Leak + Liquid Select2 Animated Dropdown + Fix Auto-Close Dropdown Bug + Fix Matcher Empty List Bug + Editable Notes with Smart Auto-Clipboard & Triple Date Callouts + Auto WA Notifier (Smart Extract & No-Alert)
// @author       Gemini AI & EMJE
// @match        https://bintangbaru.bintangmedi4.com/penjualan/transaksi*
// @match        https://bintangbaru.bintangmedi4.com/penjualan*
// @match        https://bintangbaru.bintangmedi4.com/datapenjualan/riwayat*
// @match        https://bintangbaru.bintangmedi4.com/pelanggan*
// @match        https://web.whatsapp.com/*
// @exclude      https://bintangbaru.bintangmedi4.com/penjualan/transaksi_cetak/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// ==/UserScript==

/* global $, to_rupiah, HitungTotalBayar */

(function () {
    'use strict';

    // ==========================================
    // BAGIAN 1: SCRIPT KHUSUS WHATSAPP WEB SENDER
    // ==========================================
    if (window.location.href.includes('whatsapp.com')) {
        GM_addValueChangeListener('klik_wa_data', function(key, oldValue, newValue, remote) {
            if (remote && newValue) {
                let nomorClean = newValue.phone.replace(/[^0-9]/g, '');
                const pesanUrl = encodeURIComponent(newValue.text);
                
                const linkRahasia = document.createElement('a');
                linkRahasia.href = `https://web.whatsapp.com/send/?phone=${nomorClean}&text=${pesanUrl}&app_absent=1`;
                linkRahasia.style.display = 'none';
                
                document.body.appendChild(linkRahasia);
                linkRahasia.click();
                
                window.focus();
                if (document.hidden) { window.focus(); }
                setTimeout(() => { linkRahasia.remove(); }, 500);
            }
        });
        return; // Hentikan eksekusi script sistem POS jika sedang berada di web WhatsApp
    }

    // ==========================================
    // BAGIAN 2: SCRIPT SISTEM POS BINTANG MEDIA
    // ==========================================

    // --- SETUP IDENTIFIKASI HALAMAN ---
    const isRiwayat = window.location.pathname.includes('/datapenjualan/riwayat');
    const isPelanggan = window.location.pathname.includes('/pelanggan');
    const isIframe = (window.self !== window.top);
    const isCetak = window.location.href.includes('transaksi_cetak');

    // Flag penanda agar auto-set 'Umum' hanya jalan 1x di awal
    let sudahAutoSetPelanggan = false;

    // --- BLANK LOADING GUARD (Mencegah Tampilan Bawaan Bocor) ---
    function kunciLayarBlank() {
        if (isIframe || isCetak) return;

        const styleProtector = document.createElement('style');
        styleProtector.id = 'bintang-blank-protector';
        styleProtector.innerHTML = `
            html, body {
                background: #ffffff !important;
                visibility: hidden !important;
                opacity: 0 !important;
                overflow: hidden !important;
            }
        `;

        if (document.documentElement) {
            document.documentElement.appendChild(styleProtector);
        } else {
            const observer = new MutationObserver(function () {
                if (document.documentElement) {
                    document.documentElement.appendChild(styleProtector);
                    observer.disconnect();
                }
            });
            observer.observe(document, { childList: true, subtree: true });
        }
    }

    function bukaKunciLayar() {
        const protector = document.getElementById('bintang-blank-protector');
        if (protector) {
            setTimeout(() => {
                protector.remove();
            }, 50);
        }
    }

    kunciLayarBlank();

    // --- SUPER FAST SUPPRESSOR ---
    function redamErrorJamBawaan() {
        if (isRiwayat || isIframe) {
            if (!document.getElementById('jam')) {
                const fakeClock = document.createElement('div');
                fakeClock.id = 'jam';
                fakeClock.style.display = 'none';
                if (document.body) {
                    document.body.appendChild(fakeClock);
                } else if (document.documentElement) {
                    document.documentElement.appendChild(fakeClock);
                }
            }
        }
    }

    redamErrorJamBawaan();
    document.addEventListener('DOMContentLoaded', redamErrorJamBawaan);
    window.addEventListener('load', redamErrorJamBawaan);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mulaiLogikaUtama);
    } else {
        mulaiLogikaUtama();
    }

    function mulaiLogikaUtama() {
        if (isCetak) return;

        // --- SUNTIK LIBRARY SELECT2 SECARA DINAMIS ---
        if (!document.getElementById('select2-core-css') && (window.location.pathname.includes('/penjualan') || isPelanggan)) {
            const s2Css = document.createElement('link');
            s2Css.id = 'select2-core-css';
            s2Css.rel = 'stylesheet';
            s2Css.href = 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css';
            document.head.appendChild(s2Css);

            const s2Js = document.createElement('script');
            s2Js.src = 'https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js';
            document.head.appendChild(s2Js);
        }

        // --- GLOBAL CORE STYLE INJECTION ---
        const styleId = 'bintang-media-combo-css';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.innerHTML = `
                /* GHOST FIX: XDSoft Monthpicker */
                .xdsoft_mounthpicker { display: none !important; }
                .xdsoft_datetimepicker:not([style*="display: none"]) .xdsoft_mounthpicker,
                .xdsoft_datetimepicker:not([style*="display:none"]) .xdsoft_mounthpicker {
                    display: block !important;
                }

                /* --- ANIMASI LIQUID KUSTOM UNTUK DROPDOWN SELECT2 --- */
                @keyframes select2FadeSlide {
                    from { opacity: 0; transform: translateY(-8px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .select2-container--open .select2-dropdown {
                    animation: select2FadeSlide 0.25s cubic-bezier(0.25, 1, 0.3, 1) forwards;
                    border: 1px solid #ddd !important;
                    border-radius: 8px !important;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.1) !important;
                    overflow: hidden;
                }
                .select2-container .select2-selection--single {
                    height: 30px !important;
                    border: 1px solid #ccc !important;
                    border-radius: 4px !important;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    font-size: 13px;
                }
                .select2-container--default .select2-selection--single .select2-selection__rendered {
                    line-height: 28px !important;
                    padding-left: 8px !important;
                }
                .select2-container--default .select2-selection--single .select2-selection__arrow {
                    height: 28px !important;
                }
                .select2-results__option {
                    padding: 6px 10px !important;
                    font-size: 13px !important;
                }

                /* --- MENYEMBUNYIKAN OPSI DEFAULT 'SILAHKAN PILIH' TANPA MERUSAK LIST --- */
                .select2-results__option[id*="-Silahkan"],
                .select2-results__option[id*="-silahkan"] {
                    display: none !important;
                }

                .panel-body { transition: all 0.8s cubic-bezier(0.25, 1, 0.3, 1); }

                @keyframes melarDanSwipeRight {
                    0% { opacity: 0; max-height: 0; transform: scale(0.99) translateX(-15px); margin-bottom: 0; padding-top: 0; padding-bottom: 0; }
                    100% { opacity: 1; max-height: 600px; transform: scale(1) translateX(0); margin-bottom: 15px; }
                }
                @keyframes smoothFadeIn { from { opacity: 0; } to { opacity: 1; } }

                .animasi-muncul-lembut { animation: melarDanSwipeRight 0.8s cubic-bezier(0.25, 1, 0.3, 1) forwards; }
                .animasi-fade-lembut { animation: smoothFadeIn 0.6s ease-in forwards; }

                /* --- PREMIUM MODAL EXPANSION & ROUNDED STYLE --- */
                .modal-dialog { transition: max-height 0.65s cubic-bezier(0.25, 1, 0.3, 1), transform 0.4s ease-out !important; }
                .modal-content {
                    overflow: hidden !important;
                    border-radius: 12px !important;
                    border: none !important;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
                    transition: max-height 0.65s cubic-bezier(0.25, 1, 0.3, 1) !important;
                    max-height: 140px;
                }
                .modal-content.modal-expanded { max-height: 2000px !important; }
                #ModalContent, .modal-header, .modal-footer {
                    opacity: 0;
                    transform: translateY(10px);
                    transition: opacity 0.45s cubic-bezier(0.25, 1, 0.3, 1), transform 0.45s cubic-bezier(0.25, 1, 0.3, 1);
                }
                .modal-expanded #ModalContent, .modal-expanded .modal-header, .modal-expanded .modal-footer { opacity: 1; transform: translateY(0); }

                /* PERLEBAR KOLOM UKURAN PANJANG */
                input[name="uk_panjang[]"]{ min-width: 70px !important; }
                input[name="uk_lebar[]"]{ min-width: 70px !important; }
                input[name="jumlah_beli[]"]{ min-width: 70px !important; }

                /* CSS Kustom Modul Form Catatan */
                .input-group-custom {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    background:#fff; padding:10px; border:1px solid #ddd; border-radius:5px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05); overflow: hidden; box-sizing: border-box;
                }
                .input-group-custom input { font-family: inherit;
                    border:1px solid #ccc; padding:6px 8px; border-radius:4px; font-size:13px; width:100%; box-sizing: border-box; transition: border-color 0.2s, box-shadow 0.2s;
                }
                .input-group-custom input:focus { border-color: #3498db;
                    box-shadow: 0 0 5px rgba(52, 152, 219, 0.3); outline: none;
                }
                .input-group-custom label { font-family: inherit;
                    font-weight:bold; font-size:11px; color:#555; text-transform:uppercase; margin-top: 2px; margin-bottom: 1px; display: block;
                }
                .row-flex { display: flex; gap: 10px; width: 100%; }
                .col-flex { flex: 1; display: flex; flex-direction: column; gap: 3px; position: relative; }
                .datepicker-custom { background: #fff !important; cursor: pointer !important; padding-right: 40px !important; }
                .btn-clear-date { position: absolute;
                    right: 2px; bottom: 2px; width: 31px; height: 31px; padding: 0 !important; display: flex; align-items: center; justify-content: center; z-index: 5;
                    transition: transform 0.1s; }
                .btn-clear-date:active { transform: scale(0.9); }

                .log-nota-time { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    font-size: 11px; color: #e74c3c; font-weight: bold; font-style: italic; display: block; margin-top: 4px; margin-bottom: 2px;
                }
                #Simpann { border-radius: 4px !important; transition: all 0.2s ease-in-out; }
            `;
            document.head.appendChild(style);
        }

        // --- LISTENERS: GLOBAL MODAL INTERCEPTOR ---
        if (typeof $ !== 'undefined') {
            $(document).on('show.bs.modal loaded.bs.modal', '.modal', function () {
                const modalContent = $(this).find('.modal-content');
                modalContent.removeClass('modal-expanded');
                setTimeout(function() { modalContent.addClass('modal-expanded'); }, 40);
            });

            $(document).on('DOMNodeInserted', '#ModalContent', function() {
                const modalContent = $(this).closest('.modal-content');
                if (modalContent.length && !modalContent.hasClass('modal-expanded')) {
                    setTimeout(function() { modalContent.addClass('modal-expanded'); }, 40);
                }
                jalankanSelect2Liquid();
            });
        }

        // --- HALAMAN 2: RADAR PEMBACA DI DALAM IFRAME / HALAMAN RIWAYAT ---
        if (isRiwayat) {
            setInterval(function() {
                if (typeof $ !== 'undefined') {
                    let kasirColIndex = -1;
                    $('#my-grid thead tr th, table thead tr th').each(function(index) {
                        if ($(this).text().toUpperCase().includes('KASIR')) { kasirColIndex = index; return false; }
                    });

                    $('#my-grid tbody tr, table tbody tr').first().each(function() {
                        const row = $(this);
                        let textNota = '';

                        row.find('td p').each(function() {
                            const t = $(this).text().trim();
                            if (t.match(/^([A-Za-z]+)(\d{4,15})$/)) { textNota = t; return false; }
                        });

                        if (textNota) {
                            const mMatch = textNota.match(/\d+/);
                            const angkaNotaBaru = mMatch ? parseInt(mMatch[0], 10) : 0;

                            const oldNota = localStorage.getItem('bintang_nota_terakhir');
                            let angkaNotaLama = 0;
                            if (oldNota) {
                                const oldMatch = oldNota.match(/\d+/);
                                angkaNotaLama = oldMatch ? parseInt(oldMatch[0], 10) : 0;
                            }

                            if (isIframe || angkaNotaBaru >= angkaNotaLama) {
                                if (oldNota !== textNota) {
                                    localStorage.setItem('bintang_nota_terakhir', textNota);
                                    localStorage.setItem('bintang_nota_terakhir_time', Date.now().toString());
                                    if (kasirColIndex !== -1) {
                                        const namaKasir = row.find('td').eq(kasirColIndex).text().trim();
                                        if (namaKasir) { localStorage.setItem('bintang_kasir_terakhir', namaKasir); }
                                    }
                                }
                            }
                        }
                    });
                    if (!isIframe) { bukaKunciLayar(); }
                }
            }, 1000);

            // --- INTEGRASI TOMBOL WA NOTIFIER (HANYA DI HALAMAN RIWAYAT UTAMA, BUKAN IFRAME) ---
            if (!isIframe) {
                const styleWA = document.createElement('style');
                styleWA.innerHTML = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
                document.head.appendChild(styleWA);

                function berikanIndikatorGagal(btn, svg) {
                    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="width: 12px; height: 12px; fill: white; vertical-align: middle;"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>`;
                    btn.style.cssText += 'background-color: #e74c3c !important; border-color: #e74c3c !important;';
                    btn.title = "Nomor Tidak Ditemukan!";
                    
                    setTimeout(() => {
                        btn.innerHTML = svg;
                        btn.style.cssText += 'background-color: #25D366 !important; border-color: #ccc !important;';
                        btn.title = "Kirim Pesan Selesai ke Konsumen";
                    }, 2000);
                }

                function suntikTombolKeTabel() {
                    const rows = document.querySelectorAll('tr[role="row"]');

                    rows.forEach(row => {
                        if (row.querySelector('.btn-wa-row')) return;

                        const cells = row.querySelectorAll('td');
                        if (cells.length < 15) return; 

                        const kolomAksi = cells[14];
                        const linkEditPenjualan = kolomAksi.querySelector('#EditPenjualan') || kolomAksi.querySelector('a[href*="transaksi_edit"]');
                        if (!linkEditPenjualan) return;
                        
                        const tombolEditAsli = linkEditPenjualan.querySelector('button');

                        const btnWA = document.createElement('button');
                        btnWA.className = 'btn btn-success btn-xs btn-wa-row';
                        
                        const svgWA = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="width: 14px; height: 14px; fill: white; vertical-align: middle;"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>`;
                        btnWA.innerHTML = svgWA;
                        btnWA.title = "Kirim Pesan Selesai ke Konsumen";
                        
                        btnWA.style.cssText = `
                            display: inline-block !important;
                            margin-left: 2px !important; 
                            background-color: #25D366 !important; 
                            border: 1px solid #ccc !important; 
                            padding: 1px 5px !important; 
                            height: 22px !important;
                            width: 30px !important;
                            border-radius: 3px !important;
                            cursor: pointer !important;
                            text-align: center !important;
                            box-sizing: border-box !important;
                            vertical-align: middle !important;
                        `;

                        btnWA.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();

                            btnWA.innerHTML = `<svg class="fa-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 12px; height: 12px; fill: white; animation: spin 1s linear infinite;"><path d="M304 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zm0 416a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM48 304a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm416 0a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>`;
                            btnWA.style.cssText += 'background-color: #f1c40f !important; border-color: #f1c40f !important;';

                            if (tombolEditAsli) tombolEditAsli.click();

                            let batasWaktu = 0;
                            let cekPopUp = setInterval(function() {
                                batasWaktu += 150;
                                const textareaUtuh = document.querySelector('textarea[name="keterangan_penjualan"]');
                                
                                if (textareaUtuh && textareaUtuh.value.trim() !== "") {
                                    clearInterval(cekPopUp);

                                    const teksLengkap = textareaUtuh.value;
                                    const matchNomor = teksLengkap.match(/(62|08)[\d\s-]{7,17}/);
                                    let nomorClean = '';
                                    
                                    if (matchNomor) {
                                        nomorClean = matchNomor[0].replace(/[^0-9]/g, '');
                                    }

                                    if (nomorClean.startsWith('08')) {
                                        nomorClean = '62' + nomorClean.slice(1);
                                    }

                                    if (nomorClean && nomorClean.length >= 10) {
                                        let namaKonsumenAsli = "Pelanggan";
                                        const ekstrakNama = teksLengkap.match(/^(.*?)\s*\(/);
                                        if (ekstrakNama && ekstrakNama[1].trim() !== "") {
                                            namaKonsumenAsli = ekstrakNama[1].trim();
                                        }

                                        btnWA.title = `Kirim Pesan Selesai ke ${namaKonsumenAsli}`;
                                        const pesanTemplate = `Hallo, kita dari Percetakan Bintang Media.. Mau infoin kalau cetakanya sudah selesai dan sudah bisa diambil yaa.\nTerimakasih🙏🏻`;

                                        GM_setValue('klik_wa_data', {
                                            phone: nomorClean,
                                            text: pesanTemplate,
                                            timestamp: new Date().getTime()
                                        });

                                        btnWA.innerHTML = svgWA;
                                        btnWA.style.cssText += 'background-color: #25D366 !important; border-color: #ccc !important;';
                                    } else {
                                        berikanIndikatorGagal(btnWA, svgWA);
                                    }

                                    const tombolCloseModal = document.querySelector('.modal-header .close') || 
                                                             document.querySelector('[data-dismiss="modal"]') ||
                                                             document.querySelector('.modal-footer .btn-danger');
                                    if (tombolCloseModal) tombolCloseModal.click();

                                } else if (batasWaktu >= 2500) { 
                                    clearInterval(cekPopUp);
                                    const tombolCloseModal = document.querySelector('.modal-header .close') || document.querySelector('[data-dismiss="modal"]');
                                    if (tombolCloseModal) tombolCloseModal.click();
                                    
                                    berikanIndikatorGagal(btnWA, svgWA);
                                }
                            }, 150); 
                        });

                        linkEditPenjualan.after(btnWA);
                    });
                }

                setTimeout(suntikTombolKeTabel, 1000);
                const targetNode = document.getElementById('my-grid') || document.querySelector('table') || document.body;
                if (targetNode) {
                    const observer = new MutationObserver(suntikTombolKeTabel);
                    observer.observe(targetNode, { childList: true, subtree: true });
                }
            }

            if (isIframe) { setTimeout(function() { window.location.reload(); }, 5000); }
            return;
        }

        // --- HALAMAN 3: LOGIKA UTAMA HALAMAN TRANSAKSI ---
        function suntikIframeMataMata() {
            if ($('#iframe-riwayat-bintang').length === 0) {
                const iframe = document.createElement('iframe');
                iframe.id = 'iframe-riwayat-bintang';
                iframe.src = 'https://bintangbaru.bintangmedi4.com/datapenjualan/riwayat';
                iframe.style.width = '0px'; iframe.style.height = '0px'; iframe.style.border = 'none';
                iframe.style.position = 'absolute';
                iframe.style.visibility = 'hidden';
                document.body.appendChild(iframe);
            }
        }

        function prosesSyncNomorNota(nomorTerakhir) {
            const inputNota = $('#nomor_nota');
            if (inputNota.length && nomorTerakhir) {
                if (!$('#log-nota-update-time').length) {
                    inputNota.after('<span id="log-nota-update-time" class="log-nota-time animasi-fade-lembut">Menghitung waktu update...</span>');
                }

                const m = nomorTerakhir.match(/^([A-Za-z]+)(\d+)$/);
                if (m) {
                    const prefix = m[1];
                    const numStr = m[2];
                    const nextNum = (parseInt(numStr, 10) + 1).toString().padStart(numStr.length, '0');
                    const notaTargetOtomatis = prefix + nextNum;
                    if (inputNota.val() !== notaTargetOtomatis && !inputNota.is(':focus')) {
                        inputNota.val(notaTargetOtomatis).trigger('change');
                    }
                }
            }
        }

        function updateLogWaktuNota() {
            const logContainer = $('#log-nota-update-time');
            if (!logContainer.length) return;

            const timestampStr = localStorage.getItem('bintang_nota_terakhir_time');
            const kasirTerakhir = localStorage.getItem('bintang_kasir_terakhir') || '-';

            if (!timestampStr) { logContainer.html(`Belum ada data update`);
                return; }

            const timestamp = parseInt(timestampStr, 10);
            let selisihDetik = Math.floor((Date.now() - timestamp) / 1000);
            if (selisihDetik < 0) selisihDetik = 0;

            let waktuText = '';
            if (selisihDetik < 10) { waktuText = 'baru saja'; }
            else if (selisihDetik < 60) { waktuText = `${selisihDetik} detik yang lalu`;
            }
            else {
                const menit = Math.floor(selisihDetik / 60);
                if (menit < 60) { waktuText = `${menit} menit yang lalu`;
                }
                else { const jam = Math.floor(menit / 60);
                waktuText = `${jam} jam yang lalu`; }
            }
            logContainer.html(`Terakhir diupdate ${waktuText} oleh ${kasirTerakhir}`);
        }

        window.addEventListener('storage', function(e) {
            if (e.key === 'bintang_nota_terakhir' && e.newValue) { prosesSyncNomorNota(e.newValue); updateLogWaktuNota(); }
            if (e.key === 'bintang_kasir_terakhir' || e.key === 'bintang_nota_terakhir_time') { updateLogWaktuNota(); }
        });

        // --- FIX MATCHER: CUSTOM FILTER SELECT2 AGAR KATA YANG SAMA PERSIS / COCOK TIDAK HILANG DARI LIST ---
        function customSelect2Matcher(params, data) {
            if ($.trim(params.term) === '') { return data;
            }
            if (typeof data.text === 'undefined') { return null;
            }

            var searchTerm = params.term.toLowerCase();
            var optionText = data.text.toLowerCase();
            if (optionText.includes('silahkan pilih')) { return null; }

            if (optionText.indexOf(searchTerm) > -1) { return data;
            }
            return null;
        }

        function jalankanSelect2Liquid() {
            if (window.$ && $.fn.select2) {
                $('select:not(.select2-hidden-accessible), #id_pelanggan:not(.select2-hidden-accessible)').each(function() {
                    const self = $(this);
                    self.select2({
                        width: '100%',
                        dropdownParent: self.parent(),
                        matcher: customSelect2Matcher
                    });
                });
            }
        }

        // --- LOGIKA GENERATOR DAN PARSING SINKRONISASI CATATAN CERDAS ---
        function sinkronkanCatatan() {
            let currentTxt = $('#catatan').val() || '';

            // 1. Ekstrak nomor HP yang mungkin sudah ada di dalam catatan saat ini agar tidak terhapus
            const hpMatch = currentTxt.match(/\((?:\+62|62|0)8[1-9][0-9- ]{6,15}\)/);
            let existingHP = hpMatch ? hpMatch[0] : '';

            // 2. Bersihkan tag tanggal bawaan sistem (DP, TF, CASH) dan Nomor HP dari teks asli agar kita dapat ketikan murninya
            currentTxt = currentTxt.replace(/- DP\s*:\s*\d{2}\.\d{2}\.\d{4}/g, '');
            currentTxt = currentTxt.replace(/- TF\s*:\s*\d{2}\.\d{2}\.\d{4}/g, '');
            currentTxt = currentTxt.replace(/- CASH\s*:\s*\d{2}\.\d{2}\.\d{4}/g, '');
            if (existingHP) { currentTxt = currentTxt.replace(existingHP, '');
            }

            // Atur ulang spasi ketikan manual agar rapi
            currentTxt = currentTxt.replace(/\s+/g, ' ').trim();

            // 3. Ambil data nilai tanggal dari elemen UI kustom
            const dp = $('#input-dp-custom').val() || '';
            const tf = $('#input-tf-custom').val() || '';
            const cash = $('#input-cash-custom').val() || '';

            const formattedDP = dp ? `- DP : ${dp}` : '';
            const formattedTF = tf ? `- TF : ${tf}` : '';
            const formattedCASH = cash ? `- CASH : ${cash}` : '';

            // 4. Susun kembali string akhir gabungan tanpa merusak ketikan manual user
            let pieces = [currentTxt];
            if (existingHP) pieces.push(existingHP);
            if (formattedDP) pieces.push(formattedDP);
            if (formattedTF) pieces.push(formattedTF);
            if (formattedCASH) pieces.push(formattedCASH);

            const hasil = pieces.filter(p => p.trim() !== '').join(' ');
            $('#catatan').val(hasil).trigger('input');
        }

        // --- AUTOMATISASI CLIPBOARD PINTAR (MENYUNTIKKAN LANGSUNG KE TEKS EDITABLE) ---
        function aktifkanAutoClipboard() {
            window.addEventListener('focus', async () => {
                try {
                    const text = (await navigator.clipboard.readText()).trim();
                    const regexHP = /^(?:\+62|62|0)8[1-9][0-9]{6,12}$/;
                    if (regexHP.test(text.replace(/[- ]/g, '')) && text !== sessionStorage.getItem('last_pasted_hp')) {
                        sessionStorage.setItem('last_pasted_hp', text);

                        let currentTxt = $('#catatan').val() || '';
                        const hpMatch = currentTxt.match(/\((?:\+62|62|0)8[1-9][0-9- ]{6,15}\)/);

                        // Jika sudah ada nomor HP di catatan, ganti dengan yang baru disalin, jika belum ada, tempel di belakang teks
                        if (hpMatch) {
                            currentTxt = currentTxt.replace(hpMatch[0], `(${text})`);
                        } else {
                            currentTxt = currentTxt + ` (${text})`;
                        }

                        $('#catatan').val(currentTxt);
                        sinkronkanCatatan();
                    }
                } catch (err) {}
            });
        }

        function buatKolomKeteranganBaru() {
            if ($('#input-dp-custom').length) return;

            const container = `
                <div class="input-group-custom animasi-muncul-lembut" style="margin-bottom: 8px;">
                    <div class="row-flex">
                        <div class="col-flex">
                            <label>DP</label>
                            <input type="text" id="input-dp-custom" class="datepicker-custom" readonly placeholder="Tgl DP">
                            <button type="button" class="btn btn-danger btn-block btn-sm btn-clear-date" data-target="#input-dp-custom" title="Hapus DP">
                                <i class="fa fa-trash fa-lg"></i>
                            </button>
                        </div>
                        <div class="col-flex">
                            <label>TF</label>
                            <input type="text" id="input-tf-custom" class="datepicker-custom" readonly placeholder="Tgl TF">
                            <button type="button" class="btn btn-danger btn-block btn-sm btn-clear-date" data-target="#input-tf-custom" title="Hapus TF">
                                <i class="fa fa-trash fa-lg"></i>
                            </button>
                        </div>
                        <div class="col-flex">
                            <label>CASH</label>
                            <input type="text" id="input-cash-custom" class="datepicker-custom" readonly placeholder="Tgl CASH">
                            <button type="button" class="btn btn-danger btn-block btn-sm btn-clear-date" data-target="#input-cash-custom" title="Hapus CASH">
                                <i class="fa fa-trash fa-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>`;
            $('#catatan').before(container);

            if (window.$ && $.fn.datetimepicker) {
                $('.datepicker-custom').datetimepicker({
                    timepicker: false, format: 'd.m.Y', scrollMonth: false, scrollInput: false,
                    onSelectDate: function(ct, $i) { sinkronkanCatatan(); $i.datetimepicker('hide'); }
                });
            }

            $('.btn-clear-date').on('click', function() {
                const target = $(this).data('target');
                $(target).val('').trigger('change');
            });

            $('#input-dp-custom, #input-tf-custom, #input-cash-custom').on('change', sinkronkanCatatan);
        }

        function HitungUlangBarisRealtime(idx) {
            const row = $('#TabelTransaksi tbody tr:eq(' + idx + ')');
            const p = parseFloat(row.find('td:nth-child(4) input').val()) || 0;
            const l = parseFloat(row.find('td:nth-child(5) input').val()) || 0;
            const h = parseFloat(row.find('td:nth-child(7) p').html()) || 0;
            const j = parseFloat(row.find('td:nth-child(6) input').val()) || 0;
            const sub = (p * l) * h;
            row.find('td:nth-child(7) input').val(sub);
            row.find('td:nth-child(7) span').html(sub > 0 ? to_rupiah(sub) : '');
            const tot = sub * j;
            row.find('td:nth-child(8) input').val(tot);
            row.find('td:nth-child(8) span').html(tot > 0 ? to_rupiah(tot) : '');
            HitungTotalBayar();
        }

        function inisialisasi() {
            jalankanSelect2Liquid();
            if (window.location.pathname.includes('/penjualan')) {
                suntikIframeMataMata();

                const notaAwal = localStorage.getItem('bintang_nota_terakhir');
                prosesSyncNomorNota(notaAwal);

                if (!$('#input-dp-custom').length) {
                    buatKolomKeteranganBaru();
                    aktifkanAutoClipboard();

                    if (!sudahAutoSetPelanggan && $('#id_pelanggan').length && $('#id_pelanggan').val() === '') {
                        $('#id_pelanggan').val('1').trigger('change');
                        sudahAutoSetPelanggan = true;
                    }
                }
            }
            bukaKunciLayar();
        }

        $(document).on('input keyup change', '#ukuran_panjang, #ukuran_lebar', function () {
            HitungUlangBarisRealtime($(this).closest('tr').index());
        });

        inisialisasi();

        setInterval(inisialisasi, 1000);
        setInterval(updateLogWaktuNota, 5000);
    }

    /* =====================================================
       PATCH AUTOCOMPLETE MULTI FILTER FINAL V10
       ===================================================== */
    (function(){
        let keywordTerakhir = '';
        let inputAktif = null;

        $(document).on('focus', 'input[name="kode_barang[]"]', function(){
            inputAktif = this;
            keywordTerakhir = '';
        });

        setInterval(function(){
            if (!inputAktif) return;

            const $td = $(inputAktif).closest('td');
            const $hasil = $td.find('#hasil_pencarian');
            const $daftar = $hasil.find('#daftar-autocomplete');

            if (!$daftar.length) return;

            const keyword = ($(inputAktif).val() || '').toLowerCase().trim();

            if (!keyword) {
                keywordTerakhir = '';
                return;
            }

            if (keyword === keywordTerakhir) return;
            keywordTerakhir = keyword;

            setTimeout(function(){
                const daftar = $daftar.find('li');
                if (!daftar.length) return;

                const kataCari = keyword.split(/\s+/).filter(Boolean);
                const hasil = [];

                daftar.each(function(){
                    const kode = ($(this).find('#kodenya').text() || '').toLowerCase();
                    const barang = ($(this).find('#barangnya').text() || '').toLowerCase();
                    const harga = ($(this).find('#harganya').text() || '').toLowerCase();

                    // Tetap Mencocokkan Kode, Barang, Dan Harga Sekaligus!
                    const cocok = kataCari.every(function(k){
                        return kode.includes(k) || barang.includes(k) || harga.includes(k);
                    });

                    if (cocok) {
                        hasil.push($(this).prop('outerHTML'));
                    }
                });

                if (hasil.length) {
                    $daftar.html(hasil.join(''));
                    $hasil.show();
                }
            }, 150);
        }, 200);
    })();

    /* FIX MULTI BARIS - GUNAKAN INPUT YANG SEDANG FOKUS */
    $(document).on('focus', 'input[name="kode_barang[]"]', function(){
        window.__aktif_kode_barang = this;
    });

    /* SUPPRESS DROPDOWN MUNCUL LAGI SETELAH KLIK */
    (function(){
        let waktuKlikAutocomplete = 0;

        $(document).on('click', '#daftar-autocomplete li', function(){
            waktuKlikAutocomplete = Date.now();
            const $hasil = $(this).closest('#hasil_pencarian');

            setTimeout(function(){ $hasil.hide(); }, 50);
            setTimeout(function(){ $hasil.hide(); }, 300);
            setTimeout(function(){ $hasil.hide(); }, 800);
        });

        setInterval(function(){
            if (!waktuKlikAutocomplete) return;
            if (Date.now() - waktuKlikAutocomplete < 1200) {
                $('#hasil_pencarian').hide();
            }
        }, 100);
    })();

})();
