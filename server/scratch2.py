import joblib
import pandas as pd
import numpy as np

billing_model = joblib.load('src/models/billing_pipeline.pkl')
input_data = {
    'Age': 45.0,
    'Stay_Duration': 10.0,
    'Condition_Code': 1,
    'Test_Code': 1,
    'Blood_Type_Code': 1,
    'Health_Risk_Score': 4.5,
    'Cluster': 0
}
input_df = pd.DataFrame([input_data], columns=['Age', 'Stay_Duration', 'Condition_Code', 'Test_Code', 'Blood_Type_Code', 'Health_Risk_Score', 'Cluster'])
print("Prediction with Cluster=0:", billing_model.predict(input_df)[0])
input_data['Cluster'] = 1
input_df = pd.DataFrame([input_data], columns=['Age', 'Stay_Duration', 'Condition_Code', 'Test_Code', 'Blood_Type_Code', 'Health_Risk_Score', 'Cluster'])
print("Prediction with Cluster=1:", billing_model.predict(input_df)[0])
