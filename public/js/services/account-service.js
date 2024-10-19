const accountService = {
    createAccount: async (payload) => {
        const response = await fetch('/users/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        const data = await response.json();
        return data
        
    }
}

export default accountService;