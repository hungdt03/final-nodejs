const customerService = {
    findCustomer: async (phoneNunber) => {
        const response = await fetch('/customers/api/phone-number/' + phoneNunber);
        const data = await response.json();
        return data;
    }
}

export default customerService;