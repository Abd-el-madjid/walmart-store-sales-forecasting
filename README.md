# Walmart Store Sales Forecasting

## Overview

This project focuses on forecasting sales for Walmart stores using historical sales data. It includes data processing, exploratory data analysis (EDA), model selection, and prediction of weekly sales. The analysis results are visualized through an interactive dashboard using Dash.

## Requirements

- Python 3.6 or higher

## Setup

### 1. Create a Virtual Environment

```bash
# Windows
python -m venv venv

# macOS/Linux
python3 -m venv venv
```

### 2.Install Required Packages
```bash
pip install -r requirements.txt
```

### 3.Running the Project
Execute the following command to start the Dash interface:
```bash

python app.py
```
## Project Structure

1. **data_processing.py:** Contains methods for fetching data.
2. **data/:** Directory containing the dataset.
3. **analyse/:** Directory containing Jupyter Notebook (`walmart.ipynb`) with data analysis and model selection.
   - `walmart.ipynb`: Jupyter Notebook with data analysis and model selection.
   - `model.py`: Final model for sales prediction.

