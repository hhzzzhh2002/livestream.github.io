// 销售失败主题海报动画效果
document.addEventListener('DOMContentLoaded', function() {
    // 要操作的元素
    const cloudsContainer = document.getElementById('clouds-container');
    const posterContainer = document.querySelector('.poster-container');
    const numberElement = document.getElementById('text-number');
    const unitElement = document.getElementById('text-unit');
    const topTextContainer = document.querySelector('.top-text-container');
    const bottomBannerContainer = document.querySelector('.bottom-banner-container');
    const failureTextContainer = document.querySelector('.failure-text-container');
    
    // 初始隐藏顶部文字、底部横幅和失败文字
    topTextContainer.style.opacity = '0';
    bottomBannerContainer.style.opacity = '0';
    failureTextContainer.style.opacity = '0';
    failureTextContainer.style.scale = '0';
    
    // 创建多个雨云的SVG
    function createRaincloudSVG(size, color) {
        const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size * 0.8}" viewBox="0 0 150 120">
            <!-- 云朵 -->
            <path d="M30,60 Q10,60 10,50 Q10,30 30,30 Q30,10 50,10 Q70,10 70,30 Q90,20 100,30 Q120,30 120,50 Q120,70 100,70 Q100,80 80,80 Q60,80 60,70 Q40,80 30,70 Q10,70 10,50 Q10,30 30,30" fill="${color}" stroke="#34495e" stroke-width="2"/>
            <!-- 雨滴 -->
            <path d="M40,85 L35,100" stroke="#3498db" stroke-width="4" stroke-linecap="round"/>
            <path d="M60,85 L55,100" stroke="#3498db" stroke-width="4" stroke-linecap="round"/>
            <path d="M80,85 L75,100" stroke="#3498db" stroke-width="4" stroke-linecap="round"/>
            <path d="M100,85 L95,100" stroke="#3498db" stroke-width="4" stroke-linecap="round"/>
        </svg>
        `;
        
        // 创建Blob对象
        const blob = new Blob([svgContent], {type: 'image/svg+xml'});
        
        // 创建URL
        return URL.createObjectURL(blob);
    }
    
    // 创建多个雨云
    function createMultipleClouds() {
        // 云朵位置和大小配置
        const cloudConfigs = [
            { top: 120, left: 120, size: 180, color: '#7f8c8d' },
            { top: 80, right: 150, size: 150, color: '#95a5a6' },
            { top: 200, left: 300, size: 120, color: '#7f8c8d' },
            { top: 150, right: 300, size: 160, color: '#95a5a6' },
            { top: 50, left: 500, size: 140, color: '#7f8c8d' }
        ];
        
        // 创建每个云朵
        cloudConfigs.forEach((config, index) => {
            const cloud = document.createElement('img');
            cloud.className = 'raincloud';
            cloud.id = `raincloud-${index}`;
            cloud.src = createRaincloudSVG(config.size, config.color);
            
            // 设置位置
            cloud.style.top = `${config.top}px`;
            if (config.left) {
                cloud.style.left = `${config.left}px`;
            } else {
                cloud.style.right = `${config.right}px`;
            }
            
            // 添加点击事件
            cloud.addEventListener('click', function() {
                createRainFromCloud(cloud);
                
                // 添加点击效果
                cloud.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    cloud.style.transform = 'scale(1)';
                }, 200);
            });
            
            // 添加到容器
            cloudsContainer.appendChild(cloud);
            
            // 延迟显示
            setTimeout(() => {
                cloud.style.opacity = '1';
            }, 500 + index * 300);
        });
    }
    
    // 创建雨滴
    function createRaindrop(x, y) {
        const raindrop = document.createElement('div');
        raindrop.className = 'raindrop';
        raindrop.style.left = `${x}px`;
        raindrop.style.top = `${y}px`;
        raindrop.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
        
        // 随机大小变化
        const sizeVariation = 0.8 + Math.random() * 0.4; // 0.8-1.2倍大小变化
        raindrop.style.width = `${15 * sizeVariation}px`;
        raindrop.style.height = `${30 * sizeVariation}px`;
        
        // 存储雨滴的运动属性
        raindrop.dataset.speed = 5 + Math.random() * 8; // 增加速度
        raindrop.dataset.opacity = 0.7 + Math.random() * 0.3;
        
        return raindrop;
    }
    
    // 从特定云朵创建雨滴
    function createRainFromCloud(cloud) {
        // 获取云朵位置
        const cloudRect = cloud.getBoundingClientRect();
        const containerRect = posterContainer.getBoundingClientRect();
        
        // 计算云朵相对于海报容器的位置
        const cloudLeft = cloudRect.left - containerRect.left;
        const cloudTop = cloudRect.top - containerRect.top;
        const cloudWidth = cloudRect.width;
        
        // 创建15个新雨滴（增加数量）
        for (let i = 0; i < 15; i++) {
            // 随机位置（在云朵下方）
            const x = cloudLeft + Math.random() * cloudWidth;
            const y = cloudTop + cloudRect.height;
            
            // 创建雨滴并添加到容器
            const raindrop = createRaindrop(x, y);
            posterContainer.appendChild(raindrop);
        }
    }
    
    // 创建初始雨滴效果
    function createInitialRainEffect() {
        // 获取所有云朵
        const clouds = document.querySelectorAll('.raincloud');
        
        // 为每朵云创建雨滴
        clouds.forEach(cloud => {
            // 获取云朵位置
            const cloudRect = cloud.getBoundingClientRect();
            const containerRect = posterContainer.getBoundingClientRect();
            
            // 计算云朵相对于海报容器的位置
            const cloudLeft = cloudRect.left - containerRect.left;
            const cloudTop = cloudRect.top - containerRect.top;
            const cloudWidth = cloudRect.width;
            
            // 创建10-20个雨滴（根据云朵大小）
            const dropCount = 10 + Math.floor(cloudWidth / 15);
            for (let i = 0; i < dropCount; i++) {
                // 随机位置（在云朵下方和整个容器中）
                const x = cloudLeft + Math.random() * cloudWidth;
                const y = cloudTop + cloudRect.height + Math.random() * (containerRect.height - cloudTop - cloudRect.height);
                
                // 创建雨滴并添加到容器
                const raindrop = createRaindrop(x, y);
                posterContainer.appendChild(raindrop);
            }
        });
        
        // 开始雨滴动画
        animateRain();
    }
    
    // 让雨滴下落
    function animateRain() {
        const raindrops = document.querySelectorAll('.raindrop');
        
        function updateRaindrops() {
            raindrops.forEach(raindrop => {
                // 获取当前位置和速度
                const currentY = parseFloat(raindrop.style.top);
                const speed = parseFloat(raindrop.dataset.speed);
                
                // 更新位置
                raindrop.style.top = `${currentY + speed}px`;
                
                // 如果雨滴超出容器底部，重置到某个云朵下方
                const containerRect = posterContainer.getBoundingClientRect();
                const raindropRect = raindrop.getBoundingClientRect();
                
                if (raindropRect.top > containerRect.bottom) {
                    // 随机选择一朵云
                    const clouds = document.querySelectorAll('.raincloud');
                    const randomCloud = clouds[Math.floor(Math.random() * clouds.length)];
                    const cloudRect = randomCloud.getBoundingClientRect();
                    
                    // 重置位置到选中的云下方
                    raindrop.style.top = `${cloudRect.bottom - containerRect.top}px`;
                    raindrop.style.left = `${cloudRect.left - containerRect.left + Math.random() * cloudRect.width}px`;
                }
            });
            
            requestAnimationFrame(updateRaindrops);
        }
        
        // 开始动画循环
        requestAnimationFrame(updateRaindrops);
    }
    
    // 创建数字碎片
    function createNumberFragment(x, y, size, angle) {
        const fragment = document.createElement('div');
        fragment.className = 'number-fragment';
        fragment.style.width = `${size}px`;
        fragment.style.height = `${size}px`;
        fragment.style.left = `${x}px`;
        fragment.style.top = `${y}px`;
        fragment.style.transform = `rotate(${angle}deg)`;
        
        // 存储碎片的运动属性
        fragment.dataset.velocityX = Math.cos(angle * Math.PI / 180) * (3 + Math.random() * 8);
        fragment.dataset.velocityY = Math.sin(angle * Math.PI / 180) * (3 + Math.random() * 8);
        fragment.dataset.gravity = 0.2;
        fragment.dataset.friction = 0.98;
        fragment.dataset.rotation = Math.random() * 10 - 5;
        fragment.dataset.creationTime = Date.now();
        fragment.dataset.stopTime = Date.now() + 1000 + Math.random() * 1000; // 1-2秒后停止
        
        return fragment;
    }
    
    // 数字破碎动画
    function animateNumberBreaking() {
        // 获取数字元素的位置和尺寸
        const numberRect = numberElement.getBoundingClientRect();
        const containerRect = posterContainer.getBoundingClientRect();
        
        // 计算数字相对于海报容器的位置
        const numberLeft = numberRect.left - containerRect.left;
        const numberTop = numberRect.top - containerRect.top;
        const numberWidth = numberRect.width;
        const numberHeight = numberRect.height;
        
        // 创建40个碎片（增加数量）
        for (let i = 0; i < 40; i++) {
            // 随机位置（在数字区域内）
            const x = numberLeft + Math.random() * numberWidth;
            const y = numberTop + Math.random() * numberHeight;
            
            // 随机大小（10-40像素）
            const size = 10 + Math.random() * 30;
            
            // 随机角度（0-360度）
            const angle = Math.random() * 360;
            
            // 创建碎片并添加到容器
            const fragment = createNumberFragment(x, y, size, angle);
            posterContainer.appendChild(fragment);
        }
        
        // 隐藏原始数字
        numberElement.style.opacity = '0';
        
        // 显示失败文字和哭脸
        setTimeout(() => {
            failureTextContainer.style.opacity = '1';
            failureTextContainer.style.scale = '1';
        }, 200);
        
        // 动画碎片
        animateFragments();
    }
    
    // 动画碎片
    function animateFragments() {
        const fragments = document.querySelectorAll('.number-fragment');
        let animationActive = true;
        
        function updateFragments() {
            let allSettled = true;
            const now = Date.now();
            
            fragments.forEach(fragment => {
                // 检查是否应该停止运动
                const stopTime = parseInt(fragment.dataset.stopTime);
                if (now >= stopTime) {
                    // 时间到，停止运动
                    fragment.dataset.velocityX = 0;
                    fragment.dataset.velocityY = 0;
                    return;
                }
                
                // 获取当前速度
                let vx = parseFloat(fragment.dataset.velocityX);
                let vy = parseFloat(fragment.dataset.velocityY);
                
                // 应用重力
                vy += parseFloat(fragment.dataset.gravity);
                
                // 应用摩擦力
                vx *= parseFloat(fragment.dataset.friction);
                vy *= parseFloat(fragment.dataset.friction);
                
                // 更新位置
                const currentX = parseFloat(fragment.style.left);
                const currentY = parseFloat(fragment.style.top);
                
                fragment.style.left = `${currentX + vx}px`;
                fragment.style.top = `${currentY + vy}px`;
                
                // 更新旋转
                const currentRotation = fragment.style.transform.match(/rotate\(([^)]+)\)/);
                const rotation = currentRotation ? parseFloat(currentRotation[1]) : 0;
                fragment.style.transform = `rotate(${rotation + parseFloat(fragment.dataset.rotation)}deg)`;
                
                // 保存更新后的速度
                fragment.dataset.velocityX = vx;
                fragment.dataset.velocityY = vy;
                
                // 检查是否静止
                if (Math.abs(vx) > 0.1 || Math.abs(vy) > 0.1) {
                    allSettled = false;
                }
                
                // 检查是否超出容器边界
                const containerRect = posterContainer.getBoundingClientRect();
                const fragmentRect = fragment.getBoundingClientRect();
                
                if (fragmentRect.bottom > containerRect.bottom) {
                    fragment.style.top = `${containerRect.height - fragmentRect.height}px`;
                    fragment.dataset.velocityY = -Math.abs(vy) * 0.3; // 弱反弹
                }
                
                if (fragmentRect.right > containerRect.right) {
                    fragment.style.left = `${containerRect.width - fragmentRect.width}px`;
                    fragment.dataset.velocityX = -Math.abs(vx) * 0.3; // 弱反弹
                }
                
                if (fragmentRect.left < containerRect.left) {
                    fragment.style.left = '0px';
                    fragment.dataset.velocityX = Math.abs(vx) * 0.3; // 弱反弹
                }
            });
            
            // 如果所有碎片都静止了，停止动画
            if (allSettled) {
                animationActive = false;
                
                // 显示顶部文字和底部横幅
                setTimeout(() => {
                    showTopTextAndBanner();
                }, 1000);
            } else if (animationActive) {
                requestAnimationFrame(updateFragments);
            }
        }
        
        // 开始动画循环
        requestAnimationFrame(updateFragments);
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
    
    // 数字增长动画 - 从0到19000，逐渐减速
    function animateNumberGrowth(targetNumber) {
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
            
            // 使用缓动函数使动画逐渐减速
            const easedProgress = easeOutQuart(progress);
            
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
                
                // 显示单位
                unitElement.style.opacity = '1';
                
                // 数字动画完成后，触发破碎效果
                setTimeout(() => {
                    animateNumberBreaking();
                }, 500);
            }
        }
        
        // 缓动函数 - 四次方减速
        function easeOutQuart(x) {
            return 1 - Math.pow(1 - x, 4);
        }
        
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
        button.style.backgroundColor = '#e74c3c';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.fontSize = '16px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
        
        // 悬停效果
        button.onmouseover = function() {
            this.style.backgroundColor = '#c0392b';
        };
        button.onmouseout = function() {
            this.style.backgroundColor = '#e74c3c';
        };
        
        // 点击事件 - 截图功能
        button.onclick = function() {
            // 临时隐藏按钮
            this.style.display = 'none';
            
            // 使用html2canvas库截图
            html2canvas(posterContainer).then(function(canvas) {
                // 创建下载链接
                const link = document.createElement('a');
                link.download = '销售失败海报.png';
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
    
    // 页面加载时的初始化
    function initialize() {
        // 创建截图按钮
        createScreenshotButton();
        
        // 创建多个雨云
        createMultipleClouds();
        
        // 延迟创建雨滴效果
        setTimeout(() => {
            createInitialRainEffect();
        }, 2000);
        
        // 开始数字增长动画
        setTimeout(() => {
            animateNumberGrowth(19000);
        }, 2500);
    }
    
    // 初始化
    initialize();
});
