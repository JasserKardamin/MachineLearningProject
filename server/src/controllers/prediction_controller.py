from flask import request, jsonify
from src.services.ml_service import ml_service

def predict_billing():
    """Handles POST /api/predict_billing"""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON payload provided"}), 400
        
        estimated_billing = ml_service.predict_billing(data)
        return jsonify({"estimated_billing": estimated_billing}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 503 # Service Unavailable (Models not loaded)
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500

def recommend_blood():
    """Handles POST /api/recommend"""
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No JSON payload provided"}), 400
        
        recommendation_priority = ml_service.recommend_blood(data)
        return jsonify({"recommendation_priority": recommendation_priority}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 503 # Service Unavailable
    except Exception as e:
        return jsonify({"error": f"Recommendation failed: {str(e)}"}), 500
