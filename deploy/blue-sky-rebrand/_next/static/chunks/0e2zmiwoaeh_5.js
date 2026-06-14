(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,43059,e=>{"use strict";var t=e.i(44180),o=e.i(1529),r=e.i(46648),l=e.i(26843),u=e.i(64556),i=e.i(21348);let n=`
  precision highp float;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,a=`
  precision highp float;

  uniform float uTime;
  uniform vec2  uRes;
  uniform vec2  uPointer;     // 0..1, smoothed
  uniform float uPointerStr;  // 0..1
  uniform float uIntro;       // 0..1 reveal on mount
  uniform float uScroll;      // 0..1 page-progress (deepens the journey)
  uniform vec3  uPlumDeep;
  uniform vec3  uPlum;
  uniform vec3  uMauve;
  uniform vec3  uRose;
  uniform vec3  uBlush;

  varying vec2 vUv;

  // --- value noise + fbm -------------------------------------------------
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += amp * noise(p);
      p = rot * p * 2.0 + 0.07;
      amp *= 0.55;
    }
    return v;
  }

  // Silk height-field: drifting folds with a left→right "current" (the journey).
  float silk(vec2 uv, float t) {
    vec2 q = uv * vec2(2.6, 2.0);
    // domain warp for that liquid-silk fold feel
    vec2 warp = vec2(
      fbm(q + vec2(t * 0.06, t * 0.03)),
      fbm(q + vec2(-t * 0.04, t * 0.05) + 5.2)
    );
    float h = fbm(q + warp * 1.6 + vec2(t * 0.10, 0.0)); // current flows +x
    h += 0.35 * fbm(q * 2.0 - vec2(t * 0.08, t * 0.02));
    return h;
  }

  void main() {
    vec2 uv = vUv;
    // correct for aspect so folds aren't stretched
    vec2 auv = uv;
    auv.x *= uRes.x / max(uRes.y, 1.0);

    float t = uTime * 0.5;

    // Sample the height-field + finite-difference normal for soft lighting.
    float e = 0.0016 * (uRes.y > 0.0 ? 1.0 : 1.0);
    float h  = silk(auv, t);
    float hx = silk(auv + vec2(e, 0.0), t);
    float hy = silk(auv + vec2(0.0, e), t);
    vec3 n = normalize(vec3((h - hx), (h - hy), e * 9.0));

    // Soft key light from upper-left; a fill from lower-right keeps shadows alive.
    vec3 key = normalize(vec3(-0.5, 0.7, 0.8));
    vec3 fill = normalize(vec3(0.6, -0.4, 0.7));
    float dKey = max(dot(n, key), 0.0);
    float dFill = max(dot(n, fill), 0.0) * 0.4;
    float lit = dKey + dFill;
    // specular sheen on the fold crests (the satin highlight)
    float spec = pow(dKey, 22.0) * 0.9;

    // Color ramp: valleys → deep plum, mid → plum/mauve, crests → rose/blush.
    float band = clamp(h * 1.15 + lit * 0.5, 0.0, 1.0);
    vec3 col = mix(uPlumDeep, uPlum, smoothstep(0.0, 0.45, band));
    col = mix(col, uMauve, smoothstep(0.35, 0.72, band));
    col = mix(col, uRose, smoothstep(0.68, 0.95, band));
    col += uBlush * spec;

    // The scroll deepens the field toward the plum core as the journey descends.
    col = mix(col, uPlumDeep, uScroll * 0.18);

    // A gentle left→right luminous "guide" gradient (toward revealed light).
    float guide = smoothstep(0.0, 1.0, uv.x);
    col += uMauve * guide * 0.06;

    // Pointer bloom — a soft halo of light where the guest looks.
    vec2 pa = uPointer;
    pa.x *= uRes.x / max(uRes.y, 1.0);
    float pd = distance(auv, pa);
    float halo = smoothstep(0.5, 0.0, pd) * uPointerStr;
    col += mix(uRose, uBlush, 0.5) * halo * 0.5;

    // Vignette so hero copy on the left stays legible.
    float vig = smoothstep(1.25, 0.25, distance(uv, vec2(0.62, 0.5)));
    col *= 0.72 + 0.28 * vig;

    // Intro reveal: rise out of the plum void.
    col = mix(uPlumDeep, col, smoothstep(0.0, 1.0, uIntro));

    // subtle filmic lift
    col = pow(col, vec3(0.92));
    gl_FragColor = vec4(col, 1.0);
  }
