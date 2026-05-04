from flask import Blueprint
from src.controllers.main_controller import get_status

main_bp = Blueprint('main', __name__)

# Define routes for the main blueprint
main_bp.route('/status', methods=['GET'])(get_status)
