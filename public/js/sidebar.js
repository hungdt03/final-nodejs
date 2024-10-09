const btnOpenConfirmLogout = document.getElementById('btnOpenConfirmLogout')

btnOpenConfirmLogout.addEventListener('click', function(e) {
    const modalId = this.getAttribute('data-modal')
    const modal = document.getElementById(modalId)
    modal.classList.add('show')
})