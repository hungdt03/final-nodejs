
const cartService = {
    getCartSession: async () => {
        const response = await fetch('/carts/api');
        const data = await response.json();
        return data;
    },
    addToCart: async (payload) => {
        const response = await fetch('/carts/api/add', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json' 
            }
        });

        const data = await response.json();
        return data;
    },
    addProductByBarCode: async (payload) => {
        const response = await fetch('/carts/api/add-barcode', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json' 
            }
        });

        const data = await response.json();
        return data;
    },
    updateCart: async (payload) => {
        const response = await fetch('/carts/api/update', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json' 
            }
        });

        const data = await response.json();
        return data;
    },
    removeCartItem: async (productId) => {
        const response = await fetch('/carts/api/' + productId, {
            method: 'DELETE'
        })

        const data = await response.json();
        return data;
    }
}

export default cartService;