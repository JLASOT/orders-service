import {
  createOrder,
  getOrders,
  getOrderById,
} from "../services/orderService.js";
import sendResponse from "../utils/response.js";

export default {
  list: async (req, res) => {
    try {
      //  Traer todas las órdenes con los productos relacionados desde tu base de datos local
      const orders = await getOrders();

      return sendResponse(res, {
        code: 200,
        message: "Ordenes listadas exitosamente",
        success: true,
        data: orders,
      });
    } catch (error) {
      return sendResponse(res, {
        code: 500,
        message: "Ocurrio un error al tratar de listar las ordenes",
        success: false,
        error: error.message,
      });
    }
  },

  store: async (req, res) => {
    try {
      const order = await createOrder(req.body);
      return sendResponse(res, {
        code: 201,
        message: "Orden creada",
        success: true,
        data: order,
      });
    } catch (error) {
      return sendResponse(res, {
        code: 500,
        message: "Error al crear la orden",
        success: false,
        error: error.message,
      });
    }
  },

  // Mostrar una sola orden por ID
  show: async (req, res) => {
    try {
      const { id } = req.params;

      // Llamar al servicio que trae la orden con productos y cliente
      const order = await getOrderById(id);

      if (!order) {
        return sendResponse(res, {
          code: 404,
          message: `Orden con id ${id} no encontrada`,
          success: false,
        });
      }

      return sendResponse(res, {
        code: 200,
        message: "Orden encontrada exitosamente",
        success: true,
        data: order,
      });
    } catch (error) {
      return sendResponse(res, {
        code: 500,
        message: "Ocurrió un error al buscar la orden",
        success: false,
        error: error.message,
      });
    }
  },
};
