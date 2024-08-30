document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
    });
    const result = await response.json();
    if (response.ok) {
       
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.userId);
        window.location.href = '/userdashboard.html';
    } else {
        alert(result.message || 'Login failed');
    }
});