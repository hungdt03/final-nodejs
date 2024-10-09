// Handle Search Product In Sale Page
const inputSearchProduct = document.getElementById('input-search-product')
const searchResultWrapper = document.getElementById('search-result-wrapper')

inputSearchProduct.addEventListener('focus', function() {
    const query = inputSearchProduct.value.trim();
    if (query.length > 0) {
        searchResultWrapper.classList.remove('hidden');
        searchResultWrapper.classList.add('flex');
    } else {
        searchResultWrapper.classList.add('hidden');
        searchResultWrapper.classList.remove('flex');
    }
});


inputSearchProduct.addEventListener('input', function() {
    const query = inputSearchProduct.value.trim();
    if (query.length > 0) {
        searchResultWrapper.classList.remove('hidden');
        searchResultWrapper.classList.add('flex');
    } else {
        searchResultWrapper.classList.add('hidden');
        searchResultWrapper.classList.remove('flex');
    }
});

document.addEventListener('click', function(event) {
    const isClickInside = inputSearchProduct.contains(event.target) || searchResultWrapper.contains(event.target);
    
    if (!isClickInside) {
        searchResultWrapper.classList.add('hidden');
        searchResultWrapper.classList.remove('flex');
    }
});

// Xử lí modal

// const openModalBtn = document.getElementById('openModalBtn');
// const closeModalBtn = document.getElementById('closeModalBtn');
// const modal = document.getElementById('myModal');

// Hàm mở modal với hiệu ứng
// function openModal() {
//     modal.classList.add('show');
// }

// // Hàm đóng modal
// function closeModal() {
//     modal.classList.remove('show');
// }

// // Mở modal khi nhấn nút
// openModalBtn.addEventListener('click', openModal);

// // Đóng modal khi nhấn vào nút close
// closeModalBtn.addEventListener('click', closeModal);

// // Đóng modal khi nhấn ra ngoài modal content
// window.addEventListener('click', function (event) {
//     if (event.target === modal) {
//         closeModal();
//     }
// });