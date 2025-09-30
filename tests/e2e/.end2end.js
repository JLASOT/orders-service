// tests/e2e/system.e2e.test.js
import request from "supertest";
import app from "../../app.js";

describe("Flujo E2E: Cliente compra producto", () => {
  let customerId;
  let productId;
  let orderId;

  // 1️⃣ Crear cliente
  /*it("debería crear un cliente", async () => {
    const res = await request(app)
      .post("/customers")
      .send({ name: "Pedro E2E", last_name: "Vargas E2E", ci: "12345678"});
    console.log("customer peticion",res.body);
    expect(res.body.code).toBe(201);
    expect(res.body.data).toHaveProperty("id");

    customerId = res.body.data.id;
  });

  // 2️⃣ Crear producto
  it("debería crear un producto", async () => {
    const res = await request(app)
      .post("/products")
      .send({ name: "Producto E2E", description:"Descripción del producto E2E", price: 50});
    console.log("producto peticion",res.body);
    expect(res.body.code).toBe(201);
    expect(res.body.data).toHaveProperty("id");

    productId = res.body.data.id;
  });

  // 3️⃣ Crear un pedido con el cliente y producto
  it("debería crear un pedido", async () => {
    const res = await request(app)
      .post("/orders")
      .send({
        customerId,
        products: [{ productId, quantity: 2 }], // 👈 aquí el cambio
      });

    console.log("order peticion", res.body);

    expect(res.body.code).toBe(201);              // si tu API responde con { code, message, data }
    expect(res.body.data).toHaveProperty("id");   // verificamos dentro de data

    orderId = res.body.data.id;
    console.log("orderId peticion 1", orderId);
  }); */

  // // 4️⃣ Consultar el pedido y verificar datos
  /*it("debería obtener el pedido con cliente y producto", async () => {
    console.log("orderId peticion 2", orderId);
    const res = await request(app).get(`/orders/${orderId}`);

    console.log("order detalle", res.body);
    expect(res.body.code).toBe(200);
    expect(res.body.data.customer.id).toBe(customerId);
    // expect(res.body.data.products[0].id).toBe(productId);
    // expect(res.body.data.products[0].OrderProduct.quantity).toBe(2);
  }); */
});
