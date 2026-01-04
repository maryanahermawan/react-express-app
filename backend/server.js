const express = require('express');
const cors = require('cors');
const paypal = require('@paypal/paypal-server-sdk');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5001;

console.log('PayPal Client ID:', process.env.PAYPAL_CLIENT_ID);
console.log('PayPal Client Secret:', process.env.PAYPAL_CLIENT_SECRET);
// PayPal Environment - Use sandbox for testing, production for live
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID || 'your-paypal-client-id',
  process.env.PAYPAL_CLIENT_SECRET || 'your-paypal-client-secret'
);
// For production, use:
// const environment = new paypal.core.LiveEnvironment(clientId, clientSecret);

const client = new paypal.core.PayPalHttpClient(environment);

// Middleware
app.use(cors());
app.use(express.json());

// Sample products data
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 99.99,
    description: "High-quality wireless headphones with noise cancellation",
    image: "https://via.placeholder.com/300x200?text=Headphones"
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 199.99,
    description: "Feature-rich smartwatch with fitness tracking and notifications",
    image: "https://via.placeholder.com/300x200?text=Smart+Watch"
  }
];

// In-memory cart storage (in a real app, you'd use a database)
let cart = [];

// Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/cart', (req, res) => {
  res.json(cart);
});

app.post('/api/cart', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const existingItem = cart.find(item => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId,
      quantity,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      }
    });
  }

  res.json(cart);
});

app.delete('/api/cart/:productId', (req, res) => {
  const { productId } = req.params;
  cart = cart.filter(item => item.productId !== parseInt(productId));
  res.json(cart);
});

// PayPal payment routes
app.post('/api/orders', async (req, res) => {
  try {
    const { purchase_units } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: purchase_units.map(unit => ({
        amount: {
          currency_code: unit.amount.currency_code,
          value: unit.amount.value
        }
      }))
    });

    const order = await client.execute(request);
    res.json({
      id: order.result.id,
      status: order.result.status,
      links: order.result.links
    });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({
      error: 'Failed to create order',
      details: error.message
    });
  }
});

app.post('/api/orders/:orderID/capture', async (req, res) => {
  try {
    const { orderID } = req.params;
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const capture = await client.execute(request);
    res.json({
      id: capture.result.id,
      status: capture.result.status,
      purchase_units: capture.result.purchase_units
    });
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    res.status(500).json({
      error: 'Failed to capture order',
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
