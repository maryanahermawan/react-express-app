# PayPal Integration Setup

## Prerequisites

1. Create a PayPal Developer Account at https://developer.paypal.com/
2. Create a new application in the PayPal Developer Dashboard
3. Get your Client ID and Client Secret

## Environment Variables

Create a `.env` file in the backend directory with:

```
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
```

Create a `.env` file in the frontend directory with:

```
REACT_APP_PAYPAL_CLIENT_ID=your-paypal-client-id
```

## Features Implemented

### Frontend
- ✅ PayPal Buttons for PayPal account payments
- ✅ PayPal Card Fields for unbranded card payments (cardholder name, card number, expiry, CVV)
- ✅ Payment success/error handling
- ✅ Responsive design with proper styling
- ✅ Order creation and capture through backend API

### Backend
- ✅ PayPal order creation endpoint (`POST /api/orders`)
- ✅ PayPal order capture endpoint (`POST /api/orders/:orderID/capture`)
- ✅ Error handling and logging
- ✅ PayPal Server SDK integration with proper environment configuration

## Testing

1. Start the backend: `cd backend && npm start`
2. Start the frontend: `cd frontend && npm start`
3. Add items to cart
4. Click "Proceed to Payment"
5. Test both PayPal buttons and card fields

## Production Setup

1. Change `mode: 'sandbox'` to `mode: 'live'` in `backend/server.js`
2. Use live PayPal credentials
3. Update PayPal client ID in frontend environment

## Security Notes

- Never commit real PayPal credentials to version control
- Use environment variables for all sensitive data
- Implement proper validation and error handling in production


