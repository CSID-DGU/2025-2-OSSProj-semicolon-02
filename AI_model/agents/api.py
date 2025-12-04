# AI_model/agents/api.py
from flask import Blueprint, request, jsonify
from .caffit_agents import run_caffit_supervisor

bp = Blueprint("ai", __name__, url_prefix="/ai")

@bp.route("/analyze", methods=["POST"])
def analyze():
    user_id = int(request.form.get("user_id", 1))
    image = request.files["image"]

    img_path = "/tmp/input.jpg"
    image.save(img_path)

    result = run_caffit_supervisor(user_id=user_id, image_path=img_path)
    return jsonify(result)

@bp.route("/advice", methods=["POST"])
def advice():
    data = request.get_json() or {}
    user_id = int(data.get("user_id", 1))

    # 이미지 없이 호출 → drink_candidates는 비어 있어도 됨
    result = run_caffit_supervisor(user_id=user_id, image_path=None)

    return jsonify({
        "caffeine_state": result.get("caffeine_state"),
        "advice": result.get("advice"),
    })