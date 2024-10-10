const formatCurrencyVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

module.exports = { formatCurrencyVND }