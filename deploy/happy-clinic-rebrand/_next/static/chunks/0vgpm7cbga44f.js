(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,38835,e=>{"use strict";var t=e.i(44180),a=e.i(1529),r=e.i(46648),o=e.i(26843),i=e.i(64556),s=e.i(21348),n=e.i(88287);let l=`
  uniform float uTime;
  uniform float uFlow;     // 1 = full storm, eases toward calm as you scroll
  uniform vec2  uPointer;  // -1..1, gentle breeze deflection
  uniform float uPointerStr;
  uniform float uGust;     // 0..1 scroll-wind strength (fast scroll = gust)
  uniform float uSweep;    // signed scroll-wind impulse (direction of travel)

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

    // lateral sway — a breeze that gusts; near petals sway wider, and the
    // scroll-gust widens everyone's arc (the wind leaning into the field).
    float sway = (sin(t * 0.6 + aPhase * 10.0) * (0.6 * par)
               + cos(t * 0.27 + aOffset.x) * 0.35 * par)
               * (1.0 + uGust * 1.4);

    // pointer breeze — a soft, eased push in the cursor direction.
    vec2 breeze = uPointer * uPointerStr * (0.9 * par);

    vec3 pos = aOffset;
    pos.y = fall;
    pos.x += sway + breeze.x;
    pos.y += breeze.y * 0.5;
    pos.z += sin(t * 0.4 + aPhase * 4.0) * 0.4 * par; // depth wobble

    // scroll-wind sweep — the visitor's own motion is the wind. Scrolling down
    // lifts the field past the eye and shears it across (a diagonal gust);
    // scrolling up reverses it. Near petals travel furthest, so the parallax
    // depth holds even mid-gust. Per-petal phase keeps the sweep organic.
    float swayBias = 0.85 + 0.3 * sin(aPhase * 12.566);
    pos.y += uSweep * (1.5 * par) * swayBias;
    pos.x -= uSweep * (0.7 * par) * swayBias;

    // --- flutter: each petal tumbles about its own axis ---
    float spin = t * (0.8 + aSpeed) + aPhase * 9.0;
    mat3 rot = rotAxis(normalize(aAxis), spin);
    // petal billows: slight non-uniform scale so it reads as a thin membrane;
    // a gust deepens the billow — petals caught broadside by the wind.
    vec3 local = position;
    local.x *= 1.0 + (0.12 + 0.1 * uGust) * sin(spin * 1.3);
    vec3 vtx = rot * (local * aScale * mix(0.55, 1.25, aDepth));

    vec3 world = pos + vtx;

    // soft-focus fade for the far layer (bokeh) + edge fade near field bounds.
    float edge = smoothstep(8.0, 5.5, abs(fall));
    vFade = edge * mix(0.5, 1.0, aDepth);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
  }
`,u=`
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
`;function f({pointer:e,flowRef:a,lite:o}){let c=(0,i.useRef)(null),h=(0,i.useRef)({x:0,y:0,s:0}),p=(0,i.useRef)(1),d=(0,i.useRef)(0),m=(0,i.useRef)(0),v=(0,i.useRef)(0),w=o?1200:2600,{geometry:b,uniforms:y}=(0,i.useMemo)(()=>{let e=new s.InstancedBufferGeometry,t=new s.PlaneGeometry(1,1.35,1,1);e.index=t.index,e.attributes.position=t.attributes.position,e.attributes.uv=t.attributes.uv;let a=new Float32Array(3*w),r=new Float32Array(3*w),i=new Float32Array(w),n=new Float32Array(w),l=new Float32Array(w),u=new Float32Array(w),f=new Float32Array(w),c=1337,h=()=>{c|=0;let e=Math.imul((c=c+0x6d2b79f5|0)^c>>>15,1|c);return(((e=e+Math.imul(e^e>>>7,61|e)^e)^e>>>14)>>>0)/0x100000000};for(let e=0;e<w;e++){let t=h(),o=t<.34?.33*h():t<.7?.33+.34*h():.67+.33*h();u[e]=o;let s=9+7*o;a[3*e]=(h()-.5)*s,a[3*e+1]=(h()-.5)*16,a[3*e+2]=-4+7*o+(h()-.5)*1.5;let c=h()-.5,p=h()-.5,d=h()-.5,m=Math.hypot(c,p,d)||1;r[3*e]=c/m,r[3*e+1]=p/m,r[3*e+2]=d/m,i[e]=h(),n[e]=.45+.9*h(),l[e]=.16+.22*h(),f[e]=Math.pow(h(),3)}return e.setAttribute("aOffset",new s.InstancedBufferAttribute(a,3)),e.setAttribute("aAxis",new s.InstancedBufferAttribute(r,3)),e.setAttribute("aPhase",new s.InstancedBufferAttribute(i,1)),e.setAttribute("aSpeed",new s.InstancedBufferAttribute(n,1)),e.setAttribute("aScale",new s.InstancedBufferAttribute(l,1)),e.setAttribute("aDepth",new s.InstancedBufferAttribute(u,1)),e.setAttribute("aColorMix",new s.InstancedBufferAttribute(f,1)),e.instanceCount=w,{geometry:e,uniforms:{uTime:{value:0},uFlow:{value:1},uGust:{value:0},uSweep:{value:0},uPointer:{value:new s.Vector2(0,0)},uPointerStr:{value:0},uPale:{value:new s.Color("#f7d2d4")},uSakura:{value:new s.Color("#f0a59f")},uDeep:{value:new s.Color("#ec6f68")},uPlum:{value:new s.Color("#e44b48")},uBokeh:{value:!o}}}},[w,o]);return(0,r.useFrame)((t,r)=>{let o=c.current;if(!o)return;let i=Math.min(r,1/30),s=n.windBus.velocity,l=Math.min(1,Math.abs(s)/55),u=l>m.current?Math.min(1,7*i):Math.min(1,1.15*i);m.current+=(l-m.current)*u;let f=Math.max(-1,Math.min(1,s/70));v.current+=(f-v.current)*Math.min(1,4.5*i),d.current+=i*(1+2.4*m.current),n.windBus.velocity*=Math.exp(-(3.2*i)),n.windBus.gust=m.current,o.uniforms.uTime.value=d.current,o.uniforms.uGust.value=m.current,o.uniforms.uSweep.value=v.current;let w=e.current??{x:0,y:0,active:0},b=1-Math.pow(.0022,i);h.current.x+=(w.x-h.current.x)*b,h.current.y+=(w.y-h.current.y)*b,h.current.s+=(w.active-h.current.s)*Math.min(1,2.5*i),o.uniforms.uPointer.value.set(h.current.x,h.current.y),o.uniforms.uPointerStr.value=h.current.s;let y=a.current??1;p.current+=(y-p.current)*Math.min(1,1.6*i),o.uniforms.uFlow.value=p.current}),(0,t.jsx)("mesh",{geometry:b,frustumCulled:!1,children:(0,t.jsx)("shaderMaterial",{ref:c,vertexShader:l,fragmentShader:u,uniforms:y,transparent:!0,depthWrite:!1,depthTest:!0,side:s.DoubleSide,blending:s.NormalBlending})})}function c({children:e}){let a=(0,i.useRef)(null),o=(0,i.useRef)(0);return(0,r.useFrame)(({clock:e},t)=>{let r=a.current;if(!r)return;let i=e.getElapsedTime(),s=Math.min(t,1/30);o.current+=(n.windBus.gust-o.current)*Math.min(1,2.5*s),r.rotation.z=.03*Math.sin(.08*i)-.055*o.current,r.position.x=.3*Math.sin(.05*i)}),(0,t.jsx)("group",{ref:a,children:e})}function h({lite:e}){let{gl:t}=(0,o.useThree)();return(0,i.useEffect)(()=>{t.setPixelRatio(Math.min(window.devicePixelRatio,e?1.5:2))},[t,e]),null}e.s(["default",0,function({lite:e=!1,flowRef:r}){let o=(0,i.useRef)({x:0,y:0,active:0}),s=(0,i.useRef)(null),[n,l]=(0,i.useState)(!0);return(0,i.useEffect)(()=>{let e=s.current;if(!e||"u"<typeof IntersectionObserver)return;let t=new IntersectionObserver(([e])=>l(e.isIntersecting),{rootMargin:"140px"});t.observe(e);let a=()=>l("visible"===document.visibilityState);return document.addEventListener("visibilitychange",a),()=>{t.disconnect(),document.removeEventListener("visibilitychange",a)}},[]),(0,t.jsx)("div",{ref:s,className:"absolute inset-0",onPointerMove:e=>{let t=e.currentTarget.getBoundingClientRect();o.current.x=(e.clientX-t.left)/t.width*2-1,o.current.y=-((e.clientY-t.top)/t.height*2-1),o.current.active=1},onPointerLeave:()=>{o.current.active=0},children:(0,t.jsxs)(a.Canvas,{frameloop:n?"always":"never",camera:{position:[0,0,9],fov:46},dpr:[1,2],gl:{antialias:!0,alpha:!0,powerPreference:"high-performance"},style:{position:"absolute",inset:0},children:[(0,t.jsx)(h,{lite:e}),(0,t.jsx)(c,{children:(0,t.jsx)(f,{pointer:o,flowRef:r,lite:e})})]})})}])},15922,e=>{e.n(e.i(38835))}]);