var eo={changeMusicBg:function(e=!0){const t=document.getElementById("eo_music_bg"),s=document.querySelector("#eoMusic-page .aplayer-pic");if(e&&s)kuka.disableLenisForElement(document.querySelector("#eoMusic-page .aplayer-list ol")),t.style.backgroundImage=s.style.backgroundImage;else{let e=setInterval((()=>{const s=document.querySelector("#eoMusic-page .aplayer-pic");t&&s&&(clearInterval(e),t.style.backgroundImage=s.style.backgroundImage,eo.addEventListenerChangeMusicBg(),isMusicTitle(),document.querySelector("#eoMusic-page .eoHide").aplayer.volume(.8,!0))}),100)}},addEventListenerChangeMusicBg:function(){const e=document.getElementById("eoMusic-page"),t=e.querySelector(".eoHide .aplayer-info .aplayer-time .aplayer-icon-menu"),s=e.querySelector(".eoHide .aplayer-info .aplayer-lrc");e.querySelector("#eoMusic-page .eoHide").aplayer.on("loadeddata",(function(){eo.changeMusicBg(),isMusicTitle()})),e.querySelector("#eoMusic-page .eoHide").aplayer.on("play",(function(){clocClass(),document.querySelector("#eoMusic-page .aplayer-pic").classList.add("animtranplay"),window.screen.width>768&&(document.getElementById("eolistbg"+indexNum).classList.add("playlistimgbg"),document.getElementById("eolistbg"+indexNum).classList.add("animaito"),document.getElementById("eolistbg"+indexNum).classList.add("playimgbg")),isMusicTitle()})),e.querySelector("#eoMusic-page .eoHide").aplayer.on("pause",(function(){indexNex=indexNum,document.querySelector("#eoMusic-page .aplayer-pic").classList.remove("animtranplay"),document.getElementById("eolistbg"+indexNex).classList.remove("animaito"),indexNum!=indexNex&&clocClass()})),t.addEventListener("click",(function(){document.getElementById("menu-mask").style.display="block",document.getElementById("menu-mask").style.animation="0.5s ease 0s 1 normal none running to_show"})),s.addEventListener("click",(function(){window.screen.width<768&&(document.getElementById("menu-mask").style.display="block",document.getElementById("menu-mask").style.animation="0.5s ease 0s 1 normal none running to_show",e.querySelector(".eoHide .aplayer-list").classList.add("aplayer-list-hide"))})),document.getElementById("menu-mask").addEventListener("click",(function(){"/music/"==window.location.pathname&&(e.querySelector(".eoHide .aplayer-list").classList.remove("aplayer-list-hide"),document.getElementById("eo-music-list").classList.remove("eomusic-onoff"))}))}};function isTextOverflow(e,t){const s=t.offsetWidth;return e.scrollWidth>s}function isMusicTitle(){const e=document.querySelector("#eoMusic-page .aplayer-music"),t=document.querySelector("#eoMusic-page .aplayer-info");if("/music/"==urlinfo){isTextOverflow(e,t)?document.querySelector("#eoMusic-page .aplayer-music").classList.add("animtranfrom"):document.querySelector("#eoMusic-page .aplayer-music").classList.remove("animtranfrom")}}eo.changeMusicBg(!1);var musicLength,indexNum=0,indexNex=0,volume=.8;function musicListClick(e,t,s){indexNex=indexNum,indexNum=s,clocClass(),musicListHide(),window.screen.width>768&&(document.getElementById("eolistbg"+indexNum).classList.add("playlistimgbg"),document.getElementById("eolistbg"+indexNum).classList.add("playimgbg")),indexNum!=indexNex&&(document.getElementById("eolistbg"+indexNex).classList.remove("animaito"),document.getElementsByClassName("eo-music")[0].style.left="-200%",document.getElementsByClassName("eo-music")[0].style.right="0%",document.getElementsByClassName("eo-music")[0].style.opacity=0,setTimeout((()=>{document.getElementsByClassName("eo-music")[0].style.right="-200%",document.getElementsByClassName("eo-music")[0].style.left="0%",document.getElementsByClassName("eo-music")[0].style.opacity=0,document.querySelector("#eoMusic-page .aplayer-pic").classList.remove("animtranplay"),document.querySelector("#eoMusic-page .aplayer-pic").classList.add("coverimg");const s=document.querySelector("#musics .eo-music").aplayer;var n=`https://meting.glimo.top/?server=${t}&type=playlist&id=${e}`;s.list.clear(),fetch(n).then((e=>e.json())).then((e=>{musicLength=e.length,s.list.add(e)})).catch((e=>console.error(e))),setTimeout((()=>{document.getElementsByClassName("eo-music")[0].style.right="0%",document.getElementsByClassName("eo-music")[0].style.left="0%",document.getElementsByClassName("eo-music")[0].style.opacity=1,document.querySelector("#eoMusic-page .aplayer-pic").classList.remove("coverimg")}),200)}),600))}function musicBtnClis(){document.getElementById("eo-music-list").classList.add("eomusic-onoff"),document.getElementById("menu-mask").style.display="block",document.getElementById("menu-mask").style.animation="0.5s ease 0s 1 normal none running to_show"}function musicListHide(){document.getElementById("eo-music-list").classList.remove("eomusic-onoff"),document.getElementById("menu-mask").style.animation="0.5s ease 0s 1 normal none running to_hide",setTimeout((()=>{document.getElementById("menu-mask").style.removeProperty("display"),document.getElementById("menu-mask").style.removeProperty("animation")}),400)}function clocClass(){var e=document.querySelectorAll("#eo-music-list .eolistbg");for(let t=0;t<e.length;t++)e[t].classList.remove("playlistimgbg"),e[t].classList.remove("playimgbg")}function getStyle(){let e=setInterval((()=>{var t;if(t="/music/"==window.location.pathname?document.querySelector("#eoMusic-page .aplayer-lrc-contents > p:nth-child(2)"):document.querySelector("#nav-music .aplayer-lrc-contents > p:nth-child(2)")){if(!document.documentMode){var s=getComputedStyle(t,null);fontHight=Number(s.height.replace("px",""))+Number(s.marginBottom.replace("px",""))}clearInterval(e)}}),600)}getStyle();