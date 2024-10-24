import stripePackage from "stripe";
import {
  ApiError,
  Client,
  Environment,
  LogLevel,
  OrdersController,
} from "@paypal/paypal-server-sdk";
import dotenv from "dotenv";
dotenv.config();

// Configurer Stripe
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

// Contrôleur pour Stripe
const stripeController = async (req, res) => {
  const { amount } = req.body;

  // Vérification du montant
  if (!amount || isNaN(amount)) {
    return res
      .status(400)
      .json({ error: "Le montant est requis et doit être un nombre valide." });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "eur",
    });
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Erreur lors de la création du paiement Stripe :", error);
    let errorMessage;

    if (error.type === "StripeCardError") {
      errorMessage = "Votre carte a été refusée.";
    } else if (error.type === "RateLimitError") {
      errorMessage = "Trop de requêtes envoyées à l'API Stripe.";
    } else if (error.type === "StripeInvalidRequestError") {
      errorMessage = "Paramètre invalide envoyé à Stripe.";
    } else if (error.type === "StripeAPIError") {
      errorMessage = "Erreur avec les serveurs Stripe.";
    } else if (error.type === "StripeConnectionError") {
      errorMessage = "Erreur de connexion réseau avec Stripe.";
    } else if (error.type === "StripeAuthenticationError") {
      errorMessage = "Authentification avec Stripe échouée.";
    } else {
      errorMessage = error.message || "Erreur inattendue. Veuillez réessayer.";
    }

    res.status(500).json({ error: errorMessage });
  }
};
const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET,
  },
  timeout: 0,
  environment: Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: { logBody: true },
    logResponse: { logHeaders: true },
  },
});

const ordersController = new OrdersController(client);

const createOrder = async (total) => {
  const collect = {
    body: {
      intent: "CAPTURE",
      purchaseUnits: [
        {
          amount: {
            currencyCode: "EUR",
            value: total,
          },
        },
      ],
    },
    prefer: "return=minimal",
  };

  try {
    const { body, ...httpResponse } = await ordersController.ordersCreate(
      collect
    );

    return {
      jsonResponse: JSON.parse(body),
      httpStatusCode: httpResponse.statusCode,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      const { statusCode, headers } = error;
      throw new Error(error.message);
    }
  }
};

const createOrderHandler = async (req, res) => {
  try {
    const { total } = req.body;

    const { jsonResponse, httpStatusCode } = await createOrder(total);

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
};

const captureOrder = async (orderID) => {
  const collect = {
    id: orderID,
    prefer: "return=minimal",
  };

  try {
    const { body, ...httpResponse } = await ordersController.ordersCapture(
      collect
    );
    return {
      jsonResponse: JSON.parse(body),
      httpStatusCode: httpResponse.statusCode,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
  }
};

const captureOrderHandler = async (req, res) => {
  console.log("CAPTURE");
  try {
    const { orderID } = req.params;

    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to capture order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
};

export { stripeController, captureOrderHandler, createOrderHandler };
