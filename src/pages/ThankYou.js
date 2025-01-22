import React from "react";
import { Link } from "react-router-dom";

function ThankYou() {
  return (
    <div>
      <h1>Thank You for Your Purchase!</h1>
      <p>Your payment has been successfully processed. We appreciate your business!</p>
      <Link to="/">
        <button>Go Back to Home</button>
      </Link>
    </div>
  );
}

export default ThankYou;
