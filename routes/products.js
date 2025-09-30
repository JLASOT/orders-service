
import express from "express";
import productController from "../controllers/productController.js";

const router = express.Router();

// Define las rutas para las órdenes
router.get("/", productController.list);
router.post("/", productController.create);
router.get("/:id", productController.getById);
export default router;