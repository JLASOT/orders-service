// // app.js
// import express from "express";
// import customerRoutes from "./routes/customerRoutes.js";

// const app = express();

// app.use(express.json());
// app.use("/customers", customerRoutes);

// export default app;

// app.js
import express from "express";
import cors from "cors";
import productRoutes from "./routes/products.js";
import orederRoutes from "./routes/ordersRutes.js";
import customerRoutes from "./routes/customer.js";
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf8'));

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/", (req, res) => {
  res.send("HOLA GRUPO ");
});

app.use("/products", productRoutes);
app.use("/orders", orederRoutes);
app.use("/customers", customerRoutes);

export default app;
