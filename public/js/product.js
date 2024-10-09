
// CALL PRODUCT API
const productService = {
    createProduct: async (formData) => {
        const response = await fetch('/products/api/add', {
            method: 'POST',
            body: formData
        });

        const data = await response.json()
        return data;
    },
    updateProduct: async (id, formData) => {
        const response = await fetch('/products/api/edit/' + id, {
            method: 'PUT',
            body: formData
        });

        const data = await response.json()
        console.log(data)
        return data;
    },
    getProductById: async (id) => {
        const response = await fetch('/products/api/' + id);
        const data = await response.json();
        return data;
    }
}


// DOM related to Create Product
const btnOpenCreateProductModal = document.getElementById('openCreateProductModal')
const btnCreateProduct = document.getElementById('btn-create-product')
const formCreateProduct = document.getElementById('form-create-product')

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

createNameInput.addEventListener('blur', () => validateInput(createNameInput, 'Tên sản phẩm không được để trống'));
createPurchasePriceInput.addEventListener('blur', () => validateInput(createPurchasePriceInput, 'Giá nhập không được để trống'));
createRetailPriceInput.addEventListener('blur', () => validateInput(createRetailPriceInput, 'Giá bán không được để trống'));
createStockQuantityInput.addEventListener('blur', () => validateInput(createStockQuantityInput, 'Số lượng trong kho không được để trống'));
createThumbnailInput.addEventListener('blur', () => validateInput(createThumbnailInput, 'Ảnh sản phẩm không được để trống'));

// Ẩn lỗi khi người dùng đang gõ
createNameInput.addEventListener('input', () => hideError(createNameInput));
createPurchasePriceInput.addEventListener('input', () => hideError(createPurchasePriceInput));
createRetailPriceInput.addEventListener('input', () => hideError(createRetailPriceInput));
createStockQuantityInput.addEventListener('input', () => hideError(createStockQuantityInput));
createThumbnailInput.addEventListener('input', () => hideError(createThumbnailInput));

// Validate fields
const validateCreateProductForm = () => {
    const isNameValid = validateInput(createNameInput, 'Tên sản phẩm không được để trống');
    const isPurchasePriceValid = validateInput(createPurchasePriceInput, 'Giá nhập không được để trống');
    const isRetailPriceValid = validateInput(createRetailPriceInput, 'Giá bán không được để trống');
    const isStockQuantityValid = validateInput(createStockQuantityInput, 'Số lượng trong kho không được để trống');
    const isThumbnailValid = validateInput(createThumbnailInput, 'Ảnh sản phẩm không được để trống');

    return isNameValid && isPurchasePriceValid && isRetailPriceValid && isStockQuantityValid && isThumbnailValid
};

// Handle Create product

