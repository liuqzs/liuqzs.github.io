// **因为pajx问题
/**音乐页的快捷按键必须单独处理，引入的时候不加pjax跳转*/

// 改进vh
const vh = window.innerHeight * 1;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
  let vh = window.innerHeight * 1;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

//键盘快捷键控制音乐
document.addEventListener("keydown", function(event) {
  if (window.location.pathname != "/music/") {
    return;
  }
  //暂停开启音乐
  if (event.code === "Space") {
    event.preventDefault();
    document.querySelector(`#eoMusic-page .eoHide`).aplayer.toggle();
  };
  //切换下一曲
  if (event.keyCode === 39) {
    event.preventDefault();
    document.querySelector(`#eoMusic-page .eoHide`).aplayer.skipForward();
  };
  //切换上一曲
  if (event.keyCode === 37) {
    event.preventDefault();
    document.querySelector(`#eoMusic-page .eoHide`).aplayer.skipBack();
  }
  //增加音量
  if (event.keyCode === 38) {
    if (volume <= 1) {
      volume += 0.1;
      document.querySelector(`#eoMusic-page .eoHide`).aplayer.volume(volume,true);
    }
  }
  //减小音量
  if (event.keyCode === 40) {
    if (volume >= 0) {
      volume += -0.1;
      document.querySelector(`#eoMusic-page .eoHide`).aplayer.volume(volume,true);
    }
  }
});
