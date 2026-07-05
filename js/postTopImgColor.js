// ******************************************** 辅助函数：RGB 转 HSL 字符串 ***********************************
// r, g, b: 0-255
// mixWhite: 0~1 之间的数。0=原色，0.9=极淡(背景色)，0.5=半透明感
function rgbToHslValue(r, g, b, mixWhite = 0) {
    // --- 1. 核心修改：如果有混合白色需求，先调整 RGB ---
    if (mixWhite > 0) {
        r = Math.round(r + (255 - r) * mixWhite);
        g = Math.round(g + (255 - g) * mixWhite);
        b = Math.round(b + (255 - b) * mixWhite);
    }

    // --- 2. 标准 HSL 转换逻辑 ---
    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // 灰色
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    // --- 3. 返回结果 ---
    // 注意：CSS 标准现在推荐用空格分隔 (220 80% 60%)，但也兼容逗号。
    // 这里保留你代码里的空格格式。
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// ******************************************** 默认配色逻辑 ***********************************
function setDefaultTheme() {
    const root = document.documentElement;
    // 默认 HSL 值 (对应之前的 hsl(3 81% 72%))
    const defaultHsl = '3 81% 72%'; 

    root.style.setProperty('--glmp-color', defaultHsl);
    root.style.setProperty('--glimp-post-topbg', 'transparent');
    root.style.setProperty('--glmp-postFooterbg', '0 33% 96%');
    
    // 设置默认的透明度变量
    root.style.setProperty('--heo-main-op', `hsla(${defaultHsl}, 0.5)`);
    root.style.setProperty('--heo-main-op-deep', `hsla(${defaultHsl}, 0.2)`);
    
    // console.log('已应用默认主题色');
}

// ******************************************** 文章页头图主色调提取主函数 ***********************************
function topcolor() {
    const bodyWrap = document.getElementById('body-wrap');
    if (!bodyWrap || !bodyWrap.classList.contains('post')) {
        setDefaultTheme();
        return;
    }

    const originalImg = document.getElementById("post-cover");
    if (!originalImg) {
        setDefaultTheme();
        return;
    }

    // 1. 获取原图地址
    const src = originalImg.getAttribute('src');
    if (!src) return;

    // 2. 创建一个“影子图片”专门用来取色
    const shadowImg = new Image();
    
    // 3. 只有影子图片才开启跨域，并且强制走代理绕过路过图床的限制
    shadowImg.crossOrigin = "Anonymous";
    shadowImg.src = `https://images.weserv.nl/?url=${encodeURIComponent(src)}`;

    // 4. 当影子图片加载完，进行取色
    shadowImg.onload = function() {
        try {
            const colorThief = new ColorThief();
            // 注意：这里传给 ColorThief 的是影子图片 shadowImg
            const [r, g, b] = colorThief.getColor(shadowImg);
            
            const hslValue = rgbToHslValue(r, g, b);
            const hslFooter = rgbToHslValue(r, g, b, 0.90);

            const root = document.documentElement;
            root.style.setProperty('--glmp-color', hslValue);
            root.style.setProperty('--glmp-postFooterbg', hslFooter);
            root.style.setProperty('--glimp-post-topbg', `hsl(${hslValue})`);
        } catch (e) {
            console.warn("取色由于跨域原因失败:", e);
            setDefaultTheme();
        }
    };

    shadowImg.onerror = function() {
        setDefaultTheme();
    };
}

// ******************************************** 执行 ***********************************
topcolor();