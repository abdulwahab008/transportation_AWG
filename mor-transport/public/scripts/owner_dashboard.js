document.getElementById('book-vehicle').addEventListener('click', function() {
    window.location.href = 'manage_vehicles.html';
});

document.getElementById('enter-complaints').addEventListener('click', function() {
    window.location.href = 'comment.html';
});

document.getElementById('your-bookings').addEventListener('click', function() {
    document.getElementById('booking-section').style.display = 'block';
    
    fetchBookings();
});

function fetchBookings() {
    fetch('/api/bookings')
        .then(response => response.json())
        .then(data => {
            const bookingList = document.getElementById('booking-data');
            bookingList.innerHTML = ''; 

            data.forEach(booking => {
                const box = document.createElement('div');
                box.className = 'booking-box';

                box.innerHTML = `
                    <h3>Booking ID: ${booking.id}</h3>
                    <p><span>Name:</span> ${booking.name}</p>
                    <p><span>Email:</span> ${booking.email}</p>
                    <p><span>Vehicle Name:</span> ${booking.vehicle_name}</p>
                    <p><span>Vehicle Price:</span> ${booking.vehicle_price} SAR</p>
                    <p><span>Number of Cars:</span> ${booking.number_of_cars}</p>
                    <p><span>From:</span> ${booking.trip_from}</p>
                    <p><span>To:</span> ${booking.trip_to}</p>
                    <p><span>Days:</span> ${booking.number_of_days}</p>
                    <p><span>Date:</span> ${new Date(booking.trip_date).toLocaleString()}</p>
                    <p><span>Payment Method:</span> ${booking.payment_method}</p>
                    ${booking.payment_method === 'bank' ? `
                        <p><span>Transfer Amount:</span> ${booking.transfer_amount}</p>
                        <p><span>Screenshot:</span><img src="/uploads/bookings/{{payment_screenshot}}" alt="Payment Screenshot">
</p>
                    ` : ''}
                `;

                bookingList.appendChild(box);
            });
        })
        .catch(error => console.error('Error fetching bookings:', error));
}
