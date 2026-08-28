#!/usr/bin/env python3
"""从白天贴图派生夜景贴图 v2：保留真实地形 + 光斑感城市灯光"""
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance

SRC = 'public/earth-texture.jpg'
DST = 'public/earth-night.jpg'

img = Image.open(SRC).convert('RGB')
W, H = img.size
arr = np.asarray(img, dtype=np.float32) / 255.0
R, G, B = arr[..., 0], arr[..., 1], arr[..., 2]
luma = 0.299 * R + 0.587 * G + 0.114 * B

# ---------- 1. 夜景基底：压暗 + 调蓝 + 保留地形细节 ----------
# 海洋判定（白天图里海洋是亮暖色）
landness = np.clip((0.66 - luma) * 5.0, 0, 1)
land_img = Image.fromarray((landness * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))
landness = np.asarray(land_img, dtype=np.float32) / 255.0

# 基底 = 原图大幅压暗，但保留纹理走向
base = arr * 0.10  # 先压到 10%
# 海洋单独再压暗到接近纯黑蓝
ocean_mask = 1.0 - landness
base[ocean_mask > 0.5] *= 0.6

# 整体调蓝：R 再压、B 稍抬
night = np.zeros_like(base)
night[..., 0] = base[..., 0] * 0.35   # 红大幅压
night[..., 1] = base[..., 1] * 0.65   # 绿中等
night[..., 2] = np.clip(base[..., 2] * 1.4 + 0.02, 0, 1)  # 蓝抬升

# ---------- 2. 地形高光：从原图提取亮脊线 ----------
blur = img.filter(ImageFilter.GaussianBlur(3))
blur_arr = np.asarray(blur, dtype=np.float32) / 255.0
# 亮脊线 = 原图比模糊亮的地方（山脉向阳面、河流亮边）
ridge = np.clip(arr - blur_arr, 0, 1).max(axis=2)
# 暗谷线 = 模糊比原图暗的地方（河流、峡谷）
valley = np.clip(blur_arr - arr, 0, 1).max(axis=2) * 0.6
terrain = np.clip(ridge + valley, 0, 1) * landness
# 轻微模糊让线条柔一点
terrain_img = Image.fromarray((np.clip(terrain, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
terrain = np.asarray(terrain_img, dtype=np.float32) / 255.0
# 叠加暖金色地形光
glow_col = np.array([0.90, 0.72, 0.42])
night += terrain[..., None] * glow_col[None, None, :] * 0.45

# ---------- 3. 城市灯光：光斑感 ----------
rng = np.random.default_rng(42)
# 城市群簇
noise_lo = rng.random((H // 12, W // 12)).astype(np.float32)
noise_img = Image.fromarray((noise_lo * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR).filter(ImageFilter.GaussianBlur(12))
cluster = np.asarray(noise_img, dtype=np.float32) / 255.0

# 海岸线增益
grad_x = np.abs(np.diff(landness, axis=1, prepend=landness[:, :1]))
grad_y = np.abs(np.diff(landness, axis=0, prepend=landness[:1, :]))
coast = np.clip((grad_x + grad_y) * 8.0, 0, 1)
coast = np.asarray(Image.fromarray((coast * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6)), dtype=np.float32) / 255.0

# 灯光密度
density = landness * (0.30 + 0.70 * cluster) * (0.4 + 0.8 * coast)
density = np.clip(density - 0.12, 0, 1) * 2.5

# 撒点
prob = rng.random((H, W)).astype(np.float32)
lights = (prob < density * 0.28).astype(np.float32)

# 亮度差异：核心亮 + 外圈柔光
brightness = 0.5 + 0.5 * rng.random((H, W)).astype(np.float32)
lights *= brightness

# 大幅模糊出光晕（关键：不是撒盐，是光斑）
lights_img = Image.fromarray((np.clip(lights, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2.5))
lights = np.asarray(lights_img, dtype=np.float32) / 255.0
# 增强核心亮度，柔化边缘
lights = np.clip(lights * 1.8, 0, 1)

# 灯光颜色：暖金主调，少量偏白
light_warm = np.array([1.0, 0.80, 0.42])
light_cool = np.array([0.82, 0.88, 1.0])
cool_mask = (rng.random((H, W)) < 0.06).astype(np.float32)
light_col = light_warm[None, None, :] * (1 - cool_mask[..., None]) + light_cool[None, None, :] * cool_mask[..., None]
night += lights[..., None] * light_col * 1.5

# ---------- 4. 海洋加蓝调 ----------
# 给海洋一点深蓝的通透感
ocean_blue = np.array([0.02, 0.04, 0.10])
night += ocean_mask[..., None] * ocean_blue[None, None, :] * 0.8

# 最终微调
night = np.clip(night * 1.12, 0, 1)

out = Image.fromarray((night * 255).astype(np.uint8))
out.save(DST, quality=88, optimize=True)
print('夜景贴图 v2 已生成:', DST, out.size)
