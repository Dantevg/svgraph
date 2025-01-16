const t="http://www.w3.org/2000/svg";function e(e,s,i=[]){const n=document.createElementNS(t,e);for(const t in s)void 0!==s[t]&&n.setAttribute(t,s[t]);for(const t of i??[])n.appendChild(t);return n}const s=(t={},...s)=>e("g",t,s),i=(t,...s)=>e("line",{...t,x1:t.from[0],y1:t.from[1],x2:t.to[0],y2:t.to[1],from:void 0,to:void 0},s),n=(t,...s)=>e("text",t,s);function a(t,e,s=[]){const i=document.createElement(t);for(const t in e)void 0!==e[t]&&i.setAttribute(t,e[t]);for(const t of s??[])i.appendChild(t);return i}const l=(t={},...e)=>a("div",t,e),o=(t={},...e)=>a("p",t,e),h=(t={},...e)=>a("span",t,e);class r{min;max;constructor(t,e){this.min=t,this.max=e}static UNIT=new r(0,1);get span(){return this.max.valueOf()-this.min.valueOf()}contains=t=>this.min.valueOf()<t.valueOf()&&t.valueOf()<this.max.valueOf();clamp=t=>Math.max(this.min.valueOf(),Math.min(t.valueOf(),this.max.valueOf()));normalize=t=>0!=this.span?(t.valueOf()-this.min.valueOf())/this.span:0;lerp=t=>this.min.valueOf()+t*this.span}const c=(t,e)=>t.length>0?t.reduce(((t,s)=>e(t)>e(s)?t:s)):void 0,d=(t,e)=>t.length>0?t.reduce(((t,s)=>e(t)<e(s)?t:s)):void 0,u=(t,e)=>t.length>0?t.reduce(((t,s)=>t[e]<s[e]?t:s)):void 0,g=(t,e)=>Math.floor(t/e)*e;function x(t,e,s){const i=s.map((({points:s})=>{return i=s.map((t=>e.normalize(t.label))),n=t,u(i.map(((t,e)=>[Math.abs(t-n),e])),0)[1];var i,n})),n=i.map(((t,e)=>s[e].points[t].label));return d(n,(s=>Math.abs(e.normalize(s)-t)))}const p=(t,e,s)=>u(t.map((t=>[t,Math.abs(s.normalize(t.label)-s.normalize(e))])),1)[0];class m extends HTMLElement{constructor(){super(),this.setAttribute("hidden","")}show(){this.removeAttribute("hidden")}hide(){this.setAttribute("hidden","")}move(t,e){this.style.left=`${t+20}px`,this.style.top=`${e}px`}update(t,e,s,i,n){this.move(t,e);const l=x(s,i,n);this.innerHTML="",this.appendChild(((t={},...e)=>a("h3",t,e))({},new Text(l?.text)));const o=n.map((({name:t,colour:e,points:s})=>({name:t,colour:e,point:p(s,l,i)})));return this.setValues(o),this.show(),o.map((t=>t.point))}setValues(t){for(const{name:e,colour:s,point:{value:i}}of t)null!=i&&0!=i.valueOf()&&this.appendChild(o({},l({class:"swatch",style:`background-color: ${s}`}),h({class:"name"},new Text(e)),new Text(": "),h({class:"value"},new Text(i.text))))}}customElements.define("svg-popup",m);class v extends HTMLElement{callback;lines;disabled=new Set;constructor(t){super(),this.callback=t}update(t){this.lines=t,this.innerHTML="";for(const{name:e,colour:s}of t){const t=h({class:"legend-item"},l({class:"swatch",style:`background-color: ${s}`}),h({class:"name"},new Text(e)));t.classList.toggle("disabled",this.disabled.has(e)),this.appendChild(t),t.addEventListener("click",(()=>this.onLegendItemClick(e,t)))}}onLegendItemClick(t,e){this.disabled.has(t)?this.disabled.delete(t):this.disabled.add(t),e.classList.toggle("disabled",this.disabled.has(t)),this.callback()}}customElements.define("svg-legend",v);class y{valueOf(){return this.value.valueOf()}}class f{range;constructor(t){this.range=t}}class b extends y{value={valueOf:()=>0};constructor(){super()}get text(){return""}get axisType(){return w}}class w extends f{static RANGE=new r(new b,new b);constructor(t){super(w.RANGE)}getTicks(t){return[new b]}}class A extends y{value;constructor(t){super(),this.value=t}get text(){return this.value.toString()}get axisType(){return E}}class E extends f{getTicks(t){const e=Math.pow(10,Math.floor(Math.log10(this.range.span/t))-1),s=g(this.range.span/t,e);return[...Array(Math.floor(this.range.span/s)+1).keys().map((t=>new A(g(t*s+this.range.min.valueOf(),e))))].filter(((t,e,s)=>0==e||t.valueOf()!=s[e-1].valueOf()))}}class k extends y{value;constructor(t){super(),this.value=t,this.value=Math.floor(t)}get text(){return this.value.toString()}get axisType(){return M}}class M extends f{getTicks(t){const e=Math.max(1,Math.pow(10,Math.floor(Math.log10(this.range.span/t))-1)),s=g(this.range.span/t,e);return[...Array(Math.floor(this.range.span/s)+1).keys().map((t=>new k(t*s+this.range.min.valueOf())))].filter(((t,e,s)=>0==e||t.valueOf()!=s[e-1].valueOf()))}}class O extends y{value;constructor(t){super(),this.value=t}get text(){return this.value.toISOString().split("T")[0]}get axisType(){return T}}class T extends f{getTicks(t){const e=this.range.span/24/60/60/1e3,s=e/30>t?30:e/7>t?7:1,i=Math.ceil(e/s/t)*s;return[...Array(Math.floor(e/i)+1).keys().map((t=>new O(new Date(t*i*24*60*60*1e3+this.range.min.valueOf()))))]}}class z extends y{value;constructor(t){super(),this.value=t}get text(){const t=new Date(1e3*this.value),e=Math.floor(this.value/24/60/60),s=t.getUTCHours(),i=t.getUTCMinutes(),n=t.getUTCSeconds()+t.getUTCMilliseconds()/1e3;return s>0||e>0?0==i?`${s+24*e} h`:`${s+24*e}:${String(i).padStart(2,"0")} h`:i>0?`${i}:${String(Math.floor(n)).padStart(2,"0")}`:`${n} s`}get axisType(){return C}}class C extends f{getTicks(t){const e=this.range.span/24/60/60>t?86400:this.range.span/60/60>t?3600:this.range.span/60>t?60:1,s=Math.ceil(this.range.span/e/t)*e;return[...Array(Math.floor(this.range.span/s)+1).keys().map((t=>new z(t*s+this.range.min.valueOf())))]}}class S extends y{value;unit;constructor(t,e){super(),this.value=t,this.unit=e}get text(){const t=S.largestOffset(this.value);return`${Math.floor(this.value/Math.pow(10,3*t))} ${S.units[t+S.unitsStartOffset]}${this.unit}`}get axisType(){return $}static units=["n","u","m","","k","M","G","T","P","E","Z","Y"];static unitsStartOffset=3;static largestOffset=t=>0==t?0:Math.floor(Math.log10(t)/3)}class $ extends f{getTicks=t=>[...Array(t).keys().map((e=>new S(Math.floor(this.range.lerp(e/(t-1))),this.range.min.unit)))]}class F extends HTMLElement{svgElem;popupElem;legendElem;guideElem;selectionElem;data;styles;xaxis;yaxis;resizeObserver;selection={};activeData;get canvasCoordRange(){return new r(this.styles.yAxis.width,this.svgElem.clientWidth)}constructor(s){super();const i=this.attachShadow({mode:"open"}),n=document.createElement("style");n.textContent=H,i.appendChild(n),i.appendChild(((t={},...e)=>a("h1",t,e))({id:"title"})),this.legendElem=new v((()=>this.updateActiveData())),i.appendChild(this.legendElem),this.svgElem=((s,...i)=>e("svg",{...s,xmlns:t},i))({width:"100%",height:"100%",overflow:"visible",fill:"white"}),this.svgElem.addEventListener("mousedown",(t=>this.onMouseDown(t))),this.svgElem.addEventListener("mouseup",(t=>this.onMouseUp(t))),this.svgElem.addEventListener("mousemove",(t=>this.onMouseMove(t))),this.svgElem.addEventListener("mouseleave",(t=>this.onMouseLeave(t))),i.appendChild(this.svgElem),this.popupElem=new m,i.appendChild(this.popupElem),this.update(s,!1)}connectedCallback(){this.resizeObserver=new ResizeObserver((t=>{const{inlineSize:e,blockSize:s}=t[0].contentBoxSize[0];e>0&&s>0&&this.draw(e,s)})),this.resizeObserver.observe(this.svgElem,{box:"content-box"})}update({data:t,title:e,styles:s},i=!0){this.styles={colourscheme:s?.colourscheme??["black"],xAxis:{height:s?.xAxis?.height??30,colour:s?.xAxis?.colour??"white",strokeWidth:s?.xAxis?.strokeWidth??1,labels:{spacing:s?.xAxis?.labels?.spacing??30,rotation:s?.xAxis?.labels?.rotation??0,colour:s?.xAxis?.labels?.colour??s?.xAxis?.colour??"#FFF8",fontSize:s?.xAxis?.labels?.fontSize??"0.8em"}},yAxis:{width:s?.yAxis?.width??30,colour:s?.yAxis?.colour??"white",strokeWidth:s?.yAxis?.strokeWidth??1,labels:{spacing:s?.yAxis?.labels?.spacing??50,rotation:s?.yAxis?.labels?.rotation??0,colour:s?.yAxis?.labels?.colour??s?.yAxis?.colour??"#FFF8",fontSize:s?.yAxis?.labels?.fontSize??"0.8em"}},grid:{stroke:s?.grid?.stroke??"#FFF2"},guideline:{stroke:s?.guideline?.stroke??"#FFF8",width:s?.guideline?.width??1,points:{r:s?.guideline?.points?.r??2,fill:s?.guideline?.points?.fill??"white"}},lines:{width:s?.lines?.width??2}};const n=new b;new r(n,n);this.data=Object.entries(t).sort(((t,e)=>(e[1].at(-1)?.value?.valueOf()??0)-(t[1].at(-1)?.value?.valueOf()??0))).map((([t,e],s,i)=>({name:t,points:e,colour:W(this.styles.colourscheme,(s+1)/(i.length+1))}))),this.xaxis=R(this.data,"label"),this.yaxis=R(this.data,"value"),this.legendElem.update(this.data),this.shadowRoot.getElementById("title").textContent=e,this.updateActiveData(i)}draw(t,e){this.svgElem.innerHTML="",this.svgElem.appendChild(this.grid(this.styles.yAxis.width,0,t-this.styles.yAxis.width,e-this.styles.xAxis.height)),this.svgElem.appendChild(this.lines(this.styles.yAxis.width,0,t-this.styles.yAxis.width,e-this.styles.xAxis.height)),this.svgElem.appendChild(this.axes(0,0,t,e)),this.guideElem=this.guide(e-this.styles.xAxis.height),this.svgElem.appendChild(this.guideElem),this.selectionElem=this.selectionOverlay(this.styles.yAxis.width,0,t-this.styles.yAxis.width,e-this.styles.xAxis.height),this.svgElem.appendChild(this.selectionElem)}selectRange(t,e,s=!0){this.xaxis.range=new r(t,e),this.updateActiveData(!1),0==this.activeData.length&&(this.xaxis=R(this.data,"label"),this.updateActiveData(!1)),s&&this.draw(this.svgElem.clientWidth,this.svgElem.clientHeight)}updateActiveData(t=!0){const e=this.data.filter((({name:t})=>!this.legendElem.disabled.has(t))).map((({name:t,colour:e,points:s})=>({name:t,colour:e,points:s.filter((({label:t},e,s)=>this.xaxis.range.contains(t)||s[e-1]&&this.xaxis.range.contains(s[e-1].label)||s[e+1]&&this.xaxis.range.contains(s[e+1].label)))}))).filter((({points:t})=>t.length>0));this.activeData=e,this.yaxis=R(this.activeData,"value"),t&&this.draw(this.svgElem.clientWidth,this.svgElem.clientHeight)}axes(t,e,i,n){return s({class:"axes",transform:`translate(${t}, ${e})`},this.xAxis(this.styles.yAxis.width,n-this.styles.xAxis.height,i-this.styles.yAxis.width,this.styles.xAxis.height),this.yAxis(0,0,this.styles.yAxis.width,n-this.styles.xAxis.height))}xAxis=(t,e,a,l)=>s({class:"xaxis"},i({from:[t-this.styles.yAxis.strokeWidth,e+this.styles.xAxis.strokeWidth/2],to:[t+a,e+this.styles.xAxis.strokeWidth/2],stroke:this.styles.xAxis.colour,"stroke-width":this.styles.xAxis.strokeWidth}),...this.xaxis.getTicks(Math.floor(a/this.styles.xAxis.labels.spacing)).map((s=>n({class:"tick-label",x:t+this.xaxis.range.normalize(s)*a,y:e+20,transform:`rotate(${this.styles.xAxis.labels.rotation})`,"text-anchor":D(this.styles.xAxis.labels.rotation),style:`transform-origin: ${L(this.styles.xAxis.labels.rotation)}`,fill:this.styles.xAxis.labels.colour,"font-size":this.styles.xAxis.labels.fontSize},new Text(s.text)))));yAxis=(t,e,a,l)=>s({class:"yaxis"},i({from:[t+a-this.styles.yAxis.strokeWidth/2,e],to:[t+a-this.styles.yAxis.strokeWidth/2,e+l],stroke:this.styles.yAxis.colour,"stroke-width":this.styles.yAxis.strokeWidth}),...this.yaxis.getTicks(Math.floor(l/this.styles.yAxis.labels.spacing)).map((s=>n({class:"tick-label",x:t+a-10,y:e+(1-this.yaxis.range.normalize(s))*l+5,transform:`rotate(${this.styles.yAxis.labels.rotation})`,"text-anchor":"end",style:"transform-origin: right",fill:this.styles.yAxis.labels.colour,"font-size":this.styles.yAxis.labels.fontSize},new Text(s.text)))));grid=(t,e,n,a)=>s({class:"grid",transform:`translate(${t}, ${e})`},...this.xaxis.getTicks(Math.floor(n/this.styles.xAxis.labels.spacing)).map((t=>i({class:"gridline-v",from:[this.xaxis.range.normalize(t)*n,0],to:[this.xaxis.range.normalize(t)*n,a],stroke:this.styles.grid.stroke}))),...this.yaxis.getTicks(Math.floor(a/this.styles.yAxis.labels.spacing)).map((t=>i({class:"gridline-h",from:[0,(1-this.yaxis.range.normalize(t))*a],to:[n,(1-this.yaxis.range.normalize(t))*a],stroke:this.styles.grid.stroke}))));lines=(t,i,n,a)=>s({class:"lines",transform:`translate(${t}, ${i})`,"stroke-width":this.styles.lines.width},...this.activeData.map((({name:t,colour:s,points:i},l)=>((t,...s)=>e("polyline",{...t,points:t.points.map((([t,e])=>`${t},${e}`)).join(" ")},s))({"data-name":t,points:i.map((t=>[r.UNIT.clamp(this.xaxis.range.normalize(t.label))*n,r.UNIT.clamp(1-this.yaxis.range.normalize(t.value))*a])),fill:"none",stroke:s}))));selectionOverlay=(t,s,i,n)=>((t,...s)=>e("rect",t,s))({class:"selection-overlay",x:t,y:s,width:0,height:n,fill:"#46A4"});guide=t=>s({class:"guide",transform:`translate(${this.styles.yAxis.width}, 0)`,visibility:"hidden"},i({class:"guideline",from:[0,0],to:[0,t],stroke:this.styles.guideline.stroke,"stroke-width":this.styles.guideline.width}),...this.activeData.map((()=>((t,...s)=>e("circle",t,s))({class:"guide-point",cx:0,cy:0,r:this.styles.guideline.points.r,fill:this.styles.guideline.points.fill}))));onMouseDown(t){this.isWithinGraphArea(t.clientX,t.clientY)&&(this.selection={from:r.UNIT.clamp(this.canvasCoordRange.normalize(t.clientX-this.svgElem.getBoundingClientRect().left))})}onMouseUp(t){null!=this.selection.from&&this.selectRange(x(Math.min(this.selection.from,this.selection.to),this.xaxis.range,this.activeData),x(Math.max(this.selection.from,this.selection.to),this.xaxis.range,this.activeData)),this.selection={},this.selectionElem.setAttribute("width","0")}onMouseMove(t){const e=this.svgElem.getBoundingClientRect(),s=this.shadowRoot.host.getBoundingClientRect(),i=this.canvasCoordRange.normalize(t.clientX-e.left);this.isWithinGraphArea(t.clientX,t.clientY)?(this.handleSelection(i,t.buttons),this.handleHover(i,t.clientX-s.left,t.clientY-s.top,e)):(this.popupElem.hide(),this.guideElem.setAttribute("visibility","hidden"))}onMouseLeave(t){this.popupElem.hide(),this.guideElem.setAttribute("visibility","hidden")}handleSelection(t,e){1&~e?this.selection={}:this.selection.to=r.UNIT.clamp(t),null!=this.selection.from&&null!=this.selection.to?(this.selectionElem.setAttribute("x",this.canvasCoordRange.lerp(Math.min(this.selection.from,this.selection.to)).toString()),this.selectionElem.setAttribute("width",(this.canvasCoordRange.lerp(Math.abs(this.selection.to-this.selection.from))-this.styles.yAxis.width).toString())):this.selectionElem.setAttribute("width","0")}handleHover(t,e,s,i){const n=this.popupElem.update(e,s,t,this.xaxis.range,this.activeData);this.guideElem.querySelectorAll(".guide-point").forEach(((t,e)=>{t.setAttribute("cy",((1-this.yaxis.range.normalize(n[e].value))*(i.height-this.styles.xAxis.height)).toString())})),this.guideElem.setAttribute("transform",`translate(${e}, 0)`),this.guideElem.removeAttribute("visibility")}isWithinGraphArea(t,e){const s=this.svgElem.getBoundingClientRect();return new r(s.left+this.styles.yAxis.width,s.right).contains(t)&&new r(s.top,s.bottom-this.styles.xAxis.height).contains(e)}}customElements.define("svg-graph",F);const D=t=>t<0?"end":t>0?"start":"middle",L=t=>t<0?"right":t>0?"left":"center",W=(t,e)=>t[Math.floor(e*t.length)];function R(t,e){const s=t.filter((({points:t})=>t.length>0));if(0==s.length)return new w;const i=new r(d(s.map((({points:t})=>d(t,(t=>t[e].valueOf()))?.[e])),(t=>t.valueOf())),c(s.map((({points:t})=>c(t,(t=>t[e].valueOf()))?.[e])),(t=>t.valueOf())));return new i.min.axisType(i)}const H="\n:host {\n\tdisplay: flex;\n\tflex-direction: column;\n\theight: 100%;\n}\n:host([hidden]) {\n\tdisplay: none;\n}\n\nh1 {\n\tmargin: 0 0 0.5em 0;\n\tfont-size: 1.5em;\n\ttext-align: center;\n}\nh1:empty {\n\tdisplay: none;\n}\n\nsvg-popup {\n\tposition: absolute;\n\tpadding: 0.5em 0.6em;\n\twhite-space: nowrap;\n\tbackground: #2228;\n\tborder: 1px solid #FFF1;\n\tborder-radius: 10px;\n\tbox-shadow: 1px 2px 20px 0px #0008;\n\tbackdrop-filter: blur(20px);\n\tpointer-events: none; // prevent fast mouse movements from triggering mouseleave on svg\n}\nsvg-popup h3 {\n\tmargin: 0 0 0.6em 0;\n}\nsvg-popup p {\n\tmargin: 0.3em 0 0 0;\n}\nsvg-popup .name {\n\tfont-family: monospace;\n\tfont-size: 1.2em;\n\tfont-weight: bold;\n}\n\nsvg-legend {\n\tdisplay: flex;\n\tflex-wrap: wrap;\n\tjustify-content: center;\n\tmargin: 5px;\n}\nsvg-legend .legend-item {\n\tpadding: 0.25em 0.6em;\n\tborder: 1px solid transparent;\n\tborder-radius: 1em;\n}\nsvg-legend .legend-item:hover {\n\tbackground: #FFF1;\n\tborder: 1px solid #FFF1;\n\tbox-shadow: 1px 2px 5px 0px #0004;\n\tbackdrop-filter: blur(20px);\n\tcursor: pointer;\n}\nsvg-legend .legend-item.disabled {\n\topacity: 0.5;\n\ttext-decoration: line-through;\n}\n\n.swatch {\n\tdisplay: inline-block;\n\twidth: 0.75em;\n\theight: 0.75em;\n\tmargin-right: 0.5em;\n\tborder-radius: 50%;\n}\n\t\n.xaxis text, .yaxis text {\n\ttransform-box: fill-box;\n}";export{O as DateLabel,b as EmptyLabel,k as IntegerLabel,y as Label,S as MetricLabel,A as NumberLabel,z as TimeLabel,F as default};
//# sourceMappingURL=svgraph.js.map
