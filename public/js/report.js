const fromDateInput = document.getElementById('from-date');
const toDateInput = document.getElementById('to-date');

fromDateInput.onblur = () => {
    if (fromDateInput.value) {
        fromDateInput.classList.remove('bg-slate-100')
        fromDateInput.classList.add('bg-orange-50')
        fromDateInput.classList.add('text-primary')
    } else {
        fromDateInput.classList.add('bg-slate-100')
        fromDateInput.classList.remove('bg-orange-50')
        fromDateInput.classList.remove('text-primary')
    }
}

toDateInput.onblur = () => {
    if (toDateInput.value) {
        toDateInput.classList.remove('bg-slate-100')
        toDateInput.classList.add('bg-orange-50')
        toDateInput.classList.add('text-primary')
    } else {
        toDateInput.classList.add('bg-slate-100')
        toDateInput.classList.remove('bg-orange-50')
        toDateInput.classList.remove('text-primary')
    }
}

fromDateInput.oninput = () => {
    fromDateInput.classList.remove('bg-slate-100')
    fromDateInput.classList.add('bg-orange-50')
    fromDateInput.classList.add('text-primary')
}

toDateInput.oninput = () => {
    toDateInput.classList.remove('bg-slate-100')
    toDateInput.classList.add('bg-orange-50')
    toDateInput.classList.add('text-primary')
}

toDateInput.onchange = () => {
    if (!fromDateInput.value) {
        return;
    } else {
        window.location.href = '/report/?from=' + fromDateInput.value + '&end=' + toDateInput.value;
    }
};

fromDateInput.onchange = () => {
    if (toDateInput.value) {
        window.location.href = '/report/?from=' + fromDateInput.value + '&end=' + toDateInput.value;
    }
};

// HANDLE OPEN MODAL SHOW PRODUCTS
const btnShowModalProducts = document.getElementById('btnShowModalProducts');

btnShowModalProducts.addEventListener('click', function(e) {
    const modalId = this.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    modal.classList.add('show')
})