
let currentLanguage = 'en';

// Language translations
const translations = {
    en: {
        signInText: 'Sign in to your account',
        username: 'Username',
        password: 'Password',
        signIn: 'Sign In',
        noAccount: "Don't have an account?",
        signUpHere: 'Sign up here',
        createAccount: 'Create Account',
        email: 'Email',
        firstName: 'First Name',
        lastName: 'Last Name',
        dateOfBirth: 'Date of Birth',
        backToLogin: 'Back to Login',
        enterUsername: 'Enter your username',
        enterPassword: 'Enter your password',
        chooseUsername: 'Choose a username',
        enterEmail: 'Enter your email',
        choosePassword: 'Choose a password'
    },
    fr: {
        signInText: 'Connectez-vous à votre compte',
        username: "Nom d'utilisateur",
        password: 'Mot de passe',
        signIn: 'Se connecter',
        noAccount: "Vous n'avez pas de compte?",
        signUpHere: 'Inscrivez-vous ici',
        createAccount: 'Créer un compte',
        email: 'Email',
        firstName: 'Prénom',
        lastName: 'Nom',
        dateOfBirth: 'Date de Naissance',
        backToLogin: 'Retour à la connexion',
        enterUsername: "Entrez votre nom d'utilisateur",
        enterPassword: 'Entrez votre mot de passe',
        chooseUsername: "Choisissez un nom d'utilisateur",
        enterEmail: 'Entrez votre email',
        choosePassword: 'Choisissez un mot de passe'
    }
};

function t(key) {
    return translations[currentLanguage][key] || translations.en[key] || key;
}

function updateLanguage() {
    document.getElementById('signInText').textContent = t('signInText');
    document.getElementById('usernameLabel').textContent = t('username');
    document.getElementById('passwordLabel').textContent = t('password');
    document.getElementById('signInBtn').textContent = t('signIn');
    document.getElementById('noAccountText').textContent = t('noAccount');
    document.getElementById('signUpLink').textContent = t('signUpHere');
    document.getElementById('createAccountTitle').textContent = t('createAccount');
    document.getElementById('regFirstNameLabel').textContent = t('firstName');
    document.getElementById('regLastNameLabel').textContent = t('lastName');
    document.getElementById('regEmailLabel').textContent = t('email');
    document.getElementById('regDateOfBirthLabel').textContent = t('dateOfBirth');
    document.getElementById('regUsernameLabel').textContent = t('username');
    document.getElementById('regPasswordLabel').textContent = t('password');
    document.getElementById('createAccountBtn').textContent = t('createAccount');
    document.getElementById('backToLoginBtn').textContent = t('backToLogin');
    
    // Update placeholders
    document.getElementById('username').placeholder = t('enterUsername');
    document.getElementById('password').placeholder = t('enterPassword');
    document.getElementById('regUsername').placeholder = t('chooseUsername');
    document.getElementById('regEmail').placeholder = t('enterEmail');
    document.getElementById('regPassword').placeholder = t('choosePassword');
}

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', function() {
    // Load saved language preference
    currentLanguage = localStorage.getItem('language') || 'en';
    document.getElementById('languageSelect').value = currentLanguage;
    updateLanguage();
    
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
        checkSession(sessionId);
    }
    
    setupForms();
    setupLanguageSelector();
});

function setupLanguageSelector() {
    document.getElementById('languageSelect').addEventListener('change', function(e) {
        currentLanguage = e.target.value;
        localStorage.setItem('language', currentLanguage);
        updateLanguage();
    });
}

function setupForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    
    // Setup username suggestions
    const firstNameInput = document.getElementById('regFirstName');
    const lastNameInput = document.getElementById('regLastName');
    const emailInput = document.getElementById('regEmail');
    
    const triggerSuggestions = () => {
        if (firstNameInput.value && lastNameInput.value && emailInput.value) {
            generateUsernameSuggestions();
        }
    };
    
    firstNameInput.addEventListener('blur', triggerSuggestions);
    lastNameInput.addEventListener('blur', triggerSuggestions);
    emailInput.addEventListener('blur', triggerSuggestions);
}

async function generateUsernameSuggestions() {
    const firstName = document.getElementById('regFirstName').value;
    const lastName = document.getElementById('regLastName').value;
    const email = document.getElementById('regEmail').value;
    
    try {
        const response = await axios.post('/api/suggest-usernames', {
            firstName,
            lastName,
            email
        });
        
        const suggestions = response.data.suggestions;
        const suggestionsContainer = document.getElementById('usernameSuggestions');
        const suggestionsList = document.getElementById('suggestionsList');
        
        if (suggestions.length > 0) {
            suggestionsList.innerHTML = suggestions.map(suggestion => 
                `<button type="button" onclick="selectUsername('${suggestion}')" class="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm hover:bg-opacity-30 transition-colors">${suggestion}</button>`
            ).join('');
            suggestionsContainer.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Error generating suggestions:', error);
    }
}

function selectUsername(username) {
    document.getElementById('regUsername').value = username;
    document.getElementById('usernameSuggestions').classList.add('hidden');
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
    
    const firstName = document.getElementById('regFirstName').value;
    const lastName = document.getElementById('regLastName').value;
    const email = document.getElementById('regEmail').value;
    const dateOfBirth = document.getElementById('regDateOfBirth').value;
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    
    try {
        const response = await axios.post('/api/register', {
            firstName,
            lastName,
            email,
            dateOfBirth,
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
