// DOM related to Create Category
const btnOpenCreateCategoryModal = document.getElementById('openCreateCategoryModal')
const btnCreateCategory = document.getElementById('btn-create-category')
const formCreateCategory = document.getElementById('form-create-category')

// DOM related to Create Category
const btnOpenEditCategoryModal = document.getElementById('openEditCategoryModal')
const btnEditCategory = document.getElementById('btn-edit-category')
const formEditCategory = document.getElementById('form-edit-category')

// Handle Create Category
btnOpenCreateCategoryModal.addEventListener('click', function (e) {
    const modalId = this.getAttribute('data-modal')
    const modal = document.getElementById(modalId)
    modal.classList.add('show')

    btnCreateCategory.addEventListener('click', (e) => {
        const formData = new FormData(formCreateCategory);
        const data = Object.fromEntries(formData.entries());
        console.log(data)
    })
})


// Handle Update Category
btnOpenEditCategoryModal.addEventListener('click', function (e) {
    const modalId = this.getAttribute('data-modal')
    const modal = document.getElementById(modalId)
    modal.classList.add('show')

    btnEditCategory.addEventListener('click', (e) => {
        const formData = new FormData(formEditCategory);
        const data = Object.fromEntries(formData.entries());
        console.log(data)
    })
})



const deleteCategoryBtns = document.querySelectorAll('.delete-category-btn');
deleteCategoryBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        const categoryId = this.getAttribute('data-category-id'); // Lấy CategoryId
        const modal = document.getElementById('confirmRemoveCategoryModal');
        modal.setAttribute('data-category-id', categoryId);
        modal.classList.add('show');
    });
});

// Xử lý khi người dùng xác nhận xóa trong modal
const confirmDeleteBtn = document.querySelector('#btn-confirm-delete');

confirmDeleteBtn.addEventListener('click', function () {
    const modal = document.getElementById('confirmRemoveCategoryModal');
    const categoryId = modal.getAttribute('data-category-id');
    deleteCategory(categoryId);
    modal.classList.remove('show');
});

// Hàm giả định để xóa sản phẩm
function deleteCategory(categoryId) {
    console.log(`Xóa sản phẩm với ID: ${categoryId}`);
}
