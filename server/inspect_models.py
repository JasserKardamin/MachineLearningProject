import joblib
import sys
import os

def inspect_pipeline(file_path):
    print(f"--- Inspecting {file_path} ---")
    try:
        model = joblib.load(file_path)
        print("Type:", type(model))
        
        # Check if pipeline has steps
        if hasattr(model, 'steps'):
            print("Pipeline steps:", [name for name, _ in model.steps])
            # Check expected features on the first step
            first_step = model.steps[0][1]
            if hasattr(first_step, 'feature_names_in_'):
                print("Features expected by the first step:")
                print(list(first_step.feature_names_in_))
            else:
                print("First step does not have 'feature_names_in_'")
                
            # Check expected features on the final step
            last_step = model.steps[-1][1]
            if hasattr(last_step, 'feature_names_in_'):
                print("Features expected by the final estimator:")
                print(list(last_step.feature_names_in_))
            if hasattr(last_step, 'n_features_in_'):
                print(f"Number of features expected by the final estimator: {last_step.n_features_in_}")
        
        # Check if it's a standalone estimator
        elif hasattr(model, 'feature_names_in_'):
            print("Expected features:")
            print(list(model.feature_names_in_))
        elif hasattr(model, 'n_features_in_'):
            print(f"Number of features expected: {model.n_features_in_}")
            
    except Exception as e:
        print(f"Error inspecting {file_path}: {e}")
    print()

if __name__ == "__main__":
    models_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src", "models")
    inspect_pipeline(os.path.join(models_dir, "billing_pipeline.pkl"))
    inspect_pipeline(os.path.join(models_dir, "recommendation_pipeline.pkl"))
