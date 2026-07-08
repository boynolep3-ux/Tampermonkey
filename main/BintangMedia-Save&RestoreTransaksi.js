/* global $, to_rupiah, HitungTotalBayar */

(function() {
    'use strict';

    const STORAGE_KEY = 'bintang_media_tx_templates';
    let isRestoring = false;
    let activeTemplate = null;
    let isTemplatesVisible = true;

    // Variabel untuk manajemen smooth scroll via wheel
    let scrollTarget = 0;
    let scrollCurrent = 0;
    let isAnimatingScroll = false;

    // Suntik CSS lengkap untuk animasi slide murni, scrollbar, dan efek hover
    function injectModernScrollCSS() {
        const style = document.createElement('style');
        style.innerHTML = `
            /* Viewport luar untuk memotong elemen saat digeser masuk/keluar */
            #bintang-slider-viewport {
                display: inline-flex;
                align-items: center;
                overflow: hidden;
                max-width: 750px; /* Batas lebar aman komponen template */
                transition: max-width 0.4s cubic-bezier(0.25, 1, 0.5, 1),
                            opacity 0.3s ease,
                            margin-left 0.4s cubic-bezier(0.25, 1, 0.5, 1) !important;
                will-change: max-width, opacity;
            }

            /* Pembungkus utama navigasi scroll */
            #scroll_nav_wrapper {
                display: inline-flex;
                align-items: center;
                gap: 0px;
                transform: translateX(0);
                transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1) !important;
                will-change: transform;
            }

            /* State ketika disembunyikan (Murni MENGGESER ke kiri masuk ke balik tombol) */
            #bintang-slider-viewport.bintang-hidden {
                max-width: 0px !important;
                opacity: 0 !important;
                margin-left: -8px !important;
                pointer-events: none;
            }
            #bintang-slider-viewport.bintang-hidden #scroll_nav_wrapper {
                transform: translateX(-100%); /* Geser total keluar dari pandangan */
            }

            #template_list_buttons {
                scrollbar-width: none; /* Firefox */
                -ms-overflow-style: none;  /* IE/Edge */
                transition: -webkit-mask-image 0.2s ease, mask-image 0.2s ease;
                scroll-behavior: auto !important;
                transform: translateZ(0); /* Akselerasi GPU */
                will-change: scroll-position;
            }
            #template_list_buttons::-webkit-scrollbar {
                display: none; /* Chrome, Safari, Opera */
            }

            /* Animasi untuk Tombol Save Manual dan Tombol Mata */
            #btn_manual_save, #btn_toggle_template {
                transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease !important;
            }
            #btn_manual_save:hover, #btn_toggle_template:hover {
                transform: scale(1.08) translateY(-1px);
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25) !important;
            }
            #btn_manual_save:active, #btn_toggle_template:active {
                transform: scale(0.95) translateY(0);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
            }

            /* Efek hover tombol template */
            .btn-load-template {
                transition: all 0.2s ease !important;
            }
            .btn-load-template:hover {
                background-color: #FFD700 !important;
                color: #000000 !important;
                border-color: #ECC000 !important;
            }

            /* Style tombol scroll transparan */
            .bintang-scroll-btn {
                background: transparent !important;
                border: none !important;
                color: #FFFFFF !important;
                box-shadow: none !important;
                outline: none !important;
                height: 34px;
                padding: 0 6px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                flex-shrink: 0;
                transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease !important;
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
                z-index: 10;
            }
            /* Kelas tombol scroll aktif */
            .bintang-scroll-btn.bintang-show {
                opacity: 1;
                visibility: visible;
                pointer-events: auto;
            }
            .bintang-scroll-btn:hover {
                transform: scale(1.3);
                color: #FFD700 !important;
            }
            .bintang-scroll-btn:active {
                transform: scale(0.95);
            }
        `;
        document.head.appendChild(style);
    }

    function formatRupiahLocal(angka) {
        if (typeof to_rupiah === "function") {
            return to_rupiah(angka);
        }
        return "Rp. " + parseInt(angka).toLocaleString('id-ID');
    }

    function getSavedTemplates() {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    }

    function clearCurrentTable() {
        const rows = document.querySelectorAll('#TabelTransaksi tbody tr');
        rows.forEach(row => {
            const btnHapus = row.querySelector('#HapusBaris') || row.querySelector('.hapus-baris') || row.querySelector('button');
            if (btnHapus) {
                btnHapus.click();
            } else {
                row.remove();
            }
        });

        const fieldsToReset = [
            'UangDiskon', 'UangCash', 'UangCash1', 'UangCash2',
            'UangCash3', 'UangCash4', 'UangCash5', 'catatan'
        ];
        fieldsToReset.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = el.tagName === 'INPUT' && el.id !== 'catatan' ? '0' : '';
        });

        const selectPelanggan = document.getElementById('id_pelanggan');
        if (selectPelanggan) {
            let optionUmum = Array.from(selectPelanggan.options).find(opt => opt.text.includes('Umum'));
            if (optionUmum) {
                selectPelanggan.value = optionUmum.value;
            } else {
                selectPelanggan.selectedIndex = 0;
            }

            if (window.$ && $(selectPelanggan).data('select2')) {
                $(selectPelanggan).trigger('change.select2').trigger('change');
            }
        }

        const btnBarisBaru = document.getElementById('BarisBaru');
        if (btnBarisBaru) {
            btnBarisBaru.click();
        }

        if (typeof HitungTotalBayar === "function") {
            HitungTotalBayar();
        }
    }

    function saveFormDataManual(namaTemplate) {
        const selectPelanggan = document.getElementById('id_pelanggan');
        let textPelanggan = '';
        if (selectPelanggan && selectPelanggan.options[selectPelanggan.selectedIndex]) {
            textPelanggan = selectPelanggan.options[selectPelanggan.selectedIndex].text;
        }

        let data = {
            header: {
                id_pelanggan: selectPelanggan?.value || '',
                text_pelanggan: textPelanggan,
                tanggal_pengambilan: document.getElementById('tanggal3')?.value || '',
                catatan: document.getElementById('catatan')?.value || '',
                diskon: document.getElementById('UangDiskon')?.value || '0',
                bayar_cash: document.getElementById('UangCash')?.value || '0',
                bayar_bca: document.getElementById('UangCash2')?.value || '0',
                bayar_mandiri: document.getElementById('UangCash3')?.value || '0',
                bayar_bri: document.getElementById('UangCash4')?.value || '0',
                bayar_qris_bca: document.getElementById('UangCash1')?.value || '0',
                bayar_qris_bri: document.getElementById('UangCash5')?.value || '0'
            },
            barang: []
        };

        const rows = document.querySelectorAll('#TabelTransaksi tbody tr');
        rows.forEach(row => {
            const kode = row.querySelector('input[name="kode_barang[]"]')?.value || '';
            const nama_barang_html = row.querySelector('td:nth-child(3)')?.innerHTML || '';
            const panjang = row.querySelector('input[name="uk_panjang[]"]')?.value || '';
            const lebar = row.querySelector('input[name="uk_lebar[]"]')?.value || '';
            const qty = row.querySelector('input[name="jumlah_beli[]"]')?.value || '';
            let harga_satuan = row.querySelector('input[name="harga_satuan[]"]')?.value || '0';

            if (panjang > 0 && lebar > 0 && harga_satuan > 0) {
                let hitungan_sementara = harga_satuan / (panjang * lebar);
                harga_satuan = hitungan_sementara;
            }

            if (kode || panjang || lebar || qty) {
                data.barang.push({
                    kode,
                    nama_barang_html,
                    panjang,
                    lebar,
                    qty,
                    harga_satuan: harga_satuan
                });
            }
        });

        let templates = getSavedTemplates();
        const cleanedName = namaTemplate.trim();
        templates[cleanedName] = data;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));

        activeTemplate = cleanedName;
        renderTemplateButtons();
    }

    function restoreFormData(namaTemplate) {
        const templates = getSavedTemplates();
        const data = templates[namaTemplate];
        if (!data) return;

        isRestoring = true;
        clearCurrentTable();

        if (data.header) {
            const selectPelanggan = document.getElementById('id_pelanggan');
            if (selectPelanggan) {
                selectPelanggan.value = data.header.id_pelanggan;
                if (window.$ && $(selectPelanggan).data('select2')) {
                    $(selectPelanggan).trigger('change.select2');
                }
            }
            if (document.getElementById('tanggal3')) document.getElementById('tanggal3').value = data.header.tanggal_pengambilan;
            if (document.getElementById('catatan')) document.getElementById('catatan').value = data.header.catatan;
            if (document.getElementById('UangDiskon')) document.getElementById('UangDiskon').value = data.header.diskon;
            if (document.getElementById('UangCash')) document.getElementById('UangCash').value = data.header.bayar_cash;
            if (document.getElementById('UangCash2')) document.getElementById('UangCash2').value = data.header.bayar_bca;
            if (document.getElementById('UangCash3')) document.getElementById('UangCash3').value = data.header.bayar_mandiri;
            if (document.getElementById('UangCash4')) document.getElementById('UangCash4').value = data.header.bayar_bri;
            if (document.getElementById('UangCash1')) document.getElementById('UangCash1').value = data.header.bayar_qris_bca;
            if (document.getElementById('UangCash5')) document.getElementById('UangCash5').value = data.header.bayar_qris_bri;
        }

        if (data.barang && data.barang.length > 0) {
            const btnBarisBaru = document.getElementById('BarisBaru');

            data.barang.forEach((item, index) => {
                setTimeout(() => {
                    let rows = document.querySelectorAll('#TabelTransaksi tbody tr');

                    if (index >= rows.length && btnBarisBaru) {
                        btnBarisBaru.click();
                        rows = document.querySelectorAll('#TabelTransaksi tbody tr');
                    }

                    let currentRow = rows[index];
                    if (currentRow) {
                        const inputKode = currentRow.querySelector('input[name="kode_barang[]"]');
                        const cellNama = currentRow.querySelector('td:nth-child(3)');
                        const inputPanjang = currentRow.querySelector('input[name="uk_panjang[]"]');
                        const inputLebar = currentRow.querySelector('input[name="uk_lebar[]"]');
                        const inputQty = currentRow.querySelector('input[name="jumlah_beli[]"]');
                        const inputHargaSatuan = currentRow.querySelector('input[name="harga_satuan[]"]');
                        const pHarga = currentRow.querySelector('td:nth-child(7) p');
                        const spanHarga = currentRow.querySelector('td:nth-child(7) span');

                        if (inputKode) inputKode.value = item.kode;
                        if (cellNama && item.nama_barang_html) cellNama.innerHTML = item.nama_barang_html;

                        if (item.kode) {
                            if (inputPanjang) inputPanjang.removeAttribute('disabled');
                            if (inputLebar) inputLebar.removeAttribute('disabled');
                            if (inputQty) inputQty.removeAttribute('disabled');
                        }

                        if (inputPanjang) inputPanjang.value = item.panjang;
                        if (inputLebar) inputLebar.value = item.lebar;
                        if (inputQty) inputQty.value = item.qty;

                        if (inputHargaSatuan) inputHargaSatuan.value = item.harga_satuan;
                        if (pHarga) pHarga.innerHTML = item.harga_satuan;
                        if (spanHarga) spanHarga.innerHTML = formatRupiahLocal(item.harga_satuan);

                        if (window.$) {
                            $(inputPanjang).trigger('input').trigger('change');
                            $(inputLebar).trigger('input').trigger('change');
                            $(inputQty).trigger('input').trigger('change').trigger('keyup');
                        }
                    }
                }, index * 100);
            });

            setTimeout(() => {
                if (typeof HitungTotalBayar === "function") {
                    HitungTotalBayar();
                }
                isRestoring = false;
            }, (data.barang.length * 100) + 300);
        } else {
            isRestoring = false;
        }
    }

    function deleteTemplate(namaTemplate) {
        if (confirm(`Hapus template "${namaTemplate}"?`)) {
            let templates = getSavedTemplates();
            delete templates[namaTemplate];
            localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
            if (activeTemplate === namaTemplate) activeTemplate = null;
            renderTemplateButtons();
        }
    }

    function updateScrollVisibility() {
        const container = document.getElementById('template_list_buttons');
        const btnL = document.getElementById('btn_scroll_l');
        const btnR = document.getElementById('btn_scroll_r');
        if (!container || !btnL || !btnR) return;

        if (!isTemplatesVisible) {
            btnL.classList.remove('bintang-show');
            btnR.classList.remove('bintang-show');
            container.style.maskImage = 'none';
            container.style.webkitMaskImage = 'none';
            return;
        }

        const hasOverflow = container.scrollWidth > (container.clientWidth + 2);

        if (hasOverflow) {
            const isLeftScrollable = container.scrollLeft > 4;
            const isRightScrollable = container.scrollLeft + container.clientWidth < container.scrollWidth - 4;

            if (isLeftScrollable) btnL.classList.add('bintang-show');
            else btnL.classList.remove('bintang-show');

            if (isRightScrollable) btnR.classList.add('bintang-show');
            else btnR.classList.remove('bintang-show');

            let maskStyle = '';
            if (isLeftScrollable && isRightScrollable) {
                maskStyle = 'linear-gradient(to right, transparent 0%, black 35px, black calc(100% - 35px), transparent 100%)';
            } else if (isLeftScrollable) {
                maskStyle = 'linear-gradient(to right, transparent 0%, black 35px)';
            } else if (isRightScrollable) {
                maskStyle = 'linear-gradient(to right, black calc(100% - 35px), transparent 100%)';
            }

            container.style.maskImage = maskStyle;
            container.style.webkitMaskImage = maskStyle;
        } else {
            btnL.classList.remove('bintang-show');
            btnR.classList.remove('bintang-show');
            container.style.maskImage = 'none';
            container.style.webkitMaskImage = 'none';
        }
    }

    function smoothScrollLoop(container) {
        if (!isAnimatingScroll) return;

        const delta = scrollTarget - scrollCurrent;

        if (Math.abs(delta) < 1.0) {
            scrollCurrent = scrollTarget;
            container.scrollLeft = scrollTarget;
            isAnimatingScroll = false;
            updateScrollVisibility();
            return;
        }

        scrollCurrent += delta * 0.16;
        container.scrollLeft = Math.round(scrollCurrent);
        updateScrollVisibility();

        requestAnimationFrame(() => smoothScrollLoop(container));
    }

    function injectUI() {
        injectModernScrollCSS();

        const btnBarisBaru = document.getElementById('BarisBaru');
        if (!btnBarisBaru) return;

        // Cegah tombol ganda terpasang berkali-kali
        if (document.getElementById('bintang-save-container')) return;

        const totalBayarContainer = btnBarisBaru.closest('.TotalBayar');
        if (totalBayarContainer) {
            totalBayarContainer.style.position = 'relative';
            totalBayarContainer.style.display = 'flex';
            totalBayarContainer.style.alignItems = 'center';
            totalBayarContainer.style.justifyContent = 'space-between';
            totalBayarContainer.style.paddingLeft = '15px';
            totalBayarContainer.style.paddingRight = '15px';
        }

        const leftControlsWrapper = document.createElement('div');
        leftControlsWrapper.id = 'bintang-left-controls';
        leftControlsWrapper.style.display = 'inline-flex';
        leftControlsWrapper.style.alignItems = 'center';
        leftControlsWrapper.style.gap = '8px';
        leftControlsWrapper.style.maxWidth = 'calc(100% - 180px)';

        btnBarisBaru.classList.remove('pull-left');
        btnBarisBaru.style.borderRadius = '5px';
        btnBarisBaru.style.flexShrink = '0';
        btnBarisBaru.parentNode.insertBefore(leftControlsWrapper, btnBarisBaru);
        leftControlsWrapper.appendChild(btnBarisBaru);

        const customActionContainer = document.createElement('div');
        customActionContainer.id = 'bintang-save-container';
        customActionContainer.style.display = 'inline-flex';
        customActionContainer.style.alignItems = 'center';
        customActionContainer.style.gap = '8px';

        customActionContainer.innerHTML = `
            <button id="btn_manual_save" class="btn btn-default" style="font-weight: bold; height: 34px; border-radius: 5px; background-color: #FFFFFF; color: #333333; border-color: #CCCCCC; flex-shrink: 0;" title="Simpan Transaksi">
                <i class="fa fa-save fa-lg"></i>
            </button>
            <button id="btn_toggle_template" class="btn btn-default" style="font-weight: bold; height: 34px; border-radius: 5px; background-color: #FFFFFF; color: #333333; border-color: #CCCCCC; flex-shrink: 0;" title="Sembunyikan Templates">
                <i class="fa fa-eye fa-lg"></i>
            </button>
            <div id="bintang-slider-viewport">
                <div id="scroll_nav_wrapper">
                    <button id="btn_scroll_l" class="bintang-scroll-btn" title="Scroll Kiri">
                        <i class="fa fa-chevron-left fa-lg"></i>
                    </button>
                    <div id="template_list_buttons" style="display: inline-flex; gap: 5px; flex-wrap: nowrap; max-width: 650px; overflow-x: auto; overflow-y: hidden; align-items: center; padding-bottom: 0px; -webkit-overflow-scrolling: touch;"></div>
                    <button id="btn_scroll_r" class="bintang-scroll-btn" title="Scroll Kanan">
                        <i class="fa fa-chevron-right fa-lg"></i>
                    </button>
                </div>
            </div>
        `;

        leftControlsWrapper.appendChild(customActionContainer);

        const h2Total = totalBayarContainer ? totalBayarContainer.querySelector('h2') : null;
        if(h2Total) {
            h2Total.style.margin = '0';
            h2Total.style.textAlign = 'right';
            h2Total.style.flexGrow = '1';
            h2Total.style.flexShrink = '0';
            h2Total.style.paddingLeft = '10px';
        }

        const containerList = document.getElementById('template_list_buttons');
        if (containerList) {
            containerList.addEventListener('scroll', () => {
                if (!isAnimatingScroll) {
                    scrollCurrent = containerList.scrollLeft;
                    scrollTarget = containerList.scrollLeft;
                }
                updateScrollVisibility();
            });

            containerList.addEventListener('wheel', (e) => {
                if (e.deltaY !== 0) {
                    e.preventDefault();

                    const maxScroll = containerList.scrollWidth - containerList.clientWidth;
                    scrollTarget = Math.max(0, Math.min(maxScroll, scrollTarget + (e.deltaY * 1.0)));

                    if (!isAnimatingScroll) {
                        isAnimatingScroll = true;
                        scrollCurrent = containerList.scrollLeft;
                        requestAnimationFrame(() => smoothScrollLoop(containerList));
                    }
                }
            }, { passive: false });
        }

        document.getElementById('btn_scroll_l').addEventListener('click', (e) => {
            e.preventDefault();
            const maxScroll = containerList.scrollWidth - containerList.clientWidth;
            scrollTarget = Math.max(0, Math.min(maxScroll, containerList.scrollLeft - 220));

            if (!isAnimatingScroll) {
                isAnimatingScroll = true;
                scrollCurrent = containerList.scrollLeft;
                requestAnimationFrame(() => smoothScrollLoop(containerList));
            }
        });

        document.getElementById('btn_scroll_r').addEventListener('click', (e) => {
            e.preventDefault();
            const maxScroll = containerList.scrollWidth - containerList.clientWidth;
            scrollTarget = Math.max(0, Math.min(maxScroll, containerList.scrollLeft + 220));

            if (!isAnimatingScroll) {
                isAnimatingScroll = true;
                scrollCurrent = containerList.scrollLeft;
                requestAnimationFrame(() => smoothScrollLoop(containerList));
            }
        });

        document.getElementById('btn_manual_save').addEventListener('click', (e) => {
            e.preventDefault();

            if (activeTemplate) {
                saveFormDataManual(activeTemplate);
                return;
            }

            const nama = prompt("Masukkan nama untuk menyimpan transaksi ini:", "");
            if (nama === null) return;
            if (nama.trim() === "") {
                alert("Nama tidak boleh kosong!");
                return;
            }
            saveFormDataManual(nama);
        });

        document.getElementById('btn_toggle_template').addEventListener('click', (e) => {
            e.preventDefault();
            const btnToggle = e.currentTarget;
            const viewport = document.getElementById('bintang-slider-viewport');
            const iconToggle = btnToggle.querySelector('i');

            isTemplatesVisible = !isTemplatesVisible;

            if (isTemplatesVisible) {
                viewport.classList.remove('bintang-hidden');
                iconToggle.className = 'fa fa-eye fa-lg';
                btnToggle.title = "Sembunyikan Templates";
                btnToggle.style.backgroundColor = '#FFFFFF';
                btnToggle.style.color = '#333333';
                btnToggle.style.borderColor = '#CCCCCC';
                setTimeout(updateScrollVisibility, 150);
            } else {
                viewport.classList.add('bintang-hidden');
                iconToggle.className = 'fa fa-eye-slash fa-lg';
                btnToggle.title = "Tampilkan Templates";
                btnToggle.style.backgroundColor = '#FFFFFF';
                btnToggle.style.color = '#333333';
                btnToggle.style.borderColor = '#CCCCCC';
                updateScrollVisibility();
            }
        });

        renderTemplateButtons();
    }

    function renderTemplateButtons() {
        const containerList = document.getElementById('template_list_buttons');
        if (!containerList) return;

        containerList.innerHTML = '';
        const templates = getSavedTemplates();

        Object.keys(templates).forEach(nama => {
            const group = document.createElement('div');
            group.className = 'btn-group';
            group.style.marginRight = '2px';
            group.style.display = 'inline-flex';
            group.style.flexShrink = '0';

            const isCurrentActive = (activeTemplate === nama);

            const bgBtn = isCurrentActive ? '#FFD700' : '#FFFFFF';
            const textBtn = isCurrentActive ? '#000000' : '#333333';
            const borderBtn = isCurrentActive ? '#ECC000' : '#CCCCCC';

            group.innerHTML = `
                <button class="btn btn-default btn-sm btn-load-template" style="font-weight: bold; height: 34px; background-color: ${bgBtn}; color: ${textBtn}; border-color: ${borderBtn}; border-top-left-radius: 5px; border-bottom-left-radius: 5px; border-top-right-radius: 0px; border-bottom-right-radius: 0px;">
                    ${nama}
                </button>
                <button class="btn btn-danger btn-sm btn-del-template" style="height: 34px; font-weight: bold; border-top-right-radius: 5px; border-bottom-right-radius: 5px; border-top-left-radius: 0px; border-bottom-left-radius: 0px;" title="Hapus">
                    <i class="fa fa-times"></i>
                </button>
            `;

            group.querySelector('.btn-load-template').addEventListener('click', (e) => {
                e.preventDefault();

                if (activeTemplate === nama) {
                    clearCurrentTable();
                    activeTemplate = null;
                    renderTemplateButtons();
                } else {
                    activeTemplate = nama;
                    renderTemplateButtons();
                    restoreFormData(nama);
                }
            });

            group.querySelector('.btn-del-template').addEventListener('click', (e) => {
                e.preventDefault();
                deleteTemplate(nama);
            });

            containerList.appendChild(group);
        });

        setTimeout(() => {
            updateScrollVisibility();
            if(containerList) {
                scrollTarget = containerList.scrollLeft;
                scrollCurrent = containerList.scrollLeft;
            }
        }, 50);
    }

    // GANTI BAGIAN UTAMA: Gunakan interval tunggu elemen siap, anti-gagal load di CDN Master
    const checkElementExist = setInterval(() => {
        if (document.getElementById('BarisBaru')) {
            clearInterval(checkElementExist);
            injectUI();
        }
    }, 100);

})();
