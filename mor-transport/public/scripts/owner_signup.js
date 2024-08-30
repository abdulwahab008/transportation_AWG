document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const response = await fetch('/api/auth/ownersignup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
    });
    const result = await response.json();
    if (response.ok) {
        alert('Signup successful!');
        window.location.href = '/ownerlogin.html';
    } else {
        alert(result.message || 'Signup failed');
    }
});