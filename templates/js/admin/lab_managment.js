








 function reset_search(){
    const rows = document.querySelectorAll(".row101");
    rows.forEach(row => {
      row.style.display = 'table-row';
    });
    document.querySelector("#search-orders").value = "";
    document.querySelector("#search-orders").click;
 }


const searchButton = document.querySelector("#search_button");
const searchInput = document.querySelector("#search-orders");

searchButton.addEventListener("click", () => {
  const searchValue = searchInput.value.trim().toLowerCase();
  const rows = document.querySelectorAll(".row101");

  rows.forEach(row => {
    const cells = row.querySelectorAll(".cell100");
    let isMatch = false;

    cells.forEach(cell => {
      if (cell.textContent.trim().toLowerCase().includes(searchValue)) {
        isMatch = true;
      }
    });

    if (isMatch) {
      row.style.display = 'table-row';
    } else {
      let rowText = row.textContent.trim().toLowerCase();
      if (rowText.includes(searchValue)) {
        row.style.display = 'table-row';
      } else {
        row.style.display = 'none';
      }
    }
  });
});

function   modifier_button_empl() {  
  $("#modifie_rdv_form").toggleClass('none');
 
 
  console.log(" date_search_bar_container info open ") ;
};

function   delet_button_empl() {  
  $("#delet_rdv_form").toggleClass('none');
 
 
  console.log(" date_search_bar_container info open ") ;
};

function lab_id(event) {
  
  const id = event.target.closest('.row100').querySelector('[data-title="id_lab"]').textContent.trim().replace(/\s+/g, '');
  document.querySelector("input[name=lab_id]").value = id;
}


function submit(event) {
  event.preventDefault(); // prevent the default behavior of the cancel button
  event.target.form.submit(); // submit the form element
}

function modifierlabo(event) {
   
  // Get the table row containing the clicked "Edit" button
  const row = event.target.closest(".row101");

  // Get the values of the cells in the row
  const Namelab = row.querySelector("[data-title='lab name']").innerText;
  



  // Set the input values in the "modifie_rdv_form" sectio
  document.querySelector("input[name=lab_name]").value = Namelab;
}











    function toggleForm(id) {
    const form = $("#form_"+id);

        form.toggleClass('none');
        form.find('form')[0].reset();
      console.log("active button clicked");

  }
  










  

  function   open_block_panel() {  
   

 $("#panel-1").css('transform' ,"scale(1)");
    $("#panel-1").removeClass('none');
    $("#tab-1").addClass('RRT__tab--first');
    $("#tab-1").addClass('RRT__tab--selected');
    close_active_panel();
  reset_search();
    console.log(" open_active_panel info open ") ;
};

function  close_block_panel() {  
    $("#panel-1").css('transform' ,"scale(0)");
    $("#panel-1").addClass('none');
    $("#tab-1").removeClass('RRT__tab--first');
    $("#tab-1").removeClass('RRT__tab--selected');
    
    console.log(" close_active_panel info closd ") ;
};

function   open_active_panel() {  
    $("#panel-0").css('transform' ,"scale(1)");
    $("#panel-0").removeClass('none');
    $("#tab-0").addClass('RRT__tab--first');
    $("#tab-0").addClass('RRT__tab--selected');
    reset_search();
    close_block_panel();

 


    console.log(" open_block_panel info open ") ;
};


function    close_active_panel() {  
    $("#panel-0").css('transform' ,"scale(0)");
    $("#panel-0").addClass('none');
    $("#tab-0").removeClass('RRT__tab--first');
    $("#tab-0").removeClass('RRT__tab--selected');
    
    console.log(" notification info closed ") ;
};


  
$(document).ready(function(){
    
   
    $(document).on('click', '#tab-1',  open_block_panel );
    
    $(document).on('click', '#tab-0',  open_active_panel );
   
    }); 
    