const formatCurrencyVND = (amount) => {
    const formattedAmount = new Intl.NumberFormat('vi-VN').format(amount);
    return `${formattedAmount} VNĐ`;
};

module.exports = { formatCurrencyVND };