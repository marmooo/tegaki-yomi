import signaturePad from"https://cdn.jsdelivr.net/npm/signature_pad@5.0.0/+esm";const playPanel=document.getElementById("playPanel"),infoPanel=document.getElementById("infoPanel"),countPanel=document.getElementById("countPanel"),scorePanel=document.getElementById("scorePanel"),tegakiPanel=document.getElementById("tegakiPanel");let canvases=[...tegakiPanel.getElementsByTagName("canvas")];const gameTime=180;let hinted=!1,pads=[],problems=[],problemCandidate,answerKanji="漢字",answerYomis=["かんじ"],correctCount=0,totalCount=0;const canvasCache=document.createElement("canvas").getContext("2d",{alpha:!1,willReadFrequently:!0}),audioContext=new globalThis.AudioContext,audioBufferCache={};loadAudio("end","mp3/end.mp3"),loadAudio("correct","mp3/correct3.mp3");let japaneseVoices=[];loadVoices(),loadConfig();function loadConfig(){localStorage.getItem("darkMode")==1&&document.documentElement.setAttribute("data-bs-theme","dark")}function toggleDarkMode(){localStorage.getItem("darkMode")==1?(localStorage.setItem("darkMode",0),document.documentElement.setAttribute("data-bs-theme","light")):(localStorage.setItem("darkMode",1),document.documentElement.setAttribute("data-bs-theme","dark"))}async function playAudio(e,t){const s=await loadAudio(e,audioBufferCache[e]),n=audioContext.createBufferSource();if(n.buffer=s,t){const e=audioContext.createGain();e.gain.value=t,e.connect(audioContext.destination),n.connect(e),n.start()}else n.connect(audioContext.destination),n.start()}async function loadAudio(e,t){if(audioBufferCache[e])return audioBufferCache[e];const s=await fetch(t),o=await s.arrayBuffer(),n=await audioContext.decodeAudioData(o);return audioBufferCache[e]=n,n}function unlockAudio(){audioContext.resume()}function loadVoices(){const e=new Promise(e=>{let t=speechSynthesis.getVoices();if(t.length!==0)e(t);else{let n=!1;speechSynthesis.addEventListener("voiceschanged",()=>{n=!0,t=speechSynthesis.getVoices(),e(t)}),setTimeout(()=>{n||document.getElementById("noTTS").classList.remove("d-none")},1e3)}});e.then(e=>{japaneseVoices=e.filter(e=>e.lang=="ja-JP")})}function speak(e){speechSynthesis.cancel();const t=new globalThis.SpeechSynthesisUtterance(e);t.voice=japaneseVoices[Math.floor(Math.random()*japaneseVoices.length)],t.lang="ja-JP",speechSynthesis.speak(t)}function setTegakiPanel(e){for(;tegakiPanel.firstChild;)tegakiPanel.removeChild(tegakiPanel.lastChild);pads=[];for(let t=0;t<e;t++){const n=createTegakiBox();tegakiPanel.appendChild(n)}const t=tegakiPanel.children;canvases=[...t].map(e=>e.querySelector("canvas"))}function showPredictResult(e,t){const i=canvases.indexOf(e),s=answerKanji[i];let o=!1;for(let e=0;e<t.length;e++)if(t[e]==s){o=!0;break}o?e.setAttribute("data-predict",s):e.setAttribute("data-predict",t[0]);let n="";for(let e=0;e<canvases.length;e++){const t=canvases[e].getAttribute("data-predict");t?n+=t:n+=" "}return document.getElementById("reply").textContent=n,n}function initSignaturePad(e){const t=new signaturePad(e,{minWidth:2,maxWidth:2,penColor:"black",backgroundColor:"white",throttle:0,minDistance:0});return t.addEventListener("endStroke",()=>{predict(t.canvas)}),t}function getImageData(e){const n=28,s=28;canvasCache.drawImage(e,0,0,n,s);const o=canvasCache.getImageData(0,0,n,s),t=o.data;for(let e=0;e<t.length;e+=4)t[e]=255-t[e],t[e+1]=255-t[e+1],t[e+2]=255-t[e+2];return o}function predict(e){const t=getImageData(e),n=canvases.indexOf(e);worker.postMessage({imageData:t,pos:n})}function getRandomInt(e,t){return e=Math.ceil(e),t=Math.floor(t),Math.floor(Math.random()*(t-e)+e)}function hideAnswer(){document.getElementById("answer").classList.add("d-none")}function showAnswer(){hinted=!0,document.getElementById("answer").classList.remove("d-none"),speak(answerYomis.join(", "))}function nextProblem(){hinted=!1,totalCount+=1,problemCandidate.length<=0&&(problemCandidate=problems.slice());const t=problemCandidate.splice(getRandomInt(0,problemCandidate.length),1)[0],[n,e]=t,s=Math.max(...e.map(e=>e.length));answerKanji=n,answerYomis=e,hideAnswer(),document.getElementById("problem").textContent=answerKanji,document.getElementById("answer").textContent=answerYomis.join(", "),document.getElementById("reply").textContent="",setTegakiPanel(s)}function initProblems(){const e=document.getElementById("gradeOption").selectedIndex+1;fetch("data/"+e+".tsv").then(e=>e.text()).then(e=>{problems=[],e.trimEnd().split(/\n/).forEach(e=>{const[t,n]=e.split("	");problems.push([t,n.split("|")])}),problemCandidate=problems.slice()})}let gameTimer;function startGameTimer(){clearInterval(gameTimer);const e=document.getElementById("time");initTime(),gameTimer=setInterval(()=>{const t=parseInt(e.textContent);t>0?e.textContent=t-1:(clearInterval(gameTimer),playAudio("end"),playPanel.classList.add("d-none"),scorePanel.classList.remove("d-none"),document.getElementById("score").textContent=`${correctCount} / ${totalCount}`)},1e3)}let countdownTimer;function countdown(){clearTimeout(countdownTimer),countPanel.classList.remove("d-none"),infoPanel.classList.add("d-none"),playPanel.classList.add("d-none"),scorePanel.classList.add("d-none");const e=document.getElementById("counter");e.textContent=3,countdownTimer=setInterval(()=>{const t=["skyblue","greenyellow","violet","tomato"];if(parseInt(e.textContent)>1){const n=parseInt(e.textContent)-1;e.style.backgroundColor=t[n],e.textContent=n}else clearTimeout(countdownTimer),countPanel.classList.add("d-none"),infoPanel.classList.remove("d-none"),playPanel.classList.remove("d-none"),correctCount=totalCount=0,nextProblem(),startGameTimer()},1e3)}function initTime(){document.getElementById("time").textContent=gameTime}class TegakiBox extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[globalCSS];const e=document.getElementById("tegaki-box").content.cloneNode(!0),t=e.querySelector("use"),s=t.getAttribute("href").slice(1),o=document.getElementById(s).firstElementChild.cloneNode(!0);t.replaceWith(o),this.shadowRoot.appendChild(e);const i=this.shadowRoot.querySelector("canvas"),n=initSignaturePad(i);this.shadowRoot.querySelector(".eraser").onclick=()=>{n.clear()},pads.push(n),document.documentElement.getAttribute("data-bs-theme")=="dark"&&this.shadowRoot.querySelector("canvas").setAttribute("style","filter: invert(1) hue-rotate(180deg);")}}customElements.define("tegaki-box",TegakiBox);function createTegakiBox(){const e=document.createElement("div"),n=document.getElementById("tegaki-box").content.cloneNode(!0);e.appendChild(n);const s=e.querySelector("canvas"),t=initSignaturePad(s);return e.querySelector(".eraser").onclick=()=>{t.clear()},pads.push(t),e}function kanaToHira(e){return e.replace(/[\u30a1-\u30f6]/g,e=>{const t=e.charCodeAt(0)-96;return String.fromCharCode(t)})}function getGlobalCSS(){let e="";for(const t of document.styleSheets)for(const n of t.cssRules)e+=n.cssText;const t=new CSSStyleSheet;return t.replaceSync(e),t}const globalCSS=getGlobalCSS();canvases.forEach(e=>{const t=initSignaturePad(e);pads.push(t),e.parentNode.querySelector(".eraser").onclick=()=>{t.clear(),showPredictResult(e," ")}});const worker=new Worker("worker.js");worker.addEventListener("message",e=>{const t=e.data;if(pads[t.pos].toData().length==0)return;const s=showPredictResult(canvases[t.pos],t.result),n=kanaToHira(s).trim();answerYomis.includes(n)&&(hinted||(correctCount+=1),playAudio("correct"),document.getElementById("reply").textContent="⭕ "+n,nextProblem())}),initProblems(),document.getElementById("toggleDarkMode").onclick=toggleDarkMode,document.getElementById("restartButton").onclick=countdown,document.getElementById("startButton").onclick=countdown,document.getElementById("showAnswer").onclick=showAnswer,document.getElementById("gradeOption").onchange=initProblems,document.addEventListener("pointerdown",()=>{predict(canvases[0])},{once:!0}),document.addEventListener("click",unlockAudio,{once:!0,useCapture:!0})