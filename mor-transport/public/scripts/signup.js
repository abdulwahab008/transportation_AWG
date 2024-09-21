document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
    });
    const result = await response.json();
    if (response.ok) {
        alert('Signup successful!');
        window.location.href = '/account.html';
    } else {
        alert(result.message || 'Signup failed');
    }
});

// Toggle password visibility
const togglePasswordSignup = document.getElementById('togglePasswordSignup');
const passwordInputSignup = document.getElementById('password');

togglePasswordSignup.addEventListener('click', () => {
    const type = passwordInputSignup.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInputSignup.setAttribute('type', type);
    togglePasswordSignup.textContent = type === 'password' ? '👁️' : '🙈'; // Change icon based on visibility
});
