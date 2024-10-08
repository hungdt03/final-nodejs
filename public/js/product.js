// DOM related to Create Product
const btnOpenCreateProductModal = document.getElementById('openCreateProductModal')
const btnCreateProduct = document.getElementById('btn-create-product')
const formCreateProduct = document.getElementById('form-create-product')

const btnOpenEditProductModal = document.getElementById('openEditProductModal')
const btnSaveProduct = document.getElementById('btn-save-product')
const formEditProduct = document.getElementById('form-edit-product')

// Handle Create product

btnOpenCreateProductModal.addEventListener('click', function (e) {
    const modalId = this.getAttribute('data-modal')
    const modal = document.getElementById(modalId)
    modal.classList.add('show')

    btnCreateProduct.addEventListener('click', (e) => {
        const formData = new FormData(formCreateProduct);
        const data = Object.fromEntries(formData.entries());
        console.log(data)
    })
})


// Handle Edit product

btnOpenEditProductModal.addEventListener('click', function (e) {
    const modalId = this.getAttribute('data-modal')
    const modal = document.getElementById(modalId)
    modal.classList.add('show')

    btnSaveProduct.addEventListener('click', (e) => {
        const formData = new FormData(formEditProduct);
        const data = Object.fromEntries(formData.entries());
        console.log(data)
    })
})



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

// Handle Upload file
const setupUploadFile = (form) => {
    const uploadInput = form.querySelector('.upload-product');
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


// function setupCustomDropdown(form) {
//     const dropdown = form.querySelector('.custom-dropdown');
//     const dropdownLabelWrapper = form.querySelector('.dropdown-label-wrapper');
//     const dropdownLabelText = form.querySelector('.dropdown-label');
//     const dropdownOptions = form.querySelector('.dropdown-options');
//     const dropdownInput = form.querySelector('input[name="categoryId"]');
//     const options = form.querySelectorAll('.dropdown-option');

//     // Hiển thị/Ẩn các tùy chọn khi nhấn vào label
//     dropdownLabelWrapper.addEventListener('click', () => {
//         dropdownOptions.style.display = dropdownOptions.style.display === 'block' ? 'none' : 'block';
//     });

//     // Xử lý sự kiện chọn tùy chọn
//     options.forEach(option => {
//         option.addEventListener('click', () => {
//             dropdownLabelText.innerHTML = option.textContent; // Cập nhật nhãn
//             dropdownInput.value = option.getAttribute('data-value'); // Cập nhật giá trị ẩn
//             options.forEach(opt => opt.classList.remove('selected')); // Bỏ lớp đã chọn cũ
//             option.classList.add('selected'); // Thêm lớp cho tùy chọn đã chọn
//             dropdownOptions.style.display = 'none'; // Ẩn tùy chọn
//         });
//     });

//     // Đóng dropdown nếu click bên ngoài
//     window.addEventListener('click', (e) => {
//         if (!dropdown.contains(e.target)) {
//             dropdownOptions.style.display = 'none';
//         }
//     });
// }

// // Áp dụng cho tất cả dropdown trong cả hai form
document.querySelectorAll('.form-product').forEach(form => {
    // setupCustomDropdown(form)
    setupUploadFile(form)
});


