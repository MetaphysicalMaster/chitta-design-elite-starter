(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,98443,e=>{"use strict";var t=e.i(76970);e.s(["extend",()=>t.e])},71320,e=>{"use strict";var t=e.i(76970);e.s(["createPortal",()=>t.o])},14714,e=>{"use strict";var t=e.i(76970);e.s(["applyProps",()=>t.s])},318,e=>{"use strict";var t=e.i(76970);e.s(["useLoader",()=>t.G])},71611,e=>{"use strict";function t(){return(t=Object.assign.bind()).apply(null,arguments)}e.s(["default",()=>t])},75565,e=>{"use strict";var t,i,r,n,a=e.i(71611),o=e.i(21348),s=e.i(64556),l=e.i(98443),c=e.i(46648),m=e.i(26843);function u(e,t,i){let r=(0,m.useThree)(e=>e.size),n=(0,m.useThree)(e=>e.viewport),a="number"==typeof e?e:r.width*n.dpr,l="number"==typeof t?t:r.height*n.dpr,c=("number"==typeof e?i:e)||{},{samples:u=0,depth:f,...d}=c,h=null!=f?f:c.depthBuffer,p=s.useMemo(()=>{let e=new o.WebGLRenderTarget(a,l,{minFilter:o.LinearFilter,magFilter:o.LinearFilter,type:o.HalfFloatType,...d});return h&&(e.depthTexture=new o.DepthTexture(a,l,o.FloatType)),e.samples=u,e},[]);return s.useLayoutEffect(()=>{p.setSize(a,l),u&&(p.samples=u)},[u,p,a,l]),s.useEffect(()=>()=>p.dispose(),[]),p}var f=o;let d=(t={},i="void main() { }",r="void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); discard;  }",(n=class extends f.ShaderMaterial{constructor(e){for(const n in super({vertexShader:i,fragmentShader:r,...e}),t)this.uniforms[n]=new f.Uniform(t[n]),Object.defineProperty(this,n,{get(){return this.uniforms[n].value},set(e){this.uniforms[n].value=e}});this.uniforms=f.UniformsUtils.clone(this.uniforms)}}).key=f.MathUtils.generateUUID(),n);class h extends o.MeshPhysicalMaterial{constructor(e=6,t=!1){super(),this.uniforms={chromaticAberration:{value:.05},transmission:{value:0},_transmission:{value:1},transmissionMap:{value:null},roughness:{value:0},thickness:{value:0},thicknessMap:{value:null},attenuationDistance:{value:1/0},attenuationColor:{value:new o.Color("white")},anisotropicBlur:{value:.1},time:{value:0},distortion:{value:0},distortionScale:{value:.5},temporalDistortion:{value:0},buffer:{value:null}},this.onBeforeCompile=i=>{i.uniforms={...i.uniforms,...this.uniforms},this.anisotropy>0&&(i.defines.USE_ANISOTROPY=""),t?i.defines.USE_SAMPLER="":i.defines.USE_TRANSMISSION="",i.fragmentShader=`
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
`+i.fragmentShader,i.fragmentShader=i.fragmentShader.replace("#include <transmission_pars_fragment>",`
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
`),i.fragmentShader=i.fragmentShader.replace("#include <transmission_fragment>",`  
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
`)},Object.keys(this.uniforms).forEach(e=>Object.defineProperty(this,e,{get:()=>this.uniforms[e].value,set:t=>this.uniforms[e].value=t}))}}let p=s.forwardRef(({buffer:e,transmissionSampler:t=!1,backside:i=!1,side:r=o.FrontSide,transmission:n=1,thickness:m=0,backsideThickness:f=0,backsideEnvMapIntensity:p=1,samples:v=10,resolution:g,backsideResolution:x,background:M,anisotropy:y,anisotropicBlur:S,...b},C)=>{let w,T,R,j;(0,l.extend)({MeshTransmissionMaterial:h});let F=s.useRef(null),[D]=s.useState(()=>new d),k=u(x||g),z=u(g);return(0,c.useFrame)(e=>{if(F.current.time=e.clock.elapsedTime,F.current.buffer===z.texture&&!t){var n;(j=null==(n=F.current.__r3f.parent)?void 0:n.object)&&(R=e.gl.toneMapping,w=e.scene.background,T=F.current.envMapIntensity,e.gl.toneMapping=o.NoToneMapping,M&&(e.scene.background=M),j.material=D,i&&(e.gl.setRenderTarget(k),e.gl.render(e.scene,e.camera),j.material=F.current,j.material.buffer=k.texture,j.material.thickness=f,j.material.side=o.BackSide,j.material.envMapIntensity=p),e.gl.setRenderTarget(z),e.gl.render(e.scene,e.camera),j.material=F.current,j.material.thickness=m,j.material.side=r,j.material.buffer=z.texture,j.material.envMapIntensity=T,e.scene.background=w,e.gl.setRenderTarget(null),e.gl.toneMapping=R)}}),s.useImperativeHandle(C,()=>F.current,[]),s.createElement("meshTransmissionMaterial",(0,a.default)({args:[v,t],ref:F},b,{buffer:e||z.texture,_transmission:n,anisotropicBlur:null!=S?S:y,transmission:t?n:0,thickness:m,side:r}))});e.s(["MeshTransmissionMaterial",0,p],75565)},41967,e=>{"use strict";var t=e.i(44180),i=e.i(1529),r=e.i(46648),n=e.i(26843),a=e.i(92958),o=e.i(44803),s=e.i(75565),l=e.i(79867),c=e.i(43050),m=e.i(64556),u=e.i(21348);let f=["#f06ba8","#f7a6c8","#e0568f","#f0c987","#fff1f6"];function d({spec:e,body:i,lite:n}){let a=(0,m.useRef)(null);return(0,r.useFrame)((t,r)=>{let n=a.current;if(!n)return;n.position.copy(i.pos);let o=i.squash;n.scale.set(e.radius*(1-.5*o),e.radius*(1+o),e.radius*(1-.5*o)),n.rotation.y+=.3*r,n.rotation.z=.18*i.vel.x}),(0,t.jsxs)("mesh",{ref:a,position:e.home,children:[(0,t.jsx)("sphereGeometry",{args:[1,n?24:40,n?24:40]}),(0,t.jsx)(s.MeshTransmissionMaterial,{samples:n?4:8,resolution:n?128:256,thickness:.9,roughness:.05,ior:1.32,chromaticAberration:.5,anisotropy:.2,distortion:.2,distortionScale:.4,temporalDistortion:.08,clearcoat:1,clearcoatRoughness:.04,color:e.color,attenuationColor:e.color,attenuationDistance:.7,transmission:.62})]})}function h(){return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("ambientLight",{intensity:.5}),(0,t.jsxs)(a.Environment,{resolution:256,frames:1,children:[(0,t.jsx)(o.Lightformer,{form:"rect",intensity:4,color:"#fff4ec",position:[-3.4,3.6,2],rotation:[-Math.PI/5,0,0],scale:[6,9,1]}),(0,t.jsx)(o.Lightformer,{form:"rect",intensity:2.7,color:"#f06ba8",position:[4,.8,1],rotation:[0,-Math.PI/2.4,0],scale:[6,7,1]}),(0,t.jsx)(o.Lightformer,{form:"ring",intensity:2.4,color:"#f0c987",position:[1.4,2.2,-3.6],scale:[4,4,1]}),(0,t.jsx)(o.Lightformer,{form:"circle",intensity:1.5,color:"#e8b86a",position:[-1.6,-2.6,-3],scale:[7,7,1]})]}),(0,t.jsx)("directionalLight",{position:[-4,5,3],intensity:1,color:"#fff0f6"})]})}function p({pointer:e,lite:i}){var a;let o=(0,m.useRef)(null),s=(a=i?7:11,(0,m.useMemo)(()=>{let e=[];for(let t=0;t<a;t++){let i=t/Math.max(1,a-1),r=(1.7*Math.sin(2.4*t)+(t%2==0?.4:-.4))*1,n=(i-.5)*4.6+.5*Math.sin(1.7*t),o=.7*Math.cos(1.3*t),s=.42+.55*Math.abs(Math.sin(3.1*t)),l=f[t%f.length];e.push({radius:s,color:l,home:new u.Vector3(r,n,o),phase:1.37*t,speed:.5+t%5*.12,jiggle:.6+t%3*.25})}return e},[a])),{viewport:l}=(0,n.useThree)(),c=(0,m.useMemo)(()=>s.map(e=>({pos:e.home.clone(),vel:new u.Vector3,squash:0})),[s]),h=(0,m.useRef)(0);return(0,r.useFrame)(({clock:t},i)=>{let r=o.current;if(!r)return;let n=Math.min(i,1/30),a=t.getElapsedTime(),m=e.current?.active??!1,f=(e.current?.x??0)*(l.width/2),d=(e.current?.y??0)*(l.height/2);for(let e=0;e<c.length;e++){let t=s[e],i=c[e],r=.28*Math.sin(a*t.speed+t.phase)*t.jiggle,o=.34*Math.cos(a*t.speed*.8+t.phase)*t.jiggle,l=t.home.x+r,u=t.home.y+o,h=t.home.z;if(i.vel.x+=(l-i.pos.x)*7.5*n,i.vel.y+=(u-i.pos.y)*7.5*n,i.vel.z+=(h-i.pos.z)*7.5*n,m){let e=i.pos.x-f,t=i.pos.y-d,r=e*e+t*t;if(r<2.2*2.2){let a=Math.max(1e-4,Math.sqrt(r)),o=(1-a/2.2)*9;i.vel.x+=e/a*o*n,i.vel.y+=t/a*o*n}}}for(let e=0;e<c.length;e++)for(let t=e+1;t<c.length;t++){let i=c[e],r=c[t],a=r.pos.x-i.pos.x,o=r.pos.y-i.pos.y,l=r.pos.z-i.pos.z,m=Math.max(1e-4,Math.sqrt(a*a+o*o+l*l)),u=(s[e].radius+s[t].radius)*.82;if(m<u){let e=(u-m)/u,t=a/m*e*6*n,s=o/m*e*6*n,c=l/m*e*6*n;i.vel.x-=t,i.vel.y-=s,i.vel.z-=c,r.vel.x+=t,r.vel.y+=s,r.vel.z+=c}}let p=Math.pow(9e-4,n);for(let e=0;e<c.length;e++){let t=c[e];t.vel.multiplyScalar(p),t.pos.addScaledVector(t.vel,n);let i=Math.min(.16,.05*t.vel.length());t.squash+=(i-t.squash)*Math.min(1,10*n)}h.current=Math.min(1,h.current+.7*i);let v=1-Math.pow(1-h.current,3);r.position.y=-((1-v)*1.4);let g=u.MathUtils.clamp(l.width/9,.62,1.15);r.scale.setScalar((.6+.4*v)*g)}),(0,t.jsx)("group",{ref:o,children:s.map((e,r)=>(0,t.jsx)(d,{spec:e,body:c[r],lite:i},r))})}e.s(["default",0,function({lite:e=!1}){let r=(0,m.useRef)({x:0,y:0,active:!1}),n=(0,m.useRef)(null),[a,o]=(0,m.useState)(!0);return(0,m.useEffect)(()=>{let e,t=n.current,i=!0,r=()=>o(i&&"visible"===document.visibilityState);return t&&"u">typeof IntersectionObserver&&(e=new IntersectionObserver(([e])=>{i=e.isIntersecting,r()},{rootMargin:"120px"})).observe(t),document.addEventListener("visibilitychange",r),()=>{e?.disconnect(),document.removeEventListener("visibilitychange",r)}},[]),(0,t.jsx)("div",{ref:n,className:"absolute inset-0",onPointerMove:e=>{let t=e.currentTarget.getBoundingClientRect();r.current.x=(e.clientX-t.left)/t.width*2-1,r.current.y=-((e.clientY-t.top)/t.height*2-1),r.current.active=!0},onPointerLeave:()=>{r.current.active=!1},children:(0,t.jsxs)(i.Canvas,{frameloop:a?"always":"never",camera:{position:[0,0,8],fov:40},dpr:[1,2],gl:{antialias:!0,alpha:!0,powerPreference:"high-performance",toneMapping:u.ACESFilmicToneMapping},style:{position:"absolute",inset:0},children:[(0,t.jsx)(h,{}),(0,t.jsx)(p,{pointer:r,lite:e}),(0,t.jsxs)(l.EffectComposer,{enableNormalPass:!1,children:[(0,t.jsx)(l.Bloom,{intensity:e?.62:.9,luminanceThreshold:.64,luminanceSmoothing:.22,mipmapBlur:!0,kernelSize:e?c.KernelSize.MEDIUM:c.KernelSize.LARGE}),(0,t.jsx)(l.Vignette,{eskil:!1,offset:.32,darkness:.62})]})]})})}])},82328,e=>{e.n(e.i(41967))}]);