/**
 * Helper para enviar respuestas JSON unificadas.
 * @param {import('express').Response} res
 * @param {object} opts
 * @param {number} opts.code  - Código HTTP que irá en status y en el body.
 * @param {string} opts.message - Mensaje para el cliente.
 * @param {boolean} opts.success - true si la operación fue exitosa.
 * @param {any} [opts.data=null] - Datos a devolver (puede ser null).
 */
const sendResponse = (res, { code, message, success, data = {}, error = {} }) => {
  return res.status(code).json({ code, message, success, data, error });
};

export default sendResponse;
