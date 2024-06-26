document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Sample check for credentials (username: user, password: pass)
    if (username === 'ASHOK' && password === '26-06-2024') {
        window.location.href = '4.html';
    } else {
        document.getElementById('error-message').textContent = 'Invalid username or password';
    }
});
