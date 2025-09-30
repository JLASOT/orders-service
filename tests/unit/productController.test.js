import request from "supertest";
import app from "../../app.js";
import { testErrorLogger } from "../../utils/testUtils.js";

describe("Product Routes", () => {
  let createdProductId;

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

  // Test para GET /products (listar todos los productos)
  describe("GET /products", () => {
    test("debe responder con código 201 y listar productos", async () => {
      try {
        const res = await request(app).get("/products");

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("success", true);
        expect(res.body).toHaveProperty("message", "Productos listados");
        expect(res.body).toHaveProperty("data");
        expect(Array.isArray(res.body.data)).toBe(true);
      } catch (error) {
        testErrorLogger.addError("GET /products - listar productos", error);
        throw error;
      }
    });
  });

  // Test para POST /products (crear producto)
  /*describe("POST /products", () => {
    test("debe crear un nuevo producto y responder con código 201", async () => {
      try {
        const newProduct = {
          name: "Laptop Lenovo",
          description: "Laptop gama media",
          price: 1200
        };

        const res = await request(app)
          .post("/products")
          .send(newProduct);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("success", true);
        expect(res.body).toHaveProperty("message", "Producto creado");
        expect(res.body).toHaveProperty("data");
        expect(res.body.data).toHaveProperty("id");

        // Guardamos el ID para usarlo en otros tests
        createdProductId = res.body.data.id;
      } catch (error) {
        testErrorLogger.addError("POST /products - crear producto", error);
        throw error;
      }
    });

    test("debe manejar error cuando faltan campos requeridos", async () => {
      try {
        const incompleteProduct = {
          name: "Laptop sin precio"
          // faltan campos requeridos (description, price)
        };

        const res = await request(app)
          .post("/products")
          .send(incompleteProduct);

        expect(res.statusCode).toBe(500);
        expect(res.body).toHaveProperty("success", false);
      } catch (error) {
        testErrorLogger.addError("POST /products - campos requeridos", error);
        throw error;
      }
    });
  }); */

  // Test para GET /products/:id (obtener producto por ID)
  /*describe("GET /products/:id", () => {
    test("debe obtener un producto existente por ID", async () => {
      try {
        const res = await request(app).get(`/products/${createdProductId}`);

        expect(res.body.code).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Producto encontrado");
        expect(res.body.data).toHaveProperty("id");
        expect(res.body.data.id).toBe(createdProductId);
      } catch (error) {
        testErrorLogger.addError("GET /products/:id - obtener por ID", error);
        throw error;
      }
    });

    test("debe manejar error cuando el producto no existe", async () => {
      try {
        const nonExistentId = "99999999-9999-9999-9999-999999999999";
        const res = await request(app).get(`/products/${nonExistentId}`);

        expect(res.body.code).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Producto no encontrado");
      } catch (error) {
        testErrorLogger.addError(
          "GET /products/:id - producto no existe",
          error
        );
        throw error;
      }
    });

    // test("debe manejar error cuando el ID es inválido", async () => {
    //   try {
    //     const invalidId = "invalid-id";
    //     const res = await request(app).get(`/products/${invalidId}`);
    //
    //     expect(res.statusCode).toBe(500);
    //     expect(res.body).toHaveProperty("success", false);
    //   } catch (error) {
    //     testErrorLogger.addError("GET /products/:id - ID inválido", error);
    //     throw error;
    //   }
    // });
  }); */

  // Test adicional para verificar la estructura de la respuesta
  describe("Estructura de respuestas", () => {
    test("todas las respuestas deben tener la estructura correcta", async () => {
      try {
        const res = await request(app).get("/products");

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
