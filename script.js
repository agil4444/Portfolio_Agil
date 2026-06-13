// =========================================
// 1. ANIMASI SCROLL REVEAL (FADE IN)
// =========================================
const scrollElements = document.querySelectorAll('.fade-scroll');

const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend);
};

const displayScrollElement = (element) => {
    element.style.opacity = "1";
    element.style.transform = "translateY(0)";
};

const hideScrollElement = (element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(40px)";
    element.style.transition = "all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)";
};

scrollElements.forEach((el) => { hideScrollElement(el); });

window.addEventListener('scroll', () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 1.25)) {
            displayScrollElement(el);
        }
    });
});

// =========================================
// 2. PROJECT FILTER SYSTEM (TOMBOL KATEGORI)
// =========================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Hapus warna aktif dari semua tombol, berikan ke tombol yang diklik
        filterBtns.forEach(button => button.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (filterValue === 'all' || filterValue === cardCategory) {
                card.style.display = 'flex';
                card.classList.add('show');
            } else {
                card.style.display = 'none';
                card.classList.remove('show');
            }
        });
    });
});

// =========================================
// 3. PROJECT MODAL SYSTEM (POP-UP SAAT DIKLIK)
// =========================================
const modalOverlay = document.getElementById('project-modal');
const closeBtn = document.querySelector('.modal-close-btn');

// Cek apakah ada elemen modal (agar tidak error)
if (modalOverlay) {
    const modalMainImg = document.getElementById('modal-main-image');
    const modalThumbnails = document.getElementById('modal-thumbnails');
    const modalTag = document.getElementById('modal-tag');
    const modalTitle = document.getElementById('modal-title');
    const modalDate = document.getElementById('modal-date');
    const modalLocation = document.getElementById('modal-location');
    const modalDesc = document.getElementById('modal-desc');
    const modalTools = document.getElementById('modal-tools');

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            // Ambil data dari HTML
            const category = card.getAttribute('data-category');
            const title = card.getAttribute('data-fulltitle');
            const date = card.getAttribute('data-date');
            const location = card.getAttribute('data-location');
            const desc = card.getAttribute('data-fulldesc');
            const toolsStr = card.getAttribute('data-tools'); 
            const imagesRaw = card.getAttribute('data-images'); 
            
            let imagesArray = [];
            try {
                if (imagesRaw) imagesArray = JSON.parse(imagesRaw);
            } catch(e) { console.error("Error parsing data-images", e); }

            // Isi teks ke pop-up
            modalTitle.innerText = title;
            modalDate.innerText = date;
            modalLocation.innerText = location;
            modalDesc.innerText = desc;
            
            // Isi Tag warna-warni
            const tagText = card.querySelector('.project-tag').innerText;
            modalTag.innerText = tagText;
            modalTag.className = `project-tag tag-${category}`;

            // Render Tools (Skills)
            modalTools.innerHTML = ''; 
            if (toolsStr) {
                toolsStr.split(',').forEach(tool => {
                    const span = document.createElement('span');
                    span.className = 'skill-badge';
                    span.style.fontSize = '11px';
                    span.style.padding = '5px 12px';
                    span.innerText = tool.trim();
                    modalTools.appendChild(span);
                });
            }

            // Render Gambar
            modalThumbnails.innerHTML = '';
            if (imagesArray.length > 0) {
                modalMainImg.src = imagesArray[0]; // Set gambar utama
                
                imagesArray.forEach((imgSrc, index) => {
                    const imgEl = document.createElement('img');
                    imgEl.src = imgSrc;
                    imgEl.className = index === 0 ? 'thumb-img active-thumb' : 'thumb-img';
                    
                    // Fungsi klik thumbnail ganti gambar utama
                    imgEl.addEventListener('click', () => {
                        modalMainImg.style.opacity = 0;
                        setTimeout(() => {
                            modalMainImg.src = imgSrc;
                            modalMainImg.style.opacity = 1;
                        }, 200);
                        document.querySelectorAll('.thumb-img').forEach(t => t.classList.remove('active-thumb'));
                        imgEl.classList.add('active-thumb');
                    });
                    modalThumbnails.appendChild(imgEl);
                });
            } else {
                modalMainImg.src = ''; // Kosongkan jika tidak ada gambar
            }

            // Tampilkan Modal
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });
    });

    // Fungsi Tutup Modal
    const closeModal = () => {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = 'auto'; 
    };

    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
}