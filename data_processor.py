import pandas as pd
import numpy as np


def read_data(file_path):
    # Read CSV data into a DataFrame
    data = pd.read_csv(file_path)
    return data


def preprocess_data(data):
    # Perform necessary preprocessing on the data (e.g., date conversion, additional columns)
    data['Date'] = pd.to_datetime(data['Date'])
    data['Year'] = data['Date'].dt.year
    data['Month'] = data['Date'].dt.month
    data['Week'] = data['Date'].dt.isocalendar().week
    data['Day'] = data['Date'].dt.day
    data['n_days'] = (data['Date'].dt.date -
                      data['Date'].dt.date.min()).apply(lambda x: x.days)
    return data

# This function is creating eta square test


def correlation_ratio(categories, measurements):
    fcat, _ = pd.factorize(categories)
    cat_num = np.max(fcat) + 1
    y_avg_array = np.zeros(cat_num)
    n_array = np.zeros(cat_num)

    for i in range(0, cat_num):
        cat_measures = measurements[np.argwhere(fcat == i).flatten()]
        n_array[i] = len(cat_measures)
        y_avg_array[i] = np.average(cat_measures)

    y_total_avg = np.sum(np.multiply(y_avg_array, n_array)) / np.sum(n_array)
    numerator = np.sum(np.multiply(n_array, np.power(
        np.subtract(y_avg_array, y_total_avg), 2)))
    denominator = np.sum(np.power(np.subtract(measurements, y_total_avg), 2))

    if numerator == 0:
        eta = 0.0
    else:
        eta = numerator / denominator

    return eta


def get_weekly_sales(selected_store, selected_department, data):
    # Filter data based on selected store and department
    filtered_data = data[(data['Store'] == selected_store)
                         & (data['Dept'] == selected_department)]

    # Calculate weekly sales for the specific month
    weekly_sales_data = filtered_data.groupby(['Year', 'Month', 'Week'])[
        'Weekly_Sales'].sum().reset_index()

    # Get unique months as labels
    unique_months = weekly_sales_data.sort_values(
        ['Year', 'Month'])[['Year', 'Month']].drop_duplicates()
    labels = [f"{year}-{month:02d}" for year,
              month in zip(unique_months['Year'], unique_months['Month'])]

    # Convert data to dictionary
    response_data = {
        'labels': labels,
        'featureData': weekly_sales_data['Weekly_Sales'].tolist()
    }

    return response_data


def get_weekly_sales_vs_date_year(selected_store, selected_department, data):
    # Filter data based on selected store and department
    filtered_data = data[(data['Store'] == selected_store)
                         & (data['Dept'] == selected_department)]

    # Calculate weekly sales vs date year
    weekly_sales_data_vs_date_year = filtered_data.groupby(['Date', 'Year', 'Month'])[
        'Weekly_Sales'].sum().reset_index()

    # Group the data by year and aggregate the feature data
    yearly_data = weekly_sales_data_vs_date_year.groupby(
        'Year')['Weekly_Sales'].agg(list).reset_index()

    # Convert data to a list of dictionaries with 'year_c' property
    response_data = [{'year': year, 'featureData': feature_data, 'year_c': str(year)}
                     for year, feature_data in zip(yearly_data['Year'], yearly_data['Weekly_Sales'])]

    return response_data


# data_processor.py

# data_processor.py

def get_weekly_sales_vs_week(selected_store, selected_department, data):
    # Filter data based on selected store and department
    filtered_data = data[(data['Store'] == selected_store)
                         & (data['Dept'] == selected_department)]

    # Calculate weekly sales vs week
    weekly_sales_data_vs_week = filtered_data.groupby(['Year', 'Week'])[
        'Weekly_Sales'].sum().reset_index()

    # Use 'Week' column as labels
    labels = weekly_sales_data_vs_week['Week'].astype(str).tolist()

    # Convert data to dictionary
    response_data = {
        'labels': labels,
        'featureData': weekly_sales_data_vs_week['Weekly_Sales'].tolist()
    }

    return response_data


# data_processor.py


def merge_and_calculate_correlations(train, features, stores):
    # lets convert date column into datetime type

    train.Date = pd.to_datetime(train.Date)

    features.Date = pd.to_datetime(features.Date)
    # Merge train with features and stores dataframes
    train = pd.merge(train, features, on=[
                     'Store', 'Date', 'IsHoliday'], how='left')
    train = pd.merge(train, stores, on=['Store'], how='left')

    # Calculate correlation ratios
    correlation_store = correlation_ratio(
        train['Store'], train['Weekly_Sales'])
    correlation_dept = correlation_ratio(train['Dept'], train['Weekly_Sales'])
    correlation_type = correlation_ratio(train['Type'], train['Weekly_Sales'])

    # Data for the pie chart
    labels = ['Store', 'Department', 'Type']
    correlation_values = [correlation_store,
                          correlation_dept, correlation_type]

    # Convert data to dictionary
    correlation_data = {
        'labels': labels,
        'correlation_values': correlation_values
    }

    return correlation_data

# data_processor.py


