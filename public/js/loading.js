const loading = document.getElementById('loading');

export const showLoading = () => {
    loading.classList.remove('hidden')
}

export const hideLoading = () => {
    loading.classList.add('hidden')
}

