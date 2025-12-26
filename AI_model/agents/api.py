# AI_model/agents/api.py
import os
import tempfile
from flask import Blueprint, request, jsonify

from .caffit_agents import run_caffit_supervisor

bp = Blueprint("ai_agents", __name__)

@bp.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.get_json() or {}
        user_id = int(data.get("user_id", 1))
        img_file = request.files.get("image")
        
        img_path = None
        if img_file:
            # 임시 파일로 저장
            with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmp:
                img_file.save(tmp.name)
                img_path = tmp.name
        
        result = run_caffit_supervisor(user_id=user_id, image_path=img_path)
        return jsonify(result)
    except Exception as e:
        import traceback
        error_msg = str(e)
        traceback.print_exc()
        return jsonify({"error": error_msg, "traceback": traceback.format_exc()}), 500

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