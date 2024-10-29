
import categoryService from "./services/category-service.js"
import productService from "./services/product-service.js"


// FILE INPUTS
let fileCreates = []
let fileEdits = []

// category select
const createCategorySelect = document.getElementById('create-category-select')
const editCategorySelect = document.getElementById('edit-category-select')

// DOM related to Create Product
const btnOpenCreateProductModal = document.getElementById('openCreateProductModal')
const btnCreateProduct = document.getElementById('btn-create-product')
const formCreateProduct = document.getElementById('form-create-product')

const createSelectCategory = formCreateProduct.querySelector("select[name='categoryId'")
const createNameInput = formCreateProduct.querySelector("input[name='name'")
const createPurchasePriceInput = formCreateProduct.querySelector("input[name='purchasePrice'")
const createRetailPriceInput = formCreateProduct.querySelector("input[name='retailPrice'")
const createStockQuantityInput = formCreateProduct.querySelector("input[name='stockQuantity'")
const createThumbnailInput = formCreateProduct.querySelector("input[name='thumbnail'")

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

const validateSelect = (select, message) => {
    if (!select.value) {
        showError(select, message);
        return false;
    } else {
        hideError(select);
        return true
    }
}

const validateFiles = (input, message) => {
    if (!input.files.length && !fileCreates.length) {
        showError(input, message);
        return false;
    } else {
        hideError(input);
        return true
    }
};


createSelectCategory.addEventListener('blur', () => validateSelect(createSelectCategory, 'Chưa chọn danh mục'));
createNameInput.addEventListener('blur', () => validateInput(createNameInput, 'Tên sản phẩm không được để trống'));
createPurchasePriceInput.addEventListener('blur', () => validateInput(createPurchasePriceInput, 'Giá nhập không được để trống'));
createRetailPriceInput.addEventListener('blur', () => validateInput(createRetailPriceInput, 'Giá bán không được để trống'));
createStockQuantityInput.addEventListener('blur', () => validateInput(createStockQuantityInput, 'Số lượng trong kho không được để trống'));
createThumbnailInput.addEventListener('blur', () => validateFiles(createThumbnailInput, 'Ảnh sản phẩm không được để trống'));

// Ẩn lỗi khi người dùng đang gõ
createSelectCategory.addEventListener('change', () => hideError(createSelectCategory));
createNameInput.addEventListener('input', () => hideError(createNameInput));
createPurchasePriceInput.addEventListener('input', () => hideError(createPurchasePriceInput));
createRetailPriceInput.addEventListener('input', () => hideError(createRetailPriceInput));
createStockQuantityInput.addEventListener('input', () => hideError(createStockQuantityInput));
createThumbnailInput.addEventListener('input', () => hideError(createThumbnailInput));

// Validate fields
const validateCreateProductForm = () => {
    const isCategoryValid = validateSelect(createSelectCategory, 'Chưa chọn danh mục');
    const isNameValid = validateInput(createNameInput, 'Tên sản phẩm không được để trống');
    const isPurchasePriceValid = validateInput(createPurchasePriceInput, 'Giá nhập không được để trống');
    const isRetailPriceValid = validateInput(createRetailPriceInput, 'Giá bán không được để trống');
    const isStockQuantityValid = validateInput(createStockQuantityInput, 'Số lượng trong kho không được để trống');
    const isThumbnailValid = validateFiles(createThumbnailInput, 'Ảnh sản phẩm không được để trống');

    return isCategoryValid && isNameValid && isPurchasePriceValid && isRetailPriceValid && isStockQuantityValid && isThumbnailValid
};

const renderCategorySelect = (categories, element, categoryId = '') => {
    console.log(categoryId);
    
    const html = categories.map(category => `
        <option value="${category.id}" ${category.id === categoryId ? 'selected' : ''}>${category.name}</option>
    `).join(''); 

    element.innerHTML += html;
}

// Handle Create product

