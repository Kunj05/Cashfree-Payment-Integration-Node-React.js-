import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { load } from "@cashfreepayments/cashfree-js";
import axios from "axios";

function Product() {
  const { id } = useParams();
  const [paymentSessionId, setPaymentSessionId] = useState("");
  const [orderId, setOrderId] = useState("");

  // Load Cashfree SDK in sandbox mode
  const initializeSDK = async () => {
    try {
      const cashfree = await load({ mode: "sandbox" });
      console.log("Cashfree SDK loaded successfully");
      return cashfree;
    } catch (error) {
      console.error("Error loading Cashfree SDK:", error.message);
    }
  };

  // Create an order and get the session ID from the backend
  const getSessionId = async () => {
    const orderData = {
      orderAmount: 1000,
      orderCurrency: "INR",
      customerName: "John Doe",
      customerEmail: "johndoe@example.com",
      customerPhone: "9876543210",
      customerId: "firebase_id",
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/payment",
        orderData
      );
      console.log(response.data);
      const { order_id, payment_session_id } = response.data;

      if (payment_session_id && order_id) {
        console.log("Payment Session ID:", payment_session_id);
        console.log("Order ID:", order_id);
        setPaymentSessionId(payment_session_id);
        setOrderId(order_id);

        return { paymentSessionId: payment_session_id, orderId: order_id };
      } else {
        throw new Error("Failed to retrieve payment session ID or order ID");
      }
    } catch (error) {
      console.error("Error fetching session ID or order ID:", error.message);
    }
  };

  // Verify payment status after the transaction
  const verifyPayment = async () => {
    try {
      console.log("Verifying payment for order ID:");
      const response = await axios.post(
        "http://localhost:8000/verify",
        { order_id: orderId }
      );

      console.log("Payment verification response:", response.data[0]);

      if (response.data[0].payment_status === "SUCCESS") {
        alert("Payment verified successfully");
      } else {
        alert("Payment verification failed");
      }
    } catch (error) {
      console.error("Error verifying payment:", error.message);
    }
  };

  // Handle Buy Now button click
  const handleBuyNow = async () => {
    try {
      // Step 1: Load Cashfree SDK
      const cashfree = await initializeSDK();
      if (!cashfree) {
        alert("Failed to load payment SDK. Please try again.");
        return;
      }

      // Step 2: Create an order and get session ID
      const { paymentSessionId, orderId } = await getSessionId();
      if (!paymentSessionId) {
        alert("Failed to initiate payment. Please try again.");
        return;
      }

      // Step 3: Redirect to Cashfree checkout
      await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_modal",
      })
        .then(async (response) => {
          // Step 4: Verify payment after checkout
          await verifyPayment();
          console.log("Payment response:", response);
        })
        .catch((error) => {
          if (error.message === "Payment cancelled") {
            console.log("User cancelled the payment.");
          } else {
            console.error("Error during payment:", error.message);
          }
        });
    } catch (error) {
      console.error("Error during payment process:", error.message);
      alert("An error occurred during the payment process. Please try again.");
    }
  };

  const item = {
    id: id,
    name: `Item ${id}`,
    description: "This is a great item.",
    price: `$${id * 100}`,
  };

  return (
    <div>
      <h1>{item.name}</h1>
      <p>{item.description}</p>
      <p>{item.price}</p>
      <button onClick={handleBuyNow}>Buy Now</button>
    </div>
  );
}

export default Product;