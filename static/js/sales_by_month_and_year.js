const englishMonthAbbreviations = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function generateColorsWithOpacity(numColors) {
    var colors = [];
    for (var i = 0; i < numColors; i++) {
        var red = Math.floor(Math.random() * 256);
        var green = Math.floor(Math.random() * 256);
        var blue = Math.floor(Math.random() * 256);
        var color = 'rgba(' + red + ',' + green + ',' + blue + ',';

        var backgroundColor = color + '0.2)';
        var borderColor = color + '1)';

        colors.push({ backgroundColor: backgroundColor, borderColor: borderColor });
    }
    return colors;
}

// Function to populate dropdown with options
function populateDropdown(selectId, start, end) {
    var dropdown = document.getElementById(selectId);

    for (var i = start; i <= end; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.text = i;
        dropdown.add(option);
    }
}

// Call the function on page load
window.onload = function () {
    // Populate year dropdown with numbers 2010, 2013
    populateDropdown("year-dropdown", 2010, 2013);

    // Populate month dropdown with numbers 1 to 12
    populateDropdown("month-dropdown", 1, 12);
    handleSelectionChangetable_year_month();
};

// Initialize DataTable with empty data and columns on document ready
$(document).ready(function () {
    $('#dataTable').DataTable({
        "destroy": true,
        "paging": true,
        "pagination": true,
        "pageLength": 10,
        "sorting": true,
        "columns": []  // You can define initial columns here
    });
});

function handleSelectionChangetable_year_month() {
    var selectedMonth = document.getElementById("month-dropdown").value;
    var selectedYear = document.getElementById("year-dropdown").value;

    // Show loading indicator
    $('#wait').removeClass('none');

    // Make an AJAX request to get monthly sales data based on selectedMonth and selectedYear
    fetch(`/api/getMonthlySalesData?month=${selectedMonth}&year=${selectedYear}`)
        .then(response => response.json())
        .then(data => {
            // Check if data is empty
            if (data.header.length === 0 || data.data.length === 0) {
                // Hide loading indicator
                $('#wait').addClass('none');
                return;
            }

            // Log the data to the console to check if it's fetched correctly
            console.log("Monthly Sales Data:", data);

            // Update DataTable with the new data and columns
            var columns = data.header;
 var data = data.data;
            // Create the table header dynamically
            var headerRow = "<tr>";
            columns.forEach(function (column) {
                headerRow += "<th>" + column + "</th>";
            });
            headerRow += "</tr>";

            $('#dataTable thead').html(headerRow);

            $('#dataTable').DataTable({
                "destroy": true,
                "paging": true,
                "pagination": true,
                "pageLength": 10,
                "sorting": true,
                "data":data,
                "columns": columns.map(function (column) {
                    return { "data": column };
                })
            });

            // Hide loading indicator
            $('#wait').addClass('none');
        })
        .catch(error => console.error("Error fetching monthly sales data:", error));
}

document.getElementById("month-dropdown").addEventListener("change", handleSelectionChangetable_year_month);
document.getElementById("year-dropdown").addEventListener("change", handleSelectionChangetable_year_month);
