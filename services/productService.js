import Product from "../models/Product.js";

const getProducts = async () => {
    const products = await Product.findAll();
    return products;
};

const createProduct = async (productData) => {
    const product = await Product.create(productData);
    return product;
};

const getProductById = async (id) => {
    const product = await Product.findByPk(id);
    return product;
}
export { createProduct, getProducts, getProductById };