// 礼花筒动画效果和数字滚动效果
document.addEventListener('DOMContentLoaded', function() {
    // 要操作的元素
    const lihuatong = document.querySelector('.lihuatong');
    const posterContainer = document.querySelector('.poster-container');
    const numberElement = document.getElementById('text-number');
    const plusElement = document.getElementById('text-plus');
    const unitElement = document.getElementById('text-unit');
    const topTextContainer = document.querySelector('.top-text-container');
    const bottomBannerContainer = document.querySelector('.bottom-banner-container');
    
    // 初始隐藏顶部文字和底部横幅
    topTextContainer.style.opacity = '0';
    bottomBannerContainer.style.opacity = '0';
    
    // 颜色数组
    const colors = [
        '#FF0000', // 红色
        '#FFFF00', // 黄色
        '#4A90E2', // 蓝色
        '#4CAF50', // 绿色
        '#9C27B0', // 紫色
        '#FF9800'  // 橙色
    ];
    
    // 创建一个方块元素 - 尺寸增大4倍
    function createSquare(x, y, color, angle, speed, size) {
        const square = document.createElement('div');
        square.className = 'confetti-square';
        square.style.backgroundColor = color;
        // 尺寸增大4倍
        square.style.width = `${size * 4}px`;
        square.style.height = `${size * 4}px`;
        square.style.position = 'absolute';
        square.style.left = `${x}px`;
        square.style.top = `${y}px`;
        square.style.zIndex = '100';
        square.style.transform = `rotate(${Math.random() * 360}deg)`;
        square.style.boxShadow = `0 0 ${Math.random() * 10 + 5}px rgba(0,0,0,0.3)`;
        square.style.opacity = '0.9';
        
        // 存储方块的运动属性
        square.dataset.angle = angle;
        square.dataset.speed = speed;
        square.dataset.gravity = '0.1';
        square.dataset.friction = '0.98';
        square.dataset.velocityX = Math.cos(angle * Math.PI / 180) * speed;
        square.dataset.velocityY = Math.sin(angle * Math.PI / 180) * speed;
        square.dataset.creationTime = Date.now();
        square.dataset.stopTime = Date.now() + 1000 + Math.random() * 1000; // 1-2秒后停止
        
        return square;
    }
    
    // 喷出彩色方块
    function sprayConfetti(x, y) {
        // 创建45个方块
        for (let i = 0; i < 45; i++) {
            // 随机角度 (150-300度范围，更大的扇形)
            const angle = 150 + Math.random() * 150;
            
            // 随机速度 - 增加速度使效果更夸张
            const speed = 10 + Math.random() * 20;
            
            // 随机大小 (15-30像素) - 基础尺寸，实际渲染会乘以4
            const size = 15 + Math.random() * 15;
            
            // 随机颜色
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // 创建方块并添加到容器
            const square = createSquare(x, y, color, angle, speed, size);
            posterContainer.appendChild(square);
            
            // 添加一点随机初始位置偏移，使起点不完全重合
            square.style.left = `${x + (Math.random() * 20 - 10)}px`;
            square.style.top = `${y + (Math.random() * 20 - 10)}px`;
        }
        
        // 开始动画
        animateConfetti();
    }
    
    // 动画函数
    function animateConfetti() {
        const squares = document.querySelectorAll('.confetti-square');
        let animationActive = true;
        
        function updatePositions() {
            let allSettled = true;
            const now = Date.now();
            
            squares.forEach(square => {
                // 检查是否应该停止运动
                const stopTime = parseInt(square.dataset.stopTime);
                if (now >= stopTime) {
                    // 时间到，停止运动
                    square.dataset.velocityX = 0;
                    square.dataset.velocityY = 0;
                    return;
                }
                
                // 获取当前速度
                let vx = parseFloat(square.dataset.velocityX);
                let vy = parseFloat(square.dataset.velocityY);
                
                // 应用重力
                vy += parseFloat(square.dataset.gravity);
                
                // 应用摩擦力
                vx *= parseFloat(square.dataset.friction);
                vy *= parseFloat(square.dataset.friction);
                
                // 更新位置
                const currentX = parseFloat(square.style.left);
                const currentY = parseFloat(square.style.top);
                
                square.style.left = `${currentX + vx}px`;
                square.style.top = `${currentY + vy}px`;
                
                // 更新旋转
                const currentRotation = square.style.transform.match(/rotate\(([^)]+)\)/);
                const rotation = currentRotation ? parseFloat(currentRotation[1]) : 0;
                square.style.transform = `rotate(${rotation + vx * 0.2}deg)`;
                
                // 保存更新后的速度
                square.dataset.velocityX = vx;
                square.dataset.velocityY = vy;
                
                // 检查是否静止
                if (Math.abs(vx) > 0.1 || Math.abs(vy) > 0.1) {
                    allSettled = false;
                }
                
                // 检查是否超出容器边界，如果是则反弹
                const containerRect = posterContainer.getBoundingClientRect();
                const squareRect = square.getBoundingClientRect();
                
                if (squareRect.bottom > containerRect.bottom) {
                    square.style.top = `${containerRect.height - squareRect.height}px`;
                    square.dataset.velocityY = -Math.abs(vy) * 0.5; // 反弹
                }
                
                if (squareRect.right > containerRect.right) {
                    square.style.left = `${containerRect.width - squareRect.width}px`;
                    square.dataset.velocityX = -Math.abs(vx) * 0.5; // 反弹
                }
                
                if (squareRect.left < containerRect.left) {
                    square.style.left = '0px';
                    square.dataset.velocityX = Math.abs(vx) * 0.5; // 反弹
                }
                
                if (squareRect.top < containerRect.top) {
                    square.style.top = '0px';
                    square.dataset.velocityY = Math.abs(vy) * 0.5; // 反弹
                }
            });
            
            // 如果所有方块都静止了，停止动画
            if (allSettled) {
                animationActive = false;
            } else if (animationActive) {
                requestAnimationFrame(updatePositions);
            }
        }
        
        // 开始动画循环
        requestAnimationFrame(updatePositions);
    }
    
    // 触发礼花筒效果
    function triggerConfetti() {
        // 清除之前的方块
        const oldSquares = document.querySelectorAll('.confetti-square');
        oldSquares.forEach(square => square.remove());
        
        // 获取礼花筒相对于海报容器的位置
        const lihuatongRect = lihuatong.getBoundingClientRect();
        const containerRect = posterContainer.getBoundingClientRect();
        
        // 计算喷射起点（礼花筒的顶部中心位置）
        const x = lihuatongRect.left - containerRect.left + lihuatongRect.width / 2;
        const y = lihuatongRect.top - containerRect.top + lihuatongRect.height / 2;
        
        // 喷射彩色方块
        sprayConfetti(x, y);
        
        // 添加点击效果
        lihuatong.style.transform = 'rotate(-135deg) scale(0.9)';
        setTimeout(() => {
            lihuatong.style.transform = 'rotate(-135deg) scale(1)';
        }, 200);
    }
    
    // 显示顶部文字和底部横幅
    function showTopTextAndBanner() {
        // 显示顶部文字
        topTextContainer.style.opacity = '1';
        topTextContainer.style.transition = 'opacity 1s ease';
        
        // 显示底部横幅
        bottomBannerContainer.style.opacity = '1';
        bottomBannerContainer.style.transition = 'opacity 1s ease';
        
        // 底部横幅动画
        const banner = document.querySelector('.banner');
        banner.style.transform = 'scaleX(0)';
        banner.style.transition = 'transform 1s ease';
        
        setTimeout(() => {
            banner.style.transform = 'scaleX(1)';
        }, 500);
        
        // 放射线动画
        const rays = document.querySelectorAll('.ray');
        rays.forEach(ray => {
            ray.style.opacity = '0';
            ray.style.transition = 'opacity 0.5s ease';
        });
        
        setTimeout(() => {
            rays.forEach((ray, index) => {
                setTimeout(() => {
                    ray.style.opacity = '1';
                }, index * 100);
            });
        }, 1000);
    }
    
    // 数字滚动动画
    function animateNumber(targetNumber) {
        // 确保目标数字是整数
        targetNumber = parseInt(targetNumber);
        
        // 当前数字
        let currentNumber = 0;
        
        // 动画持续时间（毫秒）
        const duration = 3000;
        
        // 开始时间
        const startTime = Date.now();
        
        // 更新函数
        function updateNumber() {
            // 计算已经过去的时间
            const elapsedTime = Date.now() - startTime;
            
            // 计算进度 (0 到 1)
            const progress = Math.min(elapsedTime / duration, 1);
            
            // 使用缓动函数使动画更自然
            const easedProgress = easeOutExpo(progress);
            
            // 计算当前应该显示的数字
            currentNumber = Math.floor(easedProgress * targetNumber);
            
            // 更新显示
            numberElement.textContent = currentNumber.toLocaleString();
            
            // 如果动画还没结束，继续更新
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                // 动画结束，确保显示最终数字
                numberElement.textContent = targetNumber.toLocaleString();
                
                // 显示加号和单位
                plusElement.style.opacity = '1';
                unitElement.style.opacity = '1';
                
                // 数字动画完成后，显示顶部文字和底部横幅
                showTopTextAndBanner();
                
                // 自动触发礼花筒效果
                setTimeout(() => {
                    triggerConfetti();
                }, 500);
            }
        }
        
        // 缓动函数 - 指数减速
        function easeOutExpo(x) {
            return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
        }
        
        // 隐藏加号和单位，直到数字动画完成
        plusElement.style.opacity = '0';
        unitElement.style.opacity = '0';
        
        // 开始动画
        updateNumber();
    }
    
    // 创建截图按钮
    function createScreenshotButton() {
        const button = document.createElement('button');
        button.textContent = '保存海报';
        button.style.position = 'fixed';
        button.style.bottom = '20px';
        button.style.right = '20px';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.fontSize = '16px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
        
        // 悬停效果
        button.onmouseover = function() {
            this.style.backgroundColor = '#45a049';
        };
        button.onmouseout = function() {
            this.style.backgroundColor = '#4CAF50';
        };
        
        // 点击事件 - 截图功能
        button.onclick = function() {
            // 临时隐藏按钮
            this.style.display = 'none';
            
            // 使用html2canvas库截图
            html2canvas(posterContainer).then(function(canvas) {
                // 创建下载链接
                const link = document.createElement('a');
                link.download = '销售海报.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                
                // 显示按钮
                button.style.display = 'block';
            });
        };
        
        // 添加到body
        document.body.appendChild(button);
        
        // 加载html2canvas库
        const script = document.createElement('script');
        script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
        document.head.appendChild(script);
    }
    
    // 礼花筒绑定点击事件
    lihuatong.addEventListener('click', triggerConfetti);
    
    // 页面加载时的初始化
    function initialize() {
        // 创建截图按钮
        createScreenshotButton();
        
        // 礼花筒初始化
        lihuatong.style.opacity = '1';
        
        // 开始数字动画
        setTimeout(() => {
            animateNumber(200000);
        }, 500);
    }
    
    // 初始化
    initialize();
});
