@echo off
chcp 65001 >nul
echo ========================================
echo   乌东文旅平台 - 快速启动脚本
echo ========================================
echo.

:: 检查Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

echo [1/3] 检测 Node.js 版本...
node --version
echo.

:: 启动后端
echo [2/3] 启动后端服务 (cool-admin-midway)...
echo 正在打开新窗口启动后端...
start "后端服务 - 端口8001" cmd /k "cd /d %~dp0cool-admin-midway && echo 正在启动后端服务... && npm run dev"
timeout /t 3 >nul

:: 启动C端前端
echo [3/3] 启动C端前端 (wudong-web)...
echo 正在打开新窗口启动前端...
start "C端前端 - 端口5173" cmd /k "cd /d %~dp0wudong-web && echo 正在启动前端... && npm run dev"

echo.
echo ========================================
echo   启动完成！
echo ========================================
echo.
echo 请等待服务启动完成，然后访问：
echo.
echo   后端API:   http://localhost:8001
echo   Swagger:   http://localhost:8001/swagger-ui/index.html
echo   C端前端:   http://localhost:5173
echo.
echo 页面地址：
echo   - 首页:     http://localhost:5173/
echo   - 商品:     http://localhost:5173/products
echo   - 餐厅:     http://localhost:5173/restaurants
echo   - 农产品:   http://localhost:5173/farm-products
echo   - 民宿:     http://localhost:5173/hotels
echo.
echo 按任意键退出此窗口（服务将继续运行）...
pause >nul
