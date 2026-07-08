/* global $, to_rupiah, HitungTotalBayar */

(function () {
    'use strict';

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
                .input-group-custom input { font-family: inherit; border:1px solid #ccc; padding:6px 8px; border-radius:4px; font-size:13px; width:100%; box-sizing: border-box; transition: border-color 0.2s, box-shadow 0.2s; }
                .input-group-custom input:focus { border-color: #3498db; box-shadow: 0 0 5px rgba(52, 152, 219, 0.3); outline: none; }
                .input-group-custom label { font-family: inherit; font-weight:bold; font-size:11px; color:#555; text-transform:uppercase; margin-top: 2px; margin-bottom: 1px; display: block; }
                .row-flex { display: flex; gap: 10px; width: 100%; }
                .col-flex { flex: 1; display: flex; flex-direction: column; gap: 3px; position: relative; }
                .datepicker-custom { background: #fff !important; cursor: pointer !important; padding-right: 40px !important; }
                .btn-clear-date { position: absolute; right: 2px; bottom: 2px; width: 31px; height: 31px; padding: 0 !important; display: flex; align-items: center; justify-content: center; z-index: 5; transition: transform 0.1s; }
                .btn-clear-date:active { transform: scale(0.9); }

                .log-nota-time { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 11px; color: #e74c3c; font-weight: bold; font-style: italic; display: block; margin-top: 4px; margin-bottom: 2px; }
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

            if (!timestampStr) { logContainer.html(`Belum ada data update`); return; }

            const timestamp = parseInt(timestampStr, 10);
            let selisihDetik = Math.floor((Date.now() - timestamp) / 1000);
            if (selisihDetik < 0) selisihDetik = 0;

            let waktuText = '';
            if (selisihDetik < 10) { waktuText = 'baru saja'; }
            else if (selisihDetik < 60) { waktuText = `${selisihDetik} detik yang lalu`; }
            else {
                const menit = Math.floor(selisihDetik / 60);
                if (menit < 60) { waktuText = `${menit} menit yang lalu`; }
                else { const jam = Math.floor(menit / 60); waktuText = `${jam} jam yang lalu`; }
            }
            logContainer.html(`Terakhir diupdate ${waktuText} oleh ${kasirTerakhir}`);
        }

        window.addEventListener('storage', function(e) {
            if (e.key === 'bintang_nota_terakhir' && e.newValue) { prosesSyncNomorNota(e.newValue); updateLogWaktuNota(); }
            if (e.key === 'bintang_kasir_terakhir' || e.key === 'bintang_nota_terakhir_time') { updateLogWaktuNota(); }
        });

        // --- FIX MATCHER: CUSTOM FILTER SELECT2 AGAR KATA YANG SAMA PERSIS / COCOK TIDAK HILANG DARI LIST ---
        function customSelect2Matcher(params, data) {
            if ($.trim(params.term) === '') { return data; }
            if (typeof data.text === 'undefined') { return null; }

            var searchTerm = params.term.toLowerCase();
            var optionText = data.text.toLowerCase();
            if (optionText.includes('silahkan pilih')) { return null; }

            if (optionText.indexOf(searchTerm) > -1) { return data; }
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
            if (existingHP) { currentTxt = currentTxt.replace(existingHP, ''); }

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