def get_weekly_sales_vs_week_by_store(year, store_type, department, data, features, stores):
    
    data.Date = pd.to_datetime(data.Date)

    features.Date = pd.to_datetime(features.Date)
    # Merge data with features and stores dataframes
    data = pd.merge(data, features, on=[
                     'Store', 'Date', 'IsHoliday'], how='left')
    data = pd.merge(data, stores, on=['Store'], how='left')
    
    
    # Filter data based on selected store type, department, and year
    filtered_data = data[(data['Type'] == store_type)
                         & (data['Dept'] == department)
                         & (data['Year'] == year)]

    # Calculate weekly sales vs week for each store
    weekly_sales_data_by_store = filtered_data.groupby(['Store', 'Year', 'Week'])[
        'Weekly_Sales'].sum().reset_index()

    # Use 'Week' column as labels
    labels = weekly_sales_data_by_store['Week'].astype(str).tolist()

    # Convert data to a nested dictionary
    response_data = {
        'labels': labels,
        'storeData': {}
    }

    # Populate storeData with weekly sales data for each store
    for store in weekly_sales_data_by_store['Store'].unique():
        store_sales = weekly_sales_data_by_store[weekly_sales_data_by_store['Store']
                                                 == store]['Weekly_Sales'].tolist()
        response_data['storeData'][str(store)] = store_sales

    return response_data


def get_weekly_sales_vs_week_by_store_all_markdowns_grouped(store_type, department, data, features, stores):
    data.Date = pd.to_datetime(data.Date)
    features.Date = pd.to_datetime(features.Date)

    # Merge data with features and stores dataframes
    data = pd.merge(data, features, on=['Store', 'Date', 'IsHoliday'], how='left')
    data = pd.merge(data, stores, on=['Store'], how='left')

    # Filter data based on selected store type and department
    filtered_data = data[(data['Type'] == store_type) & (data['Dept'] == department)]

    # Calculate weekly sales vs week for all Markdowns
    weekly_sales_data_by_store_all_markdowns = filtered_data.groupby(['Store', 'Week']).agg(
        {'MarkDown1': 'sum', 'MarkDown2': 'sum', 'MarkDown3': 'sum', 'MarkDown4': 'sum', 'MarkDown5': 'sum'}
    ).reset_index()

    # Use 'Week' column as labels
    labels = weekly_sales_data_by_store_all_markdowns['Week'].astype(str).tolist()

    # Initialize an empty dictionary to store data for each Markdown
    response_data = {
        'labels': labels,
        'markdownData': {}
    }

    # Populate markdownData with weekly sales data for each Markdown
    for markdown in range(1, 6):
        markdown_sales = weekly_sales_data_by_store_all_markdowns[f'MarkDown{markdown}'].tolist()
        response_data['markdownData'][f'MarkDown{markdown}'] = markdown_sales

    return response_data


# ... (existing code)

def merge_and_get_monthly_sales_data(selected_month, selected_year, train, features, stores):
    # Convert the 'Date' column to datetime type
    train['Date'] = pd.to_datetime(train['Date'])
    features['Date'] = pd.to_datetime(features['Date'])

    # Merge train with features and stores dataframes
    merged_data = pd.merge(train, features, on=[
                           'Store', 'Date', 'IsHoliday'], how='left')
    merged_data = pd.merge(merged_data, stores, on=['Store'], how='left')

    # Filter data based on selected month and year
    filtered_data = merged_data[(merged_data['Month'] == selected_month) & (
        merged_data['Year'] == selected_year)]

   # Format the 'Date' column to the desired string format
    filtered_data['Date'] = filtered_data['Date'].dt.strftime('%a, %d %b %Y')

    # Extract relevant columns for display
    display_data = filtered_data[[
        'Store', 'Dept', 'Date', 'Weekly_Sales', 'IsHoliday', 'Year', 'Month', 'Week', 'Day', 
        'Fuel_Price', 'MarkDown1', 'MarkDown2', 'MarkDown3', 'MarkDown4', 'MarkDown5', 'CPI', 'Unemployment',
        'Type', 'Size'
    ]]

    return display_data


# data_processor.py

def get_sales_by_store_size(selected_year, selected_department, data, features, stores):
    data.Date = pd.to_datetime(data.Date)
    features.Date = pd.to_datetime(features.Date)

    # Merge data with features and stores dataframes
    data = pd.merge(data, features, on=[
                    'Store', 'Date', 'IsHoliday'], how='left')
    data = pd.merge(data, stores, on=['Store'], how='left')

    # Filter data based on selected department and year
    filtered_data = data[(data['Dept'] == selected_department)
                         & (data['Year'] == selected_year)]

    # Group data by store size and store type, and calculate total sales
    grouped_data = filtered_data.groupby(['Size', 'Type'])[
        'Weekly_Sales'].sum().reset_index()

    # Convert data to a nested dictionary
    response_data = {
        'labels': grouped_data['Size'].tolist(),
        'typeData': {}
    }

    # Populate typeData with sales data for each store type
    for store_type in grouped_data['Type'].unique():
        type_sales = grouped_data[grouped_data['Type']
                                  == store_type]['Weekly_Sales'].tolist()
        response_data['typeData'][store_type] = type_sales

    return response_data




