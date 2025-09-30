// models/index.js
import Product from './Product.js';
import Order from './Order.js';
import OrderProduct from './OrderProduct.js';
import Customer from './Customer.js';

// 🟢 Relación muchos a muchos (Orders - Products)
Order.belongsToMany(Product, {
  through: OrderProduct,
  foreignKey: 'orderId',
  otherKey: 'productId',
  as: 'products',
});

Product.belongsToMany(Order, {
  through: OrderProduct,
  foreignKey: 'productId',
  otherKey: 'orderId',
  as: 'orders',
});

// 🟢 Relación 1:N (Customer - Orders)
Customer.hasMany(Order, {
  foreignKey: 'customerId',
  as: 'orders',
});

Order.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer',
});

// 🟢 Relaciones de la tabla pivote
OrderProduct.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order'
});

OrderProduct.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});

export default { Product, Order, OrderProduct, Customer };