btnOpenCreateProductModal.addEventListener('click', async function (e) {
    const modalId = this.getAttribute('data-modal')
    const modal = document.getElementById(modalId)
    const response = await categoryService.getAll();
    renderCategorySelect(response.data, createCategorySelect)
    modal.classList.add('show')

    btnCreateProduct.addEventListener('click', async (e) => {
        const formData = new FormData(formCreateProduct);
        formData.set('thumbnail', fileCreates[0])
        if (validateCreateProductForm()) {
            const response = await productService.createProduct(formData);
            if (response.success) {
                window.location.reload()
            } else {
                alert(response.message)
            }

        }
    })
})

// =====================================================================
// =============================EDIT PRODUCT============================
// =====================================================================

const btnOpenEditProductModals = document.querySelectorAll('.open-edit-product-modal')
const btnSaveProduct = document.getElementById('btn-save-product')
const formEditProduct = document.getElementById('form-edit-product')

const editSelectCategory = formEditProduct.querySelector("select[name='categoryId'")
const editNameInput = formEditProduct.querySelector("input[name='name'")
const editPurchasePriceInput = formEditProduct.querySelector("input[name='purchasePrice'")
const editRetailPriceInput = formEditProduct.querySelector("input[name='retailPrice'")
const editStockQuantityInput = formEditProduct.querySelector("input[name='stockQuantity'")
const editThumbnailInput = formEditProduct.querySelector("input[name='thumbnail'")
const editOldThumbnailInput = formEditProduct.querySelector("input[name='oldThumbnail'")
const editImageLabel = formEditProduct.querySelector('.image-label');
const editUploadText = formEditProduct.querySelector('.upload-text');

editCategorySelect.addEventListener('blur', () => validateSelect(editCategorySelect, 'Chưa chọn danh mục'));
editNameInput.addEventListener('blur', () => validateInput(editNameInput, 'Tên sản phẩm không được để trống'));
editPurchasePriceInput.addEventListener('blur', () => validateInput(editPurchasePriceInput, 'Giá nhập không được để trống'));
editRetailPriceInput.addEventListener('blur', () => validateInput(editRetailPriceInput, 'Giá bán không được để trống'));
editStockQuantityInput.addEventListener('blur', () => validateInput(editStockQuantityInput, 'Số lượng trong kho không được để trống'));
editThumbnailInput.addEventListener('blur', () => validateInput(editThumbnailInput, 'Ảnh sản phẩm không được để trống'));

// Ẩn lỗi khi người dùng đang gõ
editCategorySelect.addEventListener('change', () => hideError(editCategorySelect));
editNameInput.addEventListener('input', () => hideError(editNameInput));
editPurchasePriceInput.addEventListener('input', () => hideError(editPurchasePriceInput));
editRetailPriceInput.addEventListener('input', () => hideError(editRetailPriceInput));
editStockQuantityInput.addEventListener('input', () => hideError(editStockQuantityInput));
editThumbnailInput.addEventListener('input', () => hideError(editThumbnailInput));

// Validate fields
const validateEditProductForm = () => {
    const isCategoryValid = validateSelect(editCategorySelect, 'Chưa chọn danh mục');
    const isNameValid = validateInput(editNameInput, 'Tên sản phẩm không được để trống');
    const isPurchasePriceValid = validateInput(editPurchasePriceInput, 'Giá nhập không được để trống');
    const isRetailPriceValid = validateInput(editRetailPriceInput, 'Giá bán không được để trống');
    const isStockQuantityValid = validateInput(editStockQuantityInput, 'Số lượng trong kho không được để trống');

    return isCategoryValid && isNameValid && isPurchasePriceValid && isRetailPriceValid && isStockQuantityValid
};

const renderModalData = (product) => {
    editNameInput.value = product.name;
    editPurchasePriceInput.value = product.purchasePrice;
    editRetailPriceInput.value = product.retailPrice;
    editStockQuantityInput.value = product.stockQuantity;
    editOldThumbnailInput.value = product.thumbnail;

    editUploadText.style.display = 'none';
    const oldImage = formEditProduct.querySelector('.image-label img');
    if (oldImage) {
        oldImage.remove();
    }

    const img = document.createElement('img');
    img.src = '/images/product/' + product.thumbnail;
    img.alt = 'Uploaded Image';
    img.classList.add('max-w-full', 'h-32', 'object-cover');

    editImageLabel.appendChild(img);
}

