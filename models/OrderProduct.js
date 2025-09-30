import { DataTypes } from 'sequelize';
import sequelize from '../config/dataBase.js';

const OrderProduct = sequelize.define('OrderProduct', {
  orderId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'orders',
      key: 'id',
    },
    primaryKey: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'products',
      key: 'id',
    },
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'order_products',
  timestamps: false,
});

export default OrderProduct;