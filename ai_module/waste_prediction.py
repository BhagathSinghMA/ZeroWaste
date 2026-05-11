import pandas as pd
from sklearn.linear_model import LinearRegression
import datetime

def predict_waste():
    # Load historical data
    try:
        data = pd.read_csv('dataset.csv')
    except FileNotFoundError:
        # Create dummy data if file doesn't exist
        data = pd.DataFrame({
            'date': pd.date_range(start='2024-03-01', periods=10),
            'food_prepared': [100, 110, 95, 120, 105, 115, 130, 110, 100, 120],
            'food_sold': [80, 85, 82, 90, 88, 92, 100, 85, 80, 95],
            'waste': [20, 25, 13, 30, 17, 23, 30, 25, 20, 25]
        })
        data.to_csv('dataset.csv', index=False)

    # Features: Food Prepared
    # Target: Waste
    X = data[['food_prepared']]
    y = data['waste']

    # Train model
    model = LinearRegression()
    model.fit(X, y)

    # Predict for tomorrow (assuming we prepare similar amount as today's max or average)
    tomorrow_prep = data['food_prepared'].mean() * 1.05 # 5% increase for safety
    prediction = model.predict([[tomorrow_prep]])

    print(f"--- AI Food Waste Prediction ---")
    print(f"Historical Average Prep: {data['food_prepared'].mean():.2f}kg")
    print(f"Planned Prep for Tomorrow: {tomorrow_prep:.2f}kg")
    print(f"Predicted Waste for Tomorrow: {prediction[0]:.2f}kg")
    
    return prediction[0]

if __name__ == "__main__":
    predict_waste()
