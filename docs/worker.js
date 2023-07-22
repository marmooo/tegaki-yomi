const letters=Array.from("ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをんゔァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵー・、。");function getAccuracyScores(a){const b=tf.tidy(()=>{const c=1;let b=tf.browser.fromPixels(a,c);return b=tf.cast(b,"float32").div(tf.scalar(255)),b=b.expandDims(),model.predict(b).dataSync()});return b}function top2(c){let a=0,b=0;return c.forEach(c=>{a<c&&(b=a,a=c)}),[a,b]}function predict(b){const a=getAccuracyScores(b),[c,d]=top2(a),e=letters[a.indexOf(c)],f=letters[a.indexOf(d)];return[e,f]}async function loadModel(){model=await tf.loadGraphModel("model/model.json")}importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.9.0/dist/tf.min.js");let model;loadModel(),self.addEventListener("message",a=>{a.data.result=predict(a.data.imageData),delete a.data.imageData,postMessage(a.data)})