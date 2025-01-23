const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { Cashfree } = require('cashfree-pg');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: '*'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Cashfree credentials
Cashfree.XClientId = process.env.CASHFREE_API_KEY;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX; // Change to PRODUCTION for live mode

// Generate a unique order ID
function generateOrderId() {
  const uniqueId = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256');
  hash.update(uniqueId);
  const orderId = hash.digest('hex');
  return orderId.substr(0, 12); // Limit to first 12 characters
}

// Route to handle payment request
app.post('/payment', async (req, res) => {
  try {
    const { orderAmount, customerName, customerPhone, customerEmail , customerId } = req.body;

    // Validate incoming data
    if (!orderAmount || !customerName  || !customerPhone || !customerEmail || !customerId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const orderId = await generateOrderId();

    const request = {
      order_amount: orderAmount, // Convert amount to number
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: customerId, // Use email as unique customer ID
        customer_phone:customerPhone,
        customer_name:customerName,
        customer_email:customerEmail,
      },
    };

    // Create a payment session
    Cashfree.PGCreateOrder("2023-08-01", request)
      .then(response => {
        console.log(response.data);
        res.json({
          payment_session_id: response.data.payment_session_id,
          order_id: orderId
        });
      })
      .catch(error => {
        console.error(error.response?.data?.message || error.message);
        res.status(500).json({ message: "Error while creating payment session" });
      });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route to verify payment status
app.post('/verify', async (req, res) => {
  try {
    const { order_id } = req.body;
    console.log("Order Id: ",order_id);
    
    // Validate orderId
    if (!order_id) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    // Fetch payment status
    Cashfree.PGOrderFetchPayments("2023-08-01", order_id)
      .then(response => {
        console.log("Data After verification ",response.data);
        res.json(response.data); // Return the payment verification details
      })
      .catch(error => {
        console.error(error.response?.data?.message || error.message);
        res.status(500).json({ message: "Error while verifying payment" });
      });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get('/',(req,res)=>{
  res.send("hello ")
})
// Start the server
app.listen(8000, () => {
  console.log('Server is running on port 8000');
});