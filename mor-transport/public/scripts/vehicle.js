document.getElementById('vehicle-form').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('Form submitted');
    alert( 'Vehicle added successfully');
    const formData = new FormData(this);
    window.location.reload();
    fetch('/api/vehicles', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        // console.log('Response status:', response.status); 
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // console.log('Success:', data);
        showMessage(data.message || 'Vehicle added successfully', 'success');
        this.reset(); 
    })
    .catch(error => {
        // console.error('Error:', error);
        showMessage('Failed to add vehicle. Please try again.', 'error');
    });
});

function showMessage(message, type) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;
    messageElement.className = type;
    messageElement.style.display = 'block';
    
    
    void messageElement.offsetWidth;
    
    messageElement.classList.add('visible');

    // console.log(`Showing message: ${message} (${type})`);

    setTimeout(() => {
        messageElement.classList.remove('visible');
        setTimeout(() => {
            messageElement.style.display = 'none';
            console.log('Message hidden'); 
        }, 300);
    }, 5000);
}


window.onerror = function(message, source, lineno, colno, error) {
    // console.error('Global error:', message, 'at', source, lineno, colno, error);
};