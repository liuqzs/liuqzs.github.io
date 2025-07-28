
var urlinfo = window.location.pathname;
var isMobile = /Mobi|Android/i.test(navigator.userAgent);

// lenis 动画库
if (!isMobile) {
  var lenis = new Lenis({
    lerp: 0.07,
    smooth: true,
  
    duration: 1.2,
    smoothWheel: true,
    // direction: 'vertical',
  
    orientation: 'vertical',
  });
}
// 控制动画停止与恢复的标志
var stopAnimation = false;
var currentScrollPosition = 0;  // 用于记录当前滚动位置




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


  // *** 阻尼滚动（lenis 动画库）
  dampingScrolls: function() {
    if (!isMobile) {
      function raf(time) {
        if (stopAnimation) {
          return; // 停止递归动画
        }
    
        lenis.raf(time); // 更新 Lenis 滚动
        requestAnimationFrame(raf); // 请求下一帧
      }
    
      requestAnimationFrame(raf); // 启动动画循环
    }
  },
  // *** 禁用 Lenis 对局部滚动容器的干扰
  disableLenisForElement: function(element) {
    element.addEventListener('wheel', function(event) {
      event.stopImmediatePropagation();  // 阻止事件传播，防止 Lenis 影响
    }, { passive: true });
  },
  // *** Lenis 禁止滚动 和 恢复滚动
  scrollStopRecover: function(value) {
    if (value) {
      // 禁用滚动并记录当前滚动位置
      currentScrollPosition = lenis.scroll;  // 记录当前滚动位置
      lenis.enabled = false;
      stopAnimation = true; // 停止动画
    }else {      
      // 恢复滚动，并将滚动位置设置为停止时的位置
      lenis.enabled = true;
      stopAnimation = false; // 恢复动画
      lenis.scrollTo(currentScrollPosition); // 恢复到停止时的位置
      requestAnimationFrame(kuka.dampingScrolls); // 重新启动滚动动画
    }
  },



  // *** 首页文章列表鼠标横向滚动
  homePostScroll: function() {
    // 检测是否为移动端
    if (isMobile) {
        // console.log("这是手机端");
    } else {
        // console.log("这不是手机端");
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
          breakpoints: {
            460: {
              slidesPerView: 4
            },
            768: {
              slidesPerView: 4
            },
            1024: {
              slidesPerView: 4
            },
            1600: {
              slidesPerView: 6
            }
          }
        });
    }
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
    var submit = document.querySelector('#twikoo .tk-submit');
    var commask = document.querySelector('#post-comment .commentmask');
    if (submit && value) {
      submit.classList.add('show');
      commask.classList.add('show');

      // 禁用滚动并记录当前滚动位置
      kuka.scrollStopRecover(value);
    }else {
      submit.classList.remove('show');
      commask.classList.remove('show');
      
      // 恢复滚动，并将滚动位置设置为停止时的位置
      kuka.scrollStopRecover(value);
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
  aboutEscribe: function() {
    if (urlinfo == "/about/") {
      kuka.disableLenisForElement(document.querySelector('#about .character .about-content-item-escribe'));
    }
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
        while (randomLinks.length < 4 && linkList.length > 0) {
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

// 启动初始的滚动动画
requestAnimationFrame(kuka.dampingScrolls);

kuka.homePostScroll();
kuka.homeButtonClik();
kuka.homeSortPosts();
// kuka.animtionGradientShow();
kuka.categoriesBarActive();
kuka.aboutEscribe();
kuka.footerLinksRandom();
kuka.footerRandomPosts();
window.onscroll = kuka.initThemeColor;