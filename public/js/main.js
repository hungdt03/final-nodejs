// // Handle Search Product In Sale Page
// const inputSearchProduct = document.getElementById('input-search-product')
// const searchResultWrapper = document.getElementById('search-result-wrapper')

// inputSearchProduct.addEventListener('focus', function() {
//     const query = inputSearchProduct.value.trim();
//     if (query.length > 0) {
//         searchResultWrapper.classList.remove('hidden');
//         searchResultWrapper.classList.add('flex');
//     } else {
//         searchResultWrapper.classList.add('hidden');
//         searchResultWrapper.classList.remove('flex');
//     }
// });


// inputSearchProduct.addEventListener('input', function() {
//     const query = inputSearchProduct.value.trim();
//     if (query.length > 0) {
//         searchResultWrapper.classList.remove('hidden');
//         searchResultWrapper.classList.add('flex');
//     } else {
//         searchResultWrapper.classList.add('hidden');
//         searchResultWrapper.classList.remove('flex');
//     }
// });

// document.addEventListener('click', function(event) {
//     const isClickInside = inputSearchProduct.contains(event.target) || searchResultWrapper.contains(event.target);
    
//     if (!isClickInside) {
//         searchResultWrapper.classList.add('hidden');
//         searchResultWrapper.classList.remove('flex');
//     }
// });