`;function s({pointer:e,scroll:o,active:c}){let v=(0,u.useRef)(null),f=(0,u.useRef)(0),h=(0,u.useRef)({x:.5,y:.5,s:0}),{size:m,viewport:d}=(0,l.useThree)(),p=(0,u.useMemo)(()=>({uTime:{value:0},uRes:{value:new i.Vector2(1,1)},uPointer:{value:new i.Vector2(.5,.5)},uPointerStr:{value:0},uIntro:{value:0},uScroll:{value:0},uPlumDeep:{value:new i.Color("#2a1430")},uPlum:{value:new i.Color("#5a3158")},uMauve:{value:new i.Color("#a06b94")},uRose:{value:new i.Color("#c99aa0")},uBlush:{value:new i.Color("#e8c9cf")}}),[]);return(0,r.useFrame)(({clock:t},r)=>{let l=v.current;if(!l||!1===c.current)return;let u=Math.min(r,1/30);l.uniforms.uTime.value=t.getElapsedTime(),l.uniforms.uRes.value.set(m.width,m.height),f.current+=(1-f.current)*Math.min(1,.7*u),l.uniforms.uIntro.value=f.current;let i=e.current??{x:.5,y:.5,s:0},n=1-Math.pow(.0025,u);h.current.x+=(i.x-h.current.x)*n,h.current.y+=(i.y-h.current.y)*n,h.current.s+=(i.s-h.current.s)*Math.min(1,3*u),l.uniforms.uPointer.value.set(h.current.x,h.current.y),l.uniforms.uPointerStr.value=h.current.s;let a=o.current??0;l.uniforms.uScroll.value+=(a-l.uniforms.uScroll.value)*Math.min(1,4*u)}),(0,t.jsxs)("mesh",{scale:[d.width,d.height,1],frustumCulled:!1,children:[(0,t.jsx)("planeGeometry",{args:[1,1]}),(0,t.jsx)("shaderMaterial",{ref:v,vertexShader:n,fragmentShader:a,uniforms:p,depthWrite:!1,depthTest:!1})]})}e.s(["default",0,function({lite:e=!1}){let r=(0,u.useRef)({x:.5,y:.5,s:0}),l=(0,u.useRef)(0),i=(0,u.useRef)(!0),n=(0,u.useRef)(null),a=(0,u.useRef)(null);return(0,u.useEffect)(()=>()=>a.current?.(),[]),(0,t.jsx)("div",{ref:n,className:"absolute inset-0",onPointerMove:e=>{let t=e.currentTarget.getBoundingClientRect();r.current.x=(e.clientX-t.left)/t.width,r.current.y=1-(e.clientY-t.top)/t.height,r.current.s=1},onPointerLeave:()=>{r.current.s=0},children:(0,t.jsx)(o.Canvas,{orthographic:!0,camera:{zoom:1,position:[0,0,1]},dpr:e?[1,1.5]:[1,2],gl:{antialias:!1,alpha:!1,powerPreference:"high-performance"},style:{position:"absolute",inset:0},onCreated:()=>{let e=n.current;if(!e)return;let t=!0,o=()=>{i.current=t&&!document.hidden},r=new IntersectionObserver(([e])=>{t=e.isIntersecting,o()},{threshold:.01});r.observe(e);let u=()=>o(),s=()=>{let e=Math.max(1,window.innerHeight);l.current=Math.min(1,Math.max(0,window.scrollY/(1.2*e)))};s(),document.addEventListener("visibilitychange",u),window.addEventListener("scroll",s,{passive:!0}),a.current=()=>{r.disconnect(),document.removeEventListener("visibilitychange",u),window.removeEventListener("scroll",s)}},children:(0,t.jsx)(s,{pointer:r,scroll:l,active:i})})})}],43059)},71156,e=>{e.n(e.i(43059))}]);