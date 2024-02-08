const englishMonthAbbreviations = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// Function to generate colors with opacity
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

// Variable to store the reference to the predicted sales chart instance
let predictedSalesChartInstance;

// Create a new Chart.js instance for predicted sales
const predictedSalesCtx = document.getElementById('predectionresult').getContext('2d');
predictedSalesChartInstance = new Chart(predictedSalesCtx, {
    type: 'doughnut',
    data: {
        labels: ['Predicted Sales'],
        datasets: [{
            data: [0], // Initialize with a default value
            backgroundColor: ['rgba(75, 192, 192, 0.2)'],
            borderColor: ['rgba(75, 192, 192, 1)'],
            borderWidth: 1
        }]
    },
    options: {
        cutout: '90%',
        rotation: -0.5 * Math.PI,
        circumference: 2 * Math.PI,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true
            },
            tooltip: {
                enabled: true
            }
        }
    }
});

// Variable to store the reference to the feature importance chart instance
let featureImportanceChartInstance;

// Create a new Chart.js instance for feature importance
const featureImportanceCtx = document.getElementById('featureImportanceChart').getContext('2d');
featureImportanceChartInstance = new Chart(featureImportanceCtx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Feature Importance',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            x: {
                beginAtZero: true
            },
            y: {
                beginAtZero: true
            }
            
        },
        legend: {
            display: true,
            position: 'bottom'
        }
    }
});

 featureImportanceChartInstance.style.height = '420px';
    featureImportanceChartInstance.style.width = '820px';
// Function to update the chart with predicted sales
function updatePredictedSalesChart(predictedSales) {
     console.log('Updating predicted sales chart with:', predictedSales);
    predictedSalesChartInstance.data.datasets[0].data = [predictedSales];
    predictedSalesChartInstance.update();
}

// Function to update the chart with feature importance
// Function to update the chart with feature importance
// Function to update the chart with feature importance
// Function to update the chart with feature importance
function updateFeatureImportanceChart(featureImportance) {
    const features = Object.keys(featureImportance);
    const importanceValues = Object.values(featureImportance);

    // Calculate the total sum of importance values
    const totalSum = importanceValues.reduce((sum, value) => sum + value, 0);

    // Normalize importance values to sum up to 100
    const normalizedValues = importanceValues.map(value => (value / totalSum) * 100);

    featureImportanceChartInstance.data.labels = features;
    featureImportanceChartInstance.data.datasets[0].data = normalizedValues;

    // Use static colors instead of dynamic ones
    featureImportanceChartInstance.data.datasets[0].backgroundColor = [
        'rgba(75, 192, 192, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 0, 0, 0.2)',
        'rgba(0, 255, 0, 0.2)',
        'rgba(0, 0, 255, 0.2)',
        'rgba(128, 0, 128, 0.2)',
        'rgba(255, 165, 0, 0.2)',
        'rgba(0, 128, 128, 0.2)',
        'rgba(128, 128, 0, 0.2)',
        'rgba(0, 0, 128, 0.2)'
        // Add more colors as needed
    ];
    featureImportanceChartInstance.data.datasets[0].borderColor = [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 0, 0, 1)',
        'rgba(0, 255, 0, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(128, 0, 128, 1)',
        'rgba(255, 165, 0, 1)',
        'rgba(0, 128, 128, 1)',
        'rgba(128, 128, 0, 1)',
        'rgba(0, 0, 128, 1)'
        // Add more colors as needed
    ];

    // Add percentage values as data labels
    const dataLabels = normalizedValues.map(value => value.toFixed(2) + '%');
    featureImportanceChartInstance.data.datasets[0].datalabels = {
        color: 'black',
        labels: {
            title: null,
            value: {
                color: 'black'
            }
        },
        formatter: (value, context) => dataLabels[context.dataIndex]
    };

    featureImportanceChartInstance.update();
}




// Add an event listener to the form for submitting
document.getElementById('predect').addEventListener('click', function () {
    submitForm();
});

// Function to submit the form data
function submitForm() {
    const store = document.getElementById('store-dropdown').value;
    const department = document.getElementById('department-dropdown').value;
    const date = document.getElementById('date-input').value;
    const includeHolidays = document.querySelector('input[name="include-holidays"]:checked').value;

    // Make AJAX request to Flask endpoint
    fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            store: store,
            department: department,
            date: date,
            is_holiday: includeHolidays
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        console.log("predection" + data.predicted_sales);
        console.log("importance" + data.feature_importance);

        // Update charts with prediction result and feature importance
        updatePredictedSalesChart(data.predicted_sales);
        updateFeatureImportanceChart(data.feature_importance);
    })
    .catch(error => console.error('Error:', error));
}
