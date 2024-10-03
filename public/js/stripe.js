import axios from 'axios';
import { showAlert } from './alerts';

const bookBtn = document.querySelector('#book-tour');
document.addEventListener('DOMContentLoaded', function () {
  // Initialize Stripe object after the DOM and external libraries are loaded
  const stripe = Stripe(
    'pk_test_51Q5B3KRuS7dWOMLlLq5uRQ2dYviioMQ9Il80orfAS49KCw30sf92xR2vwI6lnYjzxGHRxALbtleNWjzHTm0YvVS300KnvpGV2C',
  );
  if (bookBtn) {
    bookBtn.addEventListener('click', async (e) => {
      const tourId = e.target.dataset.tourId;
      e.target.textContent = 'Processing...';
      try {
        // Fetch the checkout session from the server
        const session = await axios(
          `/api/v1/bookings/checkout-session/${tourId}`,
        );

        // Redirect to Stripe checkout page
        await stripe.redirectToCheckout({
          sessionId: session.data.session.id,
        });
      } catch (err) {
        // console.log('Error while booking the tour:', err);
        showAlert('error', err);
      }
    });
  }
});
