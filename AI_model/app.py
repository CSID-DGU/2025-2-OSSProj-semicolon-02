# AI_model/app.py
import env_loader   
from flask import Flask
from caffeine_cal.api import bp as caffeine_bp  


def create_app() -> Flask:
    env_loader.load_env()      
    app = Flask(__name__)
    app.register_blueprint(caffeine_bp)
    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
