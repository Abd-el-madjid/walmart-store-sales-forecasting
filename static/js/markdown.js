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

// Populate department dropdown with numbers 1 to 99
populateDropdown("department-dropdown", 1, 99);

// Your existing code for weekly data
// ...
handleSelectionChangeWeekly()

// Function to handle dropdown selection change for weekly data
function handleSelectionChangeWeekly() {
    var selectedStore = document.getElementById("store-dropdown").value;
    var selectedDepartment = document.getElementById("department-dropdown").value;

    // Make an AJAX request to get weekly data for all Markdowns grouped by Markdown
    fetch(`/api/get_store_sales_by_store_all_markdowns_grouped?store_type=${selectedStore}&department=${selectedDepartment}`)
        .then(response => response.json())
        .then(data => {
            // Log the received data to the console
            console.log("Received data:", data);

            // Update HTML to display scatter charts for each Markdown
            updateMarkdownScatterCharts(data);
        })
        .catch(error => console.error('Error:', error));
}

// Update scatter charts for each Markdown
function updateMarkdownScatterCharts(data) {
    // Get the canvas elements by ID
    const canvas1 = document.querySelector('#markdown1');
    const canvas2 = document.querySelector('#markdown2');
    const canvas3 = document.querySelector('#markdown3');
    const canvas4 = document.querySelector('#markdown4');
    const canvas5 = document.querySelector('#markdown5');

    // Create scatter charts for each Markdown
    createScatterChart(canvas1, data.labels, data.markdownData.MarkDown1);
    createScatterChart(canvas2, data.labels, data.markdownData.MarkDown2);
    createScatterChart(canvas3, data.labels, data.markdownData.MarkDown3);
    createScatterChart(canvas4, data.labels, data.markdownData.MarkDown4);
    createScatterChart(canvas5, data.labels, data.markdownData.MarkDown5);
}

// Create individual scatter chart for each Markdown
// Create individual scatter chart for each Markdown
function createScatterChart(canvasElement, labels, chartData) {
    const randomColor = () => {
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);
        return `rgba(${red},${green},${blue},1)`;
    };

    new Chart(canvasElement, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Markdown Sales',
                data: chartData.reduce((acc, markdownSales, index) => {
                    acc.push({ x: labels[index], y: markdownSales });
                    return acc;
                }, []),
                borderColor: randomColor(), // Use random color for each dataset
                borderWidth: 1,
                pointRadius: 5,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Scatter Chart for Markdown Sales'
                }
            }
        }
    });
}



// Attach the event listener to the dropdowns for weekly data
document.getElementById("store-dropdown").addEventListener("change", handleSelectionChangeWeekly);
document.getElementById("department-dropdown").addEventListener("change", handleSelectionChangeWeekly);























































































