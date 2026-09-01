const phases=[
{start:0,end:60,label:'FOCUS — centrale fixatie',instruction:'Kijk naar het centrale punt. Laat de mandala als geheel aanwezig zijn.',mode:'quiet'},
{start:60,end:150,label:'PERIPHERAL — kleurdetectie',instruction:'Fixeer het centrum. Welke kleur verschijnt perifeer?',mode:'color'},
{start:150,end:240,label:'PERIPHERAL — positie',instruction:'Fixeer het centrum. Waar verschijnt de verandering?',mode:'position'},
{start:240,end:330,label:'DUAL ATTENTION',instruction:'Blijf centraal kijken en registreer kleur én positie.',mode:'dual'},
{start:330,end:450,label:'ECCENTRICITEIT',instruction:'Detecteer de perifere stimulus zonder ernaar te kijken.',mode:'eccentricity'},
{start:450,end:510,label:'OPEN FOCUS',instruction:'Kijk naar het centrum en laat je aandacht het hele veld omvatten.',mode:'open'},
{start:510,end:540,label:'DYNAMISCHE PERIFERIE',instruction:'Blijf centraal kijken en merk subtiele veranderingen op.',mode:'dynamic'},
{start:540,end:600,label:'FLOW — OPEN AWARENESS',instruction:'Geen taak. Kijk naar het centrum en wees aanwezig in het volledige visuele veld.',mode:'flow'}];
let elapsed=0,interval=null,currentTrial=null,trials=0,correct=0,rtSum=0,maxEcc=0;
const stage=document.getElementById('mandala'),response=document.getElementById('responseArea'),timer=document.getElementById('timer'),phaseLabel=document.getElementById('phaseLabel'),instruction=document.getElementById('instruction'),progress=document.getElementById('progressBar');
function phase(t){return phases.find(p=>t>=p.start&&t<p.end)||phases.at(-1)}
function render(p){stage.innerHTML=createMandalaSVG({detail:p.mode==='dual'?10:8,outerColors:p.mode!=='quiet',size:720})}
function setButtons(items,fn=answer){response.innerHTML='';items.forEach(x=>{const b=document.createElement('button');b.textContent=x.label;b.onclick=()=>fn(x.value);response.appendChild(b)})}
function side(a){const x=((a+90)%360+360)%360;return x<45||x>=315?'top':x<135?'right':x<225?'bottom':'left'}
function trial(mode){
 if(!['color','position','dual','eccentricity'].includes(mode))return;
 setTimeout(()=>{
  if(!interval||phase(elapsed).mode!==mode)return;
  const idx=Math.floor(Math.random()*24),color=palette[Math.floor(Math.random()*palette.length)],angle=-90+(idx+.5)*15;
  const ecc=mode==='eccentricity'?[20,30,40,50][Math.floor(Math.random()*4)]:28+Math.random()*12;
  currentTrial={mode,idx,color,angle,ecc,shownAt:performance.now()};maxEcc=Math.max(maxEcc,ecc);
  stage.innerHTML=createMandalaSVG({detail:mode==='dual'?10:8,outerColors:true,size:720,highlight:{index:idx,color}});
  if(mode==='color')setButtons(['Rood','Oranje','Geel','Groen','Turquoise','Blauw','Indigo','Paars','Roze'].map((label,i)=>({label,value:palette[i]})));
  if(mode==='position'||mode==='eccentricity')setButtons([{label:'← Links',value:'left'},{label:'→ Rechts',value:'right'},{label:'↑ Boven',value:'top'},{label:'↓ Onder',value:'bottom'}]);
  if(mode==='dual')setButtons([{label:'Rood',value:palette[0]},{label:'Blauw',value:palette[5]},{label:'Groen',value:palette[3]},{label:'Geel',value:palette[2]},{label:'Paars',value:palette[7]}],v=>answer('c:'+v));
  setTimeout(()=>{if(currentTrial){currentTrial=null;response.innerHTML='';render(phase(elapsed))}},650);
 },900+Math.random()*1500)}
function answer(v){if(!currentTrial)return;const rt=Math.round(performance.now()-currentTrial.shownAt);trials++;rtSum+=rt;let ok=false;
 if(currentTrial.mode==='color')ok=v===currentTrial.color;
 else if(currentTrial.mode==='position'||currentTrial.mode==='eccentricity')ok=v===side(currentTrial.angle);
 else if(currentTrial.mode==='dual')ok=v==='c:'+currentTrial.color;
 if(ok)correct++;currentTrial=null;response.innerHTML=''}
function finish(){clearInterval(interval);interval=null;response.innerHTML='';instruction.textContent='Hoe was je open aandacht?';setButtons(Array.from({length:10},(_,i)=>({label:String(i+1),value:i+1})),v=>{
 const data={pdi:trials?Math.round(correct/trials*100):0,dai:trials?Math.round(Math.min(1,correct/trials*1.08)*100):0,flow:v,correct,trials,avgRT:trials?Math.round(rtSum/trials):0,maxEccentricity:Math.round(maxEcc),timestamp:new Date().toISOString()};
 localStorage.setItem('flowFieldLastSession',JSON.stringify(data));location.href='results.html'})}
function tick(){elapsed++;const rem=Math.max(0,600-elapsed);timer.textContent=`${String(Math.floor(rem/60)).padStart(2,'0')}:${String(rem%60).padStart(2,'0')}`;progress.style.width=(elapsed/600*100)+'%';const p=phase(elapsed);phaseLabel.textContent=p.label;instruction.textContent=p.instruction;render(p);if(['color','position','dual','eccentricity'].includes(p.mode))trial(p.mode);if(elapsed>=600)finish()}
document.getElementById('startBtn').onclick=()=>{document.getElementById('startOverlay').style.display='none';if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{});render(phases[0]);interval=setInterval(tick,1000);tick()}
