// 音乐页
var eo = {
  // 音乐节目切换背景
  changeMusicBg: function (isChangeBg = true) {

    const eoMusicBg = document.getElementById("eo_music_bg");
    const musiccover = document.querySelector(`#eoMusic-page .aplayer-pic`);

    if (isChangeBg && musiccover) {
      // 禁用 Lenis 对歌曲列表滚动控制的影响
      kuka.disableLenisForElement(document.querySelector('#eoMusic-page .aplayer-list ol'));

      // 歌曲列表加载后 显示 歌单按键
      const music_dot = document.querySelector("#musics .dot");
      music_dot.classList.add("add");

      // player listswitch 会进入此处
      eoMusicBg.style.backgroundImage = musiccover.style.backgroundImage;
    } else {
      // 第一次进入，绑定事件，改背景
      let timer = setInterval(()=>{
        const musiccover = document.querySelector("#eoMusic-page .aplayer-pic");
        // 确保player加载完成
        // console.info(eoMusicBg);
        if (eoMusicBg && musiccover) {
          clearInterval(timer)
          eoMusicBg.style.backgroundImage = musiccover.style.backgroundImage;

          // 绑定事件
          eo.addEventListenerChangeMusicBg();

          // 判断歌曲title文字是否溢出
          isMusicTitle();

          // 给所有歌单添加初始音量
          document.querySelector(`#eoMusic-page .eoHide`).aplayer.volume(0.8,true);

          // 暂停全局音乐灵动球
          // if (musciPlayiS) {
          //   musicStop();
          // }
        }
      }, 100)
    }
  },
  addEventListenerChangeMusicBg: function () {
    const eoMusicPage = document.getElementById("eoMusic-page");
    const aplayerIconMenu = eoMusicPage.querySelector(`.eoHide .aplayer-info .aplayer-time .aplayer-icon-menu`);
    const aplayerlrcMenu = eoMusicPage.querySelector(`.eoHide .aplayer-info .aplayer-lrc`);

    // 切换
    eoMusicPage.querySelector(`#eoMusic-page .eoHide`).aplayer.on('loadeddata', function () {
      eo.changeMusicBg();
      // console.info('player loadeddata');

      // 判断歌曲title文字是否溢出
      isMusicTitle();

      // lrc();
    });

    // 播放
    eoMusicPage.querySelector(`#eoMusic-page .eoHide`).aplayer.on('play', function () {
      clocClass();
      document.querySelector('#eoMusic-page .aplayer-pic').classList.add('animtranplay');
      // 当前设备是PC端
      if (window.screen.width > 768) {
        document.getElementById('eolistbg'+indexNum).classList.add('playlistimgbg');
        document.getElementById('eolistbg'+indexNum).classList.add('animaito');
        document.getElementById('eolistbg'+indexNum).classList.add('playimgbg');
      }
      // console.log('当前歌单'+indexNum, '上次歌单'+indexNex);

      // 判断歌曲title文字是否溢出
      isMusicTitle();
    });

    // 暂停
    eoMusicPage.querySelector(`#eoMusic-page` + ` .eoHide`).aplayer.on('pause', function () {
      indexNex = indexNum;
      document.querySelector('#eoMusic-page .aplayer-pic').classList.remove('animtranplay');
      document.getElementById('eolistbg'+indexNex).classList.remove('animaito');
      if(indexNum == indexNex) return;
      clocClass();
      // console.log('当前歌单'+indexNum, '上次歌单'+indexNex);
    });

    // 获取歌词信息
    function lrc() {
      console.log(eoMusicPage.querySelector(`#eoMusic-page .eoHide`).aplayer.lrc.current);
    };

    aplayerIconMenu.addEventListener("click", function () {
      document.getElementById('menu-mask').style.display = "block";
      document.getElementById('menu-mask').style.animation = "0.5s ease 0s 1 normal none running to_show";
    })

    aplayerlrcMenu.addEventListener("click", function () {
      if (window.screen.width < 768) {
        document.getElementById('menu-mask').style.display = "block";
        document.getElementById('menu-mask').style.animation = "0.5s ease 0s 1 normal none running to_show";
        eoMusicPage.querySelector(`.eoHide .aplayer-list`).classList.add("aplayer-list-hide");
      }
    })

    document.getElementById('menu-mask').addEventListener("click", function () {
      if (window.location.pathname != "/music/") return;
      eoMusicPage.querySelector(`.eoHide .aplayer-list`).classList.remove("aplayer-list-hide");
      document.getElementById('eo-music-list').classList.remove('eomusic-onoff');

      // document.getElementsByTagName('body')[0].style.overflow = 'hidden';
    })
  }
}
// 调用
eo.changeMusicBg(false);


