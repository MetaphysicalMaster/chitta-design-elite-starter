(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,98443,e=>{"use strict";var t=e.i(76970);e.s(["extend",()=>t.e])},71320,e=>{"use strict";var t=e.i(76970);e.s(["createPortal",()=>t.o])},14714,e=>{"use strict";var t=e.i(76970);e.s(["applyProps",()=>t.s])},318,e=>{"use strict";var t=e.i(76970);e.s(["useLoader",()=>t.G])},71611,e=>{"use strict";function t(){return(t=Object.assign.bind()).apply(null,arguments)}e.s(["default",()=>t])},3782,e=>{"use strict";var t=e.i(64556),r=e.i(46648),i=e.i(21348);let o=t.forwardRef(({children:e,enabled:o=!0,speed:a=1,rotationIntensity:n=1,floatIntensity:s=1,floatingRange:l=[-.1,.1],autoInvalidate:c=!1,...u},m)=>{let f=t.useRef(null);t.useImperativeHandle(m,()=>f.current,[]);let d=t.useRef(1e4*Math.random());return(0,r.useFrame)(e=>{var t,r;if(!o||0===a)return;c&&e.invalidate();let u=d.current+e.clock.elapsedTime;f.current.rotation.x=Math.cos(u/4*a)/8*n,f.current.rotation.y=Math.sin(u/4*a)/8*n,f.current.rotation.z=Math.sin(u/4*a)/20*n;let m=Math.sin(u/4*a)/10;m=i.MathUtils.mapLinear(m,-.1,.1,null!=(t=null==l?void 0:l[0])?t:-.1,null!=(r=null==l?void 0:l[1])?r:.1),f.current.position.y=m*s,f.current.updateMatrix()}),t.createElement("group",u,t.createElement("group",{ref:f,matrixAutoUpdate:!1},e))});e.s(["Float",0,o])},75565,e=>{"use strict";var t,r,i,o,a=e.i(71611),n=e.i(21348),s=e.i(64556),l=e.i(98443),c=e.i(46648),u=e.i(26843);function m(e,t,r){let i=(0,u.useThree)(e=>e.size),o=(0,u.useThree)(e=>e.viewport),a="number"==typeof e?e:i.width*o.dpr,l="number"==typeof t?t:i.height*o.dpr,c=("number"==typeof e?r:e)||{},{samples:m=0,depth:f,...d}=c,h=null!=f?f:c.depthBuffer,p=s.useMemo(()=>{let e=new n.WebGLRenderTarget(a,l,{minFilter:n.LinearFilter,magFilter:n.LinearFilter,type:n.HalfFloatType,...d});return h&&(e.depthTexture=new n.DepthTexture(a,l,n.FloatType)),e.samples=m,e},[]);return s.useLayoutEffect(()=>{p.setSize(a,l),m&&(p.samples=m)},[m,p,a,l]),s.useEffect(()=>()=>p.dispose(),[]),p}var f=n;let d=(t={},r="void main() { }",i="void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); discard;  }",(o=class extends f.ShaderMaterial{constructor(e){for(const o in super({vertexShader:r,fragmentShader:i,...e}),t)this.uniforms[o]=new f.Uniform(t[o]),Object.defineProperty(this,o,{get(){return this.uniforms[o].value},set(e){this.uniforms[o].value=e}});this.uniforms=f.UniformsUtils.clone(this.uniforms)}}).key=f.MathUtils.generateUUID(),o);class h extends n.MeshPhysicalMaterial{constructor(e=6,t=!1){super(),this.uniforms={chromaticAberration:{value:.05},transmission:{value:0},_transmission:{value:1},transmissionMap:{value:null},roughness:{value:0},thickness:{value:0},thicknessMap:{value:null},attenuationDistance:{value:1/0},attenuationColor:{value:new n.Color("white")},anisotropicBlur:{value:.1},time:{value:0},distortion:{value:0},distortionScale:{value:.5},temporalDistortion:{value:0},buffer:{value:null}},this.onBeforeCompile=r=>{r.uniforms={...r.uniforms,...this.uniforms},this.anisotropy>0&&(r.defines.USE_ANISOTROPY=""),t?r.defines.USE_SAMPLER="":r.defines.USE_TRANSMISSION="",r.fragmentShader=`
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
`)},Object.keys(this.uniforms).forEach(e=>Object.defineProperty(this,e,{get:()=>this.uniforms[e].value,set:t=>this.uniforms[e].value=t}))}}let p=s.forwardRef(({buffer:e,transmissionSampler:t=!1,backside:r=!1,side:i=n.FrontSide,transmission:o=1,thickness:u=0,backsideThickness:f=0,backsideEnvMapIntensity:p=1,samples:v=10,resolution:g,backsideResolution:x,background:y,anisotropy:b,anisotropicBlur:w,...M},S)=>{let C,_,R,T;(0,l.extend)({MeshTransmissionMaterial:h});let F=s.useRef(null),[j]=s.useState(()=>new d),k=m(x||g),A=m(g);return(0,c.useFrame)(e=>{if(F.current.time=e.clock.elapsedTime,F.current.buffer===A.texture&&!t){var o;(T=null==(o=F.current.__r3f.parent)?void 0:o.object)&&(R=e.gl.toneMapping,C=e.scene.background,_=F.current.envMapIntensity,e.gl.toneMapping=n.NoToneMapping,y&&(e.scene.background=y),T.material=j,r&&(e.gl.setRenderTarget(k),e.gl.render(e.scene,e.camera),T.material=F.current,T.material.buffer=k.texture,T.material.thickness=f,T.material.side=n.BackSide,T.material.envMapIntensity=p),e.gl.setRenderTarget(A),e.gl.render(e.scene,e.camera),T.material=F.current,T.material.thickness=u,T.material.side=i,T.material.buffer=A.texture,T.material.envMapIntensity=_,e.scene.background=C,e.gl.setRenderTarget(null),e.gl.toneMapping=R)}}),s.useImperativeHandle(S,()=>F.current,[]),s.createElement("meshTransmissionMaterial",(0,a.default)({args:[v,t],ref:F},M,{buffer:e||A.texture,_transmission:o,anisotropicBlur:null!=w?w:b,transmission:t?o:0,thickness:u,side:i}))});e.s(["MeshTransmissionMaterial",0,p],75565)},73040,e=>{"use strict";var t=e.i(71611),r=e.i(64556),i=e.i(21348),o=e.i(98443),a=e.i(26843),n=e.i(46648);let s=parseInt(i.REVISION.replace(/\D+/g,""));class l extends i.ShaderMaterial{constructor(){super({uniforms:{time:{value:0},pixelRatio:{value:1}},vertexShader:`
        uniform float pixelRatio;
        uniform float time;
        attribute float size;  
        attribute float speed;  
        attribute float opacity;
        attribute vec3 noise;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vOpacity;

        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          modelPosition.y += sin(time * speed + modelPosition.x * noise.x * 100.0) * 0.2;
          modelPosition.z += cos(time * speed + modelPosition.x * noise.y * 100.0) * 0.2;
          modelPosition.x += cos(time * speed + modelPosition.x * noise.z * 100.0) * 0.2;
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectionPostion = projectionMatrix * viewPosition;
          gl_Position = projectionPostion;
          gl_PointSize = size * 25. * pixelRatio;
          gl_PointSize *= (1.0 / - viewPosition.z);
          vColor = color;
          vOpacity = opacity;
        }
      `,fragmentShader:`
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float strength = 0.05 / distanceToCenter - 0.1;
          gl_FragColor = vec4(vColor, strength * vOpacity);
          #include <tonemapping_fragment>
          #include <${s>=154?"colorspace_fragment":"encodings_fragment"}>
        }
      `})}get time(){return this.uniforms.time.value}set time(e){this.uniforms.time.value=e}get pixelRatio(){return this.uniforms.pixelRatio.value}set pixelRatio(e){this.uniforms.pixelRatio.value=e}}let c=e=>e&&e.constructor===Float32Array,u=e=>e instanceof i.Vector2||e instanceof i.Vector3||e instanceof i.Vector4,m=e=>Array.isArray(e)?e:u(e)?e.toArray():[e,e,e];function f(e,t,o){return r.useMemo(()=>{if(void 0!==t)if(c(t))return t;else{if(t instanceof i.Color){let r=Array.from({length:3*e},()=>[t.r,t.g,t.b]).flat();return Float32Array.from(r)}if(u(t)||Array.isArray(t)){let r=Array.from({length:3*e},()=>m(t)).flat();return Float32Array.from(r)}return Float32Array.from({length:e},()=>t)}return Float32Array.from({length:e},o)},[t])}let d=r.forwardRef(({noise:e=1,count:s=100,speed:u=1,opacity:d=1,scale:h=1,size:p,color:v,children:g,...x},y)=>{r.useMemo(()=>(0,o.extend)({SparklesImplMaterial:l}),[]);let b=r.useRef(null),w=(0,a.useThree)(e=>e.viewport.dpr),M=m(h),S=r.useMemo(()=>Float32Array.from(Array.from({length:s},()=>M.map(i.MathUtils.randFloatSpread)).flat()),[s,...M]),C=f(s,p,Math.random),_=f(s,d),R=f(s,u),T=f(3*s,e),F=f(void 0===v?3*s:s,c(v)?v:new i.Color(v),()=>1);return(0,n.useFrame)(e=>{b.current&&b.current.material&&(b.current.material.time=e.clock.elapsedTime)}),r.useImperativeHandle(y,()=>b.current,[]),r.createElement("points",(0,t.default)({key:`particle-${s}-${JSON.stringify(h)}`},x,{ref:b}),r.createElement("bufferGeometry",null,r.createElement("bufferAttribute",{attach:"attributes-position",args:[S,3]}),r.createElement("bufferAttribute",{attach:"attributes-size",args:[C,1]}),r.createElement("bufferAttribute",{attach:"attributes-opacity",args:[_,1]}),r.createElement("bufferAttribute",{attach:"attributes-speed",args:[R,1]}),r.createElement("bufferAttribute",{attach:"attributes-color",args:[F,3]}),r.createElement("bufferAttribute",{attach:"attributes-noise",args:[T,3]})),g||r.createElement("sparklesImplMaterial",{transparent:!0,pixelRatio:w,depthWrite:!1}))});e.s(["Sparkles",0,d],73040)},24162,e=>{"use strict";var t=e.i(44180),r=e.i(1529),i=e.i(46648),o=e.i(26843),a=e.i(3782),n=e.i(92958),s=e.i(44803),l=e.i(75565),c=e.i(73040),u=e.i(79867),m=e.i(43050),f=e.i(64556),d=e.i(21348);let h=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,p=`
  precision highp float;

  varying vec2 vUv;

  uniform float u_time;
  uniform vec2  u_resolution;
  uniform vec2  u_pointer;     // -1..1
  uniform float u_intensity;   // 0..1 reveal (gem "settles" as hero loads)
  uniform vec3  u_void0;       // deep charcoal void
  uniform vec3  u_void1;       // raised charcoal
  uniform vec3  u_gold;        // hot-pink caustic light (the pop)
  uniform vec3  u_jewel;       // neutral-grey highlight lift

  // Hash + value noise (cheap, smooth) for the caustic field.
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
    float amp = 0.55;
    for (int i = 0; i < 5; i++) {
      v += amp * noise(p);
      p *= 2.02;
      amp *= 0.5;
    }
    return v;
  }

  // Caustic web: domain-warped ridges (abs of a signed field) tightened into
  // bright filaments — the signature look of light refracted through water/gem.
  float caustic(vec2 p, float t) {
    // Two warped layers drifting at different rates for organic shimmer.
    vec2 w = vec2(fbm(p + vec2(0.0, t * 0.18)), fbm(p + vec2(5.2, -t * 0.13)));
    float n = fbm(p * 1.6 + w * 2.4 - vec2(t * 0.06, t * 0.04));
    // Ridge: distance from a moving level set → bright thin lines.
    float ridge = 1.0 - abs(n - 0.5) * 2.0;
    ridge = pow(clamp(ridge, 0.0, 1.0), 3.4);
    return ridge;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 p = (uv - 0.5);
    p.x *= aspect;

    float t = u_time;

    // Caustic light source drifts subtly + leans toward the cursor (the gem's
    // refraction point). Upper-left key, soft studio light.
    vec2 src = vec2(-0.32 + u_pointer.x * 0.12, 0.30 + u_pointer.y * 0.07);
    float srcDist = length(p - src);

    // Layered caustics in two scales for depth.
    float c1 = caustic(p * 3.0, t);
    float c2 = caustic(p * 5.6 + vec2(1.7, -0.6), t * 1.22);
    float web = c1 * 0.75 + c2 * 0.55;

    // Falloff from the key so caustics pool near the light, fade to shadow.
    float pool = exp(-srcDist * 1.15);
    float bed = smoothstep(1.3, 0.0, srcDist); // soft floor wash

    // Base charcoal void gradient (darker toward the lower-right shadow).
    float vgrad = smoothstep(1.05, -0.2, uv.y + (p.x - src.x) * 0.18);
    vec3 base = mix(u_void0, u_void1, vgrad * 0.9);
    // Gentle neutral-grey lift around the source (the light's soft halo).
    base += u_jewel * pool * 0.22;

    vec3 col = base;
    // Hot-pink caustic filaments (the one statement light).
    float goldAmt = (web * (0.35 + pool * 1.25)) ;
    col += u_gold * goldAmt * 1.35;
    // Neutral-grey inner lift where caustics overlap densely.
    col += u_jewel * pow(web, 1.6) * bed * 0.4;

    // Bright caustic cores (Bloom seeds) where the web peaks near the key.
    float cores = pow(web, 2.2) * pool;
    col += u_gold * cores * 1.6;

    // Faint drifting motes catching the refracted light.
    vec2 mp = p * 6.0 + vec2(0.0, t * 0.9);
    float motes = pow(noise(mp + noise(mp * 1.6)), 9.0);
    col += u_gold * motes * (0.4 + pool) * 1.6;

    // Vignette to frame the drawing room.
    float vig = smoothstep(1.35, 0.25, length(p));
    col *= mix(0.74, 1.0, vig);

    // Fine grain to avoid banding on the dark charcoal gradient.
    float grain = (hash(uv * u_resolution + t) - 0.5) * 0.012;
    col += grain;

    // Reveal: the gem settles/brightens as the hero loads.
    col *= mix(0.18, 1.0, u_intensity);

    gl_FragColor = vec4(col, 1.0);
  }
`,v="#0d0d0d";function g({pointer:e}){let r=(0,f.useRef)(null),{size:a,viewport:n}=(0,o.useThree)(),s=(0,f.useRef)({x:0,y:0}),l=(0,f.useMemo)(()=>({u_time:{value:0},u_resolution:{value:new d.Vector2(a.width,a.height)},u_pointer:{value:new d.Vector2(0,0)},u_intensity:{value:0},u_void0:{value:new d.Color(v)},u_void1:{value:new d.Color("#1f1f1f")},u_gold:{value:new d.Color("#f0338f")},u_jewel:{value:new d.Color("#cfcfcf")}}),[]);return(0,i.useFrame)(({clock:t},i)=>{let o=r.current;if(!o)return;o.uniforms.u_time.value=t.getElapsedTime(),o.uniforms.u_resolution.value.set(a.width,a.height);let n=e.current??{x:0,y:0},l=1-Math.pow(.0016,i);s.current.x+=(n.x-s.current.x)*l,s.current.y+=(n.y-s.current.y)*l,o.uniforms.u_pointer.value.set(s.current.x,s.current.y);let c=o.uniforms.u_intensity.value;o.uniforms.u_intensity.value=c+(1-c)*Math.min(1,.9*i)}),(0,t.jsxs)("mesh",{scale:[n.width,n.height,1],children:[(0,t.jsx)("planeGeometry",{args:[1,1]}),(0,t.jsx)("shaderMaterial",{ref:r,vertexShader:h,fragmentShader:p,uniforms:l,depthWrite:!1})]})}function x({pointer:e,lite:r}){let o=(0,f.useRef)(null);return(0,i.useFrame)(({clock:t},r)=>{let i=o.current;if(!i)return;let a=t.getElapsedTime(),n=e.current??{x:0,y:0};i.rotation.y+=.16*r;let s=1-Math.pow(.0026,r),l=.3*n.y+.05*Math.sin(.4*a),c=-(.26*n.x);i.rotation.x+=(l-i.rotation.x)*s,i.rotation.z+=(c-i.rotation.z)*s;let u=1+.016*Math.sin(.5*a);i.scale.setScalar(u)}),(0,t.jsx)(a.Float,{speed:.9,rotationIntensity:.16,floatIntensity:.45,children:(0,t.jsx)("group",{ref:o,children:(0,t.jsxs)("mesh",{castShadow:!0,children:[(0,t.jsx)("dodecahedronGeometry",{args:[1.15,0]}),(0,t.jsx)(l.MeshTransmissionMaterial,{samples:r?6:10,resolution:r?256:512,thickness:1.7,roughness:.02,ior:1.62,chromaticAberration:.85,anisotropy:.35,distortion:.18,distortionScale:.45,temporalDistortion:.05,clearcoat:1,clearcoatRoughness:.05,color:"#fdfdfd",attenuationColor:"#bdbdbd",attenuationDistance:1.4,background:new d.Color(v)})]})})})}function y(){return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("ambientLight",{intensity:.3}),(0,t.jsxs)(n.Environment,{resolution:256,frames:1,children:[(0,t.jsx)(s.Lightformer,{form:"rect",intensity:3.6,color:"#fafafa",position:[-3.4,3.4,2],rotation:[-Math.PI/5,0,0],scale:[5,9,1]}),(0,t.jsx)(s.Lightformer,{form:"rect",intensity:2.2,color:"#9a9a9a",position:[4,1.2,1],rotation:[0,-Math.PI/2.4,0],scale:[6,6,1]}),(0,t.jsx)(s.Lightformer,{form:"ring",intensity:2.6,color:"#f0338f",position:[1.5,2.4,-3.5],scale:[3.5,3.5,1]}),(0,t.jsx)(s.Lightformer,{form:"circle",intensity:1.5,color:"#2a2a2a",position:[-1.5,-2.8,-3],scale:[7,7,1]})]}),(0,t.jsx)("directionalLight",{position:[-4,5,3],intensity:1.1,color:"#ffffff"})]})}e.s(["default",0,function({lite:e=!1}){let i=(0,f.useRef)({x:0,y:0}),o=(0,f.useRef)(null),[a,n]=(0,f.useState)(!0);(0,f.useEffect)(()=>{let e,t=o.current,r=!0,i=()=>n(r&&"visible"===document.visibilityState);return t&&"u">typeof IntersectionObserver&&(e=new IntersectionObserver(([e])=>{r=e.isIntersecting,i()},{rootMargin:"120px"})).observe(t),document.addEventListener("visibilitychange",i),()=>{e?.disconnect(),document.removeEventListener("visibilitychange",i)}},[]);let s=a?"always":"never";return(0,t.jsxs)("div",{ref:o,className:"absolute inset-0",onPointerMove:e=>{let t=e.currentTarget.getBoundingClientRect();i.current.x=(e.clientX-t.left)/t.width*2-1,i.current.y=-((e.clientY-t.top)/t.height*2-1)},onPointerLeave:()=>{i.current.x=0,i.current.y=0},children:[(0,t.jsx)(r.Canvas,{orthographic:!0,frameloop:s,camera:{zoom:1,position:[0,0,1]},dpr:[1,2],gl:{antialias:!1,alpha:!1,powerPreference:"high-performance"},style:{position:"absolute",inset:0},children:(0,t.jsx)(g,{pointer:i})}),(0,t.jsxs)(r.Canvas,{frameloop:s,camera:{position:[0,0,5],fov:38},dpr:[1,2],gl:{antialias:!0,alpha:!0,powerPreference:"high-performance",toneMapping:d.ACESFilmicToneMapping},style:{position:"absolute",inset:0,pointerEvents:"none"},children:[(0,t.jsx)(y,{}),(0,t.jsx)(x,{pointer:i,lite:e}),!e&&(0,t.jsx)(c.Sparkles,{count:26,scale:[6,5,3],size:2.2,speed:.26,opacity:.5,color:"#f0338f"}),(0,t.jsxs)(u.EffectComposer,{enableNormalPass:!1,children:[(0,t.jsx)(u.Bloom,{intensity:e?.85:1.25,luminanceThreshold:.62,luminanceSmoothing:.2,mipmapBlur:!0,kernelSize:e?m.KernelSize.MEDIUM:m.KernelSize.LARGE}),(0,t.jsx)(u.Vignette,{eskil:!1,offset:.3,darkness:.78})]})]})]})}],24162)},55660,e=>{e.n(e.i(24162))}]);