document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const response = await fetch('/api/auth/ownerlogin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
    });
    const result = await response.json();
    if (response.ok) {
        localStorage.setItem('token', result.token);
      
        window.location.href = '/ownerdashboard.html';
    } else {
        alert(result.message || 'Login failed');
    }
});