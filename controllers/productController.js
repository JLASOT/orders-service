import Product from "../models/Product.js";
import {
  getProducts,
  getProductById,
  createProduct,
} from "../services/productService.js";
import sendResponse from "../utils/response.js";

export default {
  list: async (req, res) => {
    try {
      const products = await getProducts();
      return sendResponse(res, {
        code: 201,
        message: "Productos listados",
        success: true,
        data: products,
      });
    } catch (error) {
      return sendResponse(res, {
        code: 500,
        message: "Error al listar los productos",
        success: false,
        error: error.message,
      });
    }
  },
  create: async (req, res) => {
    try {
      const product = await createProduct(req.body);
      return sendResponse(res, {
        code: 201,
        message: "Producto creado",
        success: true,
        data: product,
      });
    } catch (error) {
      return sendResponse(res, {
        code: 500,
        message: "Error al crear el producto",
        success: false,
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await getProductById(id);

      if (!product) {
        return sendResponse(res, {
          code: 404,
          message: "Producto no encontrado",
          success: false,
          error: "Producto no encontrado",
        });
      }
      return sendResponse(res, {
        code: 201,
        message: "Producto encontrado",
        success: true,
        data: product,
      });
    } catch (error) {
      return sendResponse(res, {
        code: 500,
        message: "Algo salio mal al tratar de obtener el producto",
        success: false,
        error: error.message,
      });
    }
  },
};
