


// Functions to execute when DOM has loaded
function init(){

    // to be displayed on the console, to be sure that the JS code is running
    console.log("App is initialized")
    
    // get existing channels from mock file or database
    Notifications = mockNotification;


    
  

    // display the channels
    displaynotification();

   
}
//---------------- Channels-----------------------------------



function displaynotification() {
  const regularElement = document.getElementById('notification_dashboard');
  regularElement.innerHTML = "";

  var notificationCount = 0; // Calculate the number of notifications
  const patientId = regularElement.getAttribute('data-patient'); // Retrieve the patient ID from the data attribute

  Notifications.forEach(Notification => {
    if (Notification.distination === patientId) {
      notificationCount = +1;
      // Check if the distination is the same as the patient ID
      const liElement = document.createElement('li');
      liElement.classList.add('bordered-block', 'notification');

      const notificationTypeElement = document.createElement('div');
      notificationTypeElement.classList.add('notification__type', 'notification__type--1');
      liElement.appendChild(notificationTypeElement);

      const notificationDataElement = document.createElement('div');
      notificationDataElement.classList.add('notification__data');
      liElement.appendChild(notificationDataElement);

      const notificationContent1 = document.createElement('div');
      notificationContent1.innerHTML = `
        <strong>${Notification.createdBy}</strong>
        ${Notification.text}
      `;
      notificationDataElement.appendChild(notificationContent1);

      const notificationContent2 = document.createElement('div');
      notificationContent2.classList.add('indent-top');
      const notificationLink = document.createElement('a');
      notificationLink.classList.add('text-style--bold');
      notificationLink.setAttribute('psimsg', 'alert.dismissAlert');
      
      notificationContent2.appendChild(notificationLink);
      notificationDataElement.appendChild(notificationContent2);

      const notificationHideElement = document.createElement('div');
      notificationHideElement.classList.add('notification__hide');
      const notificationHideIcon = document.createElement('span');
      notificationHideIcon.classList.add('material-symbols-outlined');
      notificationHideIcon.textContent = 'disabled_by_default';
      notificationHideElement.appendChild(notificationHideIcon);
      liElement.appendChild(notificationHideElement);

      regularElement.appendChild(liElement);

       const notificationBubble = document.getElementById('notification-bubble');
  notificationBubble.textContent = notificationCount;
  console.log(`Total number of notifications: ${notificationCount}`);
    }
  });

 
}
