// CALL PRODUCT API
const productService = {
    createProduct: async (formData) => {
        const response = await fetch('/products/api', {
            method: 'POST',
            body: formData
        });

        const data = await response.json()
        return data;
    },
    updateProduct: async (id, formData) => {
        const response = await fetch('/products/api/' + id, {
            method: 'PUT',
            body: formData
        });

        const data = await response.json()
        return data;
    },
    getProductById: async (id) => {
        const response = await fetch('/products/api/' + id);
        const data = await response.json();
        return data;
    },
    deleteProductById: async (id) => {
        const response = await fetch('/products/api/' + id, {
            method: 'DELETE'
        })

        const data = await response.json()
        return data;
    }
}

export default productService;