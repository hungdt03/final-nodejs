import { showLoading, hideLoading } from "./loading.js";
import categoryService from "./services/category-service.js";

// CREATE DOM
const btnOpenCreateCategoryModal = document.getElementById('openCreateCategoryModal')
const btnCreateCategory = document.getElementById('btn-create-category')
const formCreateCategory = document.getElementById('form-create-category')

const nameInput = formCreateCategory.querySelector("input[name='name'")
const descriptionInput = formCreateCategory.querySelector("textarea[name='description'")

// EDIT DOM 
const btnOpenModalEdits = document.querySelectorAll('.open-edit-category-modal')
const btnEditCategory = document.getElementById('btn-save-category')
const formEditCategory = document.getElementById('form-edit-category')


const nameInputEdit = formEditCategory.querySelector("input[name='name'")
const descriptionInputEdit = formEditCategory.querySelector("textarea[name='description'")

const showError = (input, message) => {
    let errorElement = input.nextElementSibling;
    errorElement.classList.remove('hidden')
    input.classList.add('bg-red-50')
    errorElement.innerHTML = message;
};

const hideError = (input) => {
    const errorElement = input.nextElementSibling;
    input.classList.remove('bg-red-50')
    errorElement.classList.add('hidden')
};

const validateInput = (input, message) => {
    if (!input.value.trim()) {
        showError(input, message);
        return false;
    } else {
        hideError(input);
        return true
    }
};

nameInput.addEventListener('blur', () => validateInput(nameInput, 'Tên danh mục không được để trống'));
descriptionInput.addEventListener('blur', () => validateInput(descriptionInput, 'Mô tả danh mục không được để trống'));

// Ẩn lỗi khi người dùng đang gõ
nameInput.addEventListener('input', () => hideError(nameInput));
descriptionInput.addEventListener('input', () => hideError(descriptionInput));

const validateFormCreate = () => {
    const isValidName = validateInput(nameInput, 'Tên danh mục không được để trống');
    const isValiadDescription = validateInput(descriptionInput, 'Mô tả không được để trống');

    return isValidName && isValiadDescription
}

const validateFormEdit = () => {
    const isValidName = validateInput(nameInputEdit, 'Tên danh mục không được để trống');
    const isValiadDescription = validateInput(descriptionInputEdit, 'Mô tả không được để trống');

    return isValidName && isValiadDescription
}

// Handle Create Employee
btnOpenCreateCategoryModal.addEventListener('click', function (e) {
    const modalId = this.getAttribute('data-modal')
    const modal = document.getElementById(modalId)
    modal.classList.add('show')

    btnCreateCategory.onclick = async (e) => {
        if (validateFormCreate()) {
            const formData = new FormData(formCreateCategory);
            const data = Object.fromEntries(formData.entries());
            showLoading()
            const response = await categoryService.createCategory(data)
            hideLoading()
            if(response.success) {
                window.location.reload()
            } else {
                alert(response.message)
            }
        }

    }
})

// Handle Edit Employee
btnOpenModalEdits.forEach(btn => {
    btn.addEventListener('click', function(e) {
        const modalId = this.getAttribute('data-modal');
        const dataId = this.getAttribute('data-id');
        const dataName = this.getAttribute('data-name');
        const dataDescription = this.getAttribute('data-description');

        nameInputEdit.value = dataName;
        descriptionInputEdit.value = dataDescription;

        const modal = document.getElementById(modalId)
        modal.classList.add('show')

        btnEditCategory.onclick = async (e) => {
            if (validateFormEdit()) {
                const formData = new FormData(formEditCategory);
                const data = Object.fromEntries(formData.entries());
                console.log(data)
                showLoading()
                const response = await categoryService.updateCategory(dataId, data)
                console.log(response)
                hideLoading()
                if(response.success) {
                    window.location.reload()
                } else {
                    alert(response.message)
                }
            } else {
                console.log('Vô đây à')
            }
    
        }

    })
})


// =====================================
// ============DELETE CATEGORY==========
// =====================================

const categoryNameTag = document.getElementById('category-delete')
const deleteCategoryBtns = document.querySelectorAll('.delete-category-btn');
deleteCategoryBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
        const categoryId = this.getAttribute('data-category-id'); 
        const categoryName = this.getAttribute('data-category-name'); 
        const modal = document.getElementById('confirmRemoveCategoryModal');
        modal.setAttribute('data-category-id', categoryId);
        categoryNameTag.innerHTML = categoryName
        
        modal.classList.add('show');
    });
});


const confirmDeleteBtn = document.querySelector('#btn-confirm-delete');

confirmDeleteBtn.addEventListener('click', async function () {
    const modal = document.getElementById('confirmRemoveCategoryModal');
    const categoryId = modal.getAttribute('data-category-id');
    
    await categoryService.deleteCategoryById(categoryId)
    window.location.reload()
    
});
