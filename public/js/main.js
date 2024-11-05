import { addItemToCart } from "./cart.js";
import productService from "./services/product-service.js";

// Handle Search Product In Sale Page
const inputSearchProduct = document.getElementById('input-search-product')
const searchResultWrapper = document.getElementById('search-result-wrapper')
const searchResultList = document.getElementById('search-result-list')
const searchResultTitle = document.getElementById('search-result-title')

inputSearchProduct.addEventListener('focus', function () {
    const query = inputSearchProduct.value.trim();
    if (query.length > 0) {
        searchResultWrapper.classList.remove('hidden');
        searchResultWrapper.classList.add('flex');
    } else {
        searchResultWrapper.classList.add('hidden');
        searchResultWrapper.classList.remove('flex');
    }
});


inputSearchProduct.addEventListener('input', function () {
    const query = inputSearchProduct.value.trim();
    if (query.length > 0) {
        searchResultWrapper.classList.remove('hidden');
        searchResultWrapper.classList.add('flex');

        searchProducts(query)
    } else {
        searchResultWrapper.classList.add('hidden');
        searchResultWrapper.classList.remove('flex');
    }
});

const formatCurrencyVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const searchProducts = async (query) => {
    const response = await productService.searchProducts(query);
    console.log(response)
    if (response.success) {
        renderSearchResult(response.data, query)
    }
}

window.handleAddCart = (productId) => {
    addItemToCart(productId, 1)
};

const renderSearchResult = (data, query) => {
    if(data.length === 0) {
        searchResultTitle.innerHTML = `Không tìm thấy kết quả nào cho <b>${query}</b>`
        searchResultList.innerHTML = '';
        return;
    }
    const html = data.map(item => {
        return `
            <div id="product-row" data-id="${item.id}" onclick="handleAddCart('${item.id}')"
                class="flex items-center gap-x-3 w-full hover:bg-orange-50 cursor-pointer rounded-lg py-4 px-3">

                <img class="rounded-lg object-cover w-[50px] h-[50px]" 
                    src="/images/product/${item.thumbnail}" />
                <div class="flex flex-col gap-y-2 flex-1">
                    <p class="text-sm font-medium">${item.name}</p>
                    <div class="flex items-center gap-x-5 justify-between">
                        <p class="text-[14px] font-semibold text-primary">${formatCurrencyVND(item.retailPrice)}</p>
                    </div>
                </div>
            </div>
        `
    }).join('')

    searchResultTitle.innerHTML = `Tìm thấy cho <b>${data.length}</b> kết quả cho <b>${query}</b>`
    searchResultList.innerHTML = html;
}



document.addEventListener('click', function (event) {
    const isClickInside = inputSearchProduct.contains(event.target) || searchResultWrapper.contains(event.target);

    if (!isClickInside) {
        searchResultWrapper.classList.add('hidden');
        searchResultWrapper.classList.remove('flex');
    }
});