btnOpenCreateProductModal.addEventListener('click', function (e) {
    const modalId = this.getAttribute('data-modal')
    const modal = document.getElementById(modalId)
    modal.classList.add('show')

    btnCreateProduct.addEventListener('click', async (e) => {
        const formData = new FormData(formCreateProduct);
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

const editNameInput = formEditProduct.querySelector("input[name='name'")
const editPurchasePriceInput = formEditProduct.querySelector("input[name='purchasePrice'")
const editRetailPriceInput = formEditProduct.querySelector("input[name='retailPrice'")
const editStockQuantityInput = formEditProduct.querySelector("input[name='stockQuantity'")
const editThumbnailInput = formEditProduct.querySelector("input[name='thumbnail'")
const editOldThumbnailInput = formEditProduct.querySelector("input[name='oldThumbnail'")
const editImageLabel = formEditProduct.querySelector('.image-label');
const editUploadText = formEditProduct.querySelector('.upload-text');

editNameInput.addEventListener('blur', () => validateInput(editNameInput, 'Tên sản phẩm không được để trống'));
editPurchasePriceInput.addEventListener('blur', () => validateInput(editPurchasePriceInput, 'Giá nhập không được để trống'));
editRetailPriceInput.addEventListener('blur', () => validateInput(editRetailPriceInput, 'Giá bán không được để trống'));
editStockQuantityInput.addEventListener('blur', () => validateInput(editStockQuantityInput, 'Số lượng trong kho không được để trống'));
editThumbnailInput.addEventListener('blur', () => validateInput(editThumbnailInput, 'Ảnh sản phẩm không được để trống'));

// Ẩn lỗi khi người dùng đang gõ
editNameInput.addEventListener('input', () => hideError(editNameInput));
editPurchasePriceInput.addEventListener('input', () => hideError(editPurchasePriceInput));
editRetailPriceInput.addEventListener('input', () => hideError(editRetailPriceInput));
editStockQuantityInput.addEventListener('input', () => hideError(editStockQuantityInput));
editThumbnailInput.addEventListener('input', () => hideError(editThumbnailInput));

// Validate fields
const validateEditProductForm = () => {
    const isNameValid = validateInput(editNameInput, 'Tên sản phẩm không được để trống');
    const isPurchasePriceValid = validateInput(editPurchasePriceInput, 'Giá nhập không được để trống');
    const isRetailPriceValid = validateInput(editRetailPriceInput, 'Giá bán không được để trống');
    const isStockQuantityValid = validateInput(editStockQuantityInput, 'Số lượng trong kho không được để trống');

    return isNameValid && isPurchasePriceValid && isRetailPriceValid && isStockQuantityValid
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
        renderModalData(response.data)
        const modal = document.getElementById(modalId)
        modal.classList.add('show')

        btnSaveProduct.addEventListener('click', async (e) => {
            const formData = new FormData(formEditProduct);
            const data = Object.fromEntries(formData.entries());
            console.log(data)
            if (validateEditProductForm()) {
                const response = await productService.updateProduct(productId, formData);
                console.log(response)
                if (response.success) {
                    alert(response.message)
                    window.location.reload()
                } else {
                    alert(response.message)
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
        const productId = this.getAttribute('data-product-id'); // Lấy productId
        const modal = document.getElementById('confirmRemoveProductModal');
        modal.setAttribute('data-product-id', productId);
        
        modal.classList.add('show');
    });
});

// Xử lý khi người dùng xác nhận xóa trong modal
const confirmDeleteBtn = document.querySelector('#btn-confirm-delete');

confirmDeleteBtn.addEventListener('click', function () {
    const modal = document.getElementById('confirmRemoveProductModal');
    const productId = modal.getAttribute('data-product-id');
    deleteProduct(productId);
    modal.classList.remove('show');
});

// Hàm giả định để xóa sản phẩm
function deleteProduct(productId) {
    console.log(`Xóa sản phẩm với ID: ${productId}`);
}


// =====================================================================
// =============================UPLOAD IMAGE PRODUCT============================
// =====================================================================
// Handle Upload file
const setupUploadFile = (form) => {
    const uploadInput = form.querySelector('.upload-product');
    console.log(uploadInput)
    const imageLabel = form.querySelector('.image-label');
    const uploadText = form.querySelector('.upload-text');

    // Xử lý sự kiện thay đổi file
    const handleFileUpload = (file) => {
        if (file) {
            const reader = new FileReader();

            // Đọc file dưới dạng DataURL (base64)
            reader.readAsDataURL(file);

            reader.onload = function (e) {
                // Xóa nội dung text trong label
                uploadText.style.display = 'none';

                // Nếu đã có ảnh cũ thì xóa ảnh cũ trước khi thêm ảnh mới
                const oldImage = form.querySelector('.image-label img');
                if (oldImage) {
                    oldImage.remove();
                }

                // Tạo thẻ img để chứa ảnh và gắn vào label
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = 'Uploaded Image';
                img.classList.add('max-w-full', 'h-32', 'object-cover');
                imageLabel.appendChild(img);
            };
        }
    };

    // Sự kiện khi chọn file
    uploadInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        handleFileUpload(file);
    });

    // Sự kiện kéo thả
    imageLabel.addEventListener('dragover', function (event) {
        event.preventDefault(); // Ngăn chặn hành vi mặc định
        event.stopPropagation();
        imageLabel.classList.add('border-orange-500'); // Thay đổi kiểu để cho biết khu vực có thể thả
    });

    imageLabel.addEventListener('dragleave', function (event) {
        event.preventDefault();
        event.stopPropagation();
        imageLabel.classList.remove('border-orange-500'); // Khôi phục kiểu khi rời khỏi khu vực
    });

    imageLabel.addEventListener('drop', function (event) {
        event.preventDefault();
        event.stopPropagation();
        imageLabel.classList.remove('border-orange-500'); // Khôi phục kiểu sau khi thả

        const files = event.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]); // Gọi hàm upload với file được thả
        }
    });
}



// Áp dụng cho tất cả dropdown trong cả hai form
document.querySelectorAll('.form-product').forEach(form => {
    setupUploadFile(form)
});


