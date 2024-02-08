   function blood_info() {
    const familieName = document.querySelector('.familie_name').textContent.trim();
   
    const familie_name = document.querySelector('input[name="familie_name"]');
    
    familie_name.value = familieName;
    
  }

    function toggleForm() {
    const form_add = $("#form_add");
   
   
        form_add.toggleClass('none');
      console.log("add button clicked");
 
  }
  function   open_finish_panel() {  
   

 $("#panel-1").css('transform' ,"scale(1)");
    $("#panel-1").removeClass('none');
    $("#tab-1").addClass('RRT__tab--first');
    $("#tab-1").addClass('RRT__tab--selected');
    close_waiting_panel();
  reset_search();
    console.log(" open_waiting_panel info open ") ;
};

function  close_finish_panel() {  
    $("#panel-1").css('transform' ,"scale(0)");
    $("#panel-1").addClass('none');
    $("#tab-1").removeClass('RRT__tab--first');
    $("#tab-1").removeClass('RRT__tab--selected');
    
    console.log(" close_waiting_panel info closd ") ;
};

function   open_waiting_panel() {  
    $("#panel-0").css('transform' ,"scale(1)");
    $("#panel-0").removeClass('none');
    $("#tab-0").addClass('RRT__tab--first');
    $("#tab-0").addClass('RRT__tab--selected');
    close_finish_panel();

reset_search();


    console.log(" open_finish_panel info open ") ;
};


function    close_waiting_panel() {  
    $("#panel-0").css('transform' ,"scale(0)");
    $("#panel-0").addClass('none');
    $("#tab-0").removeClass('RRT__tab--first');
    $("#tab-0").removeClass('RRT__tab--selected');
    
    console.log(" notification info closed ") ;
};

  function reset_search(){
    const rows = document.querySelectorAll(".rendez-vous_container");
    rows.forEach(row => {
      row.classList.remove('none');
    });
      document.querySelector("#search-orders").value = "";
      
      document.querySelector("#search-orders").click;

      $('#select-filter1').val('All');
      
$('#select-filter2').val('All');
 }
  
$(document).ready(function(){
    
   
    $(document).on('click', '#tab-1',  open_finish_panel );
    
    $(document).on('click', '#tab-0',  open_waiting_panel );
   
    }); 
    



   











function filterByText() {
    // Get the input from the search bar
    const searchInput = document.querySelector('#search-orders').value.toLowerCase();

    // Loop through all the rendez-vous elements
    const rendezVousElements = document.querySelectorAll('.rendez-vous');

    rendezVousElements.forEach((rvElement) => {
        // Extract the lab name from the rendez-vous element
        const laboName = rvElement.querySelector('#name_patient').textContent.trim().toLowerCase();

        // Compare the lab name with the search input
        if (laboName.includes(searchInput)) {
            // If the lab name includes the search input, remove the 'none' class from the parent element
            rvElement.parentElement.classList.remove('none');
        } else {
            // If the lab name doesn't include the search input, add the 'none' class to the parent element
            rvElement.parentElement.classList.add('none');
        }
    });
}

function init() {
    document.querySelector('#search_button').addEventListener('click', filterByText);
    
// Add an event listener for the 'change' event on the select dropdown
    document.querySelector('#select-filter1').addEventListener('change', filterByType);
    
document.querySelector('#select-filter2').addEventListener('change', filterByPlace);

}

// Call the init function after the DOM has loaded
document.addEventListener('DOMContentLoaded', init);









function filterByType() {
    // Get the selected option from the dropdown
    const selectedType = document.querySelector('#select-filter1').value.toLowerCase();

    // Loop through all the rendez-vous elements
    const rendezVousElements = document.querySelectorAll('.rendez-vous');

    rendezVousElements.forEach((rvElement) => {
        // Extract the rdv type from the rendez-vous element
        const rdvType = rvElement.querySelector('.rdv_type').textContent.trim().toLowerCase();

        if (selectedType === 'all') {
            // If the selected option is 'all', remove the 'none' class from the parent element
            rvElement.parentElement.classList.remove('none');
        } else if (rdvType === selectedType) {
            // If the rdv type matches the selected option, remove the 'none' class from the parent element
            rvElement.parentElement.classList.remove('none');
        } else {
            // If the rdv type doesn't match the selected option, add the 'none' class to the parent element
            rvElement.parentElement.classList.add('none');
        }
    });
}






function filterByPlace() {
    // Get the selected option from the dropdown
    const selectedType = document.querySelector('#select-filter2').value.toLowerCase();

    // Loop through all the rendez-vous elements
    const rendezVousElements = document.querySelectorAll('.rendez-vous');

    rendezVousElements.forEach((rvElement) => {
        // Extract the rdv type from the rendez-vous element
        const rdvType = rvElement.querySelector('.place').textContent.trim().toLowerCase();

        if (selectedType === 'all') {
            // If the selected option is 'all', remove the 'none' class from the parent element
            rvElement.parentElement.classList.remove('none');
        } else if (rdvType === selectedType) {
            // If the rdv type matches the selected option, remove the 'none' class from the parent element
            rvElement.parentElement.classList.remove('none');
        } else {
            // If the rdv type doesn't match the selected option, add the 'none' class to the parent element
            rvElement.parentElement.classList.add('none');
        }
    });
}