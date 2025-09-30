import request from "supertest";
import app from "../../app.js";
import { testErrorLogger } from "../../utils/testUtils.js";

describe("Customer Routes", () => {
  let createdCustomerId;

  // Guardar errores después de todos los tests
  afterAll(() => {
    const errorFile = testErrorLogger.saveErrorsToFile();
    if (errorFile) {
      console.log(
        `\n📁 Se guardaron ${testErrorLogger.getErrorCount()} errores en: ${errorFile}`
      );
    }
  });

  // Limpiar errores antes de cada test
  beforeEach(() => {
    testErrorLogger.clearErrors();
  });

  // Test para GET /customers (listar todos los clientes)
  describe("GET /customers", () => {
    test("debe responder con código 201 y listar clientes", async () => {
      try {
        const res = await request(app).get("/customers");

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("success", true);
        expect(res.body).toHaveProperty("message", "Clientes listados");
        expect(res.body).toHaveProperty("data");
        expect(Array.isArray(res.body.data)).toBe(true);
      } catch (error) {
        testErrorLogger.addError("GET /customers - listar clientes", error);
        throw error;
      }
    }, 10000);
  });

  // Test para POST /customers (crear cliente)
  /*describe("POST /customers", () => {
    test("debe crear un nuevo cliente y responder con código 201", async () => {
      try {
        const newCustomer = {
          name: "Juan",
          last_name: "Pérez",
          ci: "12345678",
        };

        const res = await request(app)
          .post("/customers")
          .send(newCustomer);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("success", true);
        expect(res.body).toHaveProperty("message", "Cliente creado");
        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toHaveProperty("id");

        // Guardamos el ID para usarlo en otros tests
        console.log("Cliente data:", res.body.data);
        console.log("Cliente ID:", res.body.data.id);
        createdCustomerId = res.body.data.id;
      } catch (error) {
        testErrorLogger.addError("POST /customers - crear cliente", error);
        throw error;
      }
    });

    test("debe manejar error cuando faltan campos requeridos", async () => {
      try {
        const incompleteCustomer = {
          name: "Juan "
          // faltan campos requeridos
        };

        const res = await request(app)
          .post("/customers")
          .send(incompleteCustomer);

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("success", false);
      } catch (error) {
        testErrorLogger.addError("POST /customers - campos requeridos", error);
        throw error;
      }
    });
  }); */

  // Test para GET /customers/:id (obtener cliente por ID)
  /*describe("GET /customers/:id", () => {
    test("debe obtener un cliente existente por ID", async () => {
      try {
        const res = await request(app).get(`/customers/${createdCustomerId}`);
        console.log("Cliente data peticion :", res.body);
        console.log("Cliente ID :", res.body.data.id);
        expect(res.body.code).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Cliente encontrado");
        expect(res.body.data).toHaveProperty("id");
        expect(res.body.data.id).toBe(createdCustomerId);
      } catch (error) {
        testErrorLogger.addError("GET /customers/:id - obtener por ID", error);
        throw error;
      }
    });

    test("debe manejar error cuando el cliente no existe", async () => {
      try {
        const nonExistentId = "99999999-9999-9999-9999-999999999999";
        const res = await request(app).get(`/customers/${nonExistentId}`);

        expect(res.body.code).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Cliente no encontrado");
      } catch (error) {
        testErrorLogger.addError(
          "GET /customers/:id - cliente no existe",
          error
        );
        throw error;
      }
    });

    // test("debe manejar error cuando el ID es inválido", async () => {
    //   try {
    //     const invalidId = "invalid-id";
    //     const res = await request(app).get(`/customers/${invalidId}`);

    //     expect(res.statusCode).toBe(500);
    //     expect(res.body).toHaveProperty("success", false);
    //   } catch (error) {
    //     testErrorLogger.addError("GET /customers/:id - ID inválido", error);
    //     throw error;
    //   }
    // });
  }); */

  // Test adicional para verificar la estructura de la respuesta
  describe("Estructura de respuestas", () => {
    test("todas las respuestas deben tener la estructura correcta", async () => {
      try {
        const res = await request(app).get("/customers");

        expect(res.body).toHaveProperty("code");
        expect(res.body).toHaveProperty("message");
        expect(res.body).toHaveProperty("success");
        expect(res.body).toHaveProperty("data");

        if (!res.body.success) {
          expect(res.body).toHaveProperty("error");
        }
      } catch (error) {
        testErrorLogger.addError("Estructura de respuestas", error);
        throw error;
      }
    });
  });
});
