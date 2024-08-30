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

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => editVehicle(vehicle.id));

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => deleteVehicle(vehicle.id));

                carInfo.appendChild(h3);
                carInfo.appendChild(p);
                carInfo.appendChild(editButton);
                carInfo.appendChild(deleteButton);
                carDiv.appendChild(img);
                carDiv.appendChild(carInfo);
                carSelection.appendChild(carDiv);
                carContainer.appendChild(carSelection);
            });
        })
        .catch(error => console.error('Error fetching vehicles:', error));
});

function editVehicle(id) {
    const newPrice = prompt('Enter new vehicle price:');

    if (newPrice) {
        fetch(`/api/vehicles/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ vehicle_price: newPrice }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                location.reload();
            }
        })
        .catch(error => console.error('Error editing vehicle:', error));
    }
}



function deleteVehicle(id) {
    if (confirm('Are you sure you want to delete this vehicle?')) {
        fetch(`/api/vehicles/${id}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);
                location.reload();
            }
        })
        .catch(error => console.error('Error deleting vehicle:', error));
    }
}