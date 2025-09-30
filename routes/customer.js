
import express from "express";
import customerController from "../controllers/customerController.js";

const router = express.Router();

// Define las rutas para las órdenes
router.get("/", customerController.list);
router.post("/", customerController.create);
router.get("/:id", customerController.getById);
export default router;