import React from "react";
import { Link } from "react-router-dom";

function Checkout() {
  return (
    <div>
      <h1>Checkout</h1>
      <p>Your payment will be processed soon!</p>
      <Link to="/">
        <button>Go Back to Home</button>
      </Link>
    </div>
  );
}

export default Checkout;
