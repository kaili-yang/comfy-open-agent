from comfy_open_agent.tools.comfy_tools import compact_input, compact_node_info, summarize_history


def test_compact_input_legacy_combo_is_truncated():
    out = compact_input("ckpt_name", ([f"m{i}" for i in range(50)],), True)
    assert out["type"] == "COMBO" and out["widget"] is True
    assert len(out["options"]) == 40 and out["options_total"] == 50


def test_compact_input_v3_combo_and_link_types():
    combo = compact_input("sampler", ("COMBO", {"options": ["euler"], "default": "euler"}), True)
    assert combo["options"] == ["euler"] and combo["default"] == "euler"
    link = compact_input("model", ("MODEL",), True)
    assert link == {"name": "model", "required": True, "type": "MODEL", "widget": False}
    forced = compact_input("seed", ("INT", {"forceInput": True}), False)
    assert forced["widget"] is False


def test_compact_node_info_outputs():
    info = {"name": "X", "input": {"required": {"a": ("INT", {"min": 0})}}, "output": ["IMAGE"], "output_name": ["out"]}
    compact = compact_node_info(info)
    assert compact["outputs"] == [{"index": 0, "name": "out", "type": "IMAGE"}]
    assert compact["inputs"][0]["min"] == 0


def test_summarize_history_files_and_errors():
    entry = {
        "status": {"status_str": "error", "messages": [
            ["execution_error", {"node_id": "3", "node_type": "KSampler", "exception_message": " OOM "}]
        ]},
        "outputs": {"9": {"images": [{"filename": "a.png", "subfolder": "", "type": "output"}]}},
    }
    s = summarize_history("p1", entry)
    assert s["status"] == "error"
    assert s["error"] == {"node_id": "3", "node_type": "KSampler", "message": "OOM"}
    assert s["files"][0]["filename"] == "a.png"
