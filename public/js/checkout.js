import customerService from "./services/customer-service.js";

const formatCurrencyVND = (amount) => {
    const formattedAmount = new Intl.NumberFormat('vi-VN').format(amount);
    return `${formattedAmount} VNĐ`;
};


const inputPhoneNumber = document.getElementById('input-phoneNumber');
const inputName = document.getElementById('input-name');
const inputAddress = document.getElementById('input-address');
const alertWarning = document.getElementById('alert-warning')

const givenAmountInput = document.querySelector('input[name="givenAmount"]');
const refundAmount = document.querySelector('input[name="refundAmount"]');
const totalAmount = document.querySelector('input[name="totalAmount"]');
const refundAmountTag = document.getElementById('refund-amount')

givenAmountInput.addEventListener('input', function(e) {
    const refundValue = Number(e.target.value) - Number(totalAmount.getAttribute('data-amount'))
    refundAmount.value = refundValue
    refundAmountTag.innerHTML = formatCurrencyVND(refundValue)
})

inputPhoneNumber.addEventListener('input', function(e) {
    loadCustomerInfo(e.target.value)
})

const loadCustomerInfo = async (phoneNumber) => {
    const response = await customerService.findCustomer(phoneNumber);
    if(response.success) {
        inputPhoneNumber.value = response.data.phoneNumber;
        inputName.value = response.data.fullName;
        inputAddress.value = response.data.address;
        alertWarning.classList.add('hidden')
    } else {
        alertWarning.classList.remove('hidden')
    }
}