// 判断元素中的文本是否溢出元素宽度
function isTextOverflow(element, elemeinfo) {
  const elemeinfowidt = elemeinfo.offsetWidth;
  const textWidth = element.scrollWidth;
  
  return textWidth > elemeinfowidt;
}
function isMusicTitle() {
  const aplayerMusic = document.querySelector('#eoMusic-page .aplayer-music');
  const aplayerInfo = document.querySelector('#eoMusic-page .aplayer-info');

  if (urlinfo == '/music/') {
    const isOverflow = isTextOverflow(aplayerMusic, aplayerInfo);
    // console.log('Text overflow:', isOverflow);

    if(isOverflow) {
      document.querySelector('#eoMusic-page .aplayer-music').classList.add('animtranfrom');
    }else {
      document.querySelector('#eoMusic-page .aplayer-music').classList.remove('animtranfrom');
    }
  }
}



var indexNum = 0;   // 当前歌单
var indexNex = 0;   // 上次歌单
var volume = 0.8;   // 默认音量

var musicLength;
// 歌单列表点击事件（歌单切换）
function musicListClick(eoMusicID, eoMusicServer, index) {
  indexNex = indexNum;
  indexNum = index;

  // 列表动画处理
  clocClass();
  musicListHide();
  // 当前设备是PC端
  if (window.screen.width > 768) {
    document.getElementById('eolistbg'+indexNum).classList.add('playlistimgbg');
    document.getElementById('eolistbg'+indexNum).classList.add('playimgbg');
  }

  if (indexNum == indexNex) {
    return;
  }else {
    document.getElementById('eolistbg'+indexNex).classList.remove('animaito');
  }
  
  // 切换动画处理
  document.getElementsByClassName('eo-music')[0].style.left = "-200%";
  document.getElementsByClassName('eo-music')[0].style.right = "0%";
  document.getElementsByClassName('eo-music')[0].style.opacity = 0;
  setTimeout(() => {
    document.getElementsByClassName('eo-music')[0].style.right = "-200%";
    document.getElementsByClassName('eo-music')[0].style.left = "0%";
    document.getElementsByClassName('eo-music')[0].style.opacity = 0;

    document.querySelector('#eoMusic-page .aplayer-pic').classList.remove('animtranplay');
    document.querySelector('#eoMusic-page .aplayer-pic').classList.add('coverimg');
    // 切换歌单
    const eoMusicPage = document.querySelector("#musics .eo-music").aplayer;
    var musicUrl = `https://meting.qjqq.cn/?server=${eoMusicServer}&type=playlist&id=${eoMusicID}`;
    eoMusicPage.list.clear();
    fetch(musicUrl).then(response => response.json()).then(data => {
      musicLength = data.length;
      // console.log(musicLength);
      eoMusicPage.list.add(data);
    })
    .catch(error => console.error(error));

    setTimeout(() => {
      document.getElementsByClassName('eo-music')[0].style.right = "0%";
      document.getElementsByClassName('eo-music')[0].style.left = "0%";
      document.getElementsByClassName('eo-music')[0].style.opacity = 1;

      document.querySelector('#eoMusic-page .aplayer-pic').classList.remove('coverimg');
    }, 200);
  }, 600);
}

// 歌单按钮点击事件
function musicBtnClis() {
  document.getElementById('eo-music-list').classList.add('eomusic-onoff');
  document.getElementById('menu-mask').style.display = "block";
  document.getElementById('menu-mask').style.animation = "0.5s ease 0s 1 normal none running to_show";
}
// 隐藏
function musicListHide() {
  document.getElementById('eo-music-list').classList.remove('eomusic-onoff');
  document.getElementById('menu-mask').style.animation = "0.5s ease 0s 1 normal none running to_hide";
  setTimeout(() => {
    document.getElementById('menu-mask').style.removeProperty("display");
    document.getElementById('menu-mask').style.removeProperty("animation");
  }, 400);
}
// 播放点击清除动画效果
function clocClass() {
  var list = document.querySelectorAll('#eo-music-list .eolistbg');
  for (let i = 0; i < list.length; i++) {
    list[i].classList.remove('playlistimgbg');
    list[i].classList.remove('playimgbg');
  }
}


// 获取字体需要计算的高度
function getStyle() {
  let fontroll = setInterval(() => {
    var myDiv;
    if (window.location.pathname == "/music/") {
      myDiv = document.querySelector('#eoMusic-page .aplayer-lrc-contents > p:nth-child(2)');
    }else {
      myDiv = document.querySelector("#nav-music .aplayer-lrc-contents > p:nth-child(2)");
    }

    // 先确保结构加载完
    if (myDiv) {
      // 判断是否是IE浏览器（不适配IE浏览器）
      if (!document.documentMode) {
        var myDivStyle = getComputedStyle(myDiv, null);
        fontHight = Number(myDivStyle.height.replace('px', '')) + Number(myDivStyle.marginBottom.replace('px', ''));
        // console.log('高度：'+myDivStyle.height.replace('px', ''));
      }
      
      clearInterval(fontroll);
    }
  }, 600);
}
getStyle();