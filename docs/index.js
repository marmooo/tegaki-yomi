const playPanel=document.getElementById("playPanel"),countPanel=document.getElementById("countPanel"),scorePanel=document.getElementById("scorePanel"),tegakiPanel=document.getElementById("tegakiPanel");let canvases=[...tegakiPanel.getElementsByTagName("canvas")];const gameTime=180;let hinted=!1,pads=[],problems=[],problemCandidate,answerKanji="漢字",answerYomis=["かんじ"],englishVoices=[],correctCount=problemCount=0;const canvasCache=document.createElement("canvas").getContext("2d");let endAudio,correctAudio;loadAudios();const AudioContext=window.AudioContext||window.webkitAudioContext,audioContext=new AudioContext;loadConfig();function loadConfig(){localStorage.getItem("darkMode")==1&&(document.documentElement.dataset.theme="dark")}function toggleDarkMode(){localStorage.getItem("darkMode")==1?(localStorage.setItem("darkMode",0),delete document.documentElement.dataset.theme):(localStorage.setItem("darkMode",1),document.documentElement.dataset.theme="dark")}function playAudio(c,b){const a=audioContext.createBufferSource();if(a.buffer=c,b){const c=audioContext.createGain();c.gain.value=b,c.connect(audioContext.destination),a.connect(c),a.start()}else a.connect(audioContext.destination),a.start()}function unlockAudio(){audioContext.resume()}function loadAudio(a){return fetch(a).then(a=>a.arrayBuffer()).then(a=>new Promise((b,c)=>{audioContext.decodeAudioData(a,a=>{b(a)},a=>{c(a)})}))}function loadAudios(){promises=[loadAudio("mp3/end.mp3"),loadAudio("mp3/correct3.mp3")],Promise.all(promises).then(a=>{endAudio=a[0],correctAudio=a[1]})}function loadVoices(){const a=new Promise(function(b){let a=speechSynthesis.getVoices();if(a.length!==0)b(a);else{let c=!1;speechSynthesis.addEventListener("voiceschanged",()=>{c=!0,a=speechSynthesis.getVoices(),b(a)}),setTimeout(()=>{c||document.getElementById("noTTS").classList.remove("d-none")},1e3)}});a.then(a=>{englishVoices=a.filter(a=>a.lang=="ja-JP")})}loadVoices();function speak(b){speechSynthesis.cancel();const a=new SpeechSynthesisUtterance(b);a.voice=englishVoices[Math.floor(Math.random()*englishVoices.length)],a.lang="ja-JP",speechSynthesis.speak(a)}function setTegakiPanel(){while(tegakiPanel.firstChild)tegakiPanel.removeChild(tegakiPanel.lastChild);pads=[];for(let a=0;a<answerYomis[0].length;a++){const b=createTegakiBox();tegakiPanel.appendChild(b)}const a=tegakiPanel.children;canvases=[...a].map(a=>a.querySelector("canvas"))}function showPredictResult(b,c){const f=canvases.indexOf(b),d=answerKanji[f];let e=!1;for(let a=0;a<c.length;a++)if(c[a]==d){e=!0;break}e?b.setAttribute("data-predict",d):b.setAttribute("data-predict",c[0]);let a="";for(let b=0;b<canvases.length;b++){const c=canvases[b].getAttribute("data-predict");c?a+=c:a+=" "}return document.getElementById("reply").textContent=a,a}function initSignaturePad(b){const a=new SignaturePad(b,{minWidth:2,maxWidth:2,penColor:"black",backgroundColor:"white",throttle:0,minDistance:0});return a.addEventListener("endStroke",()=>{predict(a.canvas)}),a}function getImageData(d){const b=inputHeight=28;canvasCache.drawImage(d,0,0,b,inputHeight);const c=canvasCache.getImageData(0,0,b,inputHeight),a=c.data;for(let b=0;b<a.length;b+=4)a[b]=255-a[b],a[b+1]=255-a[b+1],a[b+2]=255-a[b+2];return c}function predict(a){const b=getImageData(a),c=canvases.indexOf(a);worker.postMessage({imageData:b,pos:c})}function getRandomInt(a,b){return a=Math.ceil(a),b=Math.floor(b),Math.floor(Math.random()*(b-a)+a)}function hideAnswer(){document.getElementById("answer").classList.add("d-none")}function showAnswer(){hinted=!0,document.getElementById("answer").classList.remove("d-none"),speak(answerYomis.join(", "))}function nextProblem(){hinted=!1,problemCount+=1,problemCandidate.length<=0&&(problemCandidate=problems.slice());const b=problemCandidate.splice(getRandomInt(0,problemCandidate.length),1)[0],[c,a]=b,d=a[getRandomInt(0,a.length)].length;answerKanji=c,answerYomis=a.filter(a=>a.length==d),hideAnswer(),document.getElementById("problem").textContent=answerKanji,document.getElementById("answer").textContent=answerYomis.join(", "),document.getElementById("reply").textContent="",setTegakiPanel()}function initProblems(){const a=document.getElementById("gradeOption").selectedIndex+1;fetch("data/"+a+".tsv").then(a=>a.text()).then(a=>{problems=[],a.trimEnd().split(/\n/).forEach(a=>{const[b,c]=a.split("	");problems.push([b,c.split("|")])}),problemCandidate=problems.slice()})}let gameTimer;function startGameTimer(){clearInterval(gameTimer);const a=document.getElementById("time");initTime(),gameTimer=setInterval(()=>{const b=parseInt(a.textContent);b>0?a.textContent=b-1:(clearInterval(gameTimer),playAudio(endAudio),playPanel.classList.add("d-none"),scorePanel.classList.remove("d-none"),document.getElementById("score").textContent=correctCount,document.getElementById("total").textContent=problemCount)},1e3)}let countdownTimer;function countdown(){clearTimeout(countdownTimer),countPanel.classList.remove("d-none"),playPanel.classList.add("d-none"),scorePanel.classList.add("d-none");const a=document.getElementById("counter");a.textContent=3,countdownTimer=setInterval(()=>{const b=["skyblue","greenyellow","violet","tomato"];if(parseInt(a.textContent)>1){const c=parseInt(a.textContent)-1;a.style.backgroundColor=b[c],a.textContent=c}else clearTimeout(countdownTimer),countPanel.classList.add("d-none"),playPanel.classList.remove("d-none"),correctCount=problemCount=0,document.getElementById("score").textContent=correctCount,document.getElementById("total").textContent=problemCount-1,nextProblem(),startGameTimer()},1e3)}function initTime(){document.getElementById("time").textContent=gameTime}customElements.define("tegaki-box",class extends HTMLElement{constructor(){super();const a=document.getElementById("tegaki-box").content.cloneNode(!0),c=a.querySelector("canvas"),b=initSignaturePad(c);a.querySelector(".eraser").onclick=()=>{b.clear()},pads.push(b),this.attachShadow({mode:"open"}).appendChild(a)}});function createTegakiBox(){const a=document.createElement("div"),c=document.getElementById("tegaki-box").content.cloneNode(!0);a.appendChild(c);const d=a.querySelector("canvas"),b=initSignaturePad(d);return a.querySelector(".eraser").onclick=()=>{b.clear()},pads.push(b),a}function kanaToHira(a){return a.replace(/[\u30a1-\u30f6]/g,a=>{const b=a.charCodeAt(0)-96;return String.fromCharCode(b)})}canvases.forEach(a=>{const b=initSignaturePad(a);pads.push(b),a.parentNode.querySelector(".eraser").onclick=()=>{b.clear(),showPredictResult(a," ")}});const worker=new Worker("worker.js");worker.addEventListener("message",a=>{const b=showPredictResult(canvases[a.data.pos],a.data.result),c=kanaToHira(b);answerYomis.includes(c)&&(hinted||(correctCount+=1),playAudio(correctAudio),document.getElementById("reply").textContent="⭕ "+answerYomis,nextProblem())}),initProblems(),document.getElementById("toggleDarkMode").onclick=toggleDarkMode,document.getElementById("restartButton").onclick=countdown,document.getElementById("startButton").onclick=countdown,document.getElementById("showAnswer").onclick=showAnswer,document.getElementById("gradeOption").onchange=initProblems,document.addEventListener("click",unlockAudio,{once:!0,useCapture:!0}),/Macintosh/.test(navigator.userAgent)&&(document.ondblclick=a=>{a.preventDefault()},document.body.style.webkitUserSelect="none")