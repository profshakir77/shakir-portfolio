'use client';
import { useEffect, useRef } from 'react';

// Interactive 3D "full-stack core": a faceted core (the app), three tilted
// orbits (UI, API, data) with nodes travelling on them, stacked layer plates
// and a particle field. Follows the pointer, pauses off-screen, and renders a
// single still frame when the visitor prefers reduced motion.
export default function Hero3D() {
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
      camera.position.set(0, 0.3, 9.6);

      const css = () => getComputedStyle(document.documentElement);
      const col = (name) => new THREE.Color(css().getPropertyValue(name).trim() || '#ffffff');

      scene.add(new THREE.AmbientLight(0xffffff, 0.55));
      const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(4, 5, 6); scene.add(key);
      const rim = new THREE.PointLight(0xffffff, 18, 20); rim.position.set(-4, -2, 3); scene.add(rim);

      const world = new THREE.Group(); scene.add(world);

      // core
      const coreMat = new THREE.MeshStandardMaterial({ metalness: 0.35, roughness: 0.22, flatShading: true });
      const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 1), coreMat);
      world.add(core);
      const wireMat = new THREE.MeshBasicMaterial({ wireframe: true, transparent: true, opacity: 0.35 });
      const shell = new THREE.Mesh(new THREE.IcosahedronGeometry(1.75, 1), wireMat);
      world.add(shell);

      // orbits with travelling nodes
      const orbitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.55 });
      const nodeMat = new THREE.MeshStandardMaterial({ roughness: 0.3, metalness: 0.2 });
      const orbits = [
        { r: 2.55, tilt: [1.15, 0.2, 0], speed: 0.55 },
        { r: 3.05, tilt: [0.35, 0.9, 0.3], speed: -0.38 },
        { r: 3.55, tilt: [1.6, -0.5, 0.6], speed: 0.27 },
      ].map((o) => {
        const g = new THREE.Group(); g.rotation.set(...o.tilt);
        g.add(new THREE.Mesh(new THREE.TorusGeometry(o.r, 0.012, 8, 160), orbitMat));
        const node = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.26, 0.26), nodeMat);
        g.add(node); world.add(g);
        return { ...o, node, t: Math.random() * Math.PI * 2 };
      });

      // stacked layer plates (front end / API / database)
      const plateMat = new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.85, roughness: 0.4, metalness: 0.1 });
      const plates = new THREE.Group(); plates.position.set(2.0, -1.9, 1.2); plates.rotation.set(-0.5, 0.6, 0.15);
      [0, 0.32, 0.64].forEach((y, i) => {
        const p = new THREE.Mesh(new THREE.BoxGeometry(1.25 - i * 0.12, 0.08, 0.85 - i * 0.08), plateMat);
        p.position.y = y; plates.add(p);
      });
      world.add(plates);

      // particles
      const N = 420; const pos = new Float32Array(N * 3);
      for (let i = 0; i < N; i++) {
        const r = 4.5 + Math.random() * 4; const th = Math.random() * Math.PI * 2; const ph = Math.acos(2 * Math.random() - 1);
        pos[i * 3] = r * Math.sin(ph) * Math.cos(th); pos[i * 3 + 1] = r * Math.cos(ph) * 0.6; pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th) - 2;
      }
      const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const pMat = new THREE.PointsMaterial({ size: 0.035, transparent: true, opacity: 0.7 });
      const points = new THREE.Points(pg, pMat); scene.add(points);

      function applyTheme() {
        const core = col('--h-core'); const line = col('--h-line'); const node = col('--h-node');
        coreMat.color.copy(core); coreMat.emissive.copy(core).multiplyScalar(0.06);
        wireMat.color.copy(line); orbitMat.color.copy(line); orbitMat.opacity = 0.45;
        nodeMat.color.copy(node); plateMat.color.copy(core); pMat.color.copy(line);
        rim.color.copy(node);
      }
      applyTheme();
      const mo = new MutationObserver(applyTheme);
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

      function resize() {
        const w = el.clientWidth, h = el.clientHeight;
        renderer.setSize(w, h, false); camera.aspect = w / h;
        camera.position.z = w < 520 ? 11.5 : 9.6; camera.updateProjectionMatrix();
      }
      resize();
      const ro = new ResizeObserver(resize); ro.observe(el);

      const target = { x: 0, y: 0 };
      const onMove = (e) => {
        const p = e.touches ? e.touches[0] : e;
        target.x = (p.clientX / window.innerWidth - 0.5) * 2;
        target.y = (p.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener('pointermove', onMove, { passive: true });

      let visible = true, raf = 0, last = performance.now();
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && !raf) loop(); });
      io.observe(el);

      function frame(dt) {
        core.rotation.x += dt * 0.18; core.rotation.y += dt * 0.26;
        shell.rotation.y -= dt * 0.12; shell.rotation.z += dt * 0.05;
        orbits.forEach((o) => { o.t += dt * o.speed; o.node.position.set(Math.cos(o.t) * o.r, Math.sin(o.t) * o.r, 0); o.node.rotation.x += dt; o.node.rotation.y += dt; });
        plates.children.forEach((p, i) => { p.position.y = i * 0.32 + Math.sin(performance.now() / 900 + i) * 0.05; });
        points.rotation.y += dt * 0.02;
        world.rotation.y += (target.x * 0.45 - world.rotation.y) * 0.05;
        world.rotation.x += (target.y * 0.3 - world.rotation.x) * 0.05;
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

      if (reduce) frame(0); else loop();
      el.dataset.ready = '1';

      cleanup = () => {
        cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); mo.disconnect();
        window.removeEventListener('pointermove', onMove); document.removeEventListener('visibilitychange', onVis);
        scene.traverse((o) => { o.geometry?.dispose?.(); });
        [coreMat, wireMat, orbitMat, nodeMat, plateMat, pMat].forEach((m) => m.dispose());
        renderer.dispose(); renderer.domElement.remove();
      };
    }).catch(() => {});

    return () => { disposed = true; cleanup(); };
  }, []);

  return (
    <div className="stage" ref={host} aria-label="Interactive 3D model of a full-stack app: core, orbits for UI, API and data, and stacked layers" role="img">
      <div className="stage-fallback" aria-hidden="true" />
      <div className="stage-tags" aria-hidden="true">
        <span className="t1">&lt;UI /&gt;</span><span className="t2">API /v1</span><span className="t3">db.query()</span>
      </div>
    </div>
  );
}
