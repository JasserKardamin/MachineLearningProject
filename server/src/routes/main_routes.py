from flask import Blueprint
from src.controllers.main_controller import get_status
from src.controllers.prediction_controller import predict_billing, recommend_blood

main_bp = Blueprint('main', __name__)

# Define routes for the main blueprint
main_bp.route('/status', methods=['GET'])(get_status)

# Machine Learning routes
main_bp.route('/predict_billing', methods=['POST'])(predict_billing)
main_bp.route('/recommend', methods=['POST'])(recommend_blood)
