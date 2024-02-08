from flask import Flask, render_template, request, jsonify
from data_processor import read_data, preprocess_data, get_weekly_sales, get_weekly_sales_vs_week_by_store, get_weekly_sales_vs_week_by_store_all_markdowns_grouped
from data_processor import merge_and_calculate_correlations, merge_and_get_monthly_sales_data, get_sales_by_store_size
from analyse.model import predict_weekly_sales
import  analyse.model 

app = Flask(__name__, template_folder='templates')

# Read and preprocess the CSV data
# Change this to the actual path of your CSV file
file_path = 'data/train.csv'
file_path1 = 'data/features.csv'
file_path2 = 'data/stores.csv'
file_path3 = 'data/test.csv'

train = preprocess_data(read_data(file_path))

features = read_data(file_path1)
stores = read_data(file_path2)
test = preprocess_data(read_data(file_path3))


@app.route('/')
def index():
    return render_template('sales_by_store.html')


@app.route('/sales_wise_store')
def sales_wise_store():
    return render_template('sales_wise_store.html')


@app.route('/sales_store_size')
def sales_store_size():
    return render_template('sales_store_size.html')


@app.route('/sales_by_month_and_year')
def sales_by_month_and_year():
    return render_template('sales_by_month_and_year.html')


@app.route('/predection')
def predection():
    return render_template('predection.html')


@app.route('/markdown')
def markdown():
    return render_template('markdown.html')

@app.route('/api/getData', methods=['GET'])
def get_data():
    selected_store = int(request.args.get('store'))
    selected_department = int(request.args.get('department'))

    # Get weekly sales data
    response_data = get_weekly_sales(
        selected_store, selected_department, train)
    print(response_data)

    return jsonify(response_data)


@app.route('/api/getCorrelationData', methods=['GET'])
def get_correlation_data():
    correlation_data = merge_and_calculate_correlations(
        train, features, stores)
    print(correlation_data)
    return jsonify(correlation_data)


# ... (existing code)

@app.route('/api/get_store_sales_by_store', methods=['GET'])
def get_store_sales_by_store():
    selected_store_type = request.args.get('store_type')
    selected_department = int(request.args.get('department'))
    selected_year = int(request.args.get('year'))

    # Calculate weekly sales for each store in the specific department
    response_data = get_weekly_sales_vs_week_by_store(
        selected_year, selected_store_type, selected_department, train, features, stores)
    print("------------------------------")
    print(response_data)

    return jsonify(response_data)

# ... (existing code)
# Add new route to handle data for all Markdowns grouped by Markdown


# Add print statements in the Flask route
@app.route('/api/get_store_sales_by_store_all_markdowns_grouped', methods=['GET'])
def get_store_sales_by_store_all_markdowns_grouped():
    selected_store_type = request.args.get('store_type')
    selected_department = int(request.args.get('department'))

    # Calculate weekly sales for each store in the specific department and all Markdowns
    response_data = get_weekly_sales_vs_week_by_store_all_markdowns_grouped(
        selected_store_type, selected_department, train, features, stores)

    # Print the data before returning
    print("Response Data:", response_data)

    # Return the data in the format expected by the frontend
    return jsonify({
        'labels': response_data['labels'],
        'markdownData': response_data['markdownData']
    })


@app.route('/api/getMonthlySalesData', methods=['GET'])
def get_monthly_sales_data_route():
    selected_month = int(request.args.get('month'))
    selected_year = int(request.args.get('year'))

    # Get monthly sales data
    response_data = merge_and_get_monthly_sales_data(
        selected_month, selected_year, train, features, stores)
    print(response_data)
    # Replace NaN values in the DataFrame with 0
    response_data.fillna(0, inplace=True)
    # Convert the DataFrame to a list of dictionaries
    data_list = response_data.to_dict(orient='records')
    print(data_list)
    print("////////////////////")
    print(response_data.columns.tolist())

    return jsonify({'header': response_data.columns.tolist(), 'data': data_list})



# app.py

# ... (existing code)

@app.route('/api/get_sales_by_store_size', methods=['GET'])
def get_sales_by_store_size_route():
    selected_department = int(request.args.get('department'))
    selected_year = int(request.args.get('year'))

    # Get sales data based on store size and grouped by store type
    response_data = get_sales_by_store_size(selected_year, selected_department, train, features, stores)
    
    print(response_data)

    return jsonify(response_data)



@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        store = request.form['store']
        department = request.form['department']
        date = request.form['date']
        is_holiday = request.form.get('is_holiday', False)

        # Convert is_holiday to a boolean
        is_holiday = is_holiday.lower() == 'true'

        # Call the predict_weekly_sales method
        predicted_sales, feature_importance = predict_weekly_sales(
            int(store), int(department), date, is_holiday)
        print(predicted_sales)

        return jsonify({'predicted_sales': predicted_sales, 'feature_importance': feature_importance})

    return render_template('predection.html')




if __name__ == '__main__':
    app.run(debug=True)
