document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/vehicles')
        .then(response => response.json())
        .then(data => {
            const carContainer = document.getElementById('car-container');

            data.forEach(vehicle => {
                const carSelection = document.createElement('div');
                carSelection.className = 'car-selection';

                const carDiv = document.createElement('div');
                carDiv.className = 'car';

                const img = document.createElement('img');
                img.src = `/uploads/${vehicle.vehicle_image}`;
                img.alt = vehicle.vehicle_name;

                const carInfo = document.createElement('div');
                carInfo.className = 'car-info';

                const h3 = document.createElement('h3');
                h3.textContent = vehicle.vehicle_name;

                const p = document.createElement('p');
                p.textContent = `Price: ${vehicle.vehicle_price} SAR/day`;

                const button = document.createElement('button');
                button.dataset.car = vehicle.vehicle_name;
                button.dataset.price = vehicle.vehicle_price;

                const link = document.createElement('a');
                link.href = `bookingform.html?car=${encodeURIComponent(vehicle.vehicle_name)}&price=${vehicle.vehicle_price}`;
                link.textContent = 'Book';

                button.appendChild(link);
                carInfo.appendChild(h3);
                carInfo.appendChild(p);
                carInfo.appendChild(button);
                carDiv.appendChild(img);
                carDiv.appendChild(carInfo);
                carSelection.appendChild(carDiv);
                carContainer.appendChild(carSelection);
            });
        })
        .catch(error => console.error('Error fetching vehicles:', error));
});