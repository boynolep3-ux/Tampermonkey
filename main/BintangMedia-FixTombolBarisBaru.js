(function() {

    'use strict';



    function fixButtonState() {

        // Cari tombol tambah berdasarkan ID

        const addButton = document.getElementById('BarisBaru');

        if (!addButton) return;



        // Cari tbody yang spesifik mengandung input kode_barang

        const tbody = document.querySelector('input[name="kode_barang[]"]')?.closest('tbody') || document.querySelector('tbody');

        if (!tbody) return;



        // Hitung jumlah baris (tr) saat ini

        const currentRows = tbody.querySelectorAll('tr').length;



        if (currentRows < 8) {

            // Aktifkan kembali (Tanpa atribut disabled)

            addButton.removeAttribute('disabled');



            // Kembalikan class dan style persis seperti semula

            addButton.className = 'btn btn-default';

            addButton.setAttribute('style', 'border-radius: 5px; flex-shrink: 0;');

        } else {

            // Matikan saat mencapai 8 baris (Ditambahkan disabled="")

            addButton.setAttribute('disabled', '');



            // Paksa class dan style tetap sama seperti request tanpa tambahan class .disabled atau opacity

            addButton.className = 'btn btn-default';

            addButton.setAttribute('style', 'border-radius: 5px; flex-shrink: 0;');

        }

    }



    // Fungsi inisialisasi untuk memantau perubahan DOM

    function init() {

        const tbody = document.querySelector('input[name="kode_barang[]"]')?.closest('tbody') || document.querySelector('tbody');



        if (tbody) {

            // Gunakan MutationObserver untuk memantau kapanpun baris ditambah/dihapus

            const observer = new MutationObserver(() => {

                setTimeout(fixButtonState, 50);

            });



            observer.observe(tbody, { childList: true });



            // Jalankan pengecekan awal

            fixButtonState();



            // Deteksi klik pada tombol hapus baris sebagai cadangan

            document.addEventListener('click', function(e) {

                if (e.target && (e.target.id === 'HapusBaris' || e.target.closest('#HapusBaris') || e.target.closest('.btn-danger'))) {

                    setTimeout(fixButtonState, 100);

                }

            });

        } else {

            // Jika tabel belum load, coba lagi dalam 500ms

            setTimeout(init, 500);

        }

    }



    // Jalankan script setelah halaman siap

    if (document.readyState === 'loading') {

        document.addEventListener('DOMContentLoaded', init);

    } else {

        init();

    }

})();
