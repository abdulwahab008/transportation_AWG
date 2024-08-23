document.addEventListener('DOMContentLoaded', () => {
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async function populateBookingTable() {
        const bookings = await fetchData('http://localhost:5000/bookings');
        const bookingTableBody = document.getElementById('booking-table-body');
        bookingTableBody.innerHTML = '';
        bookings?.forEach(booking => {
            const row = document.createElement('tr');
            Object.values(booking).forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });
            bookingTableBody.appendChild(row);
        });
    }

    async function populatePaymentStatusTable() {
        const payments = await fetchData('http://localhost:5000/payments');
        const paymentTableBody = document.getElementById('payment-status-body');
        paymentTableBody.innerHTML = '';
        payments?.forEach(payment => {
            const row = document.createElement('tr');
            Object.values(payment).forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });
            paymentTableBody.appendChild(row);
        });
    }

    document.querySelectorAll('.navbars a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            document.querySelectorAll('.dashboard-section').forEach(section => {
                if (section.id === sectionId) {
                    section.classList.remove('hidden');
                } else {
                    section.classList.add('hidden');
                }
            });
        });
    });

    populateBookingTable();
    populatePaymentStatusTable();
});
