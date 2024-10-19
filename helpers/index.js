module.exports = {
    eq: function (a, b) {
        return a == b;
    },
    notEq: function (a, b) {
        return a !== b;
    },
    add: function (value, addition) {
        return value + addition;
    },
    gt: function (a, b) {
        return a > b;
    },
    lt: function (a, b) {
        return a < b;
    },
    subtract: function (value, subtraction) {
        return value - subtraction;
    },
    paginationPages: function (currentPage, totalPages, options) {
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);
        let result = '';

        for (let i = startPage; i <= endPage; i++) {
            result += options.fn(i);
        }

        return result;
    }
};