import express from "express";
import {
  stripeController,
  createOrderHandler,
  captureOrderHandler,
} from "./donations.controller.js";
import authenticateUser from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Route pour Stripe
router.post("/create-payment-intent", stripeController);

// Route pour créer une commande PayPal
router.post("/orders", authenticateUser, createOrderHandler);

// Route pour capturer une commande PayPal
router.get("/orders/:orderID/capture", authenticateUser, captureOrderHandler);

export default router;
