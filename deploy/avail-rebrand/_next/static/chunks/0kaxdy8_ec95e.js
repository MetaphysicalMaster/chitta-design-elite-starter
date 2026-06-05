(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,17866,e=>{"use strict";var t=e.i(73411);e.s(["extend",()=>t.e])},45621,e=>{"use strict";var t=e.i(44180),r=e.i(4430),o=e.i(96996),i=e.i(15746),a=e.i(36939),n=e.i(43050),s=e.i(64556),l=e.i(21348);let u=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`,c=`
  precision highp float;

  varying vec2 vUv;

  uniform float u_time;
  uniform vec2  u_resolution;
  uniform vec2  u_pointer;     // -1..1
  uniform float u_scroll;      // 0..1 hero scroll progress (parallax)
  uniform float u_intensity;   // mount fade-in 0..1
  uniform vec3  u_night0;       // top of sky
  uniform vec3  u_night1;       // horizon sky
  uniform vec3  u_violet;
  uniform vec3  u_magenta;
  uniform vec3  u_teal;
  uniform vec3  u_cyan;
  uniform vec3  u_ridge;

  // ---- noise toolkit ----
  float hash(vec2 p){
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float fbm(vec2 p){
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++){
      v += amp * noise(p);
      p *= 2.02;
      amp *= 0.5;
    }
    return v;
  }

  // Rockies ridge silhouette height at horizontal coord x (0..1).
  float ridgeHeight(float x){
    // layered low-frequency noise → jagged but believable peak line.
    float h = 0.0;
    h += 0.06 * noise(vec2(x * 3.0, 7.0));
    h += 0.05 * noise(vec2(x * 6.0, 13.0));
    h += 0.03 * noise(vec2(x * 12.0, 21.0));
    h += 0.018 * noise(vec2(x * 24.0, 31.0));
    return h * 1.15 + 0.05;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);

    // ---- night sky base (vertical) ----
    vec3 col = mix(u_night1, u_night0, smoothstep(0.0, 1.0, uv.y));

    // faint star dusting in the upper sky
    float stars = step(0.9975, hash(floor(uv * vec2(420.0, 320.0))));
    col += stars * smoothstep(0.35, 1.0, uv.y) * 0.5;

    // ---- aurora curtains ----
    // parallax: scroll pushes the aurora up + softens it; cursor sways it.
    float par = u_scroll * 0.22;
    vec2 ap = vec2(uv.x * aspect, uv.y);
    ap.x += u_pointer.x * 0.06;

    // domain-warp the sampling coords so curtains ripple like real aurora.
    float t = u_time * 0.06;
    vec2 warp = vec2(
      fbm(ap * vec2(1.6, 2.2) + vec2(t, t * 0.5)),
      fbm(ap * vec2(2.0, 1.4) + vec2(-t * 0.7, t))
    );
    float bands = fbm(ap * vec2(2.4, 3.4) + warp * 1.4 + vec2(t * 1.5, 0.0));

    // vertical envelope: aurora lives in the mid-upper sky, fading at top/bottom
    float baseY = 0.40 + par + bands * 0.18;
    float curtain = smoothstep(0.34, 0.0, abs(uv.y - baseY - 0.12))
                  + 0.6 * smoothstep(0.5, 0.0, abs(uv.y - baseY + 0.06));
    curtain *= (0.55 + 0.45 * bands);

    // vertical streaking (the rays that hang down from a curtain)
    float rays = fbm(vec2(ap.x * 14.0 + warp.x * 2.0, uv.y * 2.0 - t));
    curtain *= mix(0.7, 1.25, rays);

    // ---- aurora color ramp: violet → magenta → teal → cyan across x + noise --
    float hueMix = clamp(uv.x * 0.8 + bands * 0.5 + u_pointer.x * 0.1, 0.0, 1.0);
    vec3 aur = mix(u_violet, u_magenta, smoothstep(0.0, 0.35, hueMix));
    aur = mix(aur, u_teal, smoothstep(0.35, 0.72, hueMix));
    aur = mix(aur, u_cyan, smoothstep(0.72, 1.0, hueMix));

    // brighten the lower edge of the curtain (classic aurora glow)
    float glow = smoothstep(0.0, 0.3, curtain);
    col += aur * curtain * 1.35 * glow;

    // soft cyan ground-glow just above the ridge
    float horizonGlow = smoothstep(0.32, 0.12, uv.y) * smoothstep(0.04, 0.18, uv.y);
    col += u_cyan * horizonGlow * 0.18;

    // ---- Rockies ridge silhouette ----
    float rh = ridgeHeight(uv.x + 0.02 * sin(u_time * 0.05));
    float ridgeMask = smoothstep(rh + 0.004, rh - 0.004, uv.y);
    // distant haze on the ridge so it doesn't read as a flat black cutout
    vec3 ridgeCol = mix(u_ridge, u_night0, 0.25);
    col = mix(col, ridgeCol, ridgeMask);
    // rim light on the ridge crest from the aurora
    float rim = smoothstep(0.012, 0.0, abs(uv.y - rh)) * 0.6;
    col += aur * rim * (0.4 + 0.6 * bands);

    // faint grain to avoid banding
    col += (noise(uv * u_resolution.xy * 0.5 + u_time) - 0.5) * 0.012;

    // gentle vignette to seat copy
    float vig = smoothstep(1.4, 0.3, length((uv - 0.5) * vec2(aspect, 1.0)));
    col *= mix(0.78, 1.0, vig);

    col *= u_intensity;

    gl_FragColor = vec4(col, 1.0);
  }
`,h="#9a6bff",v="#7fe6ff";function m({drive:e}){let r=(0,s.useRef)(null),{size:a}=(0,i.useThree)(),n=(0,s.useRef)({x:0,y:0,scroll:0}),p=(0,s.useMemo)(()=>({u_time:{value:0},u_resolution:{value:new l.Vector2(a.width,a.height)},u_pointer:{value:new l.Vector2(0,0)},u_scroll:{value:0},u_intensity:{value:0},u_night0:{value:new l.Color("#1a1530")},u_night1:{value:new l.Color("#241a3a")},u_violet:{value:new l.Color(h)},u_magenta:{value:new l.Color("#d36bd0")},u_teal:{value:new l.Color("#5fe0cf")},u_cyan:{value:new l.Color(v)},u_ridge:{value:new l.Color("#2a2342")}}),[]);return(0,o.useFrame)(({clock:t},o)=>{let i=r.current;if(!i)return;i.uniforms.u_time.value=t.getElapsedTime(),i.uniforms.u_resolution.value.set(a.width,a.height);let s=e.current??{pointer:{x:0,y:0},scroll:0},l=1-Math.pow(.0016,o);n.current.x+=(s.pointer.x-n.current.x)*l,n.current.y+=(s.pointer.y-n.current.y)*l,n.current.scroll+=(s.scroll-n.current.scroll)*l,i.uniforms.u_pointer.value.set(n.current.x,n.current.y),i.uniforms.u_scroll.value=n.current.scroll;let u=i.uniforms.u_intensity.value;i.uniforms.u_intensity.value=u+(1-u)*Math.min(1,1.1*o)}),(0,t.jsxs)("mesh",{frustumCulled:!1,children:[(0,t.jsx)("planeGeometry",{args:[2,2]}),(0,t.jsx)("shaderMaterial",{ref:r,vertexShader:u,fragmentShader:c,uniforms:p,depthWrite:!1,depthTest:!1})]})}function p({drive:e,count:r}){let a=(0,s.useRef)(null),n=(0,s.useMemo)(()=>new l.Object3D,[]),{viewport:u}=(0,i.useThree)(),c=(0,s.useMemo)(()=>{let e=[];for(let t=0;t<r;t++)e.push({x:(Math.random()-.5)*8,y:(Math.random()-.5)*4,z:(Math.random()-.5)*2,rise:.1+.5*Math.random(),size:.015+.05*Math.random(),sway:Math.random()*Math.PI*2,hue:Math.random(),bright:.3+.7*Math.random()});return e},[r]),m=(0,s.useMemo)(()=>new l.Color,[]),f=(0,s.useMemo)(()=>new l.Color(h),[]),d=(0,s.useMemo)(()=>new l.Color(v),[]);return(0,o.useFrame)(({clock:t},r)=>{let o=a.current;if(!o)return;let i=e.current??{pointer:{x:0,y:0},scroll:0},s=Math.min(r,.05),l=t.getElapsedTime(),h=.6*Math.max(u.height,4);for(let e=0;e<c.length;e++){let t=c[e];t.y+=s*t.rise,t.y>h&&(t.y=-h);let r=t.x+.25*Math.sin(.3*l+t.sway)+.3*i.pointer.x,a=1-.6*i.scroll;n.position.set(r,t.y,t.z);let u=t.size*(.8+.2*Math.sin(l+t.sway));n.scale.set(u,u,u),n.updateMatrix(),o.setMatrixAt(e,n.matrix),m.copy(f).lerp(d,t.hue),m.multiplyScalar(t.bright*a),o.setColorAt(e,m)}o.instanceMatrix.needsUpdate=!0,o.instanceColor&&(o.instanceColor.needsUpdate=!0)}),(0,t.jsxs)("instancedMesh",{ref:a,args:[void 0,void 0,r],frustumCulled:!1,children:[(0,t.jsx)("circleGeometry",{args:[1,12]}),(0,t.jsx)("meshBasicMaterial",{transparent:!0,blending:l.AdditiveBlending,depthWrite:!1,depthTest:!1,opacity:.85,toneMapped:!1})]})}e.s(["default",0,function({lite:e=!1}){let o=(0,s.useRef)({pointer:{x:0,y:0},scroll:0}),i=(0,s.useRef)(null),[l,u]=(0,s.useState)(!0);return(0,s.useEffect)(()=>{let e,t=i.current,r=()=>{let e=Math.max(window.innerHeight,1);o.current.scroll=Math.min(1,Math.max(0,window.scrollY/e))};r(),window.addEventListener("scroll",r,{passive:!0}),t&&"u">typeof IntersectionObserver&&(e=new IntersectionObserver(([e])=>u(e.isIntersecting),{rootMargin:"120px"})).observe(t);let a=()=>u("visible"===document.visibilityState);return document.addEventListener("visibilitychange",a),()=>{window.removeEventListener("scroll",r),e?.disconnect(),document.removeEventListener("visibilitychange",a)}},[]),(0,t.jsx)("div",{ref:i,className:"absolute inset-0",onPointerMove:e=>{let t=e.currentTarget.getBoundingClientRect();o.current.pointer.x=(e.clientX-t.left)/t.width*2-1,o.current.pointer.y=-((e.clientY-t.top)/t.height*2-1)},onPointerLeave:()=>{o.current.pointer.x=0,o.current.pointer.y=0},children:(0,t.jsxs)(r.Canvas,{frameloop:l?"always":"never",camera:{position:[0,0,5],fov:42},dpr:[1,2],gl:{antialias:!1,alpha:!1,powerPreference:"high-performance"},style:{position:"absolute",inset:0},children:[(0,t.jsx)(m,{drive:o}),(0,t.jsx)(p,{drive:o,count:e?80:150}),(0,t.jsx)(a.EffectComposer,{enableNormalPass:!1,children:(0,t.jsx)(a.Bloom,{intensity:e?.7:1.05,luminanceThreshold:.3,luminanceSmoothing:.32,mipmapBlur:!0,kernelSize:e?n.KernelSize.MEDIUM:n.KernelSize.LARGE})})]})})}],45621)},27551,e=>{e.n(e.i(45621))}]);