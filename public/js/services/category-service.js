// CALL CATEGORY API
const categoryService = {
    getAll: async () => {
        const response = await fetch('/categories/api');
        const data = await response.json();
        return data
    },
    createCategory: async (payload) => {
        const response = await fetch('/categories/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json()
        return data;
    },
    updateCategory: async (id, payload) => {
        const response = await fetch('/categories/api/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json()
        return data;
    },
    getCategoryById: async (id) => {
        const response = await fetch('/categories/api/' + id);
        const data = await response.json();
        return data;
    },
    deleteCategoryById: async (id) => {
        const response = await fetch('/categories/api/' + id, {
            method: 'DELETE'
        })

        const data = await response.json()
        return data;
    },
    searchCategory: async (query) => {
        const response = await fetch('/categories/api/search?search=' + encodeURIComponent(query));
        const data = await response.json();
        return data
    }
}

export default categoryService;