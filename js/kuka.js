
var urlinfo = window.location.pathname;
var isMobile = /Mobi|Android/i.test(navigator.userAgent);



// 1. 关于页元素
var layers = document.querySelectorAll('.parallax-layer');
var ticking = false;
var magnification = 1;  // 放大倍数：如果你觉得幅度小，把这个 2 改成 3 或更高




var kuka = {

  // *** 友好地显示时间
  timeago: function() {
    // 判断是否为首页，只在首页执行
    if (urlinfo === '/') {
      const pallArr = document.querySelectorAll("time"); // 获取首页的时间标签
      const dateNow = new Date(); // 获取当前时间

      // 单位换算
      const min = 60 * 1000;
      const hour = min * 60;
      const day = hour * 24;
      const week = day * 7;
      const month = week * 4;
      const year = month * 12;

      pallArr.forEach((timeElement) => {
          const publishDate = new Date(timeElement.dateTime); // 获取发布时间
          const timeDiff = dateNow.getTime() - publishDate.getTime(); // 计算时间差

          // 计算时间单位
          const exceedMonth = Math.floor(timeDiff / month);
          const exceedDay = Math.floor(timeDiff / day);
          const exceedHour = Math.floor(timeDiff / hour);
          const exceedMin = Math.floor(timeDiff / min);

          let formattedDate = '';
          const dateStr = timeElement.innerHTML.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);

          if (dateStr) {
              const [yearStr, monthStr, dayStr] = [dateStr[1], dateStr[2].replace(/^0/, ''), dateStr[3].replace(/^0/, '')];
              const isCurrentYear = yearStr === dateNow.getFullYear().toString();

              if (isCurrentYear) {
                  if (exceedMonth <= 12) {
                      if (exceedDay > 7) {
                          formattedDate = `${monthStr}/${dayStr}`;
                      } else if (exceedDay > 0) {
                          formattedDate = `${exceedDay}天前`;
                      } else if (exceedHour > 0) {
                          formattedDate = `${exceedHour}小时前`;
                      } else if (exceedMin <= 10) {
                          formattedDate = "刚刚";
                      } else {
                          formattedDate = `${exceedMin}分钟前`;
                      }
                  } else {
                      formattedDate = `${monthStr}/${dayStr}`;
                  }
              } else {
                  formattedDate = `${yearStr}/${monthStr}/${dayStr}`;
              }
          }

          timeElement.innerHTML = formattedDate || timeElement.innerHTML; // 更新内容
      });
    }
  },


  // *** 首页文章列表鼠标横向滚动
  homePostScroll: function() {
    // 检测是否为移动端
    if (isMobile) {
        // console.log("这是手机端");
    } else {
        // console.log("这不是手机端");
        const recent_post_item_number = document.querySelectorAll('.recent-post-item').length;
        
        // 横向滚动
        var swiper = new Swiper(".swiper", {
          effect: "coverflow",
          grabCursor: true,
          spaceBetween: 0,
          centeredSlides: false,
          coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 0,
            modifier: 1,
            slideShadows: false
          },
          loop: false,
          pagination: {
            el: ".swiper-pagination",
            clickable: true
          },
          keyboard: {
            enabled: true
          },
          mousewheel: {
            thresholdDelta: 70
          },
          on: {
            init() {
              updateSwiperLimit(this);
            },
            resize() {
              updateSwiperLimit(this);
            },
            slideChange() {
              updateSwiperLimit(this);
            }
          },
          breakpoints: {
            460: {
              slidesPerView: 4,
              // slidesPerGroup: 一次滚动4个宽度（相当于整行的宽度）
              slidesPerGroup: 4
            },
            768: {
              slidesPerView: 4,
              slidesPerGroup: 4
            },
            1024: {
              slidesPerView: 4,
              slidesPerGroup: 4
            },
            1600: {
              slidesPerView: 5,
              slidesPerGroup: 5,
            }
          }
        });
        
        // 根据宽度动态改变一行显示多少个内容
        // function getPerGroupByWidth() {
        //   const w = window.innerWidth;
        //   if (w >= 1600) return 6;
        //   if (w >= 1024) return 4;
        //   if (w >= 768)  return 4;
        //   return 4;
        // }
        function updateSwiperLimit(swiper) {
          const group = swiper.params.slidesPerGroup;
          const maxPage = Math.max(
            0,
            Math.ceil(recent_post_item_number / (2 * group)) - 1
          );
          const page = swiper.activeIndex / group;

          swiper.allowSlideNext = page < maxPage;
          swiper.allowSlidePrev = page > 0;
        }
    }
  },


  // *** 友链页评论鼠标横向滚动
  linkCommentScroll: function() {
    if (urlinfo !== "/link/") return;

    // 2. 定义核心绑定逻辑
    const applyScroll = (container) => {
        if (!container || container.dataset.scrollBound) return;

        // 【关键】告知 Lenis 不要干涉这个容器及其子元素
        // 这样可以恢复子元素（如代码块）的原生竖向滚动
        container.setAttribute('data-lenis-prevent', 'true');

        container.addEventListener('wheel', (event) => {
            const target = event.target;

            // 判定子元素是否需要竖向滚动
            const canVerticalScroll = (el) => {
                if (!el || el === container) return false;
                const hasScrollableContent = el.scrollHeight > el.clientHeight;
                const overflowStyle = window.getComputedStyle(el).overflowY;
                const isScrollableStyle = overflowStyle.includes('auto') || overflowStyle.includes('scroll');
                
                if (hasScrollableContent && isScrollableStyle) {
                    const isScrollingDown = event.deltaY > 0;
                    const isAtBottom = Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < 1;
                    const isAtTop = el.scrollTop <= 0;
                    if (isScrollingDown && !isAtBottom) return true;
                    if (!isScrollingDown && !isAtTop) return true;
                }
                return canVerticalScroll(el.parentElement);
            };

            // 如果鼠标下的子元素正在竖向滚动
            if (canVerticalScroll(target)) {
                // 【关键】阻止滚轮事件向上冒泡到 Lenis
                // 这样你在滚子元素时，背景页面就不会跟着动
                event.stopPropagation();
                return; 
            }

            // 执行横向滚动逻辑
            if (container.scrollWidth > container.clientWidth) {
                // 阻止浏览器默认行为
                event.preventDefault();
                // 【关键】阻止冒泡到全局 Lenis 监听器
                event.stopPropagation();
                
                container.scrollLeft += event.deltaY;
            }
        }, { passive: false });

        container.dataset.scrollBound = 'true';
        // console.log('✅ Twikoo 横向滚动 (Lenis 兼容版) 绑定成功');
    };

    // --- 以下监控逻辑保持不变 ---
    const immediateContainer = document.querySelector('.tk-comments-container');
    if (immediateContainer) {
        applyScroll(immediateContainer);
    }

    if (window.twikooObserver) window.twikooObserver.disconnect();

    window.twikooObserver = new MutationObserver((mutations, obs) => {
        const container = document.querySelector('.tk-comments-container');
        if (container) {
            applyScroll(container);
            obs.disconnect();
            window.twikooObserver = null;
        }
    });

    window.twikooObserver.observe(document.body, { childList: true, subtree: true });
  },


  // *** 首页内容点击切换
  homeButtonClik: function() {
    const tabs = document.querySelectorAll('.nav-tabs button');
    const tabContainers = document.querySelectorAll('.tabsall > div'); // 获取直接子元素
    const contents = document.querySelectorAll('.recent-posts');

    function showContent(id) {
      contents.forEach(content => content.classList.remove('active'));
      // 显示目标内容
      const targetContent = document.querySelector(id);
      if (targetContent) {
          targetContent.classList.add('active');

          // 移动端首页展示内容方式不同，所以需要加这一段判断，如果不需要，可以去掉
          // 检测是否是移动端 并且 选中的是 #recent-posts
          if (isMobile) {
            const recent = document.querySelector("#recent-posts2");
            const content = document.querySelector("#content-inner");
            if (id == "#recent-posts") {
              recent.classList.add('active');
              content.classList.remove('appactive');
            }else {
              content.classList.add('appactive');
            }
          }
      }
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
          tabContainers.forEach(container => container.classList.remove('active')); // 移除所有容器的active类
          const parentContainer = tab.parentElement; // 获取按钮的父容器
          parentContainer.classList.add('active'); // 添加active类到对应的容器
          showContent(tab.getAttribute('data-target'));
      });
    });
  },


  // *** 白天 黑夜 模式切换
  rswitchDarkMode: function() {
    const willChangeMode = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    if (willChangeMode === 'dark') {
      btf.activateDarkMode()
      GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)
    } else {
      btf.activateLightMode()
      GLOBAL_CONFIG.Snackbar !== undefined && btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day)
    }
    btf.saveToLocal.set('theme', willChangeMode, 2)
  },


  // *** 首页 最新动态 按时间排序
  homeSortPosts: function() {
    if (urlinfo == "/")  {
      // 获取文章列表容器
      const articleSort = document.querySelector('.article-sort');
      if (!articleSort) return;
    
      // 获取所有的 .article-sort-item 元素
      const items = Array.from(articleSort.querySelectorAll('.article-sort-item'));
    
      // 按照文章时间（datetime）排序
      items.sort((a, b) => {
        const timeA = new Date(a.querySelector('.post-meta-date-created').getAttribute('datetime')).getTime();
        const timeB = new Date(b.querySelector('.post-meta-date-created').getAttribute('datetime')).getTime();
        return timeB - timeA; // 降序排序
      });
    
      // 清空原始容器并重新添加排序后的项
      articleSort.innerHTML = '';
      items.forEach(item => articleSort.appendChild(item));  
    }
  }, 


  // *** 发布评论 按键
  addCommentBtn: function(value) {
    // var submit = document.querySelector('#twikoo .tk-submit');
    // var commask = document.querySelector('#post-comment .commentmask');
    // var comment_head = document.querySelector('#post-comment .comment-head');
    var comment_container = document.querySelector('#post-comment');
    if (comment_container && value) {
      comment_container.classList.add('show');

      // 禁用滚动并记录当前滚动位置
      // kuka.scrollStopRecover(value);
    }else {
      comment_container.classList.remove('show');
      
      // 恢复滚动，并将滚动位置设置为停止时的位置
      // kuka.scrollStopRecover(value);
    }
  },


  // *** 友链页快速申请
  addFriendLink: function() {
    var input = document.getElementsByClassName('el-textarea__inner')[0];
    let evt = document.createEvent('HTMLEvents');
    evt.initEvent('input', true, true);
    input.value = '昵称（请勿包含博客等字样）：\n网站类别（生活、技术、艺术等）：\n网站地址（要求博客地址，请勿提交个人主页）：\n头像图片url（请提供尽可能清晰的图片，我会上传到我自己的图床）：\n描述：\n';
    input.dispatchEvent(evt);
    document.getElementById('post-comment').focus();
    input.focus();
    input.setSelectionRange(-1, -1);

    kuka.addCommentBtn(true);
  },


  // *** 动态设置每个元素的动画延迟（文章列表的文章、文章页的post-info标签）
  animtionGradientShow: function() {
    if (urlinfo != "/") {
      document.querySelectorAll('.article-sort-item, .animgrad').forEach((el, index) => {
        el.style.setProperty('--i', index + 1);
      });
    }
  },


  // *** 分类导航条
  categoriesBarActive: function() {
    urlinfo = decodeURIComponent(urlinfo);
    // console.log(urlinfo);
    //判断是否是全部文章页
    if (urlinfo == '/archives/'){
      if (document.querySelector('#allpost')){
        document.getElementById('allpost').classList.add("select")
      }
    }else {
      // 验证是否是分类链接
      var pattern = null;
      if (urlinfo.split("/")[1] == "categories") {
        pattern = /\/categories\/.*?\//
      }else if (urlinfo.split("/")[1] == "tags") {
        pattern = /\/tags\/.*?\//
      }
      if (pattern) {
        var patbool = pattern.test(urlinfo);
        // console.log(patbool);
        // 获取当前的分类
        if (patbool) {
          var valuegroup = urlinfo.split("/");
          // console.log(valuegroup[2]);
          // 获取当前分类
          var nowCategorie = valuegroup[2];
          if (document.querySelector('#category-bar-items') && nowCategorie != "随笔一记" && valuegroup[1] != "tags"){
            document.getElementById(nowCategorie).classList.add("select");
          }
        }
      }
    }

    // if (document.getElementById("category-bar-items") && document.getElementById("category-bar-items").clientHeight < 400) {
    //   document.getElementById("more-bar").style.display = 'none';
    //   document.getElementById("category-bar").style.padding = '50px'
    // }
  },


  // *** 分类条点击
  moreBarClick: function() {
    var e, t = document.querySelector("#category-bar-items"), o = document.getElementById("more-bar");
    var n = t.clientHeight;
    // console.log(t.scrollTop);
    t && (t.scrollTop + t.clientHeight >= t.scrollHeight ? t.scroll({
        top: 0,
        behavior: "smooth"
    }) : t.scrollBy({
        top: n,
        behavior: "smooth"
    }),
    t.addEventListener("scroll", (function n() {
      // console.log(t.scrollTop);
        clearTimeout(e),
        e = setTimeout((function() {
            o.style.transform = t.scrollTop + t.clientHeight >= t.scrollHeight - 8 ? "rotate(0deg)" : "",
            t.removeEventListener("scroll", n)
        }
        ), 150)
    }
    )))
  },


  // *** 返回顶部按钮
  scrollToTop: function() {
    btf.scrollToDest(0, 500);
  },
  // *** 百分比灵动球
  initThemeColor: function() {
    let a = document.documentElement.scrollTop || window.pageYOffset, // 卷去高度
      b = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight) - document.documentElement.clientHeight, // 整个网页高度
      result = Math.round(a / b * 100) // 计算百分比

    // console.log(parseInt(result))
    document.getElementById("percent").innerHTML = result
  },

  
  // *** 关于页滚动相关消除lisen对子元素影响
  // aboutEscribe: function() {
  //   if (urlinfo == "/about/") {
  //     kuka.disableLenisForElement(document.querySelector('#about .character .about-content-item-escribe'));
  //   }
  // },
  // 2. 关于页视觉差效果
  updateParallax: function(clientX, clientY) {
    const mouseX = (clientX / window.innerWidth) - 0.5;
    const mouseY = (clientY / window.innerHeight) - 0.5;

    for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        const speed = parseFloat(layer.getAttribute('data-speed')) || 0;
        
        // 应用放大倍数
        const x = mouseX * speed * magnification;
        const y = mouseY * speed * magnification;

        // 根据类型应用不同的 transform 组合
        if (layer.classList.contains('flare')) {
            // 光晕：位移 + 旋转 + 菱形拉伸
            layer.style.transform = `translate(${x}px, ${y}px) rotate(45deg) scale(1.6, 1.1)`;
        } else if (layer.classList.contains('layer-fg')) {
            // 人物：位移 + 基础缩放
            layer.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
        } else {
            // 背景：位移
            layer.style.transform = `translate(${x}px, ${y}px)`;
        }
    }
    ticking = false;
  },
  // 获取用户坐标计算距离自己多少公里
  // 1. 你的坐标 (例如：公司或家)
  myLocation: {
      lat: 29.5630,
      lng: 106.5516
  },
  // 2. 核心计算方法 (Haversine 公式)
  calculateDistance: function(lat1, lon1, lat2, lon2) {
      const R = 6371; // 地球半径(km)
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
  },
  // 3. 获取用户位置并执行回调
  checkUserDistance: function() {
    if (urlinfo !== "/about/") return;
    
    // 使用 fetch 请求 IP 定位接口
    // 注意：这里使用的是免费公共接口，生产环境建议购买付费接口或后端自建 IP 库
    // 定义全局回调函数，接收 API 返回的数据
    window.handleIPResponse = (data) => {
        if (!data.latitude || !data.longitude) {
            console.warn("无法获取经纬度");
            return;
        }

        const userLat = data.latitude;
        const userLng = data.longitude;

        const dist = this.calculateDistance(
            userLat, 
            userLng, 
            this.myLocation.lat, 
            this.myLocation.lng
        );

        const distanceEl = document.getElementById('distance-val');
        if (distanceEl) {
            distanceEl.innerText = dist.toFixed(0); 
        }
        this.lastCalculatedDistance = dist.toFixed(2);
        
        // 成功后移除脚本标签，保持页面干净
        document.getElementById('ip-jsonp')?.remove();
    };

    // 动态创建 script 标签发起 JSONP 请求
    const script = document.createElement('script');
    script.id = 'ip-jsonp';
    // 注意：这里用了 ipapi.co 的 jsonp 模式，它不走 fetch，所以没 CORS 报错
    script.src = `https://ipapi.co/jsonp/?callback=handleIPResponse`;
    
    script.onerror = () => {
        console.error("IP 定位脚本加载失败");
        const distanceEl = document.getElementById('distance-val');
        if (distanceEl) distanceEl.innerText = "未知";
        document.getElementById('ip-jsonp')?.remove();
    };

    document.body.appendChild(script);
  },


  // *** 中控台 开关
  show_hide_Console: function(value) {
    if (value) {
      document.querySelector("#console").classList.add("show");
      kuka.scrollStopRecover(value);
    }else {
      document.querySelector("#console").classList.remove("show");
      kuka.scrollStopRecover(value);
    }
  },


  // *** 页脚随机友链
  footerLinksRandom: function() {
    var links = window.siteData.link; // 获取 Hexo 数据中的链接
    var randomLinks = [];
    // 遍历所有的链接，获取其中的 link_list
    links.forEach(function(link) {
      if (link.link_list && Array.isArray(link.link_list)) {
        var linkList = link.link_list;

        // 随机选择 5 个链接
        while (randomLinks.length < 3 && linkList.length > 0) {
          var randomIndex = Math.floor(Math.random() * linkList.length);
          var randomLink = linkList[randomIndex];

          // 如果该链接尚未选择，则添加到 randomLinks 中
          if (randomLinks.indexOf(randomLink) === -1) {
            randomLinks.push(randomLink);
          }
        }
      }
    });

    // 获取 footer-links 容器并动态添加链接
    var container = document.getElementById('random-links');
    randomLinks.forEach(function (link) {
      var linkElement = document.createElement('div');
      linkElement.classList.add('footer-link');
      
      var anchor = document.createElement('a');
      anchor.href = link.link;
      anchor.textContent = link.name;
      
      var description = document.createElement('span');
      description.textContent = link.descr;
      
      linkElement.appendChild(anchor);
      linkElement.appendChild(description);
      
      container.appendChild(linkElement);
    });
  },
  // *** 页脚随机文章
  footerRandomPosts: function() {
    const postDataElement = document.getElementById("footer-posts-data");
    if (!postDataElement) return;
    try {
      const allPosts = JSON.parse(postDataElement.textContent);
      // 你可以在这里操作 allPosts，比如：
      // console.log(allPosts);

      // 随机选择一篇文章
      const randomPost = allPosts[Math.floor(Math.random() * allPosts.length)];
      // 创建 HTML 元素结构
      // const container = document.createElement("div");
      // container.className = "footer-random-post";
      postDataElement.innerHTML = `<a href="/${randomPost.path}" class="random-post-link" title="${randomPost.title}">${randomPost.title}</a>`;
      // 插入到页面指定容器里面
      // postDataElement.appendChild(container);

      // 示例：筛选包含某个标签的文章
      // const postsWithTag = allPosts.filter(post =>
      //   post.tags.includes("JavaScript")
      // );
      // console.log("含有 JavaScript 标签的文章：", postsWithTag);
    } catch (e) {
      console.error("解析文章数据出错", e);
    }
  }

}



// 调用方法
kuka.timeago();

kuka.linkCommentScroll();

kuka.homePostScroll();
kuka.homeButtonClik();
kuka.homeSortPosts();
kuka.categoriesBarActive();
kuka.checkUserDistance();
kuka.footerLinksRandom();
kuka.footerRandomPosts();
window.onscroll = kuka.initThemeColor;


// 3. 关于页视觉差效果
// 鼠标移动监听，使用 requestAnimationFrame 优化
window.addEventListener('mousemove', (e) => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
        kuka.updateParallax(e.clientX, e.clientY);
    });
    ticking = true;
  }
});
// 触摸监听
window.addEventListener('touchmove', (e) => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
        kuka.updateParallax(e.touches[0].clientX, e.touches[0].clientY);
    });
    ticking = true;
  }
}, { passive: true });