// Handle Edit product
btnOpenEditProductModals.forEach(btnOpenEditProductModal => {
    btnOpenEditProductModal.addEventListener('click', async function (e) {
        const modalId = this.getAttribute('data-modal')
        const productId = this.getAttribute('data-id')
        const response = await productService.getProductById(productId);
        console.log(response)
        renderModalData(response.data)

        const responseCategory = await categoryService.getAll();
        renderCategorySelect(responseCategory.data, editCategorySelect, response.data.category.id)

        const modal = document.getElementById(modalId)
        modal.classList.add('show')

        btnSaveProduct.addEventListener('click', async (e) => {
            const formData = new FormData(formEditProduct);
            if (fileEdits.length > 0) {
                formData.set('thumbnail', fileEdits[0])
            }

            if (validateEditProductForm()) {
                const response = await productService.updateProduct(productId, formData);
                if (response.success) {
                    window.location.reload()
                } else {
                    console.log(response)
                }
            }

        })
    })
})

// =====================================================================
// =============================DELETE PRODUCT============================
// =====================================================================


const deleteProductBtns = document.querySelectorAll('.delete-product-btn');
deleteProductBtns.forEach(btn => {
    btn.addEventListener('click', function () {
        const productId = this.getAttribute('data-product-id');
        const modal = document.getElementById('confirmRemoveProductModal');
        modal.setAttribute('data-product-id', productId);

        modal.classList.add('show');
    });
});

const confirmDeleteBtn = document.querySelector('#btn-confirm-delete');

confirmDeleteBtn.addEventListener('click', async function () {
    const modal = document.getElementById('confirmRemoveProductModal');
    const productId = modal.getAttribute('data-product-id');

    await productService.deleteProductById(productId)
    window.location.reload()

});


// =====================================================================
// =============================UPLOAD IMAGE PRODUCT============================
// =====================================================================

// Handle Upload file
const setupUploadFile = (form) => {
    const uploadInput = form.querySelector('.upload-product');
    const imageLabel = form.querySelector('.image-label');
    const uploadText = form.querySelector('.upload-text');

    const handleFileUpload = (file) => {
        if (file) {
            const reader = new FileReader();

            // DataURL (base64)
            reader.readAsDataURL(file);

            reader.onload = function (e) {
                uploadText.style.display = 'none';

                const oldImage = form.querySelector('.image-label img');
                if (oldImage) {
                    oldImage.remove();
                }


                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Uploaded Image';
                img.classList.add('max-w-full', 'h-32', 'object-cover');
                imageLabel.appendChild(img);
            };
        }
    };

    uploadInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (form.id === 'createProductModal') {
            fileCreates = event.target.files;
            fileEdits = []
        } else {
            fileEdits = event.target.files;
            fileCreates = []
        }
        handleFileUpload(file);
    });

    imageLabel.addEventListener('dragover', function (event) {
        event.preventDefault();
        event.stopPropagation();
        imageLabel.classList.add('border-orange-500');
    });

    imageLabel.addEventListener('dragleave', function (event) {
        event.preventDefault();
        event.stopPropagation();
        imageLabel.classList.remove('border-orange-500');
    });

    imageLabel.addEventListener('drop', function (event) {
        event.preventDefault();
        event.stopPropagation();
        imageLabel.classList.remove('border-orange-500');

        const files = event.dataTransfer.files;
        if (files.length > 0) {
            if (form.id === 'createProductModal') {
                fileCreates = files;
                fileEdits = []
            } else {
                fileEdits = files;
                fileCreates = []
            }

            handleFileUpload(files[0]);
        }
    });
}

document.querySelectorAll('.form-product').forEach(form => {
    console.log(form)
    setupUploadFile(form)
});


