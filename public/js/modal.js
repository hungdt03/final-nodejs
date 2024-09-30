// Lấy tất cả các button mở modal
const openModalBtns = document.querySelectorAll('.open-modal-btn');
// Lấy tất cả các button đóng modal
const closeModalBtns = document.querySelectorAll('.close-modal-btn');

// Lặp qua các button mở modal và gán sự kiện
// openModalBtns.forEach(btn => {
//     btn.addEventListener('click', function() {
//         const modalId = this.getAttribute('data-modal');
//         const modal = document.getElementById(modalId);
//         modal.classList.add('show');
//     });
// });

// Lặp qua các button đóng modal và gán sự kiện
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const modalId = this.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
    });
});

// Đóng modal khi người dùng click bên ngoài modal content
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });
});