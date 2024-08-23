document.addEventListener('DOMContentLoaded', () => {
    const bookingList = document.getElementById('booking-data');
    const today = new Date();

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
        return date.toLocaleDateString('en-US', options);
    }

    function handleEditBooking(bookingId) {
        // Logic to edit booking (e.g., open a modal with the booking details)
        console.log('Editing booking:', bookingId);
    }

    function handleDeleteBooking(bookingId) {
        fetch(`/api/bookings/${bookingId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                document.getElementById(`booking-${bookingId}`).remove();
                console.log('Booking deleted:', bookingId);
            } else {
                console.error('Failed to delete booking:', bookingId);
            }
        })
        .catch(error => {
            console.error('Error deleting booking:', error);
        });
    }

    function filterBookings(bookings, selectedDate = null) {
        bookingList.innerHTML = ''; 
        bookings.forEach(booking => {
            const bookingDate = new Date(booking.trip_date);
            const timeDifference = today - bookingDate;
            const daysDifference = timeDifference / (1000 * 3600 * 24);

            if ((daysDifference <= 7 && !selectedDate) || (selectedDate && bookingDate.toDateString() === selectedDate.toDateString())) {
                const box = document.createElement('div');
                box.className = 'booking-box';
                box.id = `booking-${booking.id}`;

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
                    <p><span>Date:</span> ${formatDate(booking.trip_date)}</p>
                    <p><span>Payment Method:</span> ${booking.payment_method}</p>
                    <button class="edit-btn" onclick="handleEditBooking(${booking.id})">Edit</button>
                    <button class="delete-btn" onclick="handleDeleteBooking(${booking.id})">Delete</button>
                `;

                bookingList.appendChild(box);
            }
        });
    }

    fetch('/api/bookings')
        .then(response => response.json())
        .then(data => {
            filterBookings(data); 

            const dateFilter = document.createElement('input');
            dateFilter.type = 'date';
            dateFilter.addEventListener('change', (e) => {
                const selectedDate = new Date(e.target.value);
                filterBookings(data, selectedDate);
            });

            bookingList.before(dateFilter); 
        })
        .catch(error => {
            console.error('Error fetching booking data:', error);
        });
});
