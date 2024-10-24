import React, { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const initialOptions = {
  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
  "enable-funding": "venmo",
  "disable-funding": "",
  "buyer-country": "FR",
  currency: "EUR",
  "data-page-type": "product-details",
  components: "buttons",
  "data-sdk-integration-source": "developer-studio",
};

const Donations = () => {
  const [amount, setAmount] = useState("10");
  const [message, setMessage] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const apiUrl = import.meta.env.VITE_API_URL;
  const amountRef = useRef(null);

  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

  // Fonction pour gérer le paiement Stripe
  const handleStripeSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      // Format du montant
      const formattedAmount = parseFloat(amount.replace(",", ".")).toFixed(2);

      // Validation du montant
      if (isNaN(formattedAmount) || formattedAmount <= 0) {
        alert("Veuillez saisir un montant valide supérieur à 0.");
        return;
      }

      // Création du PaymentIntent avec le montant en centimes
      const response = await fetch(
        `${apiUrl}/donations/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: parseInt(formattedAmount * 100) }), // Montant en centimes
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        console.log("Stripe Result Error:", result.error);
        const errorMessages = {
          card_declined:
            "Le paiement a été refusé. Veuillez vérifier vos informations de carte ou essayer une autre carte.",
          incorrect_cvc:
            "Le CVV que vous avez saisi est incorrect. Veuillez vérifier les informations de votre carte.",
          expired_card:
            "La carte est expirée. Veuillez utiliser une autre carte.",
          insufficient_funds:
            "Le paiement a été refusé en raison de fonds insuffisants. Veuillez vérifier vos fonds ou essayer une autre carte.",
          incorrect_number:
            "Le numéro de carte que vous avez saisi est incorrect. Veuillez vérifier et réessayer.",
          authentication_required:
            "L'authentification 3D Secure est requise. Veuillez suivre les instructions pour finaliser le paiement.",
          processing_error:
            "Une erreur s'est produite lors du traitement du paiement. Veuillez réessayer ou contacter votre banque.",
        };

        const errorMessage =
          errorMessages[result.error.code] ||
          `Erreur lors du paiement : ${result.error.message}`;
        alert(errorMessage);
      } else {
        alert("Paiement par carte réussi, merci pour votre générosité !");
      }
    } catch (error) {
      console.error("Erreur lors du paiement :", error);
      alert(
        "Une erreur est survenue lors du traitement de votre paiement. Veuillez réessayer plus tard."
      );
    }
  };

  const handleAmountChange = (e) => {
    let input = e.target.value;
    // Remplacer les virgules par des points
    input = input.replace(",", ".");
    // Garder uniquement les chiffres et un seul point
    const formattedInput = input
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1");

    setAmount(input);
  };

  const createOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Vous devez être connecté pour créer une commande.");
      }

      const response = await axios.post(
        "http://localhost:5000/api/v1/donations/orders",
        { total: amountRef.current },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const orderData = response.data;

      if (orderData && orderData.id) {
        return orderData.id;
      } else {
        throw new Error("L'ID de commande n'a pas été trouvé.");
      }
    } catch (error) {
      console.error("Erreur createOrder:", error);
      setMessage(`Impossible d'initier le paiement PayPal...${error.message}`);
    }
  };

  const onApprove = async (data, actions) => {
    const token = localStorage.getItem("token");

    try {
      const { data: orderData } = await axios(
        `http://localhost:5000/api/v1/donations/orders/${data.orderID}/capture`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const errorDetail = orderData?.details?.[0];

      if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
        return actions.restart();
      } else if (errorDetail) {
        throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
      } else {
        const transaction = orderData.purchase_units[0].payments.captures[0];
        setMessage(
          `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
        );
        console.log(
          "Capture result",
          orderData,
          JSON.stringify(orderData, null, 2)
        );
      }
    } catch (error) {
      console.log(error);

      setMessage(`Sorry, your transaction could not be processed...${error}`);
    }
  };

  return (
    <div className="bg-gray-900 text-white max-w-lg mx-auto mt-12 p-10 rounded-xl shadow-2xl border border-teal-400 neon-box font-gamer">
      <h1 className="text-4xl font-bold text-center text-teal-400 mb-10 neon-text">
        Supportez le Streamer
      </h1>

      {/* Montant du don (utilisé par Stripe et PayPal) */}
      <div className="mb-10">
        <h2 className="text-2xl text-teal-300 mb-6 text-center">
          Insérer le montant de votre donation :
        </h2>
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9.]*"
          placeholder="Montant du don (en euros)"
          value={amount}
          onChange={handleAmountChange}
          className="w-full p-4 mb-4 rounded bg-gray-800 text-teal-200 border border-teal-300 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-70 "
        />
      </div>

      {/* Stripe Donation Form */}
      <form className="mb-10" onSubmit={handleStripeSubmit}>
        <div className="p-4 mb-6 bg-gray-800 rounded-lg border border-gray-700 shadow-md">
          <CardElement
            className="p-2 bg-transparent text-teal-300 placeholder-teal-500 focus:outline-none"
            options={{
              style: {
                base: {
                  iconColor: "#00f3ff",
                  color: "#00f3ff",
                  fontWeight: "500",
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: "16px",
                  "::placeholder": {
                    color: "#00ffff",
                  },
                },
                invalid: {
                  iconColor: "#ff4d4f",
                  color: "#ff4d4f",
                },
              },
            }}
          />
        </div>
        <button
          type="submit"
          className="w-full p-4 text-xl font-bold rounded bg-teal-500 hover:bg-teal-400 transition-transform transform hover:scale-110 shadow-lg neon-button "
        >
          Payer par Carte Bancaire
        </button>
      </form>

      {/* PayPal Donation */}
      <PayPalScriptProvider options={initialOptions}>
        <div className="flex justify-center">
          <PayPalButtons
            style={{
              shape: "rect",
              layout: "horizontal",
              color: "gold",
              label: "donate",
            }}
            createOrder={createOrder}
            onApprove={onApprove}
          />
        </div>
      </PayPalScriptProvider>

      <div role="alert">{message}</div>
    </div>
  );
};

const DonationsWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <Donations />
    </Elements>
  );
};

export default DonationsWrapper;
