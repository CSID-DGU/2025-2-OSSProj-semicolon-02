# AI_model/app.py
from . import env_loader
from flask import Flask, request, jsonify

from .caffeine_cal.api import bp as caffeine_bp
from .agents.caffit_agents import run_caffit_supervisor  

def create_app() -> Flask:
    env_loader.load_env()
    app = Flask(__name__)
    app.register_blueprint(caffeine_bp) 

   
    @app.post("/api/caffit/analyze")
    def analyze_caffit():
        """
        모바일 앱/백엔드에서 호출하는 메인 엔드포인트
        body: { "user_id": 1, "image_path": "/path/to/file.jpg" }
              또는 파일 업로드 방식도 나중에 가능
        """
        data = request.get_json()
        user_id = int(data["user_id"])
        image_path = data["image_path"]

        result = run_caffit_supervisor(
            user_id=user_id,
            image_path=image_path,
        )
        # result는 {"advice": "...", "brand": "...", ...} 형태라고 가정

        return jsonify(result)
    # ----------------------

    return app

app = create_app()

if __name__ == "__main__":
    # 로컬 테스트용
    app.run(host="0.0.0.0", port=5001, debug=True)