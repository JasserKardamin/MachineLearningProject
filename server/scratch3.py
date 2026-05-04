import sys
sys.path.append('.')
from src.services.ml_service import ml_service
data = {
    "Age": 45,
    "Stay_Duration": 10,
    "Medical_Condition": "Cancer",
    "Blood_Type": "O+"
}
print("Prediction:", ml_service.predict_billing(data))
