from flask import jsonify

def get_status():
    """Health check endpoint."""
    return jsonify({
        "status": "success",
        "message": "Flask application is running smoothly!"
    }), 200
