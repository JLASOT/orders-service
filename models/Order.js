import { DataTypes } from "sequelize";
import sequelize from "../config/dataBase.js";


const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  customerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "customers",
      key: "id",
    },
  },
}, {
  tableName: "orders",
  timestamps: true,
});

// Relaciones
// Order.belongsToMany(Product, {
//   through: OrderProduct,  // 👈 pasamos el modelo
//   as: "products",
//   foreignKey: "orderId",
//   otherKey: "productId"
// });

// Product.belongsToMany(Order, {
//   through: OrderProduct,
//   as: "orders",
//   foreignKey: "productId",
//   otherKey: "orderId"
// });

// 1:N: Un cliente tiene muchas órdenes
// Customer.hasMany(Order, {
//   foreignKey: "customerId",
//   as: "orders",
// });

// N:1: Una orden pertenece a un cliente
// Order.belongsTo(Customer, {
//   foreignKey: "customerId",
//   as: "customer",
// });

export default Order;
