function loadSubscriptionData() {
    const database = firebase.database();
    database.ref('subscriptions').on('value', function(snapshot) {
        const subscriptions = snapshot.val();
        const table = document.getElementById('subscription-table').getElementsByTagName('tbody')[0];
        table.innerHTML = ''; // Clear the table

        for (let key in subscriptions) {
            addSubscriptionToTable(subscriptions[key], key);
        }
    });
}

function addSubscriptionToTable(subscription, key) {
    const table = document.getElementById('subscription-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.dataset.key = key;

    newRow.innerHTML = `
        <td>${subscription.subscription}</td>
        <td>${subscription.uid}</td>
        <td>${formatDate(subscription.pod)}</td>
        <td>${formatDate(subscription.eod)}</td>
        <td>${subscription.ar}</td>
        <td>${subscription.pd}</td>
        <td>${subscription.customerNumber}</td>
        <td>
            <button onclick="editSubscription(this)">Edit</button>
            <button onclick="saveSubscription('${key}', this)" style="display:none;">Save</button>
            <button onclick="cancelEdit(this)" style="display:none;">Cancel</button>
        </td>
    `;
}

// Helper function to convert date to DD/MM/YYYY format
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Edit subscription
function editSubscription(button) {
    const row = button.parentElement.parentElement;
    const cells = row.getElementsByTagName('td');

    // Store original values
    row.dataset.originalValues = JSON.stringify({
        subscription: cells[0].innerText,
        uid: cells[1].innerText,
        pod: cells[2].innerText,
        eod: cells[3].innerText,
        ar: cells[4].innerText,
        pd: cells[5].innerText,
        customerNumber: cells[6].innerText
    });

    for (let i = 0; i < cells.length - 1; i++) {
        const cell = cells[i];
        const input = document.createElement('input');
        input.value = cell.innerText;
        cell.innerText = '';
        cell.appendChild(input);
    }

    button.style.display = 'none';
    button.nextElementSibling.style.display = 'inline';
    button.nextElementSibling.nextElementSibling.style.display = 'inline';
}

// Save subscription changes
function saveSubscription(key, button) {
    const row = button.parentElement.parentElement;
    const cells = row.getElementsByTagName('td');

    const updatedSubscription = {
        subscription: cells[0].children[0].value,
        uid: cells[1].children[0].value,
        pod: formatDateForSave(cells[2].children[0].value),
        eod: formatDateForSave(cells[3].children[0].value),
        ar: cells[4].children[0].value,
        pd: cells[5].children[0].value,
        customerNumber: cells[6].children[0].value
    };

    firebase.database().ref('subscriptions/' + key).update(updatedSubscription).then(() => {
        for (let i = 0; i < cells.length - 1; i++) {
            cells[i].innerText = cells[i].children[0].value;
        }
        button.style.display = 'none';
        button.previousElementSibling.style.display = 'inline';
        button.nextElementSibling.style.display = 'none';
        showNotification("Subscription updated successfully!");
    });
}

// Cancel edit and revert changes
function cancelEdit(button) {
    const row = button.parentElement.parentElement;
    const cells = row.getElementsByTagName('td');
    const originalValues = JSON.parse(row.dataset.originalValues);

    cells[0].innerText = originalValues.subscription;
    cells[1].innerText = originalValues.uid;
    cells[2].innerText = originalValues.pod;
    cells[3].innerText = originalValues.eod;
    cells[4].innerText = originalValues.ar;
    cells[5].innerText = originalValues.pd;
    cells[6].innerText = originalValues.customerNumber;

    button.style.display = 'none';
    button.previousElementSibling.style.display = 'none';
    button.previousElementSibling.previousElementSibling.style.display = 'inline';
}

// Helper function to convert date from DD/MM/YYYY to YYYY-MM-DD for saving
function formatDateForSave(dateString) {
    const parts = dateString.split('/');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

// Search and filter functionality with highlighting and month name handling
function searchSubscriptions() {
    const input = document.getElementById('search').value.toLowerCase();
    const table = document.getElementById('subscription-table').getElementsByTagName('tbody')[0];
    const rows = table.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let match = false;
        for (let j = 0; j < cells.length; j++) {
            const cell = cells[j];
            const cellText = cell.innerText.toLowerCase();

            if (cellText.includes(input)) {
                match = true;
                const regex = new RegExp(`(${input})`, 'gi');
                cell.innerHTML = cell.innerText.replace(regex, "<span class='highlight'>$1</span>");
            } else {
                cell.innerHTML = cell.innerText; // Clear previous highlights
            }
        }
        rows[i].style.display = match ? '' : 'none';
    }
}

// Function to show notifications
function showNotification(message) {
    const notificationDiv = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerText = message;
    notificationDiv.appendChild(notification);
    setTimeout(() => {
        notificationDiv.removeChild(notification);
    }, 5000); // Remove notification after 5 seconds
}

// Initial check for expiring subscriptions
checkExpiringSubscriptions();

// Check for expiring subscriptions every day
setInterval(checkExpiringSubscriptions, 86400000); // 86400000 ms = 24 hours

// Function to check expiring subscriptions
function checkExpiringSubscriptions() {
    const today = new Date().toISOString().split('T')[0];
    firebase.database().ref('subscriptions').once('value', function(snapshot) {
        const subscriptions = snapshot.val();
        for (let key in subscriptions) {
            if (subscriptions[key].eod === today) {
                showNotification(`Subscription for ${subscriptions[key].subscription} (UID: ${subscriptions[key].uid}) is expiring today!`);
            }
        }
    });
}
