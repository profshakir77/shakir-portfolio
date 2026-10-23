'use client';
import { useEffect, useRef } from 'react';

// Interactive 3D "mentorship constellation": a glowing mentor core in the
// middle, student nodes on three tilted shells, links between them and pulses
// of knowledge travelling outward along the links. Nodes grow as they orbit
// (students levelling up). Follows the pointer, pauses off-screen and renders
// a single still frame for visitors who prefer reduced motion.
export default function Mentor3D() {
  const host = useRef(null);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    import('three').then((THREE) => {
      if (disposed || !host.current) return;
      const el = host.current;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0.4, 10);

      const css = () => getComputedStyle(document.documentElement);
      const col = (name) => new THREE.Color(css().getPropertyValue(name).trim() || '#ffffff');

      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const key = new THREE.DirectionalLight(0xffffff, 1.5); key.position.set(4, 6, 6); scene.add(key);
      const glow = new THREE.PointLight(0xffffff, 26, 14); glow.position.set(0, 0, 0); scene.add(glow);

      const world = new THREE.Group(); scene.add(world);

      // mentor core: faceted gem + slow wire halo + soft sprite glow
      const coreMat = new THREE.MeshStandardMaterial({ metalness: 0.4, roughness: 0.2, flatShading: true });
      const core = new THREE.Mesh(new THREE.OctahedronGeometry(1.05, 1), coreMat);
      world.add(core);
      const haloMat = new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.28 });
      const halo = new THREE.Mesh(new THREE.IcosahedronGeometry(1.55, 1), haloMat);
      world.add(halo);

      const glowTex = (() => {
        const c = document.createElement('canvas'); c.width = c.height = 128;
        const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
        gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
        return new THREE.CanvasTexture(c);
      })();
      const auraMat = new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, opacity: 0.55 });
      const aura = new THREE.Sprite(auraMat); aura.scale.set(5.2, 5.2, 1); world.add(aura);

      // student nodes on three shells
      const nodeMat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.25 });
      const nodeAltMat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.25 });
      const nodeGeo = new THREE.SphereGeometry(0.16, 20, 14);
      const shells = [
        { r: 2.5, n: 5, tilt: [0.9, 0.1, 0.2], speed: 0.32 },
        { r: 3.25, n: 7, tilt: [0.25, 0.8, -0.3], speed: -0.22 },
        { r: 4.0, n: 9, tilt: [1.45, -0.4, 0.5], speed: 0.15 },
      ];
      const ringMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.35 });
      const nodes = [];
      shells.forEach((s, si) => {
        const g = new THREE.Group(); g.rotation.set(...s.tilt); world.add(g);
        g.add(new THREE.Mesh(new THREE.TorusGeometry(s.r, 0.008, 6, 180), ringMat));
        for (let i = 0; i < s.n; i++) {
          const m = new THREE.Mesh(nodeGeo, (i + si) % 3 === 0 ? nodeAltMat : nodeMat);
          g.add(m);
          nodes.push({ mesh: m, group: g, r: s.r, a: (i / s.n) * Math.PI * 2 + si, speed: s.speed, base: 0.7 + Math.random() * 0.6, phase: Math.random() * 6 });
        }
      });

      // links: mentor -> every node, plus node -> nearest neighbour on next shell
      const maxSeg = nodes.length * 2;
      const linkPos = new Float32Array(maxSeg * 6);
      const linkGeo = new THREE.BufferGeometry(); linkGeo.setAttribute('position', new THREE.BufferAttribute(linkPos, 3));
      const linkMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.32 });
      const links = new THREE.LineSegments(linkGeo, linkMat); world.add(links);

      // pulses travelling from the mentor outward
      const pulseMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.95 });
      const pulseGeo = new THREE.SphereGeometry(0.06, 10, 8);
      const pulses = Array.from({ length: 14 }, (_, i) => {
        const m = new THREE.Mesh(pulseGeo, pulseMat); world.add(m);
        return { mesh: m, target: i % nodes.length, t: Math.random() };
      });

      // particle field
      const N = 520; const pos = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const r = 5 + Math.random() * 5; const th = Math.random() * Math.PI * 2; const ph = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(ph) * Math.cos(th); pos[i * 3 + 1] = r * Math.cos(ph) * 0.6; pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) - 2;
      }
      const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const pMat = new THREE.PointsMaterial({ size: 0.035, transparent: true, opacity: 0.65 });
      const points = new THREE.Points(pg, pMat); scene.add(points);

      function applyTheme() {
        const c = col('--h-core'); const line = col('--h-line'); const node = col('--h-node');
        coreMat.color.copy(node); coreMat.emissive.copy(node).multiplyScalar(0.25);
        haloMat.color.copy(line); ringMat.color.copy(line); linkMat.color.copy(line);
        nodeMat.color.copy(c); nodeAltMat.color.copy(node); nodeAltMat.emissive.copy(node).multiplyScalar(0.15);
        pulseMat.color.copy(node); auraMat.color.copy(node); pMat.color.copy(line); glow.color.copy(node);
        const dark = document.documentElement.getAttribute('data-theme') === 'dark';
        auraMat.opacity = dark ? 0.5 : 0.32; linkMat.opacity = dark ? 0.38 : 0.3;
      }
      applyTheme();
      const mo = new MutationObserver(applyTheme);
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

      function resize() {
        const w = el.clientWidth, h = el.clientHeight;
        renderer.setSize(w, h, false); camera.aspect = w / h;
        camera.position.z = w < 520 ? 12.5 : 10; camera.updateProjectionMatrix();
      }
      resize();
      const ro = new ResizeObserver(resize); ro.observe(el);

      const target = { x: 0, y: 0 };
      const onMove = (e) => {
        target.x = (e.clientX / window.innerWidth - 0.5) * 2;
        target.y = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener('pointermove', onMove, { passive: true });

      const wp = nodes.map(() => new THREE.Vector3());
      let visible = true, raf = 0, last = performance.now(), time = 0;
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) loop(); });
      io.observe(el);

      function frame(dt) {
        time += dt;
        core.rotation.x += dt * 0.25; core.rotation.y += dt * 0.35;
        halo.rotation.y -= dt * 0.1; halo.rotation.z += dt * 0.04;
        const beat = 1 + Math.sin(time * 2.2) * 0.04; core.scale.setScalar(beat);
        aura.scale.setScalar(5.2 + Math.sin(time * 2.2) * 0.25);

        world.updateMatrixWorld(true);
        const inv = new THREE.Matrix4().copy(world.matrixWorld).invert();
        nodes.forEach((n, i) => {
          n.a += dt * n.speed;
          n.mesh.position.set(Math.cos(n.a) * n.r, Math.sin(n.a) * n.r, 0);
          n.mesh.scale.setScalar(n.base * (1 + Math.sin(time * 1.3 + n.phase) * 0.18));
          n.group.updateMatrixWorld(true);
          wp[i].setFromMatrixPosition(n.mesh.matrixWorld).applyMatrix4(inv);
        });

        let k = 0;
        const put = (a, b) => { linkPos[k++] = a.x; linkPos[k++] = a.y; linkPos[k++] = a.z; linkPos[k++] = b.x; linkPos[k++] = b.y; linkPos[k++] = b.z; };
        const origin = new THREE.Vector3();
        const s0 = shells[0].n, s1 = s0 + shells[1].n;
        nodes.forEach((n, i) => {
          if (i < s0) put(origin, wp[i]);
          const from = i < s0 ? s0 : i < s1 ? s1 : -1;
          if (from < 0) return;
          const to = i < s0 ? s1 : nodes.length;
          let best = -1, bd = Infinity;
          for (let j = from; j < to; j++) { const d = wp[i].distanceToSquared(wp[j]); if (d < bd) { bd = d; best = j; } }
          if (best >= 0) put(wp[i], wp[best]);
        });
        for (let i = s0; i < s1; i += 2) put(origin, wp[i]);
        for (let i = k; i < linkPos.length; i++) linkPos[i] = 0;
        linkGeo.attributes.position.needsUpdate = true;
        linkGeo.setDrawRange(0, k / 3);

        pulses.forEach((p) => {
          p.t += dt * 0.55;
          if (p.t >= 1) { p.t = 0; p.target = Math.floor(Math.random() * nodes.length); }
          p.mesh.position.copy(wp[p.target]).multiplyScalar(p.t);
          p.mesh.scale.setScalar(Math.sin(p.t * Math.PI) * 1.2 + 0.2);
        });

        points.rotation.y += dt * 0.02;
        world.rotation.y += (target.x * 0.5 - world.rotation.y) * 0.05 + dt * 0.0;
        world.rotation.x += (target.y * 0.32 - world.rotation.x) * 0.05;
        renderer.render(scene, camera);
      }
      function loop() {
        raf = 0;
        if (!visible || document.hidden) return;
        const now = performance.now(); const dt = Math.min((now - last) / 1000, 0.05); last = now;
        frame(dt); raf = requestAnimationFrame(loop);
      }
      const onVis = () => { last = performance.now(); if (!document.hidden && !raf) loop(); };
      document.addEventListener('visibilitychange', onVis);

      if (reduce) frame(0.016); else loop();
      el.dataset.ready = '1';

      cleanup = () => {
        cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); mo.disconnect();
        window.removeEventListener('pointermove', onMove); document.removeEventListener('visibilitychange', onVis);
        scene.traverse((o) => { o.geometry?.dispose?.(); });
        [coreMat, haloMat, nodeMat, nodeAltMat, ringMat, linkMat, pulseMat, auraMat, pMat].forEach((m) => m.dispose());
        glowTex.dispose(); renderer.dispose(); renderer.domElement.remove();
      };
    }).catch(() => {});

    return () => { disposed = true; cleanup(); };
  }, []);

  return (
    <div className="stage mstage" ref={host} aria-label="Interactive 3D constellation: a mentor at the centre with student nodes orbiting and growing" role="img">
      <div className="stage-fallback" aria-hidden="true" />
      <div className="stage-tags" aria-hidden="true">
        <span className="t1">mentor.guide()</span><span className="t2">git push --portfolio</span><span className="t3">level++</span>
      </div>
    </div>
  );
}
