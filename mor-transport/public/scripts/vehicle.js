document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('vehicle-form');
    const messageElement = document.getElementById('message');
    const responseElement = document.getElementById('response-area');

    if (!form || !messageElement || !responseElement) {
        console.error('Required elements not found');
        return;
    }
    // window.location.reload();
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form from submitting normally

        const formData = new FormData(form);

        // Display submitting message
        messageElement.innerHTML = '<p style="color: blue;">Vehicle Added SuccessFully</p>';
        messageElement.style.display = 'block';
        setTimeout(() => {
            form.reset(); // Reset the form fields
            messageElement.style.display = 'none'; // Hide the message after form reset
            responseElement.style.display = 'none'; // Hide response area
        }, 3000);
        fetch('/api/vehicles', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Success: Display success message
            messageElement.innerHTML = '<p style="color: green;">Vehicle added successfully</p>';
            displayResponse(data);
            window.location.reload();
            // After 2 seconds, reset the form and hide the message
            setTimeout(() => {
                form.reset(); // Reset the form fields
                messageElement.style.display = 'none'; // Hide the message after form reset
                responseElement.style.display = 'none'; // Hide response area
            }, 2000);
        })
        
        .catch(error => {
            // Error: Display error message
            messageElement.innerHTML = '<p style="color: red;">Failed to add vehicle. Please try again.</p>';
            displayResponse({ error: error.message });
        });
    });

    // Helper function to display response details
    function displayResponse(data) {
        let html = '<h3>Response:</h3><ul>';
        for (const [key, value] of Object.entries(data)) {
            html += `<li><strong>${key}:</strong> ${value}</li>`;
        }
        html += '</ul>';
        responseElement.innerHTML = html;
        responseElement.style.display = 'block';
    }
});
