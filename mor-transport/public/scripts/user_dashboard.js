document.getElementById('book-vehicle').addEventListener('click', function() {
    window.location.href = 'booking.html';
});

document.getElementById('enter-complaints').addEventListener('click', function() {
    window.location.href = 'comment.html';
});

document.getElementById('your-bookings').addEventListener('click', function() {
    document.getElementById('booking-section').style.display = 'block';
    fetchBookings();
});

document.getElementById('logoutButton').addEventListener('click', async function() {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    // Optionally, make an API call to invalidate the session on the server
    try {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
        });
    } catch (error) {
        console.error('Error logging out:', error);
    }

    // Redirect to the account page
    window.location.href = '/account.html';
});

function fetchBookings() {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
        console.error('User ID not found. Please log in again.');
        return;
    }

    fetch(`/api/bookings?userId=${userId}`)
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
                    <p><span>Transfer Amount:</span> ${booking.transfer_amount}</p>
                    <p><span>Screenshot:</span> ${booking.payment_screenshot}</p>
                `;

                bookingList.appendChild(box);
            });
        })
        .catch(error => {
            console.error('Error fetching booking data:', error);
        });
}
