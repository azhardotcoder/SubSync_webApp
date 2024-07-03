

document.addEventListener('DOMContentLoaded', function() {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    } else {
        firebase.app();
    }

    const database = firebase.database();

    // Function to get the current date in YYYY-MM-DD format
    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(today.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    // Function to generate UID
    function generateUID(currentYear, currentMonth, serialNumber) {
        const yearPart = currentYear.toString().slice(-2);
        const monthPart = currentMonth.toUpperCase();
        const serialPart = String(serialNumber).padStart(3, '0');
        return yearPart + monthPart + serialPart;
    }

    // Function to get the month abbreviation
    function getMonthAbbreviation(monthIndex) {
        const monthAbbreviations = ['JN', 'FB', 'MR', 'AP', 'MY', 'JN', 'JL', 'AU', 'SP', 'OT', 'NV', 'DC'];
        return monthAbbreviations[monthIndex];
    }

    // Automatically fill current date for POD and generate UID
    const podField = document.getElementById('pod');
    if (podField) {
        podField.value = getCurrentDate();
    } else {
        console.error('Element with ID "pod" not found.');
    }

    // Function to get the next serial number from Firebase
    function getNextSerialNumber(year, month, callback) {
        const uidPrefix = year.toString().slice(-2) + getMonthAbbreviation(month);
        database.ref('lastSerialNumbers/' + uidPrefix).once('value').then(snapshot => {
            let serialNumber = snapshot.val() || 0;
            serialNumber++;
            callback(serialNumber);
        });
    }

    function updateUID() {
        const pod = new Date(podField.value);
        const currentYear = pod.getFullYear();
        const currentMonth = pod.getMonth();

        getNextSerialNumber(currentYear, currentMonth, serialNumber => {
            const uid = generateUID(currentYear, getMonthAbbreviation(currentMonth), serialNumber);
            const uidField = document.getElementById('uid');
            if (uidField) {
                uidField.value = uid;
            } else {
                console.error('Element with ID "uid" not found.');
            }

            // Store the updated serial number back to Firebase
            const uidPrefix = currentYear.toString().slice(-2) + getMonthAbbreviation(currentMonth);
            database.ref('lastSerialNumbers/' + uidPrefix).set(serialNumber);
        });
    }

    if (podField) {
        podField.addEventListener('change', updateUID);
    }

    // Initially generate the UID
    updateUID();

    document.getElementById('duration').addEventListener('change', function() {
        const duration = parseInt(this.value);
        const pod = new Date(document.getElementById('pod').value);

        // Calculate the EOD based on the duration
        const eod = new Date(pod);
        eod.setMonth(eod.getMonth() + duration);

        document.getElementById('eod').value = eod.toISOString().split('T')[0];
    });

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
            customerNumber: customerNumber,
            notificationSent: false // Add this line
        }).then(() => {
            showNotification('Subscription added successfully!');
            // Send WhatsApp notification
            // sendWhatsAppNotification('Subscription added successfully!', customerNumber);

            document.getElementById('subscription-form').reset();
            // Reset the POD field to the current date and generate a new UID
            podField.value = getCurrentDate();
            updateUID();
        }).catch(error => {
            showNotification('Failed to add subscription: ' + error.message);
        });
    });
});

