# Prompt Asset

## Metadata
```json
{
  "generated_at": "2026-08-27T06:43:04.526478+00:00",
  "output": "/home/node/.openclaw/workspace/code/myth-planet/public/earth-night-ai-cool.png",
  "task_profile": "illustration",
  "task_profile_reason": "explicit",
  "creative_brief": {
    "schema_version": 2,
    "brief_version": "2026-08-09.2",
    "intent": {
      "goal": "",
      "audience": "",
      "destination": "",
      "primary_message": ""
    },
    "art_direction": {
      "concept": "",
      "directions": [],
      "mood": [],
      "avoid_cliches": [],
      "candidate_variation_axes": []
    },
    "delivery": {
      "requirements": []
    },
    "references": [],
    "exploration": {
      "creative_freedom": "medium"
    },
    "execution_policy": {
      "quality_tier": "quality",
      "visual_domain": "illustration",
      "novelty": "balanced"
    },
    "provenance": {
      "/execution_policy/quality_tier": {
        "source": "default",
        "confidence": 1.0
      },
      "/execution_policy/visual_domain": {
        "source": "inferred",
        "confidence": 0.7
      },
      "/execution_policy/novelty": {
        "source": "inferred",
        "confidence": 0.7
      },
      "/exploration/creative_freedom": {
        "source": "inferred",
        "confidence": 0.7
      }
    }
  },
  "quality_plan": {
    "schema_version": 2,
    "brief_digest": "e7164e347e83f332d775ccf244ecaf9eabc76df23ad590380fc16e7ab539ff73",
    "candidate_direction_digest": "e7164e347e83f332d775ccf244ecaf9eabc76df23ad590380fc16e7ab539ff73",
    "quality_tier": "quality",
    "creative_freedom": "medium",
    "candidate_set_id": null,
    "direction_id": null,
    "candidate_concept": null,
    "candidate_index": 1,
    "candidate_total": 1,
    "recommended_candidate_count": 2,
    "candidate_coverage": "insufficient",
    "candidate_mode": "divergent-then-convergent",
    "required_diversity_axes": [
      "concept",
      "composition_or_camera",
      "visual_language_or_palette"
    ],
    "variation_axes": [],
    "review_dimensions": [
      "requirement_fidelity",
      "concept_specificity",
      "composition_hierarchy",
      "craft_detail",
      "text_typography",
      "destination_usability",
      "delight"
    ],
    "independent_review_required": true,
    "maximum_targeted_retries": 2
  },
  "prompt_compilation": {
    "raw_sha256": "24fc951ff8d9f91a8f6c0e59e30bbb472b3f46cb4bb3265022c6f15c42fa2b00",
    "compiled_sha256": "6de65255e792f8cd408bd697c407f279201b12f275fb684ab5810a64e92ae33f",
    "template_id": "allin-openai-structured-illustration-v1",
    "template_version": "2026-08-09.3",
    "task_profile": "illustration",
    "task_profile_reason": "explicit",
    "prompt_mode": "quality",
    "model_profile_id": "openai-structured-illustration-v1",
    "hard_constraints": {
      "facts": [],
      "exact_text": [],
      "preserve": [],
      "forbid": [
        "文字、水印、Logo、装饰边框、卡通风格、扁平化、白天、日光、云层、月亮"
      ]
    },
    "creative_brief_schema_version": 2,
    "creative_brief_version": "2026-08-09.2",
    "creative_brief_digest": "e7164e347e83f332d775ccf244ecaf9eabc76df23ad590380fc16e7ab539ff73",
    "candidate_direction_digest": "e7164e347e83f332d775ccf244ecaf9eabc76df23ad590380fc16e7ab539ff73"
  },
  "model": "gpt-image-2",
  "model_selection": {
    "mode": "default-champion",
    "model": "gpt-image-2",
    "reason": "default-gpt-image-2",
    "task_profile": "illustration",
    "policy_version": "2026-08-20.1",
    "policy_digest": "3f856baa08a1c916c1dc00dbac32a6e6d5a0cc97c86888b27c3ea55d2bff50b7",
    "task_profile_reason": "explicit"
  },
  "model_policy_version": "2026-08-20.1",
  "model_policy_digest": "3f856baa08a1c916c1dc00dbac32a6e6d5a0cc97c86888b27c3ea55d2bff50b7",
  "capabilities_digest": "fe03361b1e8866d7169ebb2754af99ae8df7f1722fed9042de38f1b54dc5e94b",
  "chatbot_key": "gpt-image-2",
  "style": null,
  "default_style_applied": false,
  "input_images": [],
  "workspace_id": 0,
  "project_id": 0,
  "retry_stage": 0
}
```

## Extra Params
```json
{
  "image_ratio": "3:2"
}
```

## Raw Prompt

等距圆柱投影的地球夜景贴图，用于3D球体贴图，横向铺满整个画面。从太空俯瞰地球的夜景：纯黑色太空背景，地球表面被冷白色和淡金色的城市灯光点亮，形成大片聚集的光斑（类似NASA Black Marble卫星影像），灯光有密集的都市群也有零散的乡村灯火，边缘有柔和的光晕。陆地轮廓在灯光中隐约可辨，能看到微弱的地形起伏和河流走向。海洋是深邃的墨蓝色到深蓝色渐变，有微妙的深浅变化。画面整体偏冷蓝色调，大气层边缘有一层淡蓝色辉光。摄影级真实感，高细节，无文字、无装饰边框、无水印

## Compiled Prompt

<user_requirements>
等距圆柱投影的地球夜景贴图，用于3D球体贴图，横向铺满整个画面。从太空俯瞰地球的夜景：纯黑色太空背景，地球表面被冷白色和淡金色的城市灯光点亮，形成大片聚集的光斑（类似NASA Black Marble卫星影像），灯光有密集的都市群也有零散的乡村灯火，边缘有柔和的光晕。陆地轮廓在灯光中隐约可辨，能看到微弱的地形起伏和河流走向。海洋是深邃的墨蓝色到深蓝色渐变，有微妙的深浅变化。画面整体偏冷蓝色调，大气层边缘有一层淡蓝色辉光。摄影级真实感，高细节，无文字、无装饰边框、无水印
</user_requirements>

<production_directives>
- 建立清晰单一的视觉焦点、层级、留白和目的地适配构图。
- 用一致的色彩、光线、材质和风格完成画面，避免无意义元素堆叠。
- 先形成与内容、受众和使用场景绑定的视觉逻辑；避免套用通用 AI 图标、库存式构图或无意义高级感。
- 至少做出一个有目的、可解释的独特设计决策；惊喜来自概念、构图与工艺，不来自堆叠装饰。
- 按最终使用尺寸检查视觉焦点、层级、留白、边缘、材质和文字排印。
- 画布比例由接口参数控制；不要把比例、参数名或制作说明绘制进图片。
</production_directives>

<hard_constraints>
禁止出现或禁止改变：
- 文字、水印、Logo、装饰边框、卡通风格、扁平化、白天、日光、云层、月亮
</hard_constraints>

<final_check>
生成前自行核对：事实、数量、文字、身份/参考保持、概念特异性、构图层级、工艺细节、目的地可用性和伪影。
任何装饰都不得覆盖硬约束。
</final_check>
