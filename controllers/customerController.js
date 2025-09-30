
import {
  getCustomers,
  getCustomerById,
  createCustomer,
} from "../services/customerService.js";
import sendResponse from "../utils/response.js";

export default {
  list: async (req, res) => {
    try {
      const customers = await getCustomers();
      return sendResponse(res, {
        code: 201,
        message: "Clientes listados",
        success: true,
        data: customers,
      });
    } catch (error) {
      return sendResponse(res, {
        code: 500,
        message: "Error al listar los clientes",
        success: false,
        error: error.message,
      });
    }
  },
  create: async (req, res) => {
    try {
      const customer = await createCustomer(req.body);
      return sendResponse(res, {
        code: 201,
        message: "Cliente creado",
        success: true,
        data: customer,
      });
    } catch (error) {
      return sendResponse(res, {
        code: 500,
        message: "Error al crear el cliente",
        success: false,
        error: error.message,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const customer = await getCustomerById(id);

      if (!customer) {
        return sendResponse(res, {
          code: 404,
          message: "Cliente no encontrado",
          success: false,
          error: "Cliente no encontrado",
        });
      }
      return sendResponse(res, {
        code: 201,
        message: "Cliente encontrado",
        success: true,
        data: customer,
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
