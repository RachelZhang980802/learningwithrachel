/* Wind has compact support inside the figure; the entire background stays still. */
(function(global){
'use strict';
const VS=`attribute vec2 position; varying vec2 vUv; void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const FS=`precision highp float;
uniform sampler2D painting;
uniform float phase;
uniform float strength;
uniform vec2 crop;
uniform vec2 focus;
varying vec2 vUv;
float g(vec2 p,vec4 e){vec2 q=(p-e.xy)/e.zw;return exp(-2.*dot(q,q))*(1.-smoothstep(.72,1.,length(q)));}
float pin(vec2 p,vec4 e){return 1.-smoothstep(.7,1.2,length((p-e.xy)/e.zw));}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
 vec2 uv=(vec2(vUv.x,1.-vUv.y)-.5)*crop+focus;
 vec2 p=uv*vec2(1672.,941.);
 float locked=max(max(pin(p,vec4(1105.,221.,68.,80.)),pin(p,vec4(1186.,176.,56.,69.))),max(pin(p,vec4(988.,550.,34.,38.)),pin(p,vec4(1145.,875.,93.,65.))));
 float veil=max(max(g(p,vec4(1027.,99.,166.,95.)),g(p,vec4(924.,220.,61.,134.))),max(g(p,vec4(1319.,337.,78.,100.)),g(p,vec4(986.,433.,55.,38.))))*(1.-locked);
 float hair=max(g(p,vec4(962.,322.,63.,47.)),g(p,vec4(1214.,369.,69.,67.)))*(1.-locked);
 float skirt=max(g(p,vec4(1131.,676.,61.,151.)),g(p,vec4(1218.,735.,33.,77.)))*(1.-locked)*smoothstep(.50,.67,uv.y);
 float paint=max(veil,max(hair,skirt));
 // Exactly the same source pixel on every frame outside the bounded wind regions.
 if(paint<=0.){gl_FragColor=texture2D(painting,uv);return;}
 float dx=veil*(sin(phase+uv.y*10.)*17.+sin(phase*2.+uv.x*15.)*4.)+hair*(sin(phase*2.+uv.y*27.)*8.+sin(phase+uv.x*35.)*4.)+skirt*(sin(phase+uv.y*15.)*15.+sin(phase*2.+uv.y*31.-uv.x*9.)*4.);
 float dy=veil*(cos(phase+uv.y*7.)*7.+sin(phase*2.-uv.x*8.)*2.5)+hair*sin(phase*2.+uv.x*23.)*3.2+skirt*(cos(phase+uv.x*9.)*4.+sin(phase*2.+uv.y*18.)*1.5);
 vec2 flow=vec2(dx/1672.,dy/941.)*strength;
 vec2 sampleAt=clamp(uv+flow,vec2(.0001),vec2(.9999));
 vec3 color=texture2D(painting,sampleAt).rgb;
 vec2 cells=uv*vec2(360.,202.5);vec2 cell=floor(cells);float rnd=hash(cell);
 vec2 center=vec2(.25+.5*rnd,.25+.5*hash(cell+13.7));
 vec2 d=(fract(cells)-center-vec2(sin(phase+rnd*6.)*.13,cos(phase*2.+rnd*6.)*.07));
 float splat=exp(-dot(d*vec2(3.8,6.),d*vec2(3.8,6.)));
 float alpha=splat*paint*step(.64,rnd)*.11*min(strength,1.5)*(1.-locked);
 vec3 pigment=texture2D(painting,clamp(sampleAt+vec2(.0008*sin(phase+rnd*6.),.0005*cos(phase+rnd*6.)),vec2(0.),vec2(1.))).rgb;
 gl_FragColor=vec4(mix(color,pigment,alpha),1.);
}`;
global.SeaMotion=function(canvas,url,options={}){
 const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=options.autoplay===true?false:reduce.matches,wind=options.strength??1,ready=false,destroyed=false,phase=0,last=0,drawn=0,handle;
 if(!gl){canvas.hidden=true;return{supported:false,setPaused(){},setStrength(){},destroy(){}};}
 function shader(type,code){const s=gl.createShader(type);gl.shaderSource(s,code);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
 let program;
 try{program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,VS));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,FS));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Unable to link the painting shader');}catch(error){canvas.hidden=true;return{supported:false,setPaused(){},setStrength(){},destroy(){}};}
 gl.useProgram(program);
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
 const attr=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
 const uniforms={phase:gl.getUniformLocation(program,'phase'),strength:gl.getUniformLocation(program,'strength'),crop:gl.getUniformLocation(program,'crop'),focus:gl.getUniformLocation(program,'focus')};
 const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
 const img=new Image();
 img.crossOrigin='anonymous';
 img.onload=()=>{gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);ready=true;resize();canvas.classList.add('motion-ready');options.onReady?.();};
 img.onerror=()=>{canvas.hidden=true;options.onError?.();};img.src=url;
 function resize(){const box=canvas.getBoundingClientRect();if(!box.width||!box.height)return;const ratio=Math.min(devicePixelRatio||1,1.6,1700/box.width);canvas.width=Math.round(box.width*ratio);canvas.height=Math.round(box.height*ratio);gl.viewport(0,0,canvas.width,canvas.height);const display=box.width/box.height;const image=1672/941;const cropX=Math.min(1,display/image);gl.uniform2f(uniforms.crop,cropX,display>image?image/display:1);gl.uniform2f(uniforms.focus,display<=1?.7-.2*cropX:.5,.5);draw();}
 function draw(){if(!ready||destroyed||gl.isContextLost())return;gl.uniform1f(uniforms.phase,phase);gl.uniform1f(uniforms.strength,wind);gl.drawArrays(gl.TRIANGLES,0,6);}
 function tick(now){if(destroyed)return;handle=requestAnimationFrame(tick);const dt=last?Math.min(now-last,100):0;last=now;const visible=!document.hidden&&(!options.isVisible||options.isVisible());if(!paused&&visible){phase=(phase+dt*Math.PI*2/8000)%(Math.PI*2);if(now-drawn>=1000/30){draw();drawn=now;}}}
 const observer=new ResizeObserver(resize);observer.observe(canvas);handle=requestAnimationFrame(tick);
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();canvas.style.opacity='0';});
 const api={supported:true,get paused(){return paused;},setPaused(value){paused=!!value;if(!paused)draw();},setStrength(value){wind=Math.max(0,Math.min(2,Number(value)));draw();},destroy(){destroyed=true;cancelAnimationFrame(handle);observer.disconnect();gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);}};
 if(options.autoplay!==true)reduce.addEventListener('change',()=>api.setPaused(reduce.matches));return api;
};
})(window);
