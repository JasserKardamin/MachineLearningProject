import os
import joblib
import pandas as pd
import numpy as np

# Define paths to models
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

class MLService:
    def __init__(self):
        self.billing_model = None
        self.recom_model = None
        self.le_condition = None
        self.le_blood = None
        self.load_models()

    def load_models(self):
        """Loads all the necessary pickled models and encoders."""
        try:
            self.billing_model = joblib.load(os.path.join(MODELS_DIR, 'billing_pipeline.pkl'))
            self.recom_model = joblib.load(os.path.join(MODELS_DIR, 'recommendation_pipeline.pkl'))
            self.le_condition = joblib.load(os.path.join(MODELS_DIR, 'encoder_condition.pkl'))
            self.le_blood = joblib.load(os.path.join(MODELS_DIR, 'encoder_blood_type.pkl'))
            print("Successfully loaded ML models.")
        except Exception as e:
            print(f"Warning: Could not load ML models. Ensure .pkl files are in {MODELS_DIR}. Error: {e}")

    def predict_billing(self, data):
        """
        Expects data to be a dictionary like:
        {
          "Age": 45,
          "Stay_Duration": 10,
          "Medical_Condition": "Cancer",
          "Blood_Type": "O+"
        }
        """
        if not self.billing_model or not self.le_condition or not self.le_blood:
            raise ValueError("Models are not fully loaded.")
        
        age = float(data['Age'])
        stay_duration = float(data['Stay_Duration'])
        medical_condition = data['Medical_Condition']
        blood_type = data['Blood_Type']

        # 1. Derive Health Risk Score
        health_risk_score = (age * stay_duration) / 100.0

        # Handle unseen condition labels
        if medical_condition not in self.le_condition.classes_:
            self.le_condition.classes_ = np.append(self.le_condition.classes_, medical_condition)

        # 2. Encode Medical Condition
        cond_code = self.le_condition.transform([medical_condition])[0]

        # Handle unseen blood type labels
        if blood_type not in self.le_blood.classes_:
            self.le_blood.classes_ = np.append(self.le_blood.classes_, blood_type)

        # 3. Encode Blood Type
        blood_code = self.le_blood.transform([blood_type])[0]

        # 4. Derive Test_Code based on rarity map
        blood_type_rarity_map = {
            'O+': 0, 'A+': 0, 'B+': 0, 'AB+': 1,
            'O-': 1, 'A-': 1, 'B-': 1, 'AB-': 2
        }
        test_code = blood_type_rarity_map.get(blood_type, 1)

        # 5. Prepare the input DataFrame (6 features)
        features_for_billing_model = ['Age', 'Stay_Duration', 'Condition_Code', 'Test_Code', 'Blood_Type_Code', 'Health_Risk_Score']
        input_data = {
            'Age': age,
            'Stay_Duration': stay_duration,
            'Condition_Code': cond_code,
            'Test_Code': test_code,
            'Blood_Type_Code': blood_code,
            'Health_Risk_Score': health_risk_score
        }
        
        input_df = pd.DataFrame([input_data], columns=features_for_billing_model)

        # 6. Predict using the billing pipeline
        prediction = self.billing_model.predict(input_df)
        return float(prediction[0])

    def recommend_blood(self, data):
        """
        Expects data to be a dictionary like:
        {
          "blood_type": "O+",
          "age": 30,
          "condition": "Cancer"
        }
        """
        if not self.recom_model or not self.le_condition or not self.le_blood:
            raise ValueError("Recommendation models are not loaded.")
        
        condition = data['condition']
        blood_type = data['blood_type']

        # Handle unseen condition labels
        if condition not in self.le_condition.classes_:
            self.le_condition.classes_ = np.append(self.le_condition.classes_, condition)

        # Handle unseen blood type labels
        if blood_type not in self.le_blood.classes_:
            self.le_blood.classes_ = np.append(self.le_blood.classes_, blood_type)

        # Encoding string inputs using the saved label encoders
        cond_code = self.le_condition.transform([condition])[0]
        blood_code = self.le_blood.transform([blood_type])[0]

        features = [[blood_code, data['age'], cond_code]]
        res = self.recom_model.predict(features)
        return int(res[0])

# Expose a singleton instance
ml_service = MLService()
