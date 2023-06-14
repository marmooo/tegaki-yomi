const playPanel=document.getElementById("playPanel"),infoPanel=document.getElementById("infoPanel"),countPanel=document.getElementById("countPanel"),scorePanel=document.getElementById("scorePanel"),tegakiPanel=document.getElementById("tegakiPanel");let canvases=[...tegakiPanel.getElementsByTagName("canvas")];const gameTime=180;let hinted=!1,pads=[],problems=[],problemCandidate,answerKanji="漢字",answerYomis=["かんじ"],correctCount=problemCount=0;const canvasCache=document.createElement("canvas").getContext("2d",{alpha:!1,willReadFrequently:!0}),audioContext=new AudioContext,audioBufferCache={};loadAudio("end","mp3/end.mp3"),loadAudio("correct","mp3/correct3.mp3");let japaneseVoices=[];loadVoices(),loadConfig();function loadConfig(){localStorage.getItem("darkMode")==1&&(document.documentElement.dataset.theme="dark")}function toggleDarkMode(){localStorage.getItem("darkMode")==1?(localStorage.setItem("darkMode",0),delete document.documentElement.dataset.theme):(localStorage.setItem("darkMode",1),document.documentElement.dataset.theme="dark")}async function playAudio(b,c){const d=await loadAudio(b,audioBufferCache[b]),a=audioContext.createBufferSource();if(a.buffer=d,c){const b=audioContext.createGain();b.gain.value=c,b.connect(audioContext.destination),a.connect(b),a.start()}else a.connect(audioContext.destination),a.start()}async function loadAudio(a,c){if(audioBufferCache[a])return audioBufferCache[a];const d=await fetch(c),e=await d.arrayBuffer(),b=await audioContext.decodeAudioData(e);return audioBufferCache[a]=b,b}function unlockAudio(){audioContext.resume()}function loadVoices(){const a=new Promise(function(b){let a=speechSynthesis.getVoices();if(a.length!==0)b(a);else{let c=!1;speechSynthesis.addEventListener("voiceschanged",()=>{c=!0,a=speechSynthesis.getVoices(),b(a)}),setTimeout(()=>{c||document.getElementById("noTTS").classList.remove("d-none")},1e3)}});a.then(a=>{japaneseVoices=a.filter(a=>a.lang=="ja-JP")})}function speak(b){speechSynthesis.cancel();const a=new SpeechSynthesisUtterance(b);a.voice=japaneseVoices[Math.floor(Math.random()*japaneseVoices.length)],a.lang="ja-JP",speechSynthesis.speak(a)}function setTegakiPanel(a){while(tegakiPanel.firstChild)tegakiPanel.removeChild(tegakiPanel.lastChild);pads=[];for(let b=0;b<a;b++){const c=createTegakiBox();tegakiPanel.appendChild(c)}const b=tegakiPanel.children;canvases=[...b].map(a=>a.querySelector("canvas"))}function showPredictResult(b,c){const f=canvases.indexOf(b),d=answerKanji[f];let e=!1;for(let a=0;a<c.length;a++)if(c[a]==d){e=!0;break}e?b.setAttribute("data-predict",d):b.setAttribute("data-predict",c[0]);let a="";for(let b=0;b<canvases.length;b++){const c=canvases[b].getAttribute("data-predict");c?a+=c:a+=" "}return document.getElementById("reply").textContent=a,a}function initSignaturePad(b){const a=new SignaturePad(b,{minWidth:2,maxWidth:2,penColor:"black",backgroundColor:"white",throttle:0,minDistance:0});return a.addEventListener("endStroke",()=>{predict(a.canvas)}),a}function getImageData(d){const b=inputHeight=28;canvasCache.drawImage(d,0,0,b,inputHeight);const c=canvasCache.getImageData(0,0,b,inputHeight),a=c.data;for(let b=0;b<a.length;b+=4)a[b]=255-a[b],a[b+1]=255-a[b+1],a[b+2]=255-a[b+2];return c}function predict(a){const b=getImageData(a),c=canvases.indexOf(a);worker.postMessage({imageData:b,pos:c})}function getRandomInt(a,b){return a=Math.ceil(a),b=Math.floor(b),Math.floor(Math.random()*(b-a)+a)}function hideAnswer(){document.getElementById("answer").classList.add("d-none")}function showAnswer(){hinted=!0,document.getElementById("answer").classList.remove("d-none"),speak(answerYomis.join(", "))}function nextProblem(){hinted=!1,problemCount+=1,problemCandidate.length<=0&&(problemCandidate=problems.slice());const b=problemCandidate.splice(getRandomInt(0,problemCandidate.length),1)[0],[c,a]=b,d=Math.max(...a.map(a=>a.length));answerKanji=c,answerYomis=a,hideAnswer(),document.getElementById("problem").textContent=answerKanji,document.getElementById("answer").textContent=answerYomis.join(", "),document.getElementById("reply").textContent="",setTegakiPanel(d)}function initProblems(){const a=document.getElementById("gradeOption").selectedIndex+1;fetch("data/"+a+".tsv").then(a=>a.text()).then(a=>{problems=[],a.trimEnd().split(/\n/).forEach(a=>{const[b,c]=a.split("	");problems.push([b,c.split("|")])}),problemCandidate=problems.slice()})}let gameTimer;function startGameTimer(){clearInterval(gameTimer);const a=document.getElementById("time");initTime(),gameTimer=setInterval(()=>{const b=parseInt(a.textContent);b>0?a.textContent=b-1:(clearInterval(gameTimer),playAudio("end"),playPanel.classList.add("d-none"),scorePanel.classList.remove("d-none"),document.getElementById("score").textContent=correctCount,document.getElementById("total").textContent=problemCount)},1e3)}let countdownTimer;function countdown(){clearTimeout(countdownTimer),countPanel.classList.remove("d-none"),infoPanel.classList.add("d-none"),playPanel.classList.add("d-none"),scorePanel.classList.add("d-none");const a=document.getElementById("counter");a.textContent=3,countdownTimer=setInterval(()=>{const b=["skyblue","greenyellow","violet","tomato"];if(parseInt(a.textContent)>1){const c=parseInt(a.textContent)-1;a.style.backgroundColor=b[c],a.textContent=c}else clearTimeout(countdownTimer),countPanel.classList.add("d-none"),infoPanel.classList.remove("d-none"),playPanel.classList.remove("d-none"),correctCount=problemCount=0,document.getElementById("score").textContent=correctCount,document.getElementById("total").textContent=problemCount-1,nextProblem(),startGameTimer()},1e3)}function initTime(){document.getElementById("time").textContent=gameTime}class TegakiBox extends HTMLElement{constructor(){super();const a=document.getElementById("tegaki-box").content.cloneNode(!0),c=a.querySelector("canvas"),b=initSignaturePad(c);a.querySelector(".eraser").onclick=()=>{b.clear()},pads.push(b),this.attachShadow({mode:"open"}).appendChild(a)}}customElements.define("tegaki-box",TegakiBox);function createTegakiBox(){const a=document.createElement("div"),c=document.getElementById("tegaki-box").content.cloneNode(!0);a.appendChild(c);const d=a.querySelector("canvas"),b=initSignaturePad(d);return a.querySelector(".eraser").onclick=()=>{b.clear()},pads.push(b),a}function kanaToHira(a){return a.replace(/[\u30a1-\u30f6]/g,a=>{const b=a.charCodeAt(0)-96;return String.fromCharCode(b)})}canvases.forEach(a=>{const b=initSignaturePad(a);pads.push(b),a.parentNode.querySelector(".eraser").onclick=()=>{b.clear(),showPredictResult(a," ")}});const worker=new Worker("worker.js");worker.addEventListener("message",a=>{const c=showPredictResult(canvases[a.data.pos],a.data.result),b=kanaToHira(c).trim();answerYomis.includes(b)&&(hinted||(correctCount+=1),playAudio("correct"),document.getElementById("reply").textContent="⭕ "+b,nextProblem())}),initProblems(),document.getElementById("toggleDarkMode").onclick=toggleDarkMode,document.getElementById("restartButton").onclick=countdown,document.getElementById("startButton").onclick=countdown,document.getElementById("showAnswer").onclick=showAnswer,document.getElementById("gradeOption").onchange=initProblems,document.addEventListener("click",unlockAudio,{once:!0,useCapture:!0})