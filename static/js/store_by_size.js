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

// Populate store dropdown with numbers 1 to 45
populateDropdown("year-dropdown", 2010, 2013);



// Populate department dropdown with numbers 1 to 99
populateDropdown("department-dropdown", 1, 99);



// ... (existing code)
// ... (existing code)

// Your existing ChartJS code for weekly data
var ctxWeekly, myChartWeekly;

window.onload = function () {
   
    handleSelectionChangeWeekly();

    var predictionFeaturebysize = document.querySelector('#predictionFeaturebysize');
    ctxWeekly = predictionFeaturebysize.getContext('2d');
    myChartWeekly = new Chart(ctxWeekly, {
        type: 'line',
        data: {
            labels: Array.from({ length: 6 }, (_, i) => i * 10), // Array with values 0, 10, 20, ..., 500
            datasets: [] // This will be populated dynamically based on the response
        },
        options: {
            // Your existing ChartJS options
        }
    });

    predictionFeaturebysize.style.height = '420px';
    predictionFeaturebysize.style.width = '820px';
};

// Function to handle dropdown selection change for weekly data
// Function to handle dropdown selection change for weekly data
// Function to handle dropdown selection change for weekly data
function handleSelectionChangeWeekly() {
    var selectedStore = document.getElementById("store-dropdown").value;
    var selectedDepartment = document.getElementById("department-dropdown").value;
    var selectedYear = document.getElementById("year-dropdown").value;

    // Make an AJAX request to get weekly data based on selectedStore, selectedDepartment, and selectedYear
    fetch(`/api/get_store_sales_by_store?year=${selectedYear}&store_type=${selectedStore}&department=${selectedDepartment}`)
        .then(response => response.json())
        .then(data => {
            // Log the received data to the console
            console.log("Received data:", data);

            // Update weekly chart using the fetched data
            updateChartWeekly(data, selectedStore);
        })
        .catch(error => console.error('Error:', error));
}

// Update weekly chart with new data
// Update weekly chart with new data
function updateChartWeekly(data, selectedStore) {
    // Extract necessary information from the received data
    var storeData = data.storeData;

    // Check if datasets are defined before updating the chart
    if (storeData && Object.keys(storeData).length > 0) {
        // Update chart data
        myChartWeekly.data.datasets = [];

        // Iterate through storeData and create datasets for each store
        Object.keys(storeData).forEach(function (storeNumber) {
            var storeDataset = {
                label: 'Store ' + storeNumber,
                data: storeData[storeNumber], // Assuming storeData contains an array of sales data for each store
                backgroundColor: generateColorsWithOpacity(1)[0].backgroundColor,
                borderColor: generateColorsWithOpacity(1)[0].borderColor,
                fill: false // Change to true if you want to fill the area under the line
            };

            myChartWeekly.data.datasets.push(storeDataset);
        });

        // Update chart options if needed
        myChartWeekly.options.title = {
            display: true,
            text: `Weekly Sales Data for Store ${selectedStore}`
        };

        // Update the chart
        myChartWeekly.update();
    } else {
        // Handle the case where datasets are not defined
        console.error('Error: No datasets found in the received data.');
    }
}


// Attach the event listener to the dropdowns for weekly data
document.getElementById("store-dropdown").addEventListener("change", handleSelectionChangeWeekly);
document.getElementById("department-dropdown").addEventListener("change", handleSelectionChangeWeekly);
document.getElementById("year-dropdown").addEventListener("change", handleSelectionChangeWeekly);
