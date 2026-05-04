import joblib
import pandas as pd

cluster_model = joblib.load('src/models/clustering_pipeline.pkl')
df = pd.DataFrame([{
    'Age': 45,
    'Billing Amount': 0,
    'Stay_Duration': 10,
    'Cost_Per_Day': 0,
    'Health_Risk_Score': 4.5
}])
print("Cluster:", cluster_model.predict(df)[0])
