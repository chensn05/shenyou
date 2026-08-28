#!/usr/bin/env bash
# install.sh - Pod 解压后跑一次
# 由 guard-transform 模板渲染生成；shebang / set / 镜像参数已写死，请勿手改
set -eo pipefail
cd "$(dirname "$0")"

# monorepo 后端子目录（空字符串表示单仓，pip/npm 直接在顶层执行）
BACKEND_DIR=""

echo "[install] step: start (backend_dir='${BACKEND_DIR}')"

# 切到 backend 目录的 helper：单仓时是 no-op
_cd_backend() {
  if [ -n "$BACKEND_DIR" ] && [ -d "$BACKEND_DIR" ]; then
    cd "$BACKEND_DIR"
  fi
}

if [ "0" = "1" ]; then
  (
    _cd_backend
    if [ -f requirements.txt ]; then
      # Guard pod 无公网，pip 必须走内部镜像
      # pip install --no-cache-dir -i http://pypi.devops.xiaohongshu.com/simple/ --trusted-host pypi.devops.xiaohongshu.com -r requirements.txt 2>&1
      if [ "$(uname)" = "Linux" ]; then
        echo "[install] step: create venv + pip install (venv 隔离) in $(pwd)"
        python3 -m venv .venv
        . .venv/bin/activate
        pip install --no-cache-dir -i http://pypi.devops.xiaohongshu.com/simple/ --trusted-host pypi.devops.xiaohongshu.com -r requirements.txt 2>&1
        deactivate
      else
        echo "[install] step: pip install in $(pwd)"
        python3 -m pip install --no-cache-dir -i http://pypi.devops.xiaohongshu.com/simple/ --trusted-host pypi.devops.xiaohongshu.com -r requirements.txt 2>&1
      fi
    fi
  )
fi

if [ "0" = "1" ]; then
  (
    _cd_backend
    # Next.js standalone 通常自带 node_modules，可跳过
    if [ -f package.json ] && [ ! -f .next/standalone/server.js ]; then
      echo "[install] step: npm ci --omit=dev in $(pwd)"
      # Guard pod 无公网，走内部 registry
      npm ci --omit=dev --registry=http://npm.devops.xiaohongshu.com:7001 2>&1
    fi
  )
fi

# ── 纯前端 SPA 托管 runtime ─────────────────────────────────────────────
# server.cjs 已用 Node 内置模块（http/fs/path）直接托管静态文件，
# 不再依赖 serve-handler，因此 .guard-runtime/ 安装步骤已移除。
if [ "0" = "1" ]; then
  echo "[install] step: .guard-runtime/ 已弃用（server.cjs 无外部依赖）"
  mkdir -p .guard-runtime
fi

if [ "0" = "1" ]; then
  (
    _cd_backend
    # Linux 上 Python 脚本需激活 venv（install 阶段已创建）
    if [ "$(uname)" = "Linux" ] && [ -f .venv/bin/activate ]; then
      . .venv/bin/activate
    fi
    echo "[install] step: db init (DDL + DML) in $(pwd)"
    if [ -f app/init_db.py ]; then
      python -m app.init_db 2>&1
    elif [ -f init_db.py ]; then
      python init_db.py 2>&1
    elif [ -f dist/init_db.js ]; then
      node dist/init_db.js 2>&1
    elif [ -f init_db.js ]; then
      node init_db.js 2>&1
    fi

    if [ -f app/seed_db.py ]; then
      echo "[install] step: db seed"
      python -m app.seed_db 2>&1
    elif [ -f dist/seed_db.js ]; then
      echo "[install] step: db seed"
      node dist/seed_db.js 2>&1
    fi
  )
fi

echo "[install] done"
