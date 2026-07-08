(function() {
    'use strict';

    // Fungsi helper untuk memperbaiki nama file berdasarkan ekstensi salah yang terdeteksi
    function fixFileName(fileName) {
        if (!fileName) return fileName;

        let lowerName = fileName.toLowerCase();
        let newFileName = fileName;

        // 1. Perbaikan untuk file .cdr.zip -> .cdr
        if (lowerName.endsWith('.cdr.zip')) {
            newFileName = fileName.slice(0, -4); // Menghapus '.zip'
        }
        // 2. Perbaikan untuk file .jpg.jpeg atau .jpeg.jpeg -> .jpg
        else if (lowerName.endsWith('.jpg.jpeg')) {
            newFileName = fileName.slice(0, -5); // Menghapus '.jpeg'
        }
        else if (lowerName.endsWith('.jpeg.jpeg')) {
            newFileName = fileName.slice(0, -5).replace(/\.jpeg$/i, '.jpg'); // Mengubah .jpeg pertama menjadi .jpg
        }

        if (newFileName !== fileName) {
            console.log(`[WA Fixer] Nama file diubah dari: "${fileName}" menjadi: "${newFileName}"`);
        }

        return newFileName;
    }

    // TEKNIK 1: Mencegat pembuatan Object URL (Akar tautan unduhan blob WhatsApp)
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = function(blob) {
        // Jika objek yang dibuat adalah File dan memiliki properti nama
        if (blob instanceof File && blob.name) {
            const fixedName = fixFileName(blob.name);
            if (fixedName !== blob.name) {
                // Buat objek File baru dengan nama yang sudah diperbaiki
                arguments[0] = new File([blob], fixedName, { type: blob.type });
            }
        }
        return originalCreateObjectURL.apply(this, arguments);
    };

    // TEKNIK 2: Mengantisipasi metode unduhan via pemicu klik elemen <a> secara programatis (Tetap dipertahankan)
    const originalAnchorClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function() {
        if (this.hasAttribute('download')) {
            let fileName = this.getAttribute('download');
            let fixedName = fixFileName(fileName);
            if (fixedName !== fileName) {
                this.setAttribute('download', fixedName);
            }
        }
        originalAnchorClick.apply(this, arguments);
    };

    // TEKNIK 3: Pantau DOM jika WhatsApp menyisipkan elemen unduhan secara dinamis
    document.addEventListener('pointerdown', function(event) {
        const target = event.target.closest('a');
        if (target && target.hasAttribute('download')) {
            let fileName = target.getAttribute('download');
            let fixedName = fixFileName(fileName);
            if (fixedName !== fileName) {
                target.setAttribute('download', fixedName);
            }
        }
    }, true);

})();
