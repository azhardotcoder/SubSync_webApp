function sendWhatsAppNotification(message) {

    fetch('/send-whatsapp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: message,
            to: "+917897894523",
        }),
    })
    .then(response => response.json())
    .then(data => {
   
        if (data.success) {
            
            console.log('Message sent successfully.');
        } else {
            console.error('Failed to send notification:', data.error);
        }
    })
    .catch(error => {
        console.error('Error sending notification:', error);
    });
}


