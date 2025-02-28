// --- Google Sheets and Payment Integration ---

// Function to submit order data to Google Sheet via an Apps Script Web App URL.
// Note: Replace 'REPLACE_WITH_YOUR_SCRIPT_ID' with your actual Apps Script deployment ID.
function submitOrderToSheet(orderData) {
    const formData = new FormData();
    formData.append('timestamp', new Date().toISOString());
    formData.append('customerName', orderData.name);
    formData.append('customerEmail', orderData.email);
    formData.append('customerPhone', orderData.phone);
    formData.append('customerAddress', orderData.address);
    formData.append('totalAmount', orderData.total);
    formData.append('items', JSON.stringify(orderData.items));

    const scriptURL = 'https://script.google.com/macros/s/REPLACE_WITH_YOUR_SCRIPT_ID/exec';

    return fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
            if (response.ok) return response.json();
            else throw new Error('Error submitting order');
        })
        .then(data => {
            console.log('Order submitted successfully:', data);
            return data;
        })
        .catch(error => {
            console.error('Error submitting order:', error);
            throw error;
        });
}

// Function to initialize PayPal payment gateway.
// Render the PayPal button inside the given container and create an order for the given total.
// When approved, capture payment and then submit order data to Google Sheet.
function initializePayPal(containerSelector, orderTotal, orderDataCallback) {
    document.querySelector(containerSelector).innerHTML = '';

    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: { value: orderTotal.toFixed(2) }
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                // Augment orderData with payment details.
                const orderData = orderDataCallback();
                orderData.paymentDetails = {
                    id: data.orderID,
                    status: 'completed',
                    method: 'PayPal',
                    timestamp: new Date().toISOString()
                };
                return submitOrderToSheet(orderData).then(() => {
                    alert('Payment and order submission successful!');
                    // You may clear cart and update UI here.
                });
            });
        },
        onError: function(err) {
            console.error('PayPal error:', err);
            alert('Payment failed. Please try again.');
        }
    }).render(containerSelector);
}
