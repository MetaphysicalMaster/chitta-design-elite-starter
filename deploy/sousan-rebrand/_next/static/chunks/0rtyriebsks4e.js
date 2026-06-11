(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,38835,e=>{"use strict";var t=e.i(44180),a=e.i(1529),o=e.i(46648),r=e.i(26843),i=e.i(64556),l=e.i(21348);let s=`
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
`,n=`
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

  // Cherry-blossom petal silhouette in UV space: a teardrop that is narrow at
  // the base (bottom, v=0) and wide at the top (v=1), with the signature sakura
  // V-CLEFT notched into the top edge. Built from a width profile + a notch carve.
  float petalMask(vec2 uv) {
    float x = uv.x - 0.5;          // -0.5..0.5 across
    float y = uv.y;                // 0 (base) .. 1 (tip)

    // Width profile: pinched at the base, swelling to its widest near the top,
    // then easing back so the top corners are rounded (egg-shaped petal).
    float w = sin(clamp(y, 0.0, 1.0) * 3.14159) * 0.34   // round body
            + y * 0.18;                                   // bias width toward top
    float body = smoothstep(w, w - 0.06, abs(x));         // inside the outline

    // base rounding so the bottom point isn't a hard spike
    float baseSoft = smoothstep(0.0, 0.1, y);

    // the sakura cleft: carve a small V-notch DOWN into the top edge at center.
    float cleftDepth = 0.2;                                // how deep the notch
    float cleftWidth = 0.16;                               // how wide
    float notchEdge = 1.0 - cleftDepth + (cleftWidth - abs(x)) * (cleftDepth / cleftWidth);
    float topCut = (abs(x) < cleftWidth)
      ? smoothstep(notchEdge + 0.03, notchEdge, y)         // cut the V out
      : 1.0;
    float topSoft = smoothstep(1.02, 0.96, y);             // soften the very top

    return clamp(body * baseSoft * topCut * topSoft, 0.0, 1.0);
  }

  void main() {
    float mask = petalMask(vUv);
    if (mask < 0.02) discard;

    // length-wise color: a SAKURA-dominant petal. Body sits in sakura, easing to
    // a pale rim at the tip; only the deepest base hints the blossom heart. This
    // keeps petals reading pink over the black field rather than maroon.
    vec3 base = mix(uDeep, uSakura, smoothstep(0.0, 0.32, vUv.y));
    base = mix(base, uPale, smoothstep(0.5, 1.0, vUv.y));
    // per-petal ramp shift toward the plum heart — applied to the MINORITY of
    // petals (colorMix is cubed at generation) and only near the very base.
    base = mix(base, uPlum, vColorMix * 0.3 * (1.0 - smoothstep(0.0, 0.45, vUv.y)));

    // additive sakura rim — lift the petal edges toward pale pink so the
    // silhouette glows softly over the sumi-black field instead of crushing to a
    // dark maroon edge under NormalBlending. Strongest at the outline, fades in.
    float rim = smoothstep(0.0, 0.12, mask) * (1.0 - smoothstep(0.12, 0.4, mask));
    base += uPale * rim * 0.22;

    // gentle inner glow toward the heart
    float glow = smoothstep(0.5, 0.0, length(vUv - vec2(0.5, 0.32)));
    base += uSakura * glow * 0.06;

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
`;function u({pointer:e,flowRef:a,lite:r}){let f=(0,i.useRef)(null),c=(0,i.useRef)({x:0,y:0,s:0}),h=(0,i.useRef)(1),p=r?1200:2600,{geometry:d,uniforms:m}=(0,i.useMemo)(()=>{let e=new l.InstancedBufferGeometry,t=new l.PlaneGeometry(1,1.35,1,1);e.index=t.index,e.attributes.position=t.attributes.position,e.attributes.uv=t.attributes.uv;let a=new Float32Array(3*p),o=new Float32Array(3*p),i=new Float32Array(p),s=new Float32Array(p),n=new Float32Array(p),u=new Float32Array(p),f=new Float32Array(p),c=1337,h=()=>{c|=0;let e=Math.imul((c=c+0x6d2b79f5|0)^c>>>15,1|c);return(((e=e+Math.imul(e^e>>>7,61|e)^e)^e>>>14)>>>0)/0x100000000};for(let e=0;e<p;e++){let t=h(),r=t<.34?.33*h():t<.7?.33+.34*h():.67+.33*h();u[e]=r;let l=9+7*r;a[3*e]=(h()-.5)*l,a[3*e+1]=(h()-.5)*16,a[3*e+2]=-4+7*r+(h()-.5)*1.5;let c=h()-.5,p=h()-.5,d=h()-.5,m=Math.hypot(c,p,d)||1;o[3*e]=c/m,o[3*e+1]=p/m,o[3*e+2]=d/m,i[e]=h(),s[e]=.45+.9*h(),n[e]=.16+.22*h(),f[e]=Math.pow(h(),3)}return e.setAttribute("aOffset",new l.InstancedBufferAttribute(a,3)),e.setAttribute("aAxis",new l.InstancedBufferAttribute(o,3)),e.setAttribute("aPhase",new l.InstancedBufferAttribute(i,1)),e.setAttribute("aSpeed",new l.InstancedBufferAttribute(s,1)),e.setAttribute("aScale",new l.InstancedBufferAttribute(n,1)),e.setAttribute("aDepth",new l.InstancedBufferAttribute(u,1)),e.setAttribute("aColorMix",new l.InstancedBufferAttribute(f,1)),e.instanceCount=p,{geometry:e,uniforms:{uTime:{value:0},uFlow:{value:1},uPointer:{value:new l.Vector2(0,0)},uPointerStr:{value:0},uPale:{value:new l.Color("#f7d2d4")},uSakura:{value:new l.Color("#f0a59f")},uDeep:{value:new l.Color("#ec6f68")},uPlum:{value:new l.Color("#e44b48")},uBokeh:{value:!r}}}},[p,r]);return(0,o.useFrame)(({clock:t},o)=>{let r=f.current;if(!r)return;let i=Math.min(o,1/30);r.uniforms.uTime.value=t.getElapsedTime();let l=e.current??{x:0,y:0,active:0},s=1-Math.pow(.0022,i);c.current.x+=(l.x-c.current.x)*s,c.current.y+=(l.y-c.current.y)*s,c.current.s+=(l.active-c.current.s)*Math.min(1,2.5*i),r.uniforms.uPointer.value.set(c.current.x,c.current.y),r.uniforms.uPointerStr.value=c.current.s;let n=a.current??1;h.current+=(n-h.current)*Math.min(1,1.6*i),r.uniforms.uFlow.value=h.current}),(0,t.jsx)("mesh",{geometry:d,frustumCulled:!1,children:(0,t.jsx)("shaderMaterial",{ref:f,vertexShader:s,fragmentShader:n,uniforms:m,transparent:!0,depthWrite:!1,depthTest:!0,side:l.DoubleSide,blending:l.NormalBlending})})}function f({children:e}){let a=(0,i.useRef)(null);return(0,o.useFrame)(({clock:e})=>{let t=a.current;if(!t)return;let o=e.getElapsedTime();t.rotation.z=.03*Math.sin(.08*o),t.position.x=.3*Math.sin(.05*o)}),(0,t.jsx)("group",{ref:a,children:e})}function c({lite:e}){let{gl:t}=(0,r.useThree)();return(0,i.useEffect)(()=>{t.setPixelRatio(Math.min(window.devicePixelRatio,e?1.5:2))},[t,e]),null}e.s(["default",0,function({lite:e=!1,flowRef:o}){let r=(0,i.useRef)({x:0,y:0,active:0}),l=(0,i.useRef)(null),[s,n]=(0,i.useState)(!0);return(0,i.useEffect)(()=>{let e=l.current;if(!e||"u"<typeof IntersectionObserver)return;let t=new IntersectionObserver(([e])=>n(e.isIntersecting),{rootMargin:"140px"});t.observe(e);let a=()=>n("visible"===document.visibilityState);return document.addEventListener("visibilitychange",a),()=>{t.disconnect(),document.removeEventListener("visibilitychange",a)}},[]),(0,t.jsx)("div",{ref:l,className:"absolute inset-0",onPointerMove:e=>{let t=e.currentTarget.getBoundingClientRect();r.current.x=(e.clientX-t.left)/t.width*2-1,r.current.y=-((e.clientY-t.top)/t.height*2-1),r.current.active=1},onPointerLeave:()=>{r.current.active=0},children:(0,t.jsxs)(a.Canvas,{frameloop:s?"always":"never",camera:{position:[0,0,9],fov:46},dpr:[1,2],gl:{antialias:!0,alpha:!0,powerPreference:"high-performance"},style:{position:"absolute",inset:0},children:[(0,t.jsx)(c,{lite:e}),(0,t.jsx)(f,{children:(0,t.jsx)(u,{pointer:r,flowRef:o,lite:e})})]})})}])},15922,e=>{e.n(e.i(38835))}]);