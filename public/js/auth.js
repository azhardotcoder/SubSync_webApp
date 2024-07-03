document.addEventListener('DOMContentLoaded', function() {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    } else {
        firebase.app();
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

    const phoneForm = document.getElementById('login-form');
    if (phoneForm) {
        phoneForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const phoneNumber = document.getElementById('phone-number').value;
            const appVerifier = window.recaptchaVerifier;

            auth.signInWithPhoneNumber(phoneNumber, appVerifier)
                .then(function(confirmationResult) {
                    window.confirmationResult = confirmationResult;
                    document.getElementById('login-form').style.display = 'none';
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

    auth.onAuthStateChanged(user => {
        if (!user && window.location.pathname !== '/login.html') {
            window.location.href = "login.html";
        }
    });

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

let allNotifications = [];

function showNotification(message) {
    const notificationDiv = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    notificationDiv.appendChild(notification);

    // Save the notification to the list of all notifications
    allNotifications.push(message);

    // Force reflow to enable CSS transition
    notification.offsetHeight; 
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notificationDiv.removeChild(notification);
        }, 500); // Wait for the transition to complete before removing
    }, 5000); // Show the notification for 5 seconds
}

function showAllNotifications() {
    const modal = document.getElementById('notifications-modal');
    const list = document.getElementById('all-notifications-list');
    list.innerHTML = '';

    allNotifications.forEach(notification => {
        const listItem = document.createElement('li');
        listItem.innerText = notification;
        list.appendChild(listItem);
    });

    modal.style.display = 'flex';
}

function closeNotificationsModal() {
    const modal = document.getElementById('notifications-modal');
    modal.style.display = 'none';
}


