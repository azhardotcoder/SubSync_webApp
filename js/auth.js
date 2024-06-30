document.addEventListener('DOMContentLoaded', function() {
    // Ensure Firebase is properly initialized
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    } else {
        firebase.app(); // if already initialized, use that one
    }

    const auth = firebase.auth();

    // Google sign-in
    const googleSignInButton = document.getElementById('google-signin');
    if (googleSignInButton) {
        googleSignInButton.addEventListener('click', function() {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider)
                .then(result => {
                    alert("User signed in with Google!");
                    window.location.href = "index.html";
                })
                .catch(error => {
                    alert(error.message);
                });
        });
    }

    // Phone sign-in
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': function(response) {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
    });

    const phoneForm = document.getElementById('phone-form');
    if (phoneForm) {
        phoneForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const phoneNumber = document.getElementById('phone-number').value;
            const appVerifier = window.recaptchaVerifier;

            auth.signInWithPhoneNumber(phoneNumber, appVerifier)
                .then(function(confirmationResult) {
                    window.confirmationResult = confirmationResult;
                    document.getElementById('phone-form').style.display = 'none';
                    document.getElementById('verification-form').style.display = 'block';
                })
                .catch(function(error) {
                    alert(error.message);
                });
        });
    }

    const verificationForm = document.getElementById('verification-form');
    if (verificationForm) {
        verificationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const code = document.getElementById('verification-code').value;
            window.confirmationResult.confirm(code)
                .then(function(result) {
                    alert("User signed in with phone number!");
                    window.location.href = "index.html";
                })
                .catch(function(error) {
                    alert(error.message);
                });
        });
    }

    // Check user authentication status
    auth.onAuthStateChanged(user => {
        if (!user && window.location.pathname !== '/login.html') {
            window.location.href = "login.html";
        }
    });

    // Logout
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            auth.signOut().then(() => {
                alert("User logged out successfully!");
                window.location.href = "login.html";
            });
        });
    }
});
