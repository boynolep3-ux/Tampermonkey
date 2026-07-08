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

    // Mengintersepsi elemen <a> ketika diklik untuk mengunduh
    document.addEventListener('click', function(event) {
        const target = event.target.closest('a');
        if (target && target.hasAttribute('download')) {
            let fileName = target.getAttribute('download');
            let fixedName = fixFileName(fileName);
            if (fixedName !== fileName) {
                target.setAttribute('download', fixedName);
            }
        }
    }, true);

    // Mengantisipasi metode unduhan via pemicu klik elemen <a> secara programatis
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
})();
