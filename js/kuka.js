var urlinfo=window.location.pathname,lenis=new Lenis({lerp:.07,smooth:!0,duration:1.2,smoothWheel:!0,orientation:"vertical"}),stopAnimation=!1,currentScrollPosition=0,kuka={timeago:function(){if("/"===urlinfo){const e=document.querySelectorAll("time"),t=new Date,o=6e4,n=60*o,i=24*n,r=4*(7*i);e.forEach((e=>{const a=new Date(e.dateTime),l=t.getTime()-a.getTime(),s=Math.floor(l/r),c=Math.floor(l/i),d=Math.floor(l/n),m=Math.floor(l/o);let u="";const f=e.innerHTML.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);if(f){const[e,o,n]=[f[1],f[2].replace(/^0/,""),f[3].replace(/^0/,"")];u=e===t.getFullYear().toString()?s<=12?c>7?`${o}/${n}`:c>0?`${c}天前`:d>0?`${d}小时前`:m<=10?"刚刚":`${m}分钟前`:`${o}/${n}`:`${e}/${o}/${n}`}e.innerHTML=u||e.innerHTML}))}},dampingScrolls:function(){requestAnimationFrame((function e(t){stopAnimation||(lenis.raf(t),requestAnimationFrame(e))}))},disableLenisForElement:function(e){e.addEventListener("wheel",(function(e){e.stopImmediatePropagation()}),{passive:!0})},homePostScroll:function(){if(/Mobi|Android/i.test(navigator.userAgent));else new Swiper(".swiper",{effect:"coverflow",grabCursor:!0,spaceBetween:0,centeredSlides:!1,coverflowEffect:{rotate:0,stretch:0,depth:0,modifier:1,slideShadows:!1},loop:!1,pagination:{el:".swiper-pagination",clickable:!0},keyboard:{enabled:!0},mousewheel:{thresholdDelta:70},breakpoints:{460:{slidesPerView:4},768:{slidesPerView:4},1024:{slidesPerView:4},1600:{slidesPerView:6}}})},homeButtonClik:function(){const e=document.querySelectorAll(".nav-tabs button"),t=document.querySelectorAll(".tabsall > div"),o=document.querySelectorAll(".recent-posts");e.forEach((e=>{e.addEventListener("click",(()=>{t.forEach((e=>e.classList.remove("active")));e.parentElement.classList.add("active"),function(e){o.forEach((e=>e.classList.remove("active")));const t=document.querySelector(e);t&&t.classList.add("active")}(e.getAttribute("data-target"))}))}))},rswitchDarkMode:function(){const e="dark"===document.documentElement.getAttribute("data-theme")?"light":"dark";"dark"===e?(btf.activateDarkMode(),void 0!==GLOBAL_CONFIG.Snackbar&&btf.snackbarShow(GLOBAL_CONFIG.Snackbar.day_to_night)):(btf.activateLightMode(),void 0!==GLOBAL_CONFIG.Snackbar&&btf.snackbarShow(GLOBAL_CONFIG.Snackbar.night_to_day)),btf.saveToLocal.set("theme",e,2)},homeSortPosts:function(){if("/"==urlinfo){const e=document.querySelector(".article-sort");if(!e)return;const t=Array.from(e.querySelectorAll(".article-sort-item"));t.sort(((e,t)=>{const o=new Date(e.querySelector(".post-meta-date-created").getAttribute("datetime")).getTime();return new Date(t.querySelector(".post-meta-date-created").getAttribute("datetime")).getTime()-o})),e.innerHTML="",t.forEach((t=>e.appendChild(t)))}},addCommentBtn:function(e){var t=document.querySelector("#twikoo .tk-submit"),o=document.querySelector("#post-comment .commentmask");t&&e?(t.classList.add("show"),o.classList.add("show"),currentScrollPosition=lenis.scroll,lenis.enabled=!1,stopAnimation=!0):(t.classList.remove("show"),o.classList.remove("show"),lenis.enabled=!0,stopAnimation=!1,lenis.scrollTo(currentScrollPosition),requestAnimationFrame(kuka.dampingScrolls))},addFriendLink:function(){var e=document.getElementsByClassName("el-textarea__inner")[0];let t=document.createEvent("HTMLEvents");t.initEvent("input",!0,!0),e.value="昵称（请勿包含博客等字样）：\n网站类别（生活、技术、艺术等）：\n网站地址（要求博客地址，请勿提交个人主页）：\n头像图片url（请提供尽可能清晰的图片，我会上传到我自己的图床）：\n描述：\n",e.dispatchEvent(t),document.getElementById("post-comment").focus(),e.focus(),e.setSelectionRange(-1,-1),kuka.addCommentBtn(!0)},animtionGradientShow:function(){"/"!=urlinfo&&document.querySelectorAll(".article-sort-item, .animgrad").forEach(((e,t)=>{e.style.setProperty("--i",t+1)}))},categoriesBarActive:function(){if("/archives/"==(urlinfo=decodeURIComponent(urlinfo)))document.querySelector("#allpost")&&document.getElementById("allpost").classList.add("select");else if("/link/"==urlinfo)document.getElementById("link-friend").classList.add("select");else{var e=null;if("categories"==urlinfo.split("/")[1]?e=/\/categories\/.*?\//:"tags"==urlinfo.split("/")[1]&&(e=/\/tags\/.*?\//),e)if(e.test(urlinfo)){var t=urlinfo.split("/")[2];document.querySelector("#category-bar-items")&&document.getElementById(t).classList.add("select")}}},moreBarClick:function(){var e,t=document.querySelector("#category-bar-items"),o=document.getElementById("more-bar"),n=t.clientHeight;t&&(t.scrollTop+t.clientHeight>=t.scrollHeight?t.scroll({top:0,behavior:"smooth"}):t.scrollBy({top:n,behavior:"smooth"}),t.addEventListener("scroll",(function n(){clearTimeout(e),e=setTimeout((function(){o.style.transform=t.scrollTop+t.clientHeight>=t.scrollHeight-8?"rotate(0deg)":"",t.removeEventListener("scroll",n)}),150)})))},footerLinksRandom:function(){var e=window.siteData.link,t=[];e.forEach((function(e){if(e.link_list&&Array.isArray(e.link_list))for(var o=e.link_list;t.length<4&&o.length>0;){var n=o[Math.floor(Math.random()*o.length)];-1===t.indexOf(n)&&t.push(n)}}));var o=document.getElementById("random-links");t.forEach((function(e){var t=document.createElement("div");t.classList.add("footer-link");var n=document.createElement("a");n.href=e.link,n.textContent=e.name;var i=document.createElement("span");i.textContent=e.descr,t.appendChild(n),t.appendChild(i),o.appendChild(t)}))}};kuka.timeago(),requestAnimationFrame(kuka.dampingScrolls),kuka.homePostScroll(),kuka.homeButtonClik(),kuka.homeSortPosts(),kuka.categoriesBarActive(),kuka.footerLinksRandom();