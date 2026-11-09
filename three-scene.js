/* three-scene.js - the 3D world (Three.js). Reads `state` and `showSkill` from script.js */
(function () {
  var cv = document.getElementById("c"),
    renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: cv,
      antialias: true,
      alpha: true,
    });
  } catch (e) {
    cv.style.display = "none";
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  var rm =
    window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x070b16, 0.02);
  var cam = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  var pl = new THREE.PointLight(0x5eead4, 1.1, 70);
  pl.position.set(0, 4, 6);
  scene.add(pl);
  var STEP = 12,
    ACC = "#5eead4";

  function canvasTex(text, w, h, size, color, bg) {
    var c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    var x = c.getContext("2d");
    if (bg) {
      x.fillStyle = bg;
      x.fillRect(0, 0, w, h);
    }
    x.fillStyle = color;
    x.font = "700 " + size + 'px "Segoe UI",Arial,sans-serif';
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(text, w / 2, h / 2);
    return new THREE.CanvasTexture(c);
  }
  function textPlane(text, width, size, color) {
    var w = 1024,
      h = 256,
      m = new THREE.Mesh(
        new THREE.PlaneGeometry(width, (width * h) / w),
        new THREE.MeshBasicMaterial({
          map: canvasTex(text, w, h, size, color),
          transparent: true,
        }),
      );
    return m;
  }

  /* Stars */
  var sp = new Float32Array(1800);
  for (var i = 0; i < 600; i++) {
    sp[i * 3] = (Math.random() - 0.5) * 60;
    sp[i * 3 + 1] = (Math.random() - 0.5) * 30;
    sp[i * 3 + 2] = 12 - Math.random() * 80;
  }
  var sg = new THREE.BufferGeometry();
  sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  scene.add(
    new THREE.Points(
      sg,
      new THREE.PointsMaterial({ color: 0x9bb0ff, size: 0.06 }),
    ),
  );

  /* Station 0: 3D name */
  var hero = new THREE.Group();
  hero.position.y = 0.8;
  scene.add(hero);
  for (var k = 0; k < 6; k++) {
    var L = textPlane("APARNA NR", 8.2, 140, k < 5 ? "#1f4e79" : ACC);
    L.position.z = -0.24 + k * 0.048;
    hero.add(L);
  }
  var sub = textPlane("Senior Python Full Stack Trainer", 7, 46, "#cbd5e1");
  sub.position.y = -1.15;
  hero.add(sub);
  /* Station 1: orbiting tech boxes */
  var skills = [
    ["HTML", "#e34f26", "The structure behind every page I teach and build."],
    [
      "JavaScript",
      "#c9a400",
      "Interactivity, AJAX and the logic of the front end.",
    ],
    [
      "Python",
      "#3776ab",
      "My main language for back ends, automation and teaching.",
    ],
    [
      "Django",
      "#0c4b33",
      "Full stack apps with ORM, auth, middleware and REST APIs.",
    ],
    [
      "PostgreSQL",
      "#336791",
      "Relational data design and queries for real projects.",
    ],
    [
      "Tailwind",
      "#0891b2",
      "Fast, responsive interfaces with utility classes.",
    ],
    [
      "n8n",
      "#ea4b71",
      "Workflow automation and API integrations without heavy code.",
    ],
  ];
  var ringG = new THREE.Group();
  ringG.position.set(0, 0.8, -STEP);
  scene.add(ringG);
  var boxes = [];
  skills.forEach(function (s, i) {
    var sz = Math.min(72, Math.floor(220 / (s[0].length * 0.58)));
    var t = canvasTex(s[0], 256, 256, sz, "#fff", s[1]);
    var m = new THREE.MeshStandardMaterial({ map: t, roughness: 0.5 });
    var b = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), m);
    var a = (i / skills.length) * Math.PI * 2;
    b.position.set(
      Math.cos(a) * 2.6,
      Math.sin(i * 1.3) * 0.4,
      Math.sin(a) * 2.6,
    );
    b.userData = { i: i, s: 1 };
    ringG.add(b);
    boxes.push(b);
  });

  /* Station 2: learning roadmap */
  var road = new THREE.Group();
  road.position.z = -2 * STEP;
  scene.add(road);
  var steps = [
      "HTML",
      "JavaScript",
      "Python",
      "Django",
      "PostgreSQL",
      "Deploy",
    ],
    nodes = [],
    pts = [];
  steps.forEach(function (n, i) {
    var x = -4 + i * 1.6,
      y = 0.9 + Math.sin(i * 1.1) * 0.9;
    pts.push(new THREE.Vector3(x, y, 0));
    var s = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 24, 24),
      new THREE.MeshStandardMaterial({
        color: 0x334155,
        emissive: 0x5eead4,
        emissiveIntensity: 0,
      }),
    );
    s.position.set(x, y, 0);
    road.add(s);
    nodes.push(s);
    var l = textPlane(n, 1.7, 92, "#e2e8f0");
    l.position.set(x, y - 0.65, 0);
    road.add(l);
  });
  road.add(
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0x5eead4 }),
    ),
  );

  /* Station 3: project cards */
  var proj = new THREE.Group();
  proj.position.z = -3 * STEP;
  scene.add(proj);
  var pdata = [
      ["E-Commerce App", "Django · PostgreSQL · Cart"],
      ["Document Q&A Bot", "Django · React · RAG"],
      ["Plant Disease AI", "Django · ML · REST API"],
    ],
    cards = [];
  pdata.forEach(function (d, i) {
    var c = document.createElement("canvas");
    c.width = 512;
    c.height = 320;
    var x = c.getContext("2d");
    var g = x.createLinearGradient(0, 0, 512, 320);
    g.addColorStop(0, "#0f172a");
    g.addColorStop(1, "#1e3a5f");
    x.fillStyle = g;
    x.fillRect(0, 0, 512, 320);
    x.strokeStyle = "#5eead4";
    x.lineWidth = 6;
    x.strokeRect(3, 3, 506, 314);
    x.textAlign = "center";
    x.fillStyle = "#fff";
    x.font = '700 46px "Segoe UI",Arial,sans-serif';
    x.fillText(d[0], 256, 150);
    x.fillStyle = "#9aa6bf";
    x.font = '400 30px "Segoe UI",Arial,sans-serif';
    x.fillText(d[1], 256, 205);
    var m = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 1.875),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c) }),
    );
    m.position.set((i - 1) * 3.5, 1.1 + (i === 1 ? 0.3 : 0), 0);
    m.userData.base = m.position.y;
    proj.add(m);
    cards.push(m);
  });

  /* Station 4: n8n-style contact flow */
  var flow = new THREE.Group();
  flow.position.set(0, 1.2, -4 * STEP);
  scene.add(flow);
  ["Your message", "Email", "Aparna"].forEach(function (n, i) {
    var b = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 0.9, 0.3),
      new THREE.MeshStandardMaterial({
        map: canvasTex(
          n,
          512,
          256,
          64,
          "#fff",
          i === 2 ? "#0f766e" : "#334155",
        ),
      }),
    );
    b.position.x = (i - 1) * 3.2;
    flow.add(b);
  });
  flow.add(
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-3.2, 0, 0),
        new THREE.Vector3(3.2, 0, 0),
      ]),
      new THREE.LineBasicMaterial({ color: 0x5eead4 }),
    ),
  );
  var pulse = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0x5eead4 }),
  );
  flow.add(pulse);

  /* Interaction */
  var p = 0,
    ray = new THREE.Raycaster(),
    mv = new THREE.Vector2();
  function pick() {
    mv.set(state.mx, state.my);
    ray.setFromCamera(mv, cam);
    var h = ray.intersectObjects(boxes);
    return h.length ? h[0].object : null;
  }
  function onSkills() {
    return Math.abs(p * 4 - 1) < 0.6;
  }
  state.onClick = function () {
    if (!onSkills()) return;
    var b = pick();
    if (b) {
      var s = skills[b.userData.i];
      showSkill(s[0], s[2]);
    }
  };

  function resize() {
    var w = innerWidth,
      h = innerHeight;
    renderer.setSize(w, h, false);
    cam.aspect = w / h;
    cam.updateProjectionMatrix();
    var vw = 2 * 7 * Math.tan((27.5 * Math.PI) / 180) * cam.aspect;
    hero.scale.setScalar(Math.min(1, (vw * 0.92) / 8.4));
    proj.scale.setScalar(Math.min(1, (vw * 0.92) / 10.2));
    road.scale.setScalar(Math.min(1, (vw * 0.92) / 9));
    flow.scale.setScalar(Math.min(1, (vw * 0.92) / 9));
    ringG.scale.setScalar(Math.min(1, (vw * 0.92) / 7));
  }
  window.addEventListener("resize", resize);
  resize();

  var clock = new THREE.Clock();
  function frame() {
    requestAnimationFrame(frame);
    var t = clock.getElapsedTime();
    p += (state.progress - p) * (rm ? 1 : 0.07);
    var cz = 7 - p * 4 * STEP;
    cam.position.set(state.mx * 0.6, state.my * 0.4 + 0.3, cz);
    cam.lookAt(state.mx * 0.3, state.my * 0.2 + 0.5, cz - 7);
    if (!rm) {
      ringG.rotation.y = t * 0.25;
      boxes.forEach(function (b) {
        b.rotation.y = t * 0.3 + b.userData.i;
      });
      pulse.position.x = -3.2 + ((t * 0.5) % 1) * 6.4;
    }
    var hov = onSkills() ? pick() : null;
    document.body.style.cursor = hov ? "pointer" : "default";
    boxes.forEach(function (b) {
      var tg = b === hov ? 1.3 : 1;
      b.userData.s += (tg - b.userData.s) * 0.15;
      b.scale.setScalar(b.userData.s);
    });
    var ps = p * 4;
    nodes.forEach(function (n, i) {
      var on = ps > 1.5 + i * 0.07;
      n.material.emissiveIntensity +=
        ((on ? 1.2 : 0) - n.material.emissiveIntensity) * 0.1;
    });
    cards.forEach(function (c, i) {
      c.rotation.y = -state.mx * 0.25 + (i - 1) * 0.12;
      c.position.y = c.userData.base + (rm ? 0 : Math.sin(t + i) * 0.08);
    });
    renderer.render(scene, cam);
  }
  frame();
})();
