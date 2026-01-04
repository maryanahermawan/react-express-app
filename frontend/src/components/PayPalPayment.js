import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { loadScript } from '@paypal/paypal-js';

const PayPalPayment = ({ total, onPaymentSuccess, onPaymentError }) => {
  const [showCardFields, setShowCardFields] = useState(false);
  const [cardFields, setCardFields] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // PayPal client ID - Replace with your actual PayPal client ID
  const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID || 'your-paypal-client-id';

  useEffect(() => {
    if (showCardFields) {
      loadCardFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCardFields, total]);

  const loadCardFields = async () => {
    try {
      const paypalScript = await loadScript({
        'client-id': PAYPAL_CLIENT_ID,
        'enable-funding': 'card',
        'disable-funding': 'paylater,venmo',
        'data-sdk-integration-source': 'integrationbuilder_ac'
      });

      if (paypalScript.CardFields) {
        const cardFieldsInstance = paypalScript.CardFields({
          createOrder: async () => {
            try {
              const response = await fetch('http://localhost:5001/api/orders', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  purchase_units: [{
                    amount: {
                      currency_code: 'USD',
                      value: total.toFixed(2)
                    }
                  }]
                })
              });
              
              if (!response.ok) {
                throw new Error('Failed to create order');
              }
              
              const order = await response.json();
              return order.id;
            } catch (error) {
              console.error('Error creating order:', error);
              onPaymentError(error);
              throw error;
            }
          },
          onApprove: async (data) => {
            try {
              setIsProcessing(true);
              const response = await fetch(`http://localhost:5001/api/orders/${data.orderID}/capture`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                }
              });
              
              if (!response.ok) {
                throw new Error('Failed to capture order');
              }
              
              const orderData = await response.json();
              onPaymentSuccess(orderData);
            } catch (error) {
              console.error('Error capturing order:', error);
              onPaymentError(error);
            } finally {
              setIsProcessing(false);
            }
          },
          onError: (err) => {
            console.error('PayPal Card Fields Error:', err);
            setIsProcessing(false);
            onPaymentError(err);
          }
        });

        // Render card fields
        cardFieldsInstance.Number('#card-number');
        cardFieldsInstance.Expiry('#card-expiry');
        cardFieldsInstance.CVV('#card-cvv');
        cardFieldsInstance.Name('#card-name');

        setCardFields(cardFieldsInstance);
      } else {
        console.error('CardFields not available');
        onPaymentError(new Error('Card Fields not available. Please check your PayPal configuration.'));
      }
    } catch (error) {
      console.error('Error loading PayPal Card Fields:', error);
      onPaymentError(error);
    }
  };

  const handlePayPalButtonSuccess = async (data, actions) => {
    try {
      setIsProcessing(true);
      // Capture the order on the backend
      const response = await fetch(`http://localhost:5001/api/orders/${data.orderID}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to capture order');
      }
      
      const orderData = await response.json();
      onPaymentSuccess(orderData);
    } catch (error) {
      console.error('Error capturing order:', error);
      onPaymentError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalButtonError = (err) => {
    console.error('PayPal Button Error:', err);
    onPaymentError(err);
  };

  return (
    <div className="paypal-payment">
      <h3>Payment Options</h3>
      
      {/* PayPal Buttons */}
      <div className="paypal-buttons-container">
        <PayPalScriptProvider options={{ 
          'client-id': PAYPAL_CLIENT_ID,
          'enable-funding': 'card',
          'disable-funding': 'paylater,venmo'
        }}>
          <PayPalButtons
            createOrder={async (data, actions) => {
              try {
                const response = await fetch('http://localhost:5001/api/orders', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    purchase_units: [{
                      amount: {
                        currency_code: 'USD',
                        value: total.toFixed(2)
                      }
                    }]
                  })
                });
                
                if (!response.ok) {
                  throw new Error('Failed to create order');
                }
                
                const order = await response.json();
                return order.id;
              } catch (error) {
                console.error('Error creating order:', error);
                onPaymentError(error);
                throw error;
              }
            }}
            onApprove={handlePayPalButtonSuccess}
            onError={handlePayPalButtonError}
            style={{
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'paypal'
            }}
          />
        </PayPalScriptProvider>
      </div>

      {/* Card Fields Option */}
      <div className="card-fields-section">
        <button 
          className="toggle-card-fields-btn"
          onClick={() => setShowCardFields(!showCardFields)}
        >
          {showCardFields ? 'Hide' : 'Pay with Card'} Card Details
        </button>
        
        {showCardFields && (
          <div className="card-fields-container">
            <div className="card-field-group">
              <label htmlFor="card-name">Cardholder Name</label>
              <div id="card-name" className="card-input"></div>
            </div>
            <div className="card-field-group">
              <label htmlFor="card-number">Card Number</label>
              <div id="card-number" className="card-input"></div>
            </div>
            <div className="card-fields-row">
              <div className="card-field-group">
                <label htmlFor="card-expiry">Expiry Date</label>
                <div id="card-expiry" className="card-input"></div>
              </div>
              <div className="card-field-group">
                <label htmlFor="card-cvv">CVV</label>
                <div id="card-cvv" className="card-input"></div>
              </div>
            </div>
            {cardFields && (
              <button 
                className="submit-card-btn"
                onClick={() => {
                  if (cardFields && !isProcessing) {
                    setIsProcessing(true);
                    // Card fields will submit automatically when valid
                    cardFields.submit().catch(err => {
                      console.error('Submit error:', err);
                      setIsProcessing(false);
                      onPaymentError(err);
                    });
                  }
                }}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Pay with Card'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PayPalPayment;


