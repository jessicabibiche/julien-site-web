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

  const handleStripeSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      const formattedAmount = parseFloat(amount.replace(",", ".")).toFixed(2);

      if (isNaN(formattedAmount) || formattedAmount <= 0) {
        alert("Veuillez saisir un montant valide supérieur à 0.");
        return;
      }

      const response = await fetch(
        `${apiUrl}/donations/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: parseInt(formattedAmount * 100) }),
          credentials: "include", // Assure l'envoi des cookies signés
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
    input = input.replace(",", ".");
    setAmount(input);
  };

  const createOrder = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/donations/orders`,
        { total: amountRef.current },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
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
    try {
      const { data: orderData } = await axios.post(
        `${apiUrl}/donations/orders/${data.orderID}/capture`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
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
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-white max-w-lg p-8 rounded-lg shadow-2xl border border-yellow-500 bg-gradient-to-br from-black to-gray-800">
        <h1 className="text-4xl font-extrabold text-center text-yellow-400 mb-6">
          Supportez le Streamer
        </h1>

        <div className="mb-6">
          <h2 className="text-lg text-center text-yellow-300 mb-4">
            Insérer le montant de votre donation :
          </h2>
          <input
            type="text"
            inputMode="decimal"
            pattern="[0-9.]*"
            placeholder="Montant du don (en euros)"
            value={amount}
            onChange={handleAmountChange}
            className="w-full p-2 rounded bg-gray-800 text-yellow-400 border border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        <form className="mb-6" onSubmit={handleStripeSubmit}>
          <div className="p-4 bg-gray-800 rounded-lg border border-yellow-500">
            <CardElement
              className="p-2 bg-transparent text-yellow-400 placeholder-yellow-500"
              options={{
                style: {
                  base: {
                    iconColor: "#FFD700",
                    color: "#FFD700",
                    fontWeight: "500",
                    fontFamily: "'Orbitron', sans-serif",
                    fontSize: "16px",
                    "::placeholder": {
                      color: "#FFD700",
                    },
                  },
                  invalid: {
                    iconColor: "#FF4D4F",
                    color: "#FF4D4F",
                  },
                },
              }}
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 py-3 text-lg font-bold rounded bg-yellow-400 hover:bg-yellow-300 transition-transform transform hover:scale-105 text-black shadow-lg"
          >
            Payer par Carte Bancaire
          </button>
        </form>

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

        <div role="alert" className="text-center mt-4 text-red-500">
          {message}
        </div>
      </div>
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
