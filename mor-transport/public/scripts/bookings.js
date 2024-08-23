document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleName = urlParams.get('car');
    const vehiclePrice = urlParams.get('price');

    document.querySelector('.vehicle-name').value = vehicleName;
    document.querySelector('.vehicle-price').value = vehiclePrice;

    const decrementBtn = document.querySelector('.decrement');
    const incrementBtn = document.querySelector('.increment');
    const numberOfCarsInput = document.querySelector('.number-of-cars');
    const daysInput = document.querySelector('.days');
    const ridePriceSpan = document.querySelector('.ride-price');
    const totalPriceSpan = document.querySelector('.total-price');
    const paymentMethodInputs = document.querySelectorAll('input[name="payment-method"]');
    const bankDetails = document.querySelector('.bank-details');
    const formCloseBtn = document.querySelector('.form-close');
    const dateInput = document.querySelector('.date-input');
    const confirmButton = document.querySelector('.confirm-button');

    // Constants
    const basePricePerCar = parseFloat(vehiclePrice);

    // Set today's date as default
    dateInput.value = new Date().toISOString().split('T')[0];

    function calculateTotalPrice() {
        const numberOfCars = parseInt(numberOfCarsInput.value);
        const numberOfDays = parseInt(daysInput.value);
        const ridePrice = basePricePerCar * numberOfCars;
        const totalPrice = ridePrice * numberOfDays;

        ridePriceSpan.textContent = ridePrice.toFixed(2);
        totalPriceSpan.textContent = totalPrice.toFixed(2);
    }

    decrementBtn.addEventListener('click', () => {
        let numberOfCars = parseInt(numberOfCarsInput.value);
        if (numberOfCars > 1) {
            numberOfCars--;
            numberOfCarsInput.value = numberOfCars;
            calculateTotalPrice();
        }
    });

    incrementBtn.addEventListener('click', () => {
        let numberOfCars = parseInt(numberOfCarsInput.value);
        numberOfCars++;
        numberOfCarsInput.value = numberOfCars;
        calculateTotalPrice();
    });

    daysInput.addEventListener('change', calculateTotalPrice);

    paymentMethodInputs.forEach(input => {
        input.addEventListener('change', () => {
            if (input.value === 'bank') {
                bankDetails.classList.remove('hidden');
            } else {
                bankDetails.classList.add('hidden');
            }
        });
    });

    formCloseBtn.addEventListener('click', () => {
        document.querySelector('.form-overlay').style.display = 'none';
    });

    async function testServerConnectivity() {
        try {
            console.log('Attempting to connect to server...');
            const response = await fetch('http://localhost:4000/api/test');
            console.log('Server response:', response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Server test successful:', data.message);
            return true;
        } catch (error) {
            console.error('Server test failed:', error);
            return false;
        }
    }
    
    async function makeBooking(bookingData) {
        try {
            console.log('Sending booking data:', bookingData);
            const response = await fetch('http://localhost:4000/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)
            });
            console.log('Booking response:', response);
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Booking error:', error);
            throw error;
        }
    }

    confirmButton.addEventListener('click', async (e) => {
        e.preventDefault();
        console.log('Confirm button clicked');

        // Test server connectivity first
        const isServerConnected = await testServerConnectivity();
        if (!isServerConnected) {
            alert('Unable to connect to the server. Please try again later.');
            return;
        }

        const bookingData = {
            name: document.querySelector('.name-input').value,
            email: document.querySelector('.email-input').value,
            vehicleName: document.querySelector('.vehicle-name').value,
            vehiclePrice: parseFloat(document.querySelector('.vehicle-price').value),
            numberOfCars: parseInt(document.querySelector('.number-of-cars').value, 10),
            from: document.querySelector('.from').value,
            to: document.querySelector('.to').value,
            days: parseInt(document.querySelector('.days').value, 10),
            date: document.querySelector('.date-input').value,
            paymentMethod: document.querySelector('input[name="payment-method"]:checked').value,
            userId: getUserId()
        };

        try {
            const result = await makeBooking(bookingData);
            alert('Booking confirmed! Booking ID: ' + result.bookingId);
        } catch (error) {
            alert('Booking failed: ' + error.message);
        }
    });
    function getUserId() {
        return localStorage.getItem('userId'); // Example: retrieving from localStorage
    }
    formCloseBtn.addEventListener('click', () => {
        console.log('Close button clicked');
        window.location.href = 'booking.html'; // Redirect to booking.html
    });
    

    calculateTotalPrice();
});