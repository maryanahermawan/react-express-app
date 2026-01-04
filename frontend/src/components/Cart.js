import React, { useState } from 'react';
import PayPalPayment from './PayPalPayment';

const Cart = ({ cart, onRemoveItem }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handlePaymentSuccess = (orderData) => {
    console.log('Payment successful:', orderData);
    setPaymentSuccess(true);
    setShowPayment(false);
    // You can add additional logic here like clearing the cart
    alert('Payment successful! Thank you for your purchase.');
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    alert('Payment failed. Please try again.');
  };

  return (
    <div className="cart">
      <h2>Shopping Cart ({cart.length} items)</h2>
      {cart.length === 0 ? (
        <p className="cart-empty">Your cart is empty</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.productId} className="cart-item">
              <div className="cart-item-info">
                <img 
                  src={item.product.image} 
                  alt={item.product.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h4>{item.product.name}</h4>
                  <p>Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="cart-item-price">
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
              <button 
                className="remove-btn"
                onClick={() => onRemoveItem(item.productId)}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="cart-total">
            Total: ${calculateTotal().toFixed(2)}
          </div>
          <div className="payment-section">
            {!paymentSuccess ? (
              <>
                <button 
                  className="checkout-btn"
                  onClick={() => setShowPayment(true)}
                >
                  Proceed to Payment
                </button>
                {showPayment && (
                  <PayPalPayment 
                    total={calculateTotal()}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                  />
                )}
              </>
            ) : (
              <div className="payment-success">
                <h3>✅ Payment Successful!</h3>
                <p>Thank you for your purchase. Your order has been processed.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
