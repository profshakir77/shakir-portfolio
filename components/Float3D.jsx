'use client';
import { useEffect, useRef } from 'react';

// Small floating 3D accent for section corners. One shape per section,
// coloured from the site theme, follows the pointer a little, pauses when
// off-screen, hidden on small screens, still frame for reduced motion.
export default function Float3D({ shape = 'knot', side = 'right' }) {
  const host = useRef(null);

  useEffect(() => {
    if (window.innerWidth < 760) return;
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
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
      camera.position.set(0, 0, 7);

      const css = getComputedStyle(document.documentElement);
      const col = (n, f) => new THREE.Color(css.getPropertyValue(n).trim() || f);
      const accent = col('--accent', '#E8603C');
      const navy = col('--navy2', '#16325C');

      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      const key = new THREE.DirectionalLight(0xffffff, 1.8); key.position.set(3, 4, 5); scene.add(key);
      const rim = new THREE.PointLight(accent, 14, 15); rim.position.set(-3, -2, 3); scene.add(rim);

      const group = new THREE.Group(); scene.add(group);
      const matA = new THREE.MeshStandardMaterial({ color: accent, metalness: 0.4, roughness: 0.25 });
      const matB = new THREE.MeshStandardMaterial({ color: navy, metalness: 0.5, roughness: 0.3, flatShading: true });
      const wire = new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: 0.35 });
      const geos = [];
      const add = (g, m, pos) => { geos.push(g); const mesh = new THREE.Mesh(g, m); if (pos) mesh.position.set(...pos); group.add(mesh); return mesh; };

      if (shape === 'cubes') {
        [[-0.9, -0.6, 0], [0.4, 0.2, 0.4], [-0.2, 1.0, -0.4], [1.1, -0.9, -0.2]].forEach((p, i) => {
          const m = add(new THREE.BoxGeometry(0.9, 0.9, 0.9), i % 2 ? matA : matB, p);
          m.rotation.set(i, i * 0.6, 0);
        });
      } else if (shape === 'gem') {
        add(new THREE.OctahedronGeometry(1.4, 0), matB);
        add(new THREE.OctahedronGeometry(1.75, 0), wire);
      } else if (shape === 'rings') {
        [1.5, 1.15, 0.8].forEach((r, i) => {
          const m = add(new THREE.TorusGeometry(r, 0.09, 16, 100), i === 1 ? matA : matB);
          m.rotation.set(i * 0.7, i * 0.4, 0);
        });
      } else if (shape === 'sphere') {
        add(new THREE.IcosahedronGeometry(1.3, 1), matB);
        add(new THREE.IcosahedronGeometry(1.7, 1), wire);
        add(new THREE.SphereGeometry(0.28, 24, 24), matA, [1.9, 0.9, 0.5]);
      } else {
        add(new THREE.TorusKnotGeometry(1.0, 0.32, 160, 20), matA);
      }

      const size = () => {
        const w = el.clientWidth || 1, h = el.clientHeight || 1;
        renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      };
      size();
      const ro = new ResizeObserver(size); ro.observe(el);

      let tx = 0, ty = 0;
      const move = (e) => { tx = (e.clientX / window.innerWidth - 0.5) * 0.6; ty = (e.clientY / window.innerHeight - 0.5) * 0.4; };
      window.addEventListener('pointermove', move, { passive: true });

      let visible = false, raf = 0, t = 0;
      const frame = () => {
        raf = 0;
        if (!visible) return;
        t += 0.01;
        group.rotation.y += (tx + t * 0.6 - group.rotation.y) * 0.05;
        group.rotation.x += (ty + Math.sin(t) * 0.25 - group.rotation.x) * 0.05;
        group.position.y = Math.sin(t * 1.4) * 0.18;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
      };
      const io = new IntersectionObserver(([en]) => {
        visible = en.isIntersecting;
        if (reduce) { renderer.render(scene, camera); return; }
        if (visible && !raf) raf = requestAnimationFrame(frame);
      });
      io.observe(el);
      el.classList.add('on');

      cleanup = () => {
        cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
        window.removeEventListener('pointermove', move);
        geos.forEach((g) => g.dispose()); [matA, matB, wire].forEach((m) => m.dispose());
        renderer.dispose(); renderer.domElement.remove();
      };
    });

    return () => { disposed = true; cleanup(); };
  }, [shape]);

  return <div ref={host} className={'f3d f3d-' + side} aria-hidden="true" />;
}
