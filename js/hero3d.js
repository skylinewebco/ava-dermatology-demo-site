/* ============================================================
   AVA DERMATOLOGY — Hero 3D
   Self-contained raw-WebGL raymarched centerpiece: an elegant,
   softly-lit floating skin-toned form with subsurface glow,
   fresnel rim light, ambient particles, mouse parallax.
   Graceful fallback to a CSS gradient if WebGL is unavailable.
   ============================================================ */
(function () {
  var canvas = document.getElementById("heroCanvas");
  if (!canvas) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Animated CSS fallback used when WebGL is unavailable or fails to init.
  // It animates via CSS keyframes (float + rotating sheen) — never a static image.
  function heroFallback() {
    canvas.style.display = "none";
    if (document.querySelector(".hero__orb-fallback")) return;
    var fb = document.createElement("div");
    fb.className = "hero__orb-fallback";
    fb.setAttribute("aria-hidden", "true");
    var host = document.querySelector(".hero") || canvas.parentNode;
    if (host) host.appendChild(fb);
  }

  var gl = null;
  try {
    gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false }) ||
         canvas.getContext("experimental-webgl", { alpha: true, premultipliedAlpha: false });
  } catch (e) { gl = null; }

  if (!gl) { heroFallback(); return; }

  var vertSrc =
    "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";

  var fragSrc = [
    "precision highp float;",
    "uniform vec2 uRes;",
    "uniform float uTime;",
    "uniform vec2 uMouse;",
    "uniform float uDark;",
    "",
    "float hash(vec3 p){ p=fract(p*0.3183099+0.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }",
    "float noise(vec3 x){",
    "  vec3 i=floor(x); vec3 f=fract(x); f=f*f*(3.0-2.0*f);",
    "  return mix(mix(mix(hash(i+vec3(0,0,0)),hash(i+vec3(1,0,0)),f.x),",
    "                 mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),",
    "             mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),",
    "                 mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);",
    "}",
    "float fbm(vec3 p){ float v=0.0,a=0.5; for(int i=0;i<4;i++){ v+=a*noise(p); p*=2.03; a*=0.5;} return v; }",
    "",
    "mat3 rotY(float a){ float c=cos(a),s=sin(a); return mat3(c,0.0,s, 0.0,1.0,0.0, -s,0.0,c); }",
    "mat3 rotX(float a){ float c=cos(a),s=sin(a); return mat3(1.0,0.0,0.0, 0.0,c,-s, 0.0,s,c); }",
    "mat3 rotZ(float a){ float c=cos(a),s=sin(a); return mat3(c,-s,0.0, s,c,0.0, 0.0,0.0,1.0); }",
    "",
    "float sdSphere(vec3 p, float r){ return length(p)-r; }",
    "",
    "// smooth blended form representing a soft skin surface",
    "float map(vec3 p, out float disp){",
    "  vec3 q = p;",
    "  float n = fbm(q*2.6 + vec3(0.0, uTime*0.05, 0.0));",
    "  disp = n;",
    "  float base = sdSphere(p, 0.62 + sin(uTime*0.4)*0.012);",   // subtle breathing
    "  base -= (n-0.5)*0.075;",   // gentle surface undulation like skin
    "  return base;",
    "}",
    "",
    "vec3 calcNormal(vec3 p){",
    "  float d; vec2 e=vec2(0.0015,0.0);",
    "  float c=map(p,d);",
    "  return normalize(vec3(",
    "    map(p+e.xyy,d)-c,",
    "    map(p+e.yxy,d)-c,",
    "    map(p+e.yyx,d)-c));",
    "}",
    "",
    "void main(){",
    "  vec2 uv = (gl_FragCoord.xy - 0.5*uRes.xy)/uRes.y;",
    "  // place the form to the right on wide screens, upper area on portrait",
    "  float ar = uRes.x/uRes.y;",
    "  float wide = step(1.1, ar);",
    "  vec2 fc = mix(vec2(0.0, 0.30), vec2(0.34, 0.02), wide);",
    "  uv -= fc;",
    "",
    "  // gentle positional parallax with the mouse for depth",
    "  uv += uMouse * 0.026;",
    "  // floating camera drift so the form feels alive and buoyant",
    "  vec3 ro = vec3(sin(uTime*0.21)*0.045, sin(uTime*0.3)*0.05, 4.0);",
    "  vec3 rd = normalize(vec3(uv, -1.6));",
    "",
    "  // continuous, seamless multi-axis tumble + mouse parallax (never stops)",
    "  float t = uTime*0.22;",   // primary spin: ~1 turn per 28s, visible yet elegant
    "  mat3 rot = rotY(t + uMouse.x*0.6)",
    "           * rotX(0.26*sin(uTime*0.16) - uMouse.y*0.45)",
    "           * rotZ(0.10*sin(uTime*0.11));",
    "",
    "  float tHit = 0.0; float d; float disp=0.0; bool hit=false;",
    "  vec3 pos;",
    "  for(int i=0;i<70;i++){",
    "    pos = ro + rd*tHit;",
    "    vec3 rp = rot*pos;",
    "    d = map(rp, disp);",
    "    if(d<0.001){ hit=true; break; }",
    "    tHit += d*0.85;",
    "    if(tHit>7.0) break;",
    "  }",
    "",
    "  vec3 col = vec3(0.0); float alpha = 0.0;",
    "",
    "  // theme-aware palette",
    "  vec3 skinLight = vec3(0.86, 0.92, 0.99);",   // pearl blue-white
    "  vec3 skinDeep  = vec3(0.36, 0.56, 0.80);",   // soft blue
    "  vec3 skinLightD= vec3(0.30, 0.45, 0.68);",
    "  vec3 skinDeepD = vec3(0.10, 0.18, 0.32);",
    "  vec3 baseA = mix(skinLight, skinLightD, uDark);",
    "  vec3 baseB = mix(skinDeep,  skinDeepD,  uDark);",
    "",
    "  if(hit){",
    "    vec3 rp = rot*pos;",
    "    vec3 n = calcNormal(rp);",
    "    // studio 3-point lighting",
    "    vec3 key = normalize(vec3(-0.6, 0.8, 0.7));",
    "    vec3 fill= normalize(vec3(0.8, 0.2, 0.5));",
    "    vec3 rim = normalize(vec3(0.2, -0.4, -0.9));",
    "    vec3 V = normalize(ro - pos);",
    "",
    "    float kd = max(dot(n, key), 0.0);",
    "    float fd = max(dot(n, fill), 0.0)*0.35;",
    "    float fres = pow(1.0 - max(dot(n, V), 0.0), 3.0);",
    "    float rimL = max(dot(n, rim), 0.0)*fres;",
    "",
    "    // dual soft studio softbox highlights for a glossy, lively surface",
    "    vec3 H = normalize(key + V);",
    "    float spec = pow(max(dot(n,H),0.0), 48.0)*0.6;",
    "    vec3 H2 = normalize(fill + V);",
    "    spec += pow(max(dot(n,H2),0.0), 96.0)*0.35;",
    "",
    "    vec3 surf = mix(baseB, baseA, kd*0.8 + 0.2);",
    "    surf += fd*baseA;",
    "    // subsurface-ish glow using displacement",
    "    surf += disp*0.10*baseA;",
    "",
    "    // procedural studio environment reflection that sweeps as the form turns",
    "    vec3 Rr = reflect(-V, n);",
    "    float envGrad = 0.5 + 0.5*Rr.y;",
    "    float box = smoothstep(0.62, 0.99, dot(Rr, key));",
    "    vec3 envCol = mix(baseB*0.7, baseA*1.15, envGrad) + box*mix(vec3(0.95), vec3(0.82,0.90,1.0), uDark);",
    "    float refl = pow(1.0 - max(dot(n,V),0.0), 2.5);",   // grazing angles reflect more (fresnel)
    "    surf = mix(surf, envCol, refl*0.45);",
    "",
    "    // fresnel rim in accent blue",
    "    vec3 rimCol = mix(vec3(0.55,0.75,1.0), vec3(0.65,0.82,1.0), uDark);",
    "    surf += rimL*rimCol*1.1;",
    "    surf += spec;",
    "",
    "    col = surf;",
    "    alpha = 1.0;",
    "    // soft edge feather",
    "    alpha *= smoothstep(0.0, 0.02, -d + 0.02);",
    "  }",
    "",
    "  // ambient veil scales down on dark so it never washes the charcoal base",
    "  float ambScale = mix(1.0, 0.42, uDark);",
    "",
    "  // ambient particles (screen-space, subtle)",
    "  vec2 pp = uv*vec2(uRes.x/uRes.y, 1.0);",
    "  float parts = 0.0;",
    "  for(int k=0;k<6;k++){",
    "    float fk = float(k);",
    "    float sp = 0.06 + fk*0.015;",
    "    vec2 c = vec2(",
    "      sin(uTime*sp + fk*2.1)*0.6 - wide*0.3 + 0.1*fk,",
    "      cos(uTime*sp*0.8 + fk*1.7)*0.5",
    "    );",
    "    float dd = length(pp - c);",
    "    parts += smoothstep(0.018, 0.0, dd)*0.45;",
    "  }",
    "  parts *= ambScale;",
    "  vec3 pcol = mix(vec3(0.4,0.6,0.85), vec3(0.62,0.8,1.0), uDark);",
    "  col += pcol*parts*(1.0-alpha);",
    "  alpha += parts*0.5*(1.0-alpha);",
    "",
    "  // soft halo tight around the form (not the whole screen)",
    "  float glow = smoothstep(0.85, 0.0, length(uv)) * mix(0.11, 0.05, uDark);",
    "  vec3 gcol = mix(vec3(0.55,0.74,0.98), vec3(0.34,0.5,0.74), uDark);",
    "  col += gcol*glow*(1.0-alpha);",
    "  alpha += glow*(1.0-alpha);",
    "",
    "  gl_FragColor = vec4(col, clamp(alpha,0.0,1.0));",
    "}"
  ].join("\n");

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn("Shader error:", gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  var vs = compile(gl.VERTEX_SHADER, vertSrc);
  var fs = compile(gl.FRAGMENT_SHADER, fragSrc);
  if (!vs || !fs) { heroFallback(); return; }
  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn("Program link error");
    heroFallback();
    return;
  }
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  var uRes = gl.getUniformLocation(prog, "uRes");
  var uTime = gl.getUniformLocation(prog, "uTime");
  var uMouse = gl.getUniformLocation(prog, "uMouse");
  var uDark = gl.getUniformLocation(prog, "uDark");

  var mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  var dpr = Math.min(window.devicePixelRatio || 1, 1.6);
  // Lower resolution on small screens for performance
  if (window.innerWidth < 768) dpr = Math.min(dpr, 1.2);

  function resize() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    var W = Math.floor(w * dpr), H = Math.floor(h * dpr);
    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W; canvas.height = H;
      gl.viewport(0, 0, W, H);
    }
  }

  window.addEventListener("mousemove", function (e) {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  function isDark() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? 1.0 : 0.0;
  }

  var start = performance.now();
  var running = true;
  var lastFrame = 0;
  // Smoother on desktop; gently capped on mobile to stay performant
  var frameInterval = 1000 / (window.innerWidth < 768 ? 40 : 60);

  function render(now) {
    if (!running) return;
    requestAnimationFrame(render);
    if (now - lastFrame < frameInterval) return;
    lastFrame = now;

    resize();
    // The orb always animates automatically; reduced-motion users get a gentler,
    // slower drift rather than a frozen frame (it must never be static).
    var t = (now - start) / 1000;
    if (reduceMotion) t *= 0.6;
    // ease mouse (parallax is a bonus on top of the automatic motion)
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;

    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, t);
    gl.uniform2f(uMouse, reduceMotion ? 0 : mouse.x, reduceMotion ? 0 : mouse.y);
    gl.uniform1f(uDark, isDark());
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  requestAnimationFrame(render);

  // Pause when hero is off-screen or tab hidden (performance)
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { running = false; }
    else if (!running) { running = true; lastFrame = 0; requestAnimationFrame(render); }
  });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          if (!running && !document.hidden) { running = true; lastFrame = 0; requestAnimationFrame(render); }
        } else {
          running = false;
        }
      });
    }, { threshold: 0.01 });
    io.observe(canvas);
  }
})();
