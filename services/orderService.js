// services/orderService.js
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Customer from "../models/Customer.js";

const getOrders = async () => {
 
  const ordersList = await Order.findAll({
    include: [
      {
        model: Product,
        as: "products",
        through: {
          attributes: ["quantity"],
        },
      },
      {
        model: Customer, 
        as: "customer",
        attributes: ["id", "ci", "name", "last_name", "number"], 
      },
    ],
  });

  return ordersList;
};

const createOrder = async (orderData) => {
  const { customerId, products } = orderData;

  const customer = await Customer.findByPk(customerId);
  if (!customer) {
    throw new Error(`Cliente con id ${customerId} no encontrado`);
  }

  let totalAmount = 0;
  for (const { productId, quantity } of products) {
    const product = await Product.findByPk(productId);
    if (!product) {
      throw new Error(`Libro con id ${productId} no encontrado`);
    }
    totalAmount += product.price * quantity;
  }


  const order = await Order.create({
    customerId,
    totalAmount,
  });


  for (const { productId, quantity } of products) {
    await order.addProduct(productId, {
      through: { quantity },
    });
  }

  const orderWithProducts = await Order.findByPk(order.id, {
    include: [
      {
        model: Product,
        as: "products",
        through: {
          attributes: ["quantity"], 
        },
      },
    ],
  });

  return orderWithProducts;
};


const getOrderById = async (orderId) => {
  const order = await Order.findByPk(orderId, {
    include: [
      {
        model: Product,
        as: "products",
        through: {
          attributes: ["quantity"], 
        },
      },
      {
        model: Customer,
        as: "customer",
        attributes: ["id", "ci", "name", "last_name", "number"],
      },
    ],
  });

  return order;
};

export { createOrder, getOrders, getOrderById };
