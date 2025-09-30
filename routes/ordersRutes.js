
import express from "express";
import ordersController from "../controllers/ordersController.js";

const router = express.Router();


router.get("/", ordersController.list);
router.post("/", ordersController.store);

router.get("/:id", ordersController.show);
export default router;