document.addEventListener('DOMContentLoaded', function() {
    // Ensure Firebase is properly initialized
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    } else {
        firebase.app(); // if already initialized, use that one
    }

    const database = firebase.database();

    // Automatically generate UID based on the current date
    document.getElementById('pod').addEventListener('change', function() {
        const pod = new Date(this.value);
        const uid = pod.getFullYear().toString().slice(-2) + 
                    ('0' + (pod.getMonth() + 1)).slice(-2) + 
                    ('0' + pod.getDate()).slice(-2) + 
                    Math.random().toString(36).substr(2, 5).toUpperCase();
        document.getElementById('uid').value = uid;
    });

    // Automatically fill current date for POD
    document.getElementById('pod').valueAsDate = new Date();

    // Automatically calculate EOD based on the selected duration
    document.getElementById('duration').addEventListener('change', function() {
        const duration = parseInt(this.value);
        const pod = new Date(document.getElementById('pod').value);
        const eod = new Date(pod.setMonth(pod.getMonth() + duration));
        document.getElementById('eod').valueAsDate = eod;
    });

    // Handle form submission
    document.getElementById('subscription-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const subscription = document.getElementById('subscription').value;
        const uid = document.getElementById('uid').value;
        const pod = document.getElementById('pod').value;
        const eod = document.getElementById('eod').value;
        const ar = document.getElementById('ar').value;
        const pd = document.getElementById('pd').value;
        const customerNumber = document.getElementById('customer-number').value;

        const newSubscriptionRef = database.ref('subscriptions').push();
        newSubscriptionRef.set({
            subscription: subscription,
            uid: uid,
            pod: pod,
            eod: eod,
            ar: ar,
            pd: pd,
            customerNumber: customerNumber
        }).then(() => {
            alert('Subscription added successfully!');
            document.getElementById('subscription-form').reset();
        }).catch(error => {
            alert('Failed to add subscription: ' + error.message);
        });
    });
});
