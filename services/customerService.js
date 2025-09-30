import Customer from "../models/Customer.js";

const getCustomers = async () => {
    const customer = await Customer.findAll();
    return customer;
};

const createCustomer = async (customerData) => {
    const customer = await Customer.create(customerData);
    return customer;
};

const getCustomerById = async (id) => {
    const customer = await Customer.findByPk(id);
    return customer;
}
export { createCustomer, getCustomers, getCustomerById };