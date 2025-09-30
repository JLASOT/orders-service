import request from "supertest";
import app from "../../app.js"; // tu instancia principal de express
import { testErrorLogger } from "../../utils/testUtils.js"; // si usas tu logger de errores

describe("Orders API", () => {
  test("debe listar todas las órdenes (GET /orders)", async () => {
    try {
      const res = await request(app).get("/orders");
      console.log("GET /orders - listar órdenes marck:", res.body);
      expect(res.body.code).toBe(200);
      expect(res.body).toHaveProperty("success", true);
      expect(Array.isArray(res.body.data)).toBe(true);
    } catch (error) {
      testErrorLogger.addError("GET /orders - listar órdenes", error);
      throw error;
    }
  });

  // test("debe crear una orden (POST /orders)", async () => {
  //   try {
  //     const newOrder = {
  //       customerId: "uuid-cliente-existente",
  //       total: 250.5,
  //       status: "pending",
  //     };

  //     const res = await request(app).post("/orders").send(newOrder);

  //     expect(res.statusCode).toBe(201);
  //     expect(res.body).toHaveProperty("success", true);
  //     expect(res.body.data).toHaveProperty("id");
  //     expect(res.body.data).toHaveProperty("status", "pending");
  //   } catch (error) {
  //     testErrorLogger.addError("POST /orders - crear orden", error);
  //     throw error;
  //   }
  // });

  // test("debe obtener una orden por ID válido (GET /orders/:id)", async () => {
  //   try {
  //     // crea una orden primero (setup)
  //     const newOrder = {
  //       customerId: "uuid-cliente-existente",
  //       total: 100,
  //       status: "pending",
  //     };
  //     const createRes = await request(app).post("/orders").send(newOrder);
  //     const orderId = createRes.body.data.id;

  //     const res = await request(app).get(`/orders/${orderId}`);

  //     expect(res.statusCode).toBe(200);
  //     expect(res.body).toHaveProperty("success", true);
  //     expect(res.body.data).toHaveProperty("id", orderId);
  //   } catch (error) {
  //     testErrorLogger.addError("GET /orders/:id - orden válida", error);
  //     throw error;
  //   }
  // });

  // test("debe manejar error cuando la orden no existe (GET /orders/:id)", async () => {
  //   try {
  //     const nonExistentId = "99999999-9999-9999-9999-999999999999";
  //     const res = await request(app).get(`/orders/${nonExistentId}`);

  //     expect(res.statusCode).toBe(404);
  //     expect(res.body).toHaveProperty("success", false);
  //     expect(res.body).toHaveProperty("message", "Orden no encontrada");
  //   } catch (error) {
  //     testErrorLogger.addError("GET /orders/:id - orden no existe", error);
  //     throw error;
  //   }
  // });

  // test("debe manejar error cuando el ID es inválido (GET /orders/:id)", async () => {
  //   try {
  //     const invalidId = "invalid-id";
  //     const res = await request(app).get(`/orders/${invalidId}`);

  //     expect(res.statusCode).toBe(500); // depende cómo manejes validación de UUID
  //     expect(res.body).toHaveProperty("success", false);
  //   } catch (error) {
  //     testErrorLogger.addError("GET /orders/:id - ID inválido", error);
  //     throw error;
  //   }
  // });
});
