import { showLoading, hideLoading } from "./loading.js";
import accountService from "./services/account-service.js"

const btnOpenCreateEmployeeModal = document.getElementById('openCreateEmployeeModal')
const btnCreateEmployee = document.getElementById('btn-create-employee')
const formCreateEmployee = document.getElementById('form-create-employee')

const nameInput = formCreateEmployee.querySelector("input[name='fullName'")
const emailInput = formCreateEmployee.querySelector("input[name='email'")

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

nameInput.addEventListener('blur', () => validateInput(nameInput, 'Tên nhân viên không được để trống'));
emailInput.addEventListener('blur', () => validateInput(emailInput, 'Địa chỉ email không được để trống'));

// Ẩn lỗi khi người dùng đang gõ
nameInput.addEventListener('input', () => hideError(nameInput));
emailInput.addEventListener('input', () => hideError(emailInput));

const validateForm = () => {
    const isValidName = validateInput(nameInput, 'Tên nhân viên không được để trống');
    const isValidEmail = validateInput(emailInput, 'Địa chỉ email không được để trống');

    return isValidName && isValidEmail
}

// Handle Create Employee
btnOpenCreateEmployeeModal.addEventListener('click', function (e) {
    const modalId = this.getAttribute('data-modal')
    const modal = document.getElementById(modalId)
    modal.classList.add('show')

    btnCreateEmployee.addEventListener('click', async (e) => {
        if (validateForm()) {
            const formData = new FormData(formCreateEmployee);
            const data = Object.fromEntries(formData.entries());
            showLoading()
            const response = await accountService.createAccount(data)
            hideLoading()
            if(response.success) {
                window.location.reload()
            } else {
                console.log(response.message)
                window.location.reload()
            }
        }

    })
})
