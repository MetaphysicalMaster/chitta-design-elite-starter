(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,38835,e=>{"use strict";var t=e.i(44180),a=e.i(4430),r=e.i(96996),o=e.i(15746),i=e.i(64556),l=e.i(21348);let n=`
  uniform float uTime;
  uniform float uFlow;     // 1 = full storm, eases toward calm as you scroll
  uniform vec2  uPointer;  // -1..1, gentle breeze deflection
  uniform float uPointerStr;

  attribute vec3 aOffset;   // base position in the field
  attribute vec3 aAxis;     // tumble axis (normalized)
  attribute float aPhase;   // per-petal time offset
  attribute float aSpeed;   // per-petal fall speed
  attribute float aScale;   // per-petal size
  attribute float aDepth;   // 0 = far, 1 = near (depth layer)
  attribute float aColorMix;// 0..1 along the sakura ramp

  varying vec2  vUv;
  varying float vDepth;
  varying float vColorMix;
  varying float vFade;

  // cheap rotation matrix about an arbitrary axis
  mat3 rotAxis(vec3 a, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat3(
      oc*a.x*a.x + c,      oc*a.x*a.y - a.z*s, oc*a.z*a.x + a.y*s,
      oc*a.x*a.y + a.z*s,  oc*a.y*a.y + c,     oc*a.y*a.z - a.x*s,
      oc*a.z*a.x - a.y*s,  oc*a.y*a.z + a.x*s, oc*a.z*a.z + c
    );
  }

  void main() {
    vUv = uv;
    vDepth = aDepth;
    vColorMix = aColorMix;

    // --- wind field: down-and-across drift, eased by uFlow ---
    float t = uTime * (0.35 + aSpeed * 0.55) * mix(0.45, 1.0, uFlow) + aPhase * 6.2831;

    // parallax: near petals fall faster + travel further across
    float par = mix(0.55, 1.4, aDepth);

    // vertical fall wraps within the field height (~ 16 units), so it loops.
    float fallH = 16.0;
    float fall = mod(aOffset.y - t * aSpeed * par, fallH) - fallH * 0.5;

    // lateral sway — a breeze that gusts; near petals sway wider.
    float sway = sin(t * 0.6 + aPhase * 10.0) * (0.6 * par)
               + cos(t * 0.27 + aOffset.x) * 0.35 * par;

    // pointer breeze — a soft, eased push in the cursor direction.
    vec2 breeze = uPointer * uPointerStr * (0.9 * par);

    vec3 pos = aOffset;
    pos.y = fall;
    pos.x += sway + breeze.x;
    pos.y += breeze.y * 0.5;
    pos.z += sin(t * 0.4 + aPhase * 4.0) * 0.4 * par; // depth wobble

    // --- flutter: each petal tumbles about its own axis ---
    float spin = t * (0.8 + aSpeed) + aPhase * 9.0;
    mat3 rot = rotAxis(normalize(aAxis), spin);
    // petal billows: slight non-uniform scale so it reads as a thin membrane
    vec3 local = position;
    local.x *= 1.0 + 0.12 * sin(spin * 1.3);
    vec3 vtx = rot * (local * aScale * mix(0.55, 1.25, aDepth));

    vec3 world = pos + vtx;

    // soft-focus fade for the far layer (bokeh) + edge fade near field bounds.
    float edge = smoothstep(8.0, 5.5, abs(fall));
    vFade = edge * mix(0.5, 1.0, aDepth);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
  }
`,s=`
  precision highp float;

  uniform vec3  uPale;
  uniform vec3  uSakura;
  uniform vec3  uDeep;
  uniform vec3  uPlum;
  uniform float uFlow;
  uniform bool  uBokeh;

  varying vec2  vUv;
  varying float vDepth;
  varying float vColorMix;
  varying float vFade;

  // signed-distance-ish petal silhouette in UV space (a notched almond).
  float petalMask(vec2 uv) {
    vec2 p = uv - vec2(0.5, 0.5);
    p.y *= 0.78;                 // squash into a petal proportion
    float r = length(p);
    // almond outline: narrower at the tip, with a soft top notch (sakura cleft)
    float body = smoothstep(0.5, 0.36, r);
    // notch at the top to suggest the cherry-blossom cleft
    float notch = smoothstep(0.0, 0.16, abs(uv.x - 0.5) - (0.5 - uv.y) * 0.5);
    float tipY = smoothstep(0.0, 0.12, uv.y);     // soften base
    return clamp(body * mix(0.65, 1.0, notch) * tipY, 0.0, 1.0);
  }

  void main() {
    float mask = petalMask(vUv);
    if (mask < 0.02) discard;

    // length-wise color: heart (plum/deep) at base → sakura → pale rim at tip.
    vec3 base = mix(uDeep, uSakura, smoothstep(0.0, 0.6, vUv.y));
    base = mix(base, uPale, smoothstep(0.55, 1.0, vUv.y));
    // per-petal ramp shift so the field has variety
    base = mix(base, uPlum, vColorMix * 0.35 * (1.0 - vUv.y));

    // gentle inner glow toward the heart
    float glow = smoothstep(0.5, 0.0, length(vUv - vec2(0.5, 0.32)));
    base += uPlum * glow * 0.08;

    // depth dims the far layer slightly; flow fades the whole field as it calms.
    float depthDim = mix(0.82, 1.0, vDepth);
    float alpha = mask * vFade * depthDim;

    // far-layer soft focus (bokeh): lift alpha edge softness on far petals.
    if (uBokeh) {
      float soft = mix(0.45, 1.0, vDepth);
      alpha *= mix(0.7, 1.0, soft);
    }

    // near petals stay denser; very-near calm keeps a tasteful translucency.
    alpha *= mix(0.78, 0.95, vDepth);

    gl_FragColor = vec4(base, alpha);
  }
`;function u({pointer:e,flowRef:a,lite:o}){let f=(0,i.useRef)(null),c=(0,i.useRef)({x:0,y:0,s:0}),p=(0,i.useRef)(1),h=o?1200:2600,{geometry:v,uniforms:d}=(0,i.useMemo)(()=>{let e=new l.InstancedBufferGeometry,t=new l.PlaneGeometry(1,1.35,1,1);e.index=t.index,e.attributes.position=t.attributes.position,e.attributes.uv=t.attributes.uv;let a=new Float32Array(3*h),r=new Float32Array(3*h),i=new Float32Array(h),n=new Float32Array(h),s=new Float32Array(h),u=new Float32Array(h),f=new Float32Array(h),c=1337,p=()=>{c|=0;let e=Math.imul((c=c+0x6d2b79f5|0)^c>>>15,1|c);return(((e=e+Math.imul(e^e>>>7,61|e)^e)^e>>>14)>>>0)/0x100000000};for(let e=0;e<h;e++){let t=p(),o=t<.34?.33*p():t<.7?.33+.34*p():.67+.33*p();u[e]=o;let l=9+7*o;a[3*e]=(p()-.5)*l,a[3*e+1]=(p()-.5)*16,a[3*e+2]=-4+7*o+(p()-.5)*1.5;let c=p()-.5,h=p()-.5,v=p()-.5,d=Math.hypot(c,h,v)||1;r[3*e]=c/d,r[3*e+1]=h/d,r[3*e+2]=v/d,i[e]=p(),n[e]=.45+.9*p(),s[e]=.16+.22*p(),f[e]=p()}return e.setAttribute("aOffset",new l.InstancedBufferAttribute(a,3)),e.setAttribute("aAxis",new l.InstancedBufferAttribute(r,3)),e.setAttribute("aPhase",new l.InstancedBufferAttribute(i,1)),e.setAttribute("aSpeed",new l.InstancedBufferAttribute(n,1)),e.setAttribute("aScale",new l.InstancedBufferAttribute(s,1)),e.setAttribute("aDepth",new l.InstancedBufferAttribute(u,1)),e.setAttribute("aColorMix",new l.InstancedBufferAttribute(f,1)),e.instanceCount=h,{geometry:e,uniforms:{uTime:{value:0},uFlow:{value:1},uPointer:{value:new l.Vector2(0,0)},uPointerStr:{value:0},uPale:{value:new l.Color("#f3dbe6")},uSakura:{value:new l.Color("#f0b9cf")},uDeep:{value:new l.Color("#e486a9")},uPlum:{value:new l.Color("#cf6d92")},uBokeh:{value:!o}}}},[h,o]);return(0,r.useFrame)(({clock:t},r)=>{let o=f.current;if(!o)return;let i=Math.min(r,1/30);o.uniforms.uTime.value=t.getElapsedTime();let l=e.current??{x:0,y:0,active:0},n=1-Math.pow(.0022,i);c.current.x+=(l.x-c.current.x)*n,c.current.y+=(l.y-c.current.y)*n,c.current.s+=(l.active-c.current.s)*Math.min(1,2.5*i),o.uniforms.uPointer.value.set(c.current.x,c.current.y),o.uniforms.uPointerStr.value=c.current.s;let s=a.current??1;p.current+=(s-p.current)*Math.min(1,1.6*i),o.uniforms.uFlow.value=p.current}),(0,t.jsx)("mesh",{geometry:v,frustumCulled:!1,children:(0,t.jsx)("shaderMaterial",{ref:f,vertexShader:n,fragmentShader:s,uniforms:d,transparent:!0,depthWrite:!1,depthTest:!0,side:l.DoubleSide,blending:l.NormalBlending})})}function f({children:e}){let a=(0,i.useRef)(null);return(0,r.useFrame)(({clock:e})=>{let t=a.current;if(!t)return;let r=e.getElapsedTime();t.rotation.z=.03*Math.sin(.08*r),t.position.x=.3*Math.sin(.05*r)}),(0,t.jsx)("group",{ref:a,children:e})}function c({lite:e}){let{gl:t}=(0,o.useThree)();return(0,i.useEffect)(()=>{t.setPixelRatio(Math.min(window.devicePixelRatio,e?1.5:2))},[t,e]),null}e.s(["default",0,function({lite:e=!1,flowRef:r}){let o=(0,i.useRef)({x:0,y:0,active:0}),l=(0,i.useRef)(null),[n,s]=(0,i.useState)(!0);return(0,i.useEffect)(()=>{let e=l.current;if(!e||"u"<typeof IntersectionObserver)return;let t=new IntersectionObserver(([e])=>s(e.isIntersecting),{rootMargin:"140px"});t.observe(e);let a=()=>s("visible"===document.visibilityState);return document.addEventListener("visibilitychange",a),()=>{t.disconnect(),document.removeEventListener("visibilitychange",a)}},[]),(0,t.jsx)("div",{ref:l,className:"absolute inset-0",onPointerMove:e=>{let t=e.currentTarget.getBoundingClientRect();o.current.x=(e.clientX-t.left)/t.width*2-1,o.current.y=-((e.clientY-t.top)/t.height*2-1),o.current.active=1},onPointerLeave:()=>{o.current.active=0},children:(0,t.jsxs)(a.Canvas,{frameloop:n?"always":"never",camera:{position:[0,0,9],fov:46},dpr:[1,2],gl:{antialias:!0,alpha:!0,powerPreference:"high-performance"},style:{position:"absolute",inset:0},children:[(0,t.jsx)(c,{lite:e}),(0,t.jsx)(f,{children:(0,t.jsx)(u,{pointer:o,flowRef:r,lite:e})})]})})}])},15922,e=>{e.n(e.i(38835))}]);