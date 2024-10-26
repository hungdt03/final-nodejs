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
        alert('Chưa chọn ngày bắt đầu');
    } else {
        const fromDate = new Date(fromDateInput.value);
        const toDate = new Date(toDateInput.value);

        if (fromDate > toDate) {
            alert('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
        } else {
            window.location.href = '/report/?from=' + fromDateInput.value + '&end=' + toDateInput.value;
        }
    }
};