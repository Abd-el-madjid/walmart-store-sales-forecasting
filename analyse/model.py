# Importing necessary libraries
# Importing necessary libraries
print("Importing necessary libraries")
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_absolute_error
import numpy as np
import pandas as pd
import datetime
import holidays
from datetime import date

print("Reading data")
# Reading data
train = pd.read_csv("data/train.csv")
features = pd.read_csv("data/features.csv")
stores = pd.read_csv("data/stores.csv")

print("Merging datasets")
# Merging datasets
train = pd.merge(train, features, on=[
                 'Store', 'Date', 'IsHoliday'], how='left')
train = pd.merge(train, stores, on=['Store'], how='left')
train.Date = pd.to_datetime(train.Date)
features.Date = pd.to_datetime(features.Date)

train.dtypes# Feature engineering
print("Feature engineering")
train['Year'] = train['Date'].dt.year
train['Month'] = train['Date'].dt.month
train['Week'] = train['Date'].dt.isocalendar().week
train['Day'] = train['Date'].dt.day
train['n_days'] = (train['Date'].dt.date -
                   train['Date'].dt.date.min()).apply(lambda x: x.days)


# Handling Markdown features
print("Handling Markdown features")
for i in range(1, 6):
    features["MarkDown"+str(i)] = features["MarkDown" +
                                           str(i)].apply(lambda x: 0 if x < 0 else x)
    features["MarkDown"+str(i)].fillna(value=0, inplace=True)

# Creating HolidayType column
print("Creating HolidayType column")
def create_Holiday_Type(df):
    def create_holiday_type_column(df, dates, holiday_type, name):
        df.loc[
            df['Date'].isin(dates),
            'HolidayType'
        ] = holiday_type

    df['HolidayType'] = -1

    holiday_list = [
        (['2010-02-12', '2011-02-11', '2012-02-10', '2013-02-08'], 'Super_Bowl'),
        (['2010-09-10', '2011-09-09', '2012-09-07', '2013-09-06'], 'Labor_Day'),
        (['2010-11-26', '2011-11-25', '2012-11-23', '2013-11-29'], 'Thanksgiving'),
        (['2010-12-31', '2011-12-30', '2012-12-28', '2013-12-27'], 'Christmas')
    ]

    for index in range(0, len(holiday_list)):
        holiday = holiday_list[index]
        create_holiday_type_column(df, holiday[0], index, holiday[1])

    for x in df:
        if df[x].dtypes == "int64":
            df[x] = df[x].astype(float)



create_Holiday_Type(train)

# Handling missing values
print("Handling missing values")

data = train[['Store', 'Size', 'Dept', 'Month', 'Type', 'Year', 'Week',
              'Day', 'n_days', 'IsHoliday', 'HolidayType', 'CPI']]

print("Using LabelEncoder for 'Type' column")
# Using LabelEncoder for 'Type' column
data['Type'] = LabelEncoder().fit_transform(data['Type'])


data.describe

# Splitting data
print("Splitting data")
X = data
Y = train['Weekly_Sales']
X_train, X_test, y_train, y_test = train_test_split(
    X, Y, test_size=0.2, random_state=42)

# Feature scaling and encoding
print("Feature scaling and encoding")
numeric_features = ['Size', 'Dept', 'Month',
                    'Year', 'Week', 'Day', 'n_days', 'CPI']
categorical_features = ['Type']

numeric_transformer = StandardScaler()
categorical_transformer = OneHotEncoder()

preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('cat', categorical_transformer, categorical_features)
    ]
)

print("Model training (Random Forest)")

# Model training (Random Forest)
rf_model = RandomForestRegressor()

# Define the best hyperparameters
print("Define the best hyperparameters")

best_hyperparameters = {
    'n_estimators': 100,
    'max_depth': 25,
    'min_samples_split': 2,
    'min_samples_leaf': 1
}

# Create the final model with the best hyperparameters
print("Create the final model with the best hyperparameters")


final_model = RandomForestRegressor(**best_hyperparameters)

# Train the final model on your data
print(" Train the final model on your data")

final_model.fit(X_train, y_train)

# Predictions
print("Predictions")
predictions = final_model.predict(X_test)


def WMAE(dataset, real, predicted):

    weights = dataset.IsHoliday.apply(lambda x: 5 if x else 1)
    return np.round(np.sum(weights*abs(real-predicted))/(np.sum(weights)), 2)


# Evaluate the model
print(" Evaluate the model")
wmae_score = WMAE(X_test, y_test, predictions)
mae_score = mean_absolute_error(y_test, predictions)

print(f'WMAE Score: {wmae_score}')
print(f'MAE Score: {mae_score}')


# Access and print feature importances
feature_importances = final_model.feature_importances_
feature_names = X_train.columns


# Create a DataFrame to display feature importances
importance_df = pd.DataFrame(
    {'Feature': feature_names, 'Importance': feature_importances})
importance_df = importance_df.sort_values(by='Importance', ascending=False)
print(importance_df)


def predict_weekly_sales(store, department, date, is_holiday):
    # Prepare input data for prediction
    input_data = pd.DataFrame({
        'Store': [store],
        'Dept': [department],
        'Date': [pd.to_datetime(date)],
        'IsHoliday': [is_holiday]
    })

    # Merge with features and stores data
    input_data = pd.merge(input_data, features, on=[
                          'Store', 'Date', 'IsHoliday'], how='left')
    input_data = pd.merge(input_data, stores, on=['Store'], how='left')

    # Feature engineering for the input data
    input_data['Year'] = input_data['Date'].dt.year
    input_data['Month'] = input_data['Date'].dt.month
    input_data['Week'] = input_data['Date'].dt.isocalendar().week
    input_data['Day'] = input_data['Date'].dt.day
    input_data['n_days'] = (input_data['Date'].dt.date -
                            train['Date'].dt.date.min()).apply(lambda x: x.days)

    # Handling Markdown features
    for i in range(1, 6):
        input_data["MarkDown"+str(i)] = input_data["MarkDown" +
                                                   str(i)].apply(lambda x: 0 if x < 0 else x)
        input_data["MarkDown"+str(i)].fillna(value=0, inplace=True)

    # Create HolidayType column
    create_Holiday_Type(input_data)

    # Extract relevant features for prediction
    input_features = input_data[['Store', 'Size', 'Dept', 'Month', 'Type', 'Year', 'Week', 'Day', 'n_days',
                                 'IsHoliday', 'HolidayType', 'CPI']]

    # Use LabelEncoder for 'Type' column
    input_features['Type'] = LabelEncoder(
    ).fit_transform(input_features['Type'])

    # Make predictions using the trained model
    predicted_sales = final_model.predict(input_features)
    # Get feature importances from the model
    feature_importances = final_model.feature_importances_

    # Create a dictionary with feature names and their importance values
    importance_dict = dict(zip(features.columns, feature_importances))

    return predicted_sales[0], importance_dict
