document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            const section = this.dataset.section;
            document.querySelectorAll('.table-container').forEach(container => {
                container.classList.remove('active');
            });
            document.getElementById(section).classList.add('active');
        });
    });

    fetchAccounts();
    fetchBookings();
    fetchServices();
});

async function fetchAccounts() {
    try {
        const response = await fetch('/accounts');
        const accounts = await response.json();
        const table = document.getElementById('account-details-table');
        table.innerHTML = ''; // Clear existing table rows
        accounts.forEach(account => {
            const row = table.insertRow();
            row.insertCell(0).innerText = account.mobileNumber;
            row.insertCell(1).innerText = account.email;
            row.insertCell(2).innerText = account.name;
            row.insertCell(3).innerText = account.username;
            row.insertCell(4).innerHTML = `<button onclick="editAccount('${account._id}')">Edit</button>
                                            <button onclick="deleteAccount('${account._id}')">Delete</button>`;
        });
    } catch (error) {
        console.error('Error fetching accounts:', error);
    }
}

async function addAccount() {
    const mobileNumber = document.getElementById('mobileNumber').value;
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;

    try {
        const response = await fetch('/accounts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mobileNumber,
                email,
                name,
                username
            })
        });
        await response.json();
        fetchAccounts(); // Refresh the table
    } catch (error) {
        console.error('Error adding account:', error);
    }
}

async function editAccount(id) {
    const mobileNumber = prompt('Enter new mobile number:');
    const email = prompt('Enter new email:');
    const name = prompt('Enter new name:');
    const username = prompt('Enter new username:');

    try {
        const response = await fetch(`/accounts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mobileNumber,
                email,
                name,
                username
            })
        });
        await response.json();
        fetchAccounts(); // Refresh the table
    } catch (error) {
        console.error('Error editing account:', error);
    }
}

async function deleteAccount(id) {
    try {
        await fetch(`/accounts/${id}`, {
            method: 'DELETE'
        });
        fetchAccounts(); // Refresh the table
    } catch (error) {
        console.error('Error deleting account:', error);
    }
}

async function fetchBookings() {
    try {
        const response = await fetch('/bookings');
        const bookings = await response.json();
        const table = document.getElementById('booking-details-table');
        table.innerHTML = ''; // Clear existing table rows
        bookings.forEach(booking => {
            const row = table.insertRow();
            row.insertCell(0).innerText = booking.bookingID;
            row.insertCell(1).innerText = booking.user;
            row.insertCell(2).innerText = booking.car;
            row.insertCell(3).innerText = booking.date;
            row.insertCell(4).innerText = booking.price;
            row.insertCell(5).innerHTML = `<button onclick="editBooking('${booking._id}')">Edit</button>
                                            <button onclick="deleteBooking('${booking._id}')">Delete</button>`;
        });
    } catch (error) {
        console.error('Error fetching bookings:', error);
    }
}

async function addBooking() {
    const bookingID = document.getElementById('bookingID').value;
    const user = document.getElementById('user').value;
    const car = document.getElementById('car').value;
    const date = document.getElementById('date').value;
    const price = document.getElementById('price').value;

    try {
        const response = await fetch('/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bookingID,
                user,
                car,
                date,
                price
            })
        });
        await response.json();
        fetchBookings(); // Refresh the table
    } catch (error) {
        console.error('Error adding booking:', error);
    }
}

async function editBooking(id) {
    const bookingID = prompt('Enter new booking ID:');
    const user = prompt('Enter new user:');
    const car = prompt('Enter new car:');
    const date = prompt('Enter new date:');
    const price = prompt('Enter new price:');

    try {
        const response = await fetch(`/bookings/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bookingID,
                user,
                car,
                date,
                price
            })
        });
        await response.json();
        fetchBookings(); // Refresh the table
    } catch (error) {
        console.error('Error editing booking:', error);
    }
}

async function deleteBooking(id) {
    try {
        await fetch(`/bookings/${id}`, {
            method: 'DELETE'
        });
        fetchBookings(); // Refresh the table
    } catch (error) {
        console.error('Error deleting booking:', error);
    }
}

async function fetchServices() {
    try {
        const response = await fetch('/services');
        const services = await response.json();
        const table = document.getElementById('services-table');
        table.innerHTML = ''; // Clear existing table rows
        services.forEach(service => {
            const row = table.insertRow();
            row.insertCell(0).innerText = service.car;
            row.insertCell(1).innerText = service.bookingPrice;
            row.insertCell(2).innerText = service.city;
            row.insertCell(3).innerHTML = `<button onclick="editService('${service._id}')">Edit</button>
                                            <button onclick="deleteService('${service._id}')">Delete</button>`;
        });
    } catch (error) {
        console.error('Error fetching services:', error);
    }
}

async function addService() {
    const car = document.getElementById('carService').value;
    const bookingPrice = document.getElementById('bookingPrice').value;
    const city = document.getElementById('city').value;

    try {
        const response = await fetch('/services', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                car,
                bookingPrice,
                city
            })
        });
        await response.json();
        fetchServices(); // Refresh the table
    } catch (error) {
        console.error('Error adding service:', error);
    }
}

async function editService(id) {
    const car = prompt('Enter new car:');
    const bookingPrice = prompt('Enter new booking price:');
    const city = prompt('Enter new city:');

    try {
        const response = await fetch(`/services/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                car,
                bookingPrice,
                city
            })
        });
        await response.json();
        fetchServices(); // Refresh the table
    } catch (error) {
        console.error('Error editing service:', error);
    }
}

async function deleteService(id) {
    try {
        await fetch(`/services/${id}`, {
            method: 'DELETE'
        });
        fetchServices(); // Refresh the table
    } catch (error) {
        console.error('Error deleting service:', error);
    }
}
