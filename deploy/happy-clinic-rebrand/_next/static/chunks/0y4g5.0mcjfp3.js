(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,74422,e=>{"use strict";var t=e.i(44180),r=e.i(4430),o=e.i(96996),a=e.i(15746),i=e.i(64556),l=e.i(21348);let s=`
  precision highp float;

  // Per-particle data
  attribute vec3 aLattice;   // ordered resolved position (the dermal lattice)
  attribute vec3 aCloud;     // dispersed source position (intro / no-resolve)
  attribute float aDepth;    // 0 (surface corneum) .. 1 (deep hypodermis)
  attribute float aVessel;   // 0..1 — membership in the oxblood capillary thread
  attribute float aSeed;     // 0..1 random per particle
  attribute float aScale;    // base point-size multiplier

  uniform float uTime;
  uniform float uResolve;    // 0 dispersed .. 1 fully resolved lattice
  uniform float uIntro;      // 0..1 reveal on mount
  uniform float uDpr;
  uniform float uSize;       // global point-size scale
  uniform float uFocus;      // focal depth plane (0..1) — DoF center
  uniform vec2  uPointer;    // -1..1 cursor in clip-ish space
  uniform float uPointerStr; // 0..1 strength (eased on enter/leave)

  varying float vDepth;      // dermal depth -> color ramp
  varying float vVessel;     // oxblood membership -> color
  varying float vSharp;      // 0 blurred .. 1 sharp (depth-of-field)
  varying float vGlow;       // cursor proximity glow

  // Cheap hash noise (organic micro-drift, no textures).
  vec3 hash3(vec3 p) {
    p = vec3(
      dot(p, vec3(127.1, 311.7, 74.7)),
      dot(p, vec3(269.5, 183.3, 246.1)),
      dot(p, vec3(113.5, 271.9, 124.6))
    );
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  void main() {
    // Resolve: ease the dispersed cloud into the ordered dermal lattice.
    float res = smoothstep(0.0, 1.0, uResolve);
    vec3 pos = mix(aCloud, aLattice, res);

    // Tissue settle — a faint, slow vertical breathing per stratum once
    // resolved ("living dermis"); micro-drift while dispersed.
    vec3 n = hash3(aLattice * 0.6 + aSeed * 17.0 + uTime * 0.05);
    float settle = mix(0.09, 0.014, res); // larger drift when dispersed
    pos += n * settle;
    // Strata flow: each band drifts laterally a touch, scaled by depth.
    pos.x += sin(uTime * 0.22 + aDepth * 6.2831 + aSeed * 6.2831)
             * 0.02 * res;

    // --- Cursor lens: gentle local lift toward the viewer (a dermatoscope) ---
    vec3 pointer3 = vec3(uPointer * 1.4, 0.0);
    vec3 toP = pos - pointer3;
    float d = length(toP.xy) + 0.0001;
    float influence = uPointerStr * smoothstep(1.1, 0.0, d);
    pos.z += influence * 0.32;
    pos.xy += (toP.xy / d) * influence * 0.05;

    // Intro reveal — particles ease in from a slightly farther dispersed cloud.
    pos = mix(aCloud * 1.25, pos, smoothstep(0.0, 1.0, uIntro));

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Depth-of-field: sharpest at the focal stratum, softening away from it.
    // Particles also have a little z, so combine dermal depth + view z.
    float focusDist = abs(aDepth - uFocus);
    float sharp = 1.0 - smoothstep(0.12, 0.6, focusDist);
    sharp = mix(0.35, 1.0, sharp); // never fully invisible
    vSharp = sharp;

    // Point size: perspective attenuation + per-particle scale + dpr.
    // Blurred (out-of-focus) particles render LARGER + softer (bokeh).
    float bokeh = mix(1.9, 1.0, sharp);
    float size = uSize * aScale * (0.62 + 0.6 * aSeed) * bokeh;
    gl_PointSize = size * uDpr * (300.0 / -mvPosition.z);
    gl_PointSize = clamp(gl_PointSize, 0.0, 16.0 * uDpr);

    vDepth = aDepth;
    vVessel = aVessel;
    vGlow = influence;
  }
`,n=`
  precision highp float;

  uniform float uTime;
  uniform vec3  uCorneum;   // pale surface
  uniform vec3  uEpidermis;
  uniform vec3  uDermis;
  uniform vec3  uDeep;      // deep navy hypodermis
  uniform vec3  uVessel;    // oxblood capillary

  varying float vDepth;
  varying float vVessel;
  varying float vSharp;
  varying float vGlow;

  void main() {
    // Soft round sprite (no texture). Out-of-focus particles get a softer,
    // wider falloff edge — bokeh.
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    float edge = mix(0.5, 0.34, vSharp); // blurred -> feather starts sooner
    float alpha = smoothstep(0.5, edge, r);
    if (alpha <= 0.001) discard;

    // Dermal depth ramp: corneum -> epidermis -> dermis -> deep navy.
    vec3 col = mix(uCorneum, uEpidermis, smoothstep(0.0, 0.34, vDepth));
    col = mix(col, uDermis, smoothstep(0.3, 0.66, vDepth));
    col = mix(col, uDeep, smoothstep(0.62, 1.0, vDepth));

    // The lone oxblood capillary thread.
    col = mix(col, uVessel, vVessel);

    // Cursor lens warms a faint highlight (clinical, restrained).
    col = mix(col, mix(col, uCorneum, 0.6), vGlow * 0.5);

    // Sharp particles read crisper + a touch brighter; blurred ones dim.
    float lum = mix(0.6, 1.0, vSharp);
    col *= lum;

    // Alpha: in-focus particles are more opaque; bokeh stays faint.
    float a = alpha * mix(0.32, 0.92, vSharp);
    a *= 0.72 + 0.28 * vVessel; // vessel slightly punches through

    gl_FragColor = vec4(col, a);
  }
`;function u({pointer:e,lite:r}){let c=(0,i.useRef)(null),p=(0,i.useRef)(0),f=(0,i.useRef)(0),h=(0,i.useRef)({x:0,y:0,s:0}),m=(0,i.useRef)(.5),{geometry:d,uniforms:v}=(0,i.useMemo)(()=>{let e,t=function(e,t){let r=new Float32Array(3*e),o=new Float32Array(3*e),a=new Float32Array(e),i=new Float32Array(e),s=new Float32Array(e),n=new Float32Array(e),u=Math.floor(.05*e);for(let c=0;c<e;c++){let e,p,f,h;if(c<u){let r=c/u;e=(r-.5)*3.4040000000000004,h=.62+.12*Math.sin(r*Math.PI*3)+(t()-.5)*.04,p=l.MathUtils.lerp(1,-1,h)+(t()-.5)*.04,f=.18*Math.cos(r*Math.PI*4)+(t()-.5)*.04,i[c]=1}else{e=(2*t()-1)*1.85;h=Math.min(1,Math.max(0,(h=Math.pow(t(),.85))+(t()-.5)*.06)),p=l.MathUtils.lerp(1,-1,h)+(t()-.5)*.05,f=(t()-.5)*.42*(.5+.5*h),i[c]=0}r[3*c]=e,r[3*c+1]=p,r[3*c+2]=f;let m=1.7*Math.pow(t(),.5),d=t()*Math.PI*2,v=Math.acos(2*t()-1);o[3*c]=m*Math.sin(v)*Math.cos(d)*1.5,o[3*c+1]=m*Math.sin(v)*Math.sin(d)*.9,o[3*c+2]=m*Math.cos(v)*.6,a[c]=h,s[c]=t(),n[c]=.7+.8*t()}return{lattice:r,cloud:o,depth:a,vessel:i,seed:s,scale:n}}(r?Math.floor(3960.0000000000005):7200,(e=40719,function(){e|=0;let t=Math.imul((e=e+0x6d2b79f5|0)^e>>>15,1|e);return(((t=t+Math.imul(t^t>>>7,61|t)^t)^t>>>14)>>>0)/0x100000000})),o=new l.BufferGeometry;return o.setAttribute("position",new l.BufferAttribute(t.lattice.slice(),3)),o.setAttribute("aLattice",new l.BufferAttribute(t.lattice,3)),o.setAttribute("aCloud",new l.BufferAttribute(t.cloud,3)),o.setAttribute("aDepth",new l.BufferAttribute(t.depth,1)),o.setAttribute("aVessel",new l.BufferAttribute(t.vessel,1)),o.setAttribute("aSeed",new l.BufferAttribute(t.seed,1)),o.setAttribute("aScale",new l.BufferAttribute(t.scale,1)),{geometry:o,uniforms:{uTime:{value:0},uResolve:{value:0},uIntro:{value:0},uDpr:{value:1},uSize:{value:r?3.6:4.2},uFocus:{value:.5},uPointer:{value:new l.Vector2(0,0)},uPointerStr:{value:0},uCorneum:{value:new l.Color("#dce4ee")},uEpidermis:{value:new l.Color("#8fa3c0")},uDermis:{value:new l.Color("#46577a")},uDeep:{value:new l.Color("#1d2740")},uVessel:{value:new l.Color("#a23645")}}}},[r]),{gl:g}=(0,a.useThree)();return(0,o.useFrame)(({clock:t},r)=>{let o=c.current;if(!o)return;let a=Math.min(r,1/30),i=t.getElapsedTime();o.uniforms.uTime.value=i,o.uniforms.uDpr.value=Math.min(g.getPixelRatio(),2),p.current+=(1-p.current)*Math.min(1,.9*a),o.uniforms.uIntro.value=p.current,f.current+=(1-f.current)*Math.min(1,.5*a),o.uniforms.uResolve.value=f.current,m.current=.5+.32*Math.sin(.16*i),o.uniforms.uFocus.value=m.current;let l=e.current??{x:0,y:0,active:0},s=1-Math.pow(.0022,a);h.current.x+=(l.x-h.current.x)*s,h.current.y+=(l.y-h.current.y)*s,h.current.s+=(l.active-h.current.s)*Math.min(1,3*a),o.uniforms.uPointer.value.set(h.current.x,h.current.y),o.uniforms.uPointerStr.value=h.current.s}),(0,t.jsx)("points",{geometry:d,frustumCulled:!1,children:(0,t.jsx)("shaderMaterial",{ref:c,vertexShader:s,fragmentShader:n,uniforms:v,transparent:!0,depthWrite:!1,depthTest:!1,blending:l.NormalBlending})})}function c({children:e}){let r=(0,i.useRef)(null);return(0,o.useFrame)(({clock:e})=>{let t=r.current;if(!t)return;let o=e.getElapsedTime();t.rotation.y=.1*Math.sin(.12*o),t.rotation.x=.035*Math.sin(.09*o)}),(0,t.jsx)("group",{ref:r,children:e})}e.s(["default",0,function({lite:e=!1}){let o=(0,i.useRef)({x:0,y:0,active:0});return(0,t.jsx)("div",{className:"absolute inset-0",onPointerMove:e=>{let t=e.currentTarget.getBoundingClientRect();o.current.x=(e.clientX-t.left)/t.width*2-1,o.current.y=-((e.clientY-t.top)/t.height*2-1),o.current.active=1},onPointerLeave:()=>{o.current.active=0},children:(0,t.jsx)(r.Canvas,{camera:{position:[0,0,4.2],fov:40},dpr:[1,2],gl:{antialias:!0,alpha:!0,powerPreference:"high-performance"},style:{position:"absolute",inset:0},children:(0,t.jsx)(c,{children:(0,t.jsx)(u,{pointer:o,lite:e})})})})}],74422)},18435,e=>{e.n(e.i(74422))}]);