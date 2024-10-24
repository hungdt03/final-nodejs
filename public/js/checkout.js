import customerService from "./services/customer-service.js";

const inputPhoneNumber = document.getElementById('input-phoneNumber');
const inputName = document.getElementById('input-name');
const inputAddress = document.getElementById('input-address');
const alertWarning = document.getElementById('alert-warning')

const givenAmountInput = document.querySelector('input[name="givenAmount"]');
const refundAmount = document.querySelector('input[name="refundAmount"]');
const totalAmount = document.querySelector('input[name="totalAmount"]');
const refundAmountTag = document.getElementById('refund-amount')

givenAmountInput.addEventListener('input', function(e) {
    refundAmount.value = Number(e.target.value) - Number(totalAmount.value)
    refundAmountTag.innerHTML = Number(e.target.value) - Number(totalAmount.value)
})

inputPhoneNumber.addEventListener('input', function(e) {
    loadCustomerInfo(e.target.value)
})

const loadCustomerInfo = async (phoneNumber) => {
    const response = await customerService.findCustomer(phoneNumber);
    console.log(response)
    if(response.success) {
        inputPhoneNumber.value = response.data.phoneNumber;
        inputName.value = response.data.fullName;
        inputAddress.value = response.data.address;
        alertWarning.classList.add('hidden')
    } else {
        alertWarning.classList.remove('hidden')
    }
}