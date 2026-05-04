import joblib
import sys
import os

def inspect_pipeline(file_path):
    print(f"--- Inspecting {file_path} ---")
    try:
        model = joblib.load(file_path)
        print("Type:", type(model))
        
        if hasattr(model, 'steps'):
            print("Pipeline steps:", [name for name, _ in model.steps])
            first_step = model.steps[0][1]
            if hasattr(first_step, 'feature_names_in_'):
                print("Features expected by the first step:", list(first_step.feature_names_in_))
            
            last_step = model.steps[-1][1]
            if hasattr(last_step, 'feature_names_in_'):
                print("Features expected by the final estimator:", list(last_step.feature_names_in_))
        elif hasattr(model, 'feature_names_in_'):
            print("Expected features:", list(model.feature_names_in_))
    except Exception as e:
        print(f"Error inspecting {file_path}: {e}")
    print()

if __name__ == "__main__":
    models_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src", "models")
    inspect_pipeline(os.path.join(models_dir, "clustering_pipeline.pkl"))
