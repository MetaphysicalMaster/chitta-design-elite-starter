(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,74303,e=>{"use strict";var t=e.i(64556),r=e.i(96996),o=e.i(21348);let i=t.forwardRef(({children:e,enabled:i=!0,speed:a=1,rotationIntensity:n=1,floatIntensity:s=1,floatingRange:l=[-.1,.1],autoInvalidate:c=!1,...u},m)=>{let f=t.useRef(null);t.useImperativeHandle(m,()=>f.current,[]);let d=t.useRef(1e4*Math.random());return(0,r.useFrame)(e=>{var t,r;if(!i||0===a)return;c&&e.invalidate();let u=d.current+e.clock.elapsedTime;f.current.rotation.x=Math.cos(u/4*a)/8*n,f.current.rotation.y=Math.sin(u/4*a)/8*n,f.current.rotation.z=Math.sin(u/4*a)/20*n;let m=Math.sin(u/4*a)/10;m=o.MathUtils.mapLinear(m,-.1,.1,null!=(t=null==l?void 0:l[0])?t:-.1,null!=(r=null==l?void 0:l[1])?r:.1),f.current.position.y=m*s,f.current.updateMatrix()}),t.createElement("group",u,t.createElement("group",{ref:f,matrixAutoUpdate:!1},e))});e.s(["Float",0,i])},71611,e=>{"use strict";function t(){return(t=Object.assign.bind()).apply(null,arguments)}e.s(["default",()=>t])},4020,e=>{"use strict";var t,r,o,i,a=e.i(71611),n=e.i(21348),s=e.i(64556),l=e.i(17866),c=e.i(96996),u=e.i(15746);function m(e,t,r){let o=(0,u.useThree)(e=>e.size),i=(0,u.useThree)(e=>e.viewport),a="number"==typeof e?e:o.width*i.dpr,l="number"==typeof t?t:o.height*i.dpr,c=("number"==typeof e?r:e)||{},{samples:m=0,depth:f,...d}=c,v=null!=f?f:c.depthBuffer,h=s.useMemo(()=>{let e=new n.WebGLRenderTarget(a,l,{minFilter:n.LinearFilter,magFilter:n.LinearFilter,type:n.HalfFloatType,...d});return v&&(e.depthTexture=new n.DepthTexture(a,l,n.FloatType)),e.samples=m,e},[]);return s.useLayoutEffect(()=>{h.setSize(a,l),m&&(h.samples=m)},[m,h,a,l]),s.useEffect(()=>()=>h.dispose(),[]),h}var f=n;let d=(t={},r="void main() { }",o="void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); discard;  }",(i=class extends f.ShaderMaterial{constructor(e){for(const i in super({vertexShader:r,fragmentShader:o,...e}),t)this.uniforms[i]=new f.Uniform(t[i]),Object.defineProperty(this,i,{get(){return this.uniforms[i].value},set(e){this.uniforms[i].value=e}});this.uniforms=f.UniformsUtils.clone(this.uniforms)}}).key=f.MathUtils.generateUUID(),i);class v extends n.MeshPhysicalMaterial{constructor(e=6,t=!1){super(),this.uniforms={chromaticAberration:{value:.05},transmission:{value:0},_transmission:{value:1},transmissionMap:{value:null},roughness:{value:0},thickness:{value:0},thicknessMap:{value:null},attenuationDistance:{value:1/0},attenuationColor:{value:new n.Color("white")},anisotropicBlur:{value:.1},time:{value:0},distortion:{value:0},distortionScale:{value:.5},temporalDistortion:{value:0},buffer:{value:null}},this.onBeforeCompile=r=>{r.uniforms={...r.uniforms,...this.uniforms},this.anisotropy>0&&(r.defines.USE_ANISOTROPY=""),t?r.defines.USE_SAMPLER="":r.defines.USE_TRANSMISSION="",r.fragmentShader=`
      uniform float chromaticAberration;         
      uniform float anisotropicBlur;      
      uniform float time;
      uniform float distortion;
      uniform float distortionScale;
      uniform float temporalDistortion;
      uniform sampler2D buffer;

      vec3 random3(vec3 c) {
        float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
        vec3 r;
        r.z = fract(512.0*j);
        j *= .125;
        r.x = fract(512.0*j);
        j *= .125;
        r.y = fract(512.0*j);
        return r-0.5;
      }

      uint hash( uint x ) {
        x += ( x << 10u );
        x ^= ( x >>  6u );
        x += ( x <<  3u );
        x ^= ( x >> 11u );
        x += ( x << 15u );
        return x;
      }

      // Compound versions of the hashing algorithm I whipped together.
      uint hash( uvec2 v ) { return hash( v.x ^ hash(v.y)                         ); }
      uint hash( uvec3 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z)             ); }
      uint hash( uvec4 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z) ^ hash(v.w) ); }

      // Construct a float with half-open range [0:1] using low 23 bits.
      // All zeroes yields 0.0, all ones yields the next smallest representable value below 1.0.
      float floatConstruct( uint m ) {
        const uint ieeeMantissa = 0x007FFFFFu; // binary32 mantissa bitmask
        const uint ieeeOne      = 0x3F800000u; // 1.0 in IEEE binary32
        m &= ieeeMantissa;                     // Keep only mantissa bits (fractional part)
        m |= ieeeOne;                          // Add fractional part to 1.0
        float  f = uintBitsToFloat( m );       // Range [1:2]
        return f - 1.0;                        // Range [0:1]
      }

      // Pseudo-random value in half-open range [0:1].
      float randomBase( float x ) { return floatConstruct(hash(floatBitsToUint(x))); }
      float randomBase( vec2  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
      float randomBase( vec3  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
      float randomBase( vec4  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
      float rand(float seed) {
        float result = randomBase(vec3(gl_FragCoord.xy, seed));
        return result;
      }

      const float F3 =  0.3333333;
      const float G3 =  0.1666667;

      float snoise(vec3 p) {
        vec3 s = floor(p + dot(p, vec3(F3)));
        vec3 x = p - s + dot(s, vec3(G3));
        vec3 e = step(vec3(0.0), x - x.yzx);
        vec3 i1 = e*(1.0 - e.zxy);
        vec3 i2 = 1.0 - e.zxy*(1.0 - e);
        vec3 x1 = x - i1 + G3;
        vec3 x2 = x - i2 + 2.0*G3;
        vec3 x3 = x - 1.0 + 3.0*G3;
        vec4 w, d;
        w.x = dot(x, x);
        w.y = dot(x1, x1);
        w.z = dot(x2, x2);
        w.w = dot(x3, x3);
        w = max(0.6 - w, 0.0);
        d.x = dot(random3(s), x);
        d.y = dot(random3(s + i1), x1);
        d.z = dot(random3(s + i2), x2);
        d.w = dot(random3(s + 1.0), x3);
        w *= w;
        w *= w;
        d *= w;
        return dot(d, vec4(52.0));
      }

      float snoiseFractal(vec3 m) {
        return 0.5333333* snoise(m)
              +0.2666667* snoise(2.0*m)
              +0.1333333* snoise(4.0*m)
              +0.0666667* snoise(8.0*m);
      }
`+r.fragmentShader,r.fragmentShader=r.fragmentShader.replace("#include <transmission_pars_fragment>",`
        #ifdef USE_TRANSMISSION
          // Transmission code is based on glTF-Sampler-Viewer
          // https://github.com/KhronosGroup/glTF-Sample-Viewer
          uniform float _transmission;
          uniform float thickness;
          uniform float attenuationDistance;
          uniform vec3 attenuationColor;
          #ifdef USE_TRANSMISSIONMAP
            uniform sampler2D transmissionMap;
          #endif
          #ifdef USE_THICKNESSMAP
            uniform sampler2D thicknessMap;
          #endif
          uniform vec2 transmissionSamplerSize;
          uniform sampler2D transmissionSamplerMap;
          uniform mat4 modelMatrix;
          uniform mat4 projectionMatrix;
          varying vec3 vWorldPosition;
          vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
            // Direction of refracted light.
            vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
            // Compute rotation-independant scaling of the model matrix.
            vec3 modelScale;
            modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
            modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
            modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
            // The thickness is specified in local space.
            return normalize( refractionVector ) * thickness * modelScale;
          }
          float applyIorToRoughness( const in float roughness, const in float ior ) {
            // Scale roughness with IOR so that an IOR of 1.0 results in no microfacet refraction and
            // an IOR of 1.5 results in the default amount of microfacet refraction.
            return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
          }
          vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
            float framebufferLod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );            
            #ifdef USE_SAMPLER
              #ifdef texture2DLodEXT
                return texture2DLodEXT(transmissionSamplerMap, fragCoord.xy, framebufferLod);
              #else
                return texture2D(transmissionSamplerMap, fragCoord.xy, framebufferLod);
              #endif
            #else
              return texture2D(buffer, fragCoord.xy);
            #endif
          }
          vec3 applyVolumeAttenuation( const in vec3 radiance, const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
            if ( isinf( attenuationDistance ) ) {
              // Attenuation distance is +∞, i.e. the transmitted color is not attenuated at all.
              return radiance;
            } else {
              // Compute light attenuation using Beer's law.
              vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
              vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance ); // Beer's law
              return transmittance * radiance;
            }
          }
          vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
            const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
            const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
            const in vec3 attenuationColor, const in float attenuationDistance ) {
            vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
            vec3 refractedRayExit = position + transmissionRay;
            // Project refracted vector on the framebuffer, while mapping to normalized device coordinates.
            vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
            vec2 refractionCoords = ndcPos.xy / ndcPos.w;
            refractionCoords += 1.0;
            refractionCoords /= 2.0;
            // Sample framebuffer to get pixel the refracted ray hits.
            vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
            vec3 attenuatedColor = applyVolumeAttenuation( transmittedLight.rgb, length( transmissionRay ), attenuationColor, attenuationDistance );
            // Get the specular component.
            vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
            return vec4( ( 1.0 - F ) * attenuatedColor * diffuseColor, transmittedLight.a );
          }
        #endif
`),r.fragmentShader=r.fragmentShader.replace("#include <transmission_fragment>",`  
        // Improve the refraction to use the world pos
        material.transmission = _transmission;
        material.transmissionAlpha = 1.0;
        material.thickness = thickness;
        material.attenuationDistance = attenuationDistance;
        material.attenuationColor = attenuationColor;
        #ifdef USE_TRANSMISSIONMAP
          material.transmission *= texture2D( transmissionMap, vUv ).r;
        #endif
        #ifdef USE_THICKNESSMAP
          material.thickness *= texture2D( thicknessMap, vUv ).g;
        #endif
        
        vec3 pos = vWorldPosition;
        float runningSeed = 0.0;
        vec3 v = normalize( cameraPosition - pos );
        vec3 n = inverseTransformDirection( normal, viewMatrix );
        vec3 transmission = vec3(0.0);
        float transmissionR, transmissionB, transmissionG;
        float randomCoords = rand(runningSeed++);
        float thickness_smear = thickness * max(pow(roughnessFactor, 0.33), anisotropicBlur);
        vec3 distortionNormal = vec3(0.0);
        vec3 temporalOffset = vec3(time, -time, -time) * temporalDistortion;
        if (distortion > 0.0) {
          distortionNormal = distortion * vec3(snoiseFractal(vec3((pos * distortionScale + temporalOffset))), snoiseFractal(vec3(pos.zxy * distortionScale - temporalOffset)), snoiseFractal(vec3(pos.yxz * distortionScale + temporalOffset)));
        }
        for (float i = 0.0; i < ${e}.0; i ++) {
          vec3 sampleNorm = normalize(n + roughnessFactor * roughnessFactor * 2.0 * normalize(vec3(rand(runningSeed++) - 0.5, rand(runningSeed++) - 0.5, rand(runningSeed++) - 0.5)) * pow(rand(runningSeed++), 0.33) + distortionNormal);
          transmissionR = getIBLVolumeRefraction(
            sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
            pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness  + thickness_smear * (i + randomCoords) / float(${e}),
            material.attenuationColor, material.attenuationDistance
          ).r;
          transmissionG = getIBLVolumeRefraction(
            sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
            pos, modelMatrix, viewMatrix, projectionMatrix, material.ior  * (1.0 + chromaticAberration * (i + randomCoords) / float(${e})) , material.thickness + thickness_smear * (i + randomCoords) / float(${e}),
            material.attenuationColor, material.attenuationDistance
          ).g;
          transmissionB = getIBLVolumeRefraction(
            sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
            pos, modelMatrix, viewMatrix, projectionMatrix, material.ior * (1.0 + 2.0 * chromaticAberration * (i + randomCoords) / float(${e})), material.thickness + thickness_smear * (i + randomCoords) / float(${e}),
            material.attenuationColor, material.attenuationDistance
          ).b;
          transmission.r += transmissionR;
          transmission.g += transmissionG;
          transmission.b += transmissionB;
        }
        transmission /= ${e}.0;
        totalDiffuse = mix( totalDiffuse, transmission.rgb, material.transmission );
`)},Object.keys(this.uniforms).forEach(e=>Object.defineProperty(this,e,{get:()=>this.uniforms[e].value,set:t=>this.uniforms[e].value=t}))}}let h=s.forwardRef(({buffer:e,transmissionSampler:t=!1,backside:r=!1,side:o=n.FrontSide,transmission:i=1,thickness:u=0,backsideThickness:f=0,backsideEnvMapIntensity:h=1,samples:p=10,resolution:x,backsideResolution:g,background:y,anisotropy:w,anisotropicBlur:M,...b},S)=>{let C,_,T,R;(0,l.extend)({MeshTransmissionMaterial:v});let F=s.useRef(null),[j]=s.useState(()=>new d),z=m(g||x),D=m(x);return(0,c.useFrame)(e=>{if(F.current.time=e.clock.elapsedTime,F.current.buffer===D.texture&&!t){var i;(R=null==(i=F.current.__r3f.parent)?void 0:i.object)&&(T=e.gl.toneMapping,C=e.scene.background,_=F.current.envMapIntensity,e.gl.toneMapping=n.NoToneMapping,y&&(e.scene.background=y),R.material=j,r&&(e.gl.setRenderTarget(z),e.gl.render(e.scene,e.camera),R.material=F.current,R.material.buffer=z.texture,R.material.thickness=f,R.material.side=n.BackSide,R.material.envMapIntensity=h),e.gl.setRenderTarget(D),e.gl.render(e.scene,e.camera),R.material=F.current,R.material.thickness=u,R.material.side=o,R.material.buffer=D.texture,R.material.envMapIntensity=_,e.scene.background=C,e.gl.setRenderTarget(null),e.gl.toneMapping=T)}}),s.useImperativeHandle(S,()=>F.current,[]),s.createElement("meshTransmissionMaterial",(0,a.default)({args:[p,t],ref:F},b,{buffer:e||D.texture,_transmission:i,anisotropicBlur:null!=M?M:w,transmission:t?i:0,thickness:u,side:o}))});e.s(["MeshTransmissionMaterial",0,h],4020)},1020,e=>{"use strict";var t=e.i(44180),r=e.i(4430),o=e.i(96996),i=e.i(15746),a=e.i(74303),n=e.i(4020),s=e.i(64556),l=e.i(21348);let c=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,u=`
  precision highp float;

  uniform float u_time;
  uniform vec2  u_resolution;
  uniform vec2  u_pointer;     // -1..1 parallax target (smoothed on CPU)
  uniform float u_intensity;   // 0..1 master fade-in
  uniform vec3  u_dawn;        // warm low band
  uniform vec3  u_mid;         // daylight blue
  uniform vec3  u_high;        // azure
  uniform vec3  u_deep;        // horizon ink
  uniform vec3  u_blush;       // faint rose accent

  varying vec2 vUv;

  // --- Ashima simplex noise ---
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
           + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // fractional Brownian motion — layered noise for volumetric softness
  float fbm(vec2 p){
    float total = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    for (int i = 0; i < 5; i++){
      total += amp * snoise(p * freq);
      freq *= 2.0;
      amp *= 0.5;
    }
    return total;
  }

  void main(){
    // Aspect-correct UV, centered
    vec2 uv = vUv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 p = (uv - 0.5);
    p.x *= aspect;

    // Gentle parallax: clouds drift toward the cursor
    vec2 par = u_pointer * 0.06;

    float t = u_time * 0.02;

    // Domain-warped fbm for organic cloud structure
    vec2 q = vec2(
      fbm(p * 1.3 + par + vec2(0.0, t)),
      fbm(p * 1.3 + par + vec2(5.2, 1.3 - t))
    );
    vec2 r = vec2(
      fbm(p * 1.3 + 1.6 * q + vec2(1.7, 9.2) + t * 0.8),
      fbm(p * 1.3 + 1.6 * q + vec2(8.3, 2.8) - t * 0.6)
    );
    float clouds = fbm(p * 1.3 + 1.7 * r);
    clouds = clouds * 0.5 + 0.5; // 0..1

    // Vertical dawn -> day gradient (top brighter, horizon deeper)
    float v = uv.y;
    vec3 grad = mix(u_deep, u_high, smoothstep(0.0, 0.55, v));
    grad = mix(grad, u_mid, smoothstep(0.4, 0.9, v));

    // Warm dawn glow in the lower-left, slow palette shift over time
    float dawnGlow = smoothstep(0.55, 0.0, distance(uv, vec2(0.18, 0.12)));
    float palShift = 0.5 + 0.5 * sin(u_time * 0.05);
    grad = mix(grad, u_dawn, dawnGlow * (0.45 + 0.2 * palShift));

    // Faint rose blush upper-right
    float blush = smoothstep(0.6, 0.0, distance(uv, vec2(0.86, 0.9)));
    grad = mix(grad, u_blush, blush * 0.22);

    // Layer soft volumetric clouds — luminous, low-contrast
    float cloudBand = smoothstep(0.45, 0.95, clouds);
    vec3 cloudColor = mix(u_high, vec3(1.0), 0.65);
    vec3 col = mix(grad, cloudColor, cloudBand * 0.5);

    // A second, higher wisp layer for depth
    float wisp = smoothstep(0.6, 1.0, fbm(p * 2.4 + par * 1.4 + vec2(t * 1.4, -t)));
    col = mix(col, vec3(1.0), wisp * 0.12);

    // "Breath": gentle global luminance pulse
    float breath = 0.97 + 0.03 * sin(u_time * 0.12);
    col *= breath;

    // Subtle vignette to seat the headline
    float vig = smoothstep(1.25, 0.35, length(p));
    col *= mix(0.86, 1.0, vig);

    // Master fade-in
    col = mix(u_deep * 0.6, col, clamp(u_intensity, 0.0, 1.0));

    gl_FragColor = vec4(col, 1.0);
  }
`;function m({pointer:e}){let r=(0,s.useRef)(null),{size:a,viewport:n}=(0,i.useThree)(),f=(0,s.useRef)({x:0,y:0}),d=(0,s.useMemo)(()=>({u_time:{value:0},u_resolution:{value:new l.Vector2(a.width,a.height)},u_pointer:{value:new l.Vector2(0,0)},u_intensity:{value:0},u_dawn:{value:new l.Color("#f2dcb8")},u_mid:{value:new l.Color("#bcd4ec")},u_high:{value:new l.Color("#7fb0e6")},u_deep:{value:new l.Color("#4f74b3")},u_blush:{value:new l.Color("#f3d2d6")}}),[]);return(0,o.useFrame)(({clock:t},o)=>{let i=r.current;if(!i)return;i.uniforms.u_time.value=t.getElapsedTime(),i.uniforms.u_resolution.value.set(a.width,a.height);let n=e.current??{x:0,y:0},s=1-Math.pow(.001,o);f.current.x+=(n.x-f.current.x)*s,f.current.y+=(n.y-f.current.y)*s,i.uniforms.u_pointer.value.set(f.current.x,f.current.y);let l=i.uniforms.u_intensity.value;i.uniforms.u_intensity.value=l+(1-l)*Math.min(1,1.6*o)}),(0,t.jsxs)("mesh",{scale:[n.width,n.height,1],children:[(0,t.jsx)("planeGeometry",{args:[1,1]}),(0,t.jsx)("shaderMaterial",{ref:r,vertexShader:c,fragmentShader:u,uniforms:d,depthWrite:!1})]})}function f({pointer:e}){let r=(0,s.useRef)(null);return(0,o.useFrame)((t,o)=>{let i=r.current;if(!i)return;let a=e.current??{x:0,y:0},n=1-Math.pow(.0015,o);i.position.x+=(.6*a.x-i.position.x)*n,i.position.y+=(.15+.35*a.y-i.position.y)*n}),(0,t.jsx)("group",{ref:r,position:[.9,.2,1.5],children:(0,t.jsx)(a.Float,{speed:1.1,rotationIntensity:.35,floatIntensity:.9,children:(0,t.jsxs)("mesh",{children:[(0,t.jsx)("sphereGeometry",{args:[.62,64,64]}),(0,t.jsx)(n.MeshTransmissionMaterial,{samples:6,resolution:256,thickness:.55,roughness:.08,chromaticAberration:.18,anisotropy:.2,distortion:.25,distortionScale:.3,temporalDistortion:.1,ior:1.18,color:"#eaf3ff",attenuationColor:"#cfe2f7",attenuationDistance:1.5})]})})})}function d(){return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("ambientLight",{intensity:.7}),(0,t.jsx)("directionalLight",{position:[3,4,5],intensity:1.1,color:"#fff4e0"}),(0,t.jsx)("directionalLight",{position:[-4,-2,2],intensity:.4,color:"#bcd4ec"})]})}e.s(["default",0,function({showOrb:e=!0}){let o=(0,s.useRef)({x:0,y:0});return(0,t.jsxs)("div",{className:"absolute inset-0",onPointerMove:e=>{let t=e.currentTarget.getBoundingClientRect();o.current.x=(e.clientX-t.left)/t.width*2-1,o.current.y=-((e.clientY-t.top)/t.height*2-1)},onPointerLeave:()=>{o.current.x=0,o.current.y=0},children:[(0,t.jsx)(r.Canvas,{orthographic:!0,camera:{zoom:1,position:[0,0,1]},dpr:[1,2],gl:{antialias:!1,alpha:!1,powerPreference:"high-performance"},style:{position:"absolute",inset:0},children:(0,t.jsx)(m,{pointer:o})}),e&&(0,t.jsxs)(r.Canvas,{camera:{position:[0,0,4],fov:42},dpr:[1,2],gl:{antialias:!0,alpha:!0,powerPreference:"high-performance"},style:{position:"absolute",inset:0,pointerEvents:"none"},children:[(0,t.jsx)(d,{}),(0,t.jsx)(f,{pointer:o})]})]})}],1020)},5781,e=>{e.n(e.i(1020))}]);