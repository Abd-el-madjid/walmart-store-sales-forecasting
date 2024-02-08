function init() {
            mobiscroll.setOptions({
            locale: mobiscroll.localeAr,
            theme: 'ios',
            themeVariant: 'light'
        });
        
        mobiscroll.select('#demo-multiple-select', {
            inputElement: document.getElementById('demo-multiple-select-input')
        });


  appointment_time_slot();
}  
    
    function appointment_time_slot() {
  
    let currentDay = 0; // Add this line
const parseAppointments = (data) => {
  if (!data) {
    return [];
  }

  const appointmentsList = data.split('$');
  return appointmentsList.map(app => {
    const [dateString, time] = app.split('>');
    const date = new Date(dateString);
    return { date, time };
  });
};

    
const parseWorkDayTimes = (data) => {
  if (!data) {
    return [];
  }

  // Replace French day names with English day names
  data = data.replace(/lundi/g, 'Monday')
             .replace(/mardi/g, 'Tuesday')
             .replace(/mercredi/g, 'Wednesday')
             .replace(/jeudi/g, 'Thursday')
             .replace(/vendredi/g, 'Friday')
             .replace(/samedi/g, 'Saturday')
             .replace(/dimanche/g, 'Sunday');

  const workDayTimesList = data.split('$');
  return workDayTimesList.map(dayTime => {
    const [dayName, morningStartTime, afternoonEndTime] = dayTime.split('>');
    return { dayName, morningStartTime, afternoonEndTime };
  });
};

    
// ... rest of your JavaScript code ...



    const calendarDaysContainers = document.querySelectorAll('.calendar-days');

  calendarDaysContainers.forEach(calendarDays => {
      



              const hour_apointment = calendarDays.dataset.appointmenthour;







    const morningButton = calendarDays.parentNode.parentNode.querySelector("#Morning");
const afternoonButton = calendarDays.parentNode.parentNode.querySelector("#Afternoon");


    





 


      morningButton.addEventListener("click", function () {
        morningButton.classList.add("selected");
        morningButton.nextElementSibling.classList.remove("selected");
    

    
       updateCalendarDays(currentDay, calendarDays);

      });

      afternoonButton.addEventListener("click", function () {
        afternoonButton.classList.add("selected");
        afternoonButton.previousElementSibling.classList.remove("selected");
    
       updateCalendarDays(currentDay, calendarDays);

      });

    


const workdaysData = calendarDays.dataset.workdays;

      const workdays = parseWorkDayTimes(workdaysData); 
      console.log(workdays)

              const appointmentsData = calendarDays.dataset.appointment;
        const appointments = parseAppointments(appointmentsData);
    
  // Update these lines

      // Move these declarations outside the event listeners

   




    
    const leftArrow = calendarDays.parentElement.querySelector('.arrow-left');
    const rightArrow = calendarDays.parentElement.querySelector('.arrow-right');
    const daysToShow = 5;
    
  const chosenSlots = document.querySelectorAll('.calendre_availabile_day_slot');
  
  // Function to generate calendar days HTML
      const generateDaysHTML = (currentDay) => {
  let html = '';
  let daysAdded = 0;
        let dayIndex = currentDay;
        while (daysAdded < daysToShow) {
          // Generate date object for each day
          const date = new Date();
          date.setDate(date.getDate() + dayIndex);
          
 
          // Get dayName of the current date
          const currentDayName = date.toLocaleString('en-US', { weekday: 'long' });

          console.log('currentDayName:', currentDayName);
          // Skip Friday
if (currentDayName !== 'Friday') {
          const workDay = workdays.find(workDay => workDay.dayName === currentDayName);
          console.log('workDay:', workDay);

           
      
      
           
          let morningStartTime, afternoonEndTime;
          if (workDay) {
            morningStartTime = workDay.morningStartTime;
            afternoonEndTime = workDay.afternoonEndTime;
          } else {
            // If no matching workday is found, set default values (or skip the day)
            morningStartTime = '07:00';
            afternoonEndTime = '15:30';
          }







          
          // Convert the start and end times to Date objects
          const startTime = new Date(date);
        
          const endTime = new Date(date);
         
          // Set fixed morning end time and afternoon start time
          const morningEndTime = '12:00';
          const afternoonStartTime = '13:00';
          // Generate HTML for each slot
          let slotHtml = '';
  
          if (document.getElementById('Morning').classList.contains('selected')) {
            startTime.setHours(morningStartTime.split(':')[0], morningStartTime.split(':')[1]);
            console.log(startTime)
            endTime.setHours(morningEndTime.split(':')[0], morningEndTime.split(':')[1]);
            console.log(endTime)
          }
          else if (document.getElementById('Afternoon').classList.contains('selected')) {
            startTime.setHours(afternoonStartTime.split(':')[0], afternoonStartTime.split(':')[1]);
            console.log(startTime)
            endTime.setHours(afternoonEndTime.split(':')[0], afternoonEndTime.split(':')[1]);
            console.log(endTime)
          }

          let count = 0;
          let hiddenSlotHtml = '';
          if (morningStartTime !== '' && afternoonEndTime !== '') {

            while (startTime <= endTime) {
              const slotDate = new Date(startTime);
              const isOccupied = appointments.some(app => app.date.toISOString().slice(0, 10) === slotDate.toISOString().slice(0, 10) && app.time === startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  
              if (count < 3) {
                if (!isOccupied) {
                  slotHtml += `<div class="calendre_availabile_day_slot slot" data-date="${date.toISOString()}">${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>`;
                } else {
                  slotHtml += `<div class="calendre_empty_slot slot"><div class="calendre_empty_slot_lign"></div></div>`;
      
                }
              } else {
                if (!isOccupied) {
                  hiddenSlotHtml += `<div class="calendre_availabile_day_slot  slot hidden" data-date="${date.toISOString()}">${startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>`;
                } else {
                  hiddenSlotHtml += `<div class="calendre_empty_slot  slot hidden"><div class="calendre_empty_slot_lign"></div></div>`;
                }
          
              }


              startTime.setTime(startTime.getTime() +(60/hour_apointment)  * 60000); // 10 minutes
              count++;
            }
          }
          else {
            while (count < 3) {
              slotHtml += `<div class="calendre_empty_slot slot"><div class="calendre_empty_slot_lign"></div></div>`;
              count++;
            }
          }

          // Generate HTML for each day
          html += `
      <div class="calendre_availabile_day">
        <div class="calendre_availabile_day_title">
          <div class="calendre_availabile_day_name">${date.toLocaleString('en-US', { weekday: 'short' })}</div>
          <div class="calendre_availabile_day_date">${date.toLocaleString('en-US', { month: 'short', day: 'numeric' })}</div>
        </div>
        <div class="calendre_availabile_day_slots">
          ${slotHtml}
          ${hiddenSlotHtml}
          ${count > 5 ? `<div class="show-more-btn">More <span class="material-symbols-outlined ">expand_more</span></div>` : '<div class="show-more-btn" style="visibility: hidden;">More <span class="material-symbols-outlined ">expand_more</span></div>'}

          ${hiddenSlotHtml && hiddenSlotHtml !== '' ? `<div class="show-less-btn hidden">Less <span class="material-symbols-outlined ">expand_less</span></div>` : ''}
        </div>
      </div>
  `;
          if (hiddenSlotHtml === '') {
            html = html.replace('More', '');
          }
   daysAdded++;
          }
              // Increment the dayIndex for the next iteration
    dayIndex++;
    }

    return html;
  };
  

      
      
      
      

  // Add event listener to Show More button
  calendarDays.addEventListener('click', (event) => {
    console.log("hhhhhhhhhhhhhhhh")
    if (event.target.classList.contains('show-more-btn')) {
      const slotsContainer = event.target.parentNode;
      const hiddenSlots = slotsContainer.querySelectorAll('.hidden');
      hiddenSlots.forEach((slot) => {
        slot.classList.remove('hidden');
      });
      event.target.classList.add('hidden');
      const showLessBtn = slotsContainer.querySelector('.show-less-btn');
      showLessBtn.classList.remove('hidden');
   
    } else if (event.target.classList.contains('show-less-btn')) {
      const slotsContainer = event.target.parentNode;
      const allSlots = slotsContainer.querySelectorAll('.slot');
      
      const hiddenSlots = slotsContainer.querySelectorAll('.hidden');
      hiddenSlots.forEach((slot) => {
        slot.classList.remove('hidden');
      });
      allSlots.forEach((slot, index) => {
        if (index >= 3) {
          slot.classList.add('hidden');
        }
      });
      event.target.classList.add('hidden');
      const showMoreBtn = slotsContainer.querySelector('.show-more-btn');
      showMoreBtn.classList.remove('hidden');
    }
  });

  
  
  
   // Function to update calendar days HTML
const updateCalendarDays = (currentDay, calendarDays) => {
    calendarDays.innerHTML = generateDaysHTML(currentDay);
    const newChosenSlots = document.querySelectorAll('.calendre_availabile_day_slot');
    newChosenSlots.forEach(slot => {
      slot.addEventListener('click', () => {
        newChosenSlots.forEach(slot => {
          slot.style.backgroundColor = '#E61F57';
          slot.style.color = 'white';
          
        });
        slot.style.backgroundColor = '#46807F';
        slot.style.color = 'white';
        const time = slot.textContent.trim();
        const rdvTime = document.getElementById('rdv_time');
        rdvTime.value = time;
        
        const slotDate = new Date(slot.getAttribute('data-date'));
        const currentYear = new Date().getFullYear();
        slotDate.setFullYear(currentYear);
        const rdvDate = document.getElementById('rdv_date');
        rdvDate.value = slotDate.toISOString().slice(0,10);


// Format the date as "Thursday, March 2, 2023"
const formattedDate = slotDate.toLocaleString('en-US', {
 
  day: 'numeric',
  month: 'long',
  year: 'numeric'
});
// Combine the date and time in the desired format
const combinedDateTime = `${formattedDate} on ${time}`;


const selectedTimes = document.querySelectorAll('.p_date_time');

selectedTimes.forEach(selectedTime => {
  selectedTime.textContent = "the  " + combinedDateTime;
});



      });
    });
    
  };
  
  
  // Click event listener for left arrow
  leftArrow.addEventListener('click', () => {
    if (currentDay > 0) {
      currentDay -= daysToShow;
     updateCalendarDays(currentDay, calendarDays);

    }
  });
  
  // Click event listener for right arrow
  rightArrow.addEventListener('click', () => {
    currentDay += daysToShow;
   updateCalendarDays(currentDay, calendarDays);

  });
  
 
  






  function checkMediaQuery() {
    if (window.matchMedia('(max-width: 750px)').matches) {
      // Screen width is 750 pixels or less
      $(".criter_list").add('none');
    } else {
      // Screen width is greater than 750 pixels
      $(".criter_list").remove('none');
    }
  }


   // Initial call to update calendar days HTML
  updateCalendarDays(currentDay, calendarDays);


    // Call the function on page load and whenever the window is resized
    checkMediaQuery();
    window.addEventListener('resize', checkMediaQuery);
    // Initial call to update calendar days HTML
     // Add this line to trigger the click event on the morning button
  });
};









function toggleForm() {
  const form_scanner = $("#form_scanner");
 
 
      form_scanner.toggleClass('none');
    console.log("add button clicked");

}


