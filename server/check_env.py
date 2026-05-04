import joblib
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'src', 'models')

try:
    le_cond = joblib.load(os.path.join(MODELS_DIR, 'encoder_condition.pkl'))
    print("Conditions:", list(le_cond.classes_))
except Exception as e:
    print("Error loading condition encoder:", e)

try:
    clustering = joblib.load(os.path.join(MODELS_DIR, 'clustering_pipeline.pkl'))
    if hasattr(clustering, 'feature_names_in_'):
        print("Clustering features:", list(clustering.feature_names_in_))
    elif hasattr(clustering, 'steps'):
        print("Clustering first step features:", list(clustering.steps[0][1].feature_names_in_))
except Exception as e:
    print("Error loading clustering pipeline:", e)
