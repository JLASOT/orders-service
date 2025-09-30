import { Sequelize } from "sequelize";

// const sequelize = new Sequelize("orders", "orders_user", "orders_pass", {
// const sequelize = new Sequelize("orders", "root", "Soto123", {
//   host: "127.0.0.1", // <--- ¡CAMBIA ESTO! Usa la dirección IPv4 de localhost
//   dialect: "mysql",
// });
// export default sequelize;

const sequelize = new Sequelize(
  process.env.DB_NAME || "freedb_orders",
  process.env.DB_USER || "freedb_Dev003",
  process.env.DB_PASSWORD || "q3&sjmFT8f8QhB9",
  {
    host: process.env.DB_HOST || "sql.freedb.tech",
    port: 3306,
    dialect: "mysql",
  }
);

export default sequelize;
