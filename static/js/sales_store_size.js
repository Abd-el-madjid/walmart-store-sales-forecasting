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

// Populate store dropdown with numbers 2010 to 2013
populateDropdown("year-dropdown", 2010, 2013);

// Populate department dropdown with numbers 1 to 99
populateDropdown("department-dropdown", 1, 99);

var ctxMonthly, myChartMonthly;

window.onload = function () {
    // Initialize chart
    updateChart();
};

async function updateChart() {
    const year = document.getElementById("year-dropdown").value;
    const department = document.getElementById("department-dropdown").value;

    // Fetch data from the server
    const response = await fetch(`/api/get_sales_by_store_size?department=${department}&year=${year}`);
    const responseData = await response.json();

    // Create chart if it doesn't exist
    if (!myChartMonthly) {
        const data = {
            datasets: Object.keys(responseData.typeData).map((storeType, index) => ({
                label: `Store Type ${storeType}`,
                data: responseData.typeData[storeType].map((sales, idx) => ({ x: responseData.labels[idx], y: sales })),
                borderColor: generateColorsWithOpacity(Object.keys(responseData.typeData).length)[index].borderColor,
                backgroundColor: generateColorsWithOpacity(Object.keys(responseData.typeData).length)[index].backgroundColor,
            })),
        };

        var predictionFeaturebysize = document.querySelector('#predictionFeaturebysize');
        ctxMonthly = predictionFeaturebysize.getContext('2d');
        myChartMonthly = new Chart(ctxMonthly, {
            type: 'bubble',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Store Size',
                        },
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Sales',
                        },
                    },
                },
            },
        });
    } else {
        // Update chart data and redraw
        myChartMonthly.data.datasets = Object.keys(responseData.typeData).map((storeType, index) => ({
            label: `Store Type ${storeType}`,
            data: responseData.typeData[storeType].map((sales, idx) => ({ x: responseData.labels[idx], y: sales })),
            borderColor: generateColorsWithOpacity(Object.keys(responseData.typeData).length)[index].borderColor,
            backgroundColor: generateColorsWithOpacity(Object.keys(responseData.typeData).length)[index].backgroundColor,
        }));

        myChartMonthly.update();
    }
}

function generateData(config) {
    var data = [];
    for (var i = 0; i < config.count; i++) {
        var x = Math.random() * (config.max - config.min) + config.min;
        var y = Math.random() * (config.max - config.min) + config.min;
        data.push({ x: x, y: y });
    }
    return data;
}

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


   // Add event listeners to dropdowns
    document.getElementById("year-dropdown").addEventListener("change", updateChart);
    document.getElementById("department-dropdown").addEventListener("change", updateChart);