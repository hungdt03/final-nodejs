import cartService from "./services/cart-service.js";

const cartBtnProducts = document.querySelectorAll('.cart-product');
const cartArea = document.getElementById('cart-area')
const cartCount = document.getElementById('cart-count')
const totalMoneyTag = document.getElementById('total-money')
const btnCheckout = document.getElementById('btn-checkout')
const formatCurrencyVND = (amount) => {
    const formattedAmount = new Intl.NumberFormat('vi-VN').format(amount);
    return `${formattedAmount} VNĐ`;
};

const renderCart = (data) => {
    let html = `<div class="flex flex-col gap-y-4 items-center justify-center">
        <img width="60%" src="/images/system/empty-cart.png" />
    </div>`
    btnCheckout.classList.add('hidden')

    if (data.length > 0) {
        html = data.map(item => `
        <div id="product-row"
            class="relative flex items-start gap-x-3 w-full hover:bg-orange-50 cursor-pointer rounded-lg py-4 px-3">
            <img class="rounded-lg object-cover w-[50px] h-[50px]"
                src="/images/product/${item.product.thumbnail}" />
            <div class="flex flex-col gap-y-2 flex-1">
                <p class="text-sm font-medium">${item.product.name}</p>
                <div class="flex items-center gap-x-5 justify-between">
                    <div class="flex items-center gap-x-1">
                        <p class="text-[14px] font-semibold text-primary">${formatCurrencyVND(item.product.retailPrice)}</p>
                        x
                        <span class="text-gray-400">${item.quantity}</span>
                    </div>
                    <div class="flex items-center gap-x-2">
                        <a href="#" data-id="${item.product._id}" class="qty-minus bg-white border-[1px] border-primary p-[3px] rounded-lg flex justify-center">
                            <i class="ti-minus text-primary"></i> 
                        </a>
                        <input value="${item.quantity}" data-id="${item.product._id}" type="number" class="quantity-input text-center w-8 px-1 py-[4px] outline-none border-[1px] rounded-md border-primary" />
                        <a href="#" data-id="${item.product._id}" class="qty-plus bg-white border-[1px] border-primary p-[3px] rounded-lg flex justify-center">
                            <i class="ti-plus text-primary"></i> 
                        </a>
                    </div>
                </div>
            </div>
            <button id="btn-trash" data-id="${item.product._id}"  class="btn-remove-cart-item border-[1px] bg-red-600 border-red-600 p-[2px] rounded-lg flex justify-center">
                <i class="ti-close text-white text-xs w-4 h-4"></i> 
            </button>  
         </div>
    `).join('')
        btnCheckout.classList.remove('hidden')
    }

    let itemCount = data.length;
    let tmp = 0;
    data.forEach(items => {
        let quantities = items.quantity;
        tmp += items.quantity
    });
    cartCount.innerHTML = tmp
    cartArea.innerHTML = html;
    totalMoneyTag.innerHTML = formatCurrencyVND(data.reduce((acc, cur) => acc + Number(cur.subTotal), 0));

    const buttons = document.querySelectorAll('.btn-remove-cart-item');
    buttons.forEach(button => {
        button.onclick = () => removeCartItem(button.getAttribute('data-id'));
    });

    const quantityInputs = document.querySelectorAll('.quantity-input')
    quantityInputs.forEach(qty => {
        qty.addEventListener('change', function (e) {
            const productId = this.getAttribute('data-id');
            updateCart(productId, parseInt(e.target.value))
        })
    })

    const btnMinuses = document.querySelectorAll('.qty-minus')
    const btnPluses = document.querySelectorAll('.qty-plus')

    btnMinuses.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const value = parseInt(this.nextElementSibling.value);
            if (value === 1)
                return;
            const productId = this.getAttribute('data-id');
            updateCart(productId, value - 1)
        })
    })

    btnPluses.forEach(btn => {
        btn.addEventListener('click', function (e) {
            const value = parseInt(this.previousElementSibling.value);
            const productId = this.getAttribute('data-id');
            updateCart(productId, value + 1)
        })
    })
}

const loadCart = async () => {
    const response = await cartService.getCartSession();
    renderCart(response.cart)
}

const addItemToCart = async (productId, quantity) => {
    const response = await cartService.addToCart({
        productId, quantity
    });

    if (response.success) {
        loadCart()
    } else alert(response.message)
}

const updateCart = async (productId, quantity) => {
    const response = await cartService.updateCart({
        productId, quantity
    });

    if (response.success) {
        loadCart()
    } else alert(response.message)
}

const removeCartItem = async (productId) => {
    const response = await cartService.removeCartItem(productId);
    if (response.success) {
        loadCart()
    } else {
        alert(response.message)
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadCart()
});

cartBtnProducts.forEach(btn => {
    btn.addEventListener('click', function (e) {
        const productId = this.getAttribute('data-id')
        addItemToCart(productId, 1)
    })
})

export { addItemToCart, renderCart }

