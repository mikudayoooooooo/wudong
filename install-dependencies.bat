@echo off
chcp 65001 >nul
echo ========================================
echo   首次安装依赖脚本
echo ========================================
echo.
echo 正在安装项目依赖，请耐心等待...
echo.

:: 安装后端依赖
echo [1/2] 安装后端依赖 (cool-admin-midway)...
cd /d %~dp0cool-admin-midway
if not exist node_modules (
    echo 开始安装后端依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo [错误] 后端依赖安装失败
        pause
        exit /b 1
    )
    echo [完成] 后端依赖安装成功
) else (
    echo [跳过] 后端依赖已安装
)
echo.

:: 安装前端依赖
echo [2/2] 安装前端依赖 (wudong-web)...
cd /d %~dp0wudong-web
if not exist node_modules (
    echo 开始安装前端依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo [错误] 前端依赖安装失败
        pause
        exit /b 1
    )
    echo [完成] 前端依赖安装成功
) else (
    echo [跳过] 前端依赖已安装
)
echo.

echo ========================================
echo   依赖安装完成！
echo ========================================
echo.
echo 现在可以启动项目了：
echo.
echo   方式1: 双击运行 start-all.bat
echo   方式2: 手动执行:
echo          cd cool-admin-midway
echo          npm run dev
echo.
pause
