from flask import Flask
from flask_cors import CORS
from .config import Config

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable Cross-Origin Resource Sharing (CORS)
    CORS(app)
    
    # Initialize extensions here (e.g. database, migrations, etc.)
    
    # Register blueprints (routes)
    from src.routes.main_routes import main_bp
    app.register_blueprint(main_bp, url_prefix='/api')
    
    # Register additional blueprints as your app grows
    # from src.routes.model_routes import model_bp
    # app.register_blueprint(model_bp, url_prefix='/api/models')
    
    return app
