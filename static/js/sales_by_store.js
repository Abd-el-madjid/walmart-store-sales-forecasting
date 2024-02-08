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
populateDropdown("store-dropdown", 1, 45);

// Populate department dropdown with numbers 1 to 99
populateDropdown("department-dropdown", 1, 99);

// Your existing ChartJS code for monthly data
var ctxMonthly, myChartMonthly;


// Your existing ChartJS code for yearly data
var ctxYearly, myChartYearly;

var ctxWeekly, myChartWeekly;
var ctxcoor, myChartcoor;

window.onload = function () {
    handleSelectionChangeMonthly();
    handleSelectionChangeYearly();
    handleSelectionChangeWeekly();
    handleSelectionChangeCorrelation();


 var predictionFeatureMonthly = document.querySelector('#predictionFeatureMonthly');

    ctxMonthly = predictionFeatureMonthly.getContext('2d');
    myChartMonthly = new Chart(ctxMonthly, {
        type: 'bar',
        data: {
            labels: englishMonthAbbreviations,
            datasets: [{
                data: [],
                backgroundColor: generateColorsWithOpacity(10).map(color => color.backgroundColor),
                borderColor: generateColorsWithOpacity(10).map(color => color.borderColor),
                borderWidth: 1
            }]
        },
        options: {
            // Your existing ChartJS options
        }
    });



    ///////////////////////////////////////////////
    var predictionFeatureYearly = document.querySelector('#predictionFeatureYearly');

    ctxYearly = predictionFeatureYearly.getContext('2d');
    myChartYearly = new Chart(ctxYearly, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: generateColorsWithOpacity(1).map(color => color.backgroundColor),
                borderColor: generateColorsWithOpacity(1).map(color => color.borderColor),
                borderWidth: 1
            }]
        },
        options: {
            // Your existing ChartJS options
        }
    });


    ///////////////////////////////////////////////////////
        var predictionFeatureWeekly = document.querySelector('#predictionFeatureWeekly');

    ctxWeekly = predictionFeatureWeekly.getContext('2d');
    myChartWeekly = new Chart(ctxWeekly, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: generateColorsWithOpacity(1).map(color => color.backgroundColor),
                borderColor: generateColorsWithOpacity().map(color => color.borderColor),
                borderWidth: 1
            }]
        },
        options: {
            // Your existing ChartJS options
        }
    });



     var Features_correlated_to_Weekly_Sale = document.querySelector('#Features_correlated_to_Weekly_Sale');

    ctxcoor = Features_correlated_to_Weekly_Sale.getContext('2d');
    myChartcoor = new Chart(ctxcoor, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                'rgba(230, 31, 87, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(230, 31, 87, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(153, 102, 255, 1)'
            ],
                borderWidth: 1
            }]
        },
        options: {
            // Your existing ChartJS options
        }
    });



    
     predictionFeatureMonthly.style.height = '420px';
    predictionFeatureYearly.style.height = '420px';
    predictionFeatureWeekly.style.height = '420px';
    Features_correlated_to_Weekly_Sale.style.height = '320px';

    predictionFeatureMonthly.style.width = '820px';
    predictionFeatureYearly.style.width = '820px';
    predictionFeatureWeekly.style.width = '820px';
    Features_correlated_to_Weekly_Sale.style.width = '820px';
};

// Function to handle dropdown selection change for monthly data
function handleSelectionChangeMonthly() {
    var selectedStore = document.getElementById("store-dropdown").value;
    var selectedDepartment = document.getElementById("department-dropdown").value;

    // Make an AJAX request to get monthly data based on selectedStore and selectedDepartment
    fetch(`/api/getData?store=${selectedStore}&department=${selectedDepartment}&function=get_weekly_sales`)
        .then(response => response.json())
        .then(data => {
            // Update monthly chart using the fetched data
            updateChartMonthly(data);
        })
        .catch(error => console.error('Error:', error));
}

// Function to handle dropdown selection change for yearly data
function handleSelectionChangeYearly() {
    var selectedStore = document.getElementById("store-dropdown").value;
    var selectedDepartment = document.getElementById("department-dropdown").value;

    // Make an AJAX request to get yearly data based on selectedStore and selectedDepartment
    fetch(`/api/getData?store=${selectedStore}&department=${selectedDepartment}&function=get_weekly_sales_vs_date_year`)
        .then(response => response.json())
        .then(data => {
            // Update yearly chart using the fetched data
            updateChartYearly(data);
        })
        .catch(error => console.error('Error:', error));
}



// Function to handle dropdown selection change for weekly data
function handleSelectionChangeWeekly() {
    var selectedStore = document.getElementById("store-dropdown").value;
    var selectedDepartment = document.getElementById("department-dropdown").value;

    // Make an AJAX request to get weekly data based on selectedStore and selectedDepartment
    fetch(`/api/getData?store=${selectedStore}&department=${selectedDepartment}&function=get_weekly_sales_vs_week`)
        .then(response => response.json())
        .then(data => {
            // Update weekly chart using the fetched data
            updateChartWeekly(data);
        })
        .catch(error => console.error('Error:', error));
}




// Function to handle dropdown selection change for correlation data
function handleSelectionChangeCorrelation() {
    var selectedStore = document.getElementById("store-dropdown").value;
    var selectedDepartment = document.getElementById("department-dropdown").value;

// Make an AJAX request to get correlation data
fetch('/api/getCorrelationData')
    .then(response => response.json())
    .then(data => {
        // Update the correlation chart using the fetched data
        updateChartCorrelation(data);
    })
    .catch(error => console.error('Error:', error));

    
}

// Update monthly chart with new data
function updateChartMonthly(data) {
    myChartMonthly.data.datasets[0].data = data.featureData;

    // Update monthly chart
    myChartMonthly.update();
}

// Update yearly chart with new data
function updateChartYearly(data) {
    myChartYearly.data.labels = data.labels;
    myChartYearly.data.datasets[0].data = data.featureData;

    // Update yearly chart
    myChartYearly.update();
}


// Update weekly chart with new data
function updateChartWeekly(data) {
    myChartWeekly.data.labels = data.labels; // Update labels accordingly
    myChartWeekly.data.datasets[0].data = data.featureData;

    // Update weekly chart
    myChartWeekly.update();
}


function updateChartCorrelation(data) {
    myChartcoor.data.labels = data.labels;
    myChartcoor.data.datasets[0].data = data.correlation_values;

    // Update the correlation chart
    myChartcoor.update();
}


// Attach the event listener to the dropdowns for monthly data
document.getElementById("store-dropdown").addEventListener("change", handleSelectionChangeMonthly);
document.getElementById("department-dropdown").addEventListener("change", handleSelectionChangeMonthly);

// Attach the event listener to the dropdowns for yearly data
document.getElementById("store-dropdown").addEventListener("change", handleSelectionChangeYearly);
document.getElementById("department-dropdown").addEventListener("change", handleSelectionChangeYearly);



// Attach the event listener to the dropdowns for weekly data
document.getElementById("store-dropdown").addEventListener("change", handleSelectionChangeWeekly);
document.getElementById("department-dropdown").addEventListener("change", handleSelectionChangeWeekly);

// Attach the event listener to the dropdowns for correlation data
document.getElementById("store-dropdown").addEventListener("change", handleSelectionChangeCorrelation);
document.getElementById("department-dropdown").addEventListener("change", handleSelectionChangeCorrelation);
