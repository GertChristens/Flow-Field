const palette=['#e84b3c','#ef8b2c','#f2c94c','#70b34a','#1ea68b','#2b80c9','#5d61b9','#9b55a8','#d6538c'];
function polar(cx,cy,r,a){const t=a*Math.PI/180;return[cx+r*Math.cos(t),cy+r*Math.sin(t)]}
function line(x1,y1,x2,y2,sw=1,op=.8){return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#e6d9c5" stroke-width="${sw}" opacity="${op}"/>`}
function circle(cx,cy,r,sw=1,op=.8,fill='none'){return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="#e6d9c5" stroke-width="${sw}" opacity="${op}"/>`}
function createMandalaSVG(o={}){
 const size=o.size||700,cx=size/2,cy=size/2,R=size*.46,detail=o.detail||7,n=24;let s=`<svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" aria-label="Flow Field mandala"><rect width="100%" height="100%" fill="#050505"/>`;
 s+=`<circle cx="${cx}" cy="${cy}" r="${R+4}" fill="none" stroke="#d6c7ad" stroke-width="2"/>`;
 for(let i=0;i<n;i++){const a0=-90+i*360/n+1,a1=-90+(i+1)*360/n-1,p0=polar(cx,cy,R*.80,a0),p1=polar(cx,cy,R*.98,a0),p2=polar(cx,cy,R*.98,a1),p3=polar(cx,cy,R*.80,a1);let fill=o.outerColors?palette[i%palette.length]:'#3f3b34';if(o.highlight&&o.highlight.index===i)fill=o.highlight.color||'#fff';s+=`<path d="M ${p0[0]} ${p0[1]} L ${p1[0]} ${p1[1]} A ${R*.98} ${R*.98} 0 0 1 ${p2[0]} ${p2[1]} L ${p3[0]} ${p3[1]} A ${R*.80} ${R*.80} 0 0 0 ${p0[0]} ${p0[1]} Z" fill="${fill}" stroke="#cfc1aa" stroke-width="1"/>`}
 const inner=R*.76;
 for(let k=1;k<=detail;k++)s+=circle(cx,cy,inner*k/detail,k%2?1:.7,.62);
 for(let k=3;k<=detail+2;k++){const rad=inner*(.25+.65*((k-2)/detail)),pts=[];for(let j=0;j<k*2;j++){const p=polar(cx,cy,rad,-90+j*360/(k*2));pts.push(p.join(','))}s+=`<polygon points="${pts.join(' ')}" fill="none" stroke="#e6d9c5" stroke-width=".8" opacity=".48"/>`}
 const rays=12+detail*2;for(let j=0;j<rays;j++){const a=j*360/rays,p=polar(cx,cy,inner,a),q=polar(cx,cy,inner*.62,a+180/rays);s+=line(cx,cy,p[0],p[1],.7,.36)+line(cx,cy,q[0],q[1],.7,.34)}
 for(let j=0;j<8;j++){const p=polar(cx,cy,inner*.48,j*45);s+=circle(p[0],p[1],inner*.13,1,.55)+circle(p[0],p[1],inner*.055,1,.7)}
 s+=circle(cx,cy,inner*.055,1.4,.9,'#050505')+`<circle cx="${cx}" cy="${cy}" r="3" fill="#f1dfbd"/></svg>`;return s
}