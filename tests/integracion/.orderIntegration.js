import request from "supertest";
import app from "../../app.js";

describe("Integración Orders - Customers - Products", () => {
  let customerId;
  let productId;
  let orderId;

  // 1. Crear un cliente
  /*it("debería crear un cliente", async () => {
    const res = await request(app).post("/customers").send({
      name: "Carlos",
      last_name: "Pérez",
      ci: "87654321",
    });
    console.log('POST /customers - crear cliente:', res.body);
    expect(res.body.code).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    customerId = res.body.data.id;
  });

  // 2. Crear un producto
  it("debería crear un producto", async () => {
    const res = await request(app).post("/products").send({
      name: "Celular Samsung",
      description: "Gama alta",
      price: 1500,
    });

    console.log('POST /products - crear producto:', res.body);
    expect(res.body.code).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    productId = res.body.data.id;
  });

  // 3. Crear un pedido asociado al cliente
  it("debería crear un pedido", async () => {
    const res = await request(app).post("/orders").send({
      customerId,
      totalAmount: 1500,
      status: 1,
      products: [
        { productId, quantity: 2 }, // 👈 va a la tabla pivote
      ],
    });
    console.log('POST /orders - crear pedido:', res.body);
    expect(res.body.code).toBe(201);
    expect(res.body.data).toHaveProperty("id");
    orderId = res.body.data.id;
  }); */

  // 4. Obtener el pedido y verificar integraciones
  /*it("debería obtener el pedido con cliente y productos", async () => {
    const res = await request(app).get(`/orders/${orderId}`);
    console.log("GET /orders/:id - obtener pedido:", res.body);
    expect(res.body.code).toBe(200);
    expect(res.body.data).toHaveProperty("customer");
    expect(res.body.data.customer.id).toBe(customerId);
    // expect(res.body.data.products[0].id).toBe(productId);
    // expect(res.body.data.products[0].OrderProduct.quantity).toBe(2);
  }); */
});
