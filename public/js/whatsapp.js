

function sendWhatsAppNotification(message) {
  
   
    fetch('/send-whatsapp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: message,
            to: "+918800808452",
        }),
    })
    .then(response => response.json())
    .then(data => {
   
        if (data.success) {
            
            console.log('WhatsApp notification sent successfully.');
        } else {
            console.error('Failed to send WhatsApp notification:', data.error);
        }
    })
    .catch(error => {
        console.error('Error sending WhatsApp notification:', error);
    });
}

