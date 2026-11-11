'use client';
import { useEffect, useRef } from 'react';

// Interactive 3D "tech globe": every tool I use as a logo badge on a sphere,
// around a glowing wireframe core with an orbit ring. Drag to spin, follows
// the pointer, pauses off-screen, still frame for reduced motion.
const ICONS = [
  'react-original', 'nextjs-plain', 'nodejs-plain', 'typescript-plain', 'javascript-plain', 'html5-plain',
  'css3-plain', 'tailwindcss-original', 'php-plain', 'laravel-original', 'express-original', 'python-plain',
  'mysql-original', 'postgresql-plain', 'mongodb-plain', 'redis-plain', 'prisma-original', 'firebase-plain',
  'wordpress-plain', 'woocommerce-plain', 'figma-plain', 'threejs-original', 'docker-plain', 'git-plain',
  'github-original', 'vercel-original', 'bootstrap-plain', 'jquery-plain',
];

function badge(THREE, src) {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const draw = (img) => {
    g.clearRect(0, 0, 128, 128);
    g.beginPath(); g.arc(64, 64, 60, 0, Math.PI * 2);
    g.fillStyle = '#ffffff'; g.shadowColor = 'rgba(11,31,58,.25)'; g.shadowBlur = 8; g.fill();
    g.shadowBlur = 0; g.lineWidth = 3; g.strokeStyle = 'rgba(232,96,60,.55)'; g.stroke();
    if (img) g.drawImage(img, 30, 30, 68, 68);
    tex.needsUpdate = true;
  };
  draw(null);
  const img = new Image(); img.onload = () => draw(img); img.src = `/icons/${src}.svg`;
  return tex;
}

export default function SkillsGlobe3D() {
  const host = useRef(null);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    import('three').then((THREE) => {
      if (disposed || !host.current) return;
      const el = host.current;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const small = window.innerWidth < 760;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      camera.position.set(0, 0, small ? 12.5 : 11.2);

      const css = getComputedStyle(document.documentElement);
      const accent = new THREE.Color(css.getPropertyValue('--accent').trim() || '#E8603C');
      const navy = new THREE.Color(css.getPropertyValue('--navy2').trim() || '#16325C');

      scene.add(new THREE.AmbientLight(0xffffff, 0.7));
      const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(4, 5, 6); scene.add(key);
      const glow = new THREE.PointLight(accent, 20, 12); scene.add(glow);

      const world = new THREE.Group(); scene.add(world);
      const disposables = [];
      const keep = (x) => { disposables.push(x); return x; };

      // glowing core
      const coreMat = keep(new THREE.MeshStandardMaterial({ color: navy, metalness: 0.45, roughness: 0.25, flatShading: true }));
      world.add(new THREE.Mesh(keep(new THREE.IcosahedronGeometry(1.25, 1)), coreMat));
      const wireMat = keep(new THREE.MeshBasicMaterial({ color: accent, wireframe: true, transparent: true, opacity: 0.4 }));
      world.add(new THREE.Mesh(keep(new THREE.IcosahedronGeometry(1.6, 1)), wireMat));

      // orbit rings
      const ringMat = keep(new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.45 }));
      [[3.9, 1.2, 0.3], [3.6, 0.4, 1.1]].forEach(([r, a, b]) => {
        const ring = new THREE.Mesh(keep(new THREE.TorusGeometry(r, 0.012, 8, 200)), ringMat);
        ring.rotation.set(a, b, 0); world.add(ring);
      });

      // logo badges on a fibonacci sphere
      const R = 3.2;
      const sprites = ICONS.map((name, i) => {
        const y = 1 - (i / (ICONS.length - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const th = i * Math.PI * (3 - Math.sqrt(5));
        const mat = keep(new THREE.SpriteMaterial({ map: keep(badge(THREE, name)), transparent: true }));
        const s = new THREE.Sprite(mat);
        s.position.set(Math.cos(th) * r * R, y * R, Math.sin(th) * r * R);
        s.scale.setScalar(0.78);
        world.add(s);
        return s;
      });

      // twinkling particles
      const pts = new Float32Array(240 * 3);
      for (let i = 0; i < pts.length; i++) pts[i] = (Math.random() - 0.5) * 12;
      const pg = keep(new THREE.BufferGeometry()); pg.setAttribute('position', new THREE.BufferAttribute(pts, 3));
      const pm = keep(new THREE.PointsMaterial({ color: accent, size: 0.04, transparent: true, opacity: 0.6 }));
      world.add(new THREE.Points(pg, pm));

      const size = () => {
        const w = el.clientWidth || 1, h = el.clientHeight || 1;
        renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      };
      size();
      const ro = new ResizeObserver(size); ro.observe(el);

      // drag to spin + gentle pointer follow
      let vx = 0.004, vy = 0, drag = false, lx = 0, ly = 0, tilt = 0;
      const down = (e) => { drag = true; lx = e.clientX; ly = e.clientY; el.setPointerCapture?.(e.pointerId); };
      const up = () => { drag = false; };
      const move = (e) => {
        if (drag) { vx = (e.clientX - lx) * 0.004; vy = (e.clientY - ly) * 0.004; lx = e.clientX; ly = e.clientY; }
        else tilt = (e.clientY / window.innerHeight - 0.5) * 0.4;
      };
      el.addEventListener('pointerdown', down);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointermove', move, { passive: true });

      const scale = new THREE.Vector3();
      let visible = false, raf = 0, t = 0;
      const frame = () => {
        raf = 0;
        if (!visible) return;
        t += 0.016;
        world.rotation.y += vx;
        world.rotation.x += vy + (tilt - world.rotation.x) * 0.02;
        if (!drag) { vx += (0.004 - vx) * 0.02; vy *= 0.92; }
        sprites.forEach((s, i) => {
          const z = s.getWorldPosition(scale).z;
          const k = 0.62 + (z / R + 1) * 0.2 + Math.sin(t * 2 + i) * 0.02;
          s.scale.setScalar(k); s.material.opacity = 0.45 + (z / R + 1) * 0.275;
        });
        glow.intensity = 18 + Math.sin(t * 2) * 4;
        renderer.render(scene, camera);
        raf = requestAnimationFrame(frame);
      };
      const io = new IntersectionObserver(([en]) => {
        visible = en.isIntersecting;
        if (reduce) { setTimeout(() => renderer.render(scene, camera), 600); return; }
        if (visible && !raf) raf = requestAnimationFrame(frame);
      });
      io.observe(el);

      cleanup = () => {
        cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
        el.removeEventListener('pointerdown', down);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointermove', move);
        disposables.forEach((d) => d.dispose && d.dispose());
        renderer.dispose(); renderer.domElement.remove();
      };
    });

    return () => { disposed = true; cleanup(); };
  }, []);

  return (
    <div className="globe3d" ref={host} role="img" aria-label="3D globe of the tools I use: React, Next.js, Node.js, PHP, Laravel, databases and more">
      <span className="globe-hint">Drag to spin</span>
    </div>
  );
}
