
// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
        checkSession(sessionId);
    }
    
    setupForms();
});

function setupForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
}

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await axios.post('/api/login', {
            username,
            password
        });
        
        if (response.data.success) {
            localStorage.setItem('sessionId', response.data.sessionId);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            alert(`Welcome ${response.data.user.isAdmin ? 'Admin' : ''} ${response.data.user.username}!`);
            
            // Redirect to main app
            window.location.href = '/';
        }
    } catch (error) {
        console.error('Login error:', error);
        alert(error.response?.data?.error || 'Login failed. Please try again.');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    
    try {
        const response = await axios.post('/api/register', {
            username,
            password
        });
        
        if (response.data.success) {
            alert('Account created successfully! Please log in.');
            showLoginForm();
            document.getElementById('username').value = username;
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert(error.response?.data?.error || 'Registration failed. Please try again.');
    }
}

async function checkSession(sessionId) {
    try {
        const response = await axios.get('/api/me', {
            headers: {
                'X-Session-Id': sessionId
            }
        });
        
        if (response.data.user) {
            // User is already logged in, redirect to main app
            window.location.href = '/';
        }
    } catch (error) {
        // Session expired or invalid, remove from localStorage
        localStorage.removeItem('sessionId');
        localStorage.removeItem('user');
    }
}

function showRegisterForm() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

function showLoginForm() {
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
}
