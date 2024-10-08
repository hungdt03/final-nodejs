const btnOpenCreateEmployeeModal = document.getElementById('openCreateEmployeeModal')
const btnCreateEmployee = document.getElementById('btn-create-employee')
const formCreateEmployee = document.getElementById('form-create-employee')

// Handle Create Employee
btnOpenCreateEmployeeModal.addEventListener('click', function (e) {
    const modalId = this.getAttribute('data-modal')
    const modal = document.getElementById(modalId)
    modal.classList.add('show')

    // btnCreateEmployee.addEventListener('click', (e) => {
    //     const formData = new FormData(formCreateEmployee);
    //     const data = Object.fromEntries(formData.entries());
    //     console.log(data)
    // })
})
