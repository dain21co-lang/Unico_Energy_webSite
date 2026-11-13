"use client";

import { useEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { PLATE, WING, CORE, EV, ESTAIR_TYP, ESTAIR_LOW, floorY, floorH, ROOF_Y, ROOMS, COLORS, kindOf } from "./model";
import type { Rect } from "./model";

/*
 * 원도면 치수로 세운 선 건물. 스크롤 진행값(0~1)에 따라
 * 0~0.28 층이 하나씩 올라가고 → 0.28~0.5 회전·색 변화 → 0.5~0.72 층이 펼쳐지며 객실이 채워지고 → 이후 유지
 */
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

type Seg = number[];
const rectLoop = (s: Seg, r: Rect, y: number) => {
  const [x0, z0, x1, z1] = r;
  s.push(x0, y, z0, x1, y, z0, x1, y, z0, x1, y, z1, x1, y, z1, x0, y, z1, x0, y, z1, x0, y, z0);
};
const rectPosts = (s: Seg, r: Rect, y0: number, y1: number) => {
  const [x0, z0, x1, z1] = r;
  for (const [x, z] of [[x0, z0], [x1, z0], [x1, z1], [x0, z1]]) s.push(x, y0, z, x, y1, z);
};
const mullions = (s: Seg, r: Rect, y0: number, y1: number, step: number) => {
  const [x0, z0, x1, z1] = r;
  const nx = Math.max(1, Math.round((x1 - x0) / step)), nz = Math.max(1, Math.round((z1 - z0) / step));
  for (let i = 1; i < nx; i++) { const x = x0 + ((x1 - x0) * i) / nx; s.push(x, y0, z0, x, y1, z0, x, y0, z1, x, y1, z1); }
  for (let i = 1; i < nz; i++) { const z = z0 + ((z1 - z0) * i) / nz; s.push(x0, y0, z, x0, y1, z, x1, y0, z, x1, y1, z); }
};

function floorSegs(k: number): Seg {
  const s: Seg = [];
  const h = floorH(k);
  const blocks: Rect[] = [PLATE, CORE, EV];
  if (k <= 3) blocks.push(WING);
  if (k === 2 || k === 3) blocks.push(ESTAIR_LOW);
  if (k >= 4) blocks.push(ESTAIR_TYP);
  for (const b of blocks) { rectLoop(s, b, 0); rectPosts(s, b, 0, h); }
  mullions(s, PLATE, 0.15, h, 3.05);
  if (k <= 3) mullions(s, WING, 0.15, h, 3.3);
  // 창대 높이 수평선 (본체)
  rectLoop(s, PLATE, Math.min(0.95, h * 0.3));
  if (k === 4) { rectLoop(s, [WING[0], WING[1], WING[2], WING[3]], 1.1); rectPosts(s, WING, 0, 1.1); } // 4층 옥상정원 난간
  return s;
}

function roofSegs(): Seg {
  const s: Seg = [];
  rectLoop(s, PLATE, 0); rectLoop(s, PLATE, 1.1); rectPosts(s, PLATE, 0, 1.1);
  rectLoop(s, CORE, 0); rectLoop(s, CORE, 3.6); rectPosts(s, CORE, 0, 3.6); // 계단탑
  rectLoop(s, EV, 0); rectLoop(s, EV, 4.4); rectPosts(s, EV, 0, 4.4);
  return s;
}

export default function Building3D({ progress, paused, className }: { progress: MutableRefObject<number>; paused: MutableRefObject<boolean>; className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      el.dataset.nogl = "1";
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = "pan-y";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.5, 400);
    const root = new THREE.Group();
    scene.add(root);
    const CX = 9, CZ = 5.5; // 회전 중심(날개 포함 대략 중심)

    const res = new THREE.Vector2(1, 1);
    const mats: LineMaterial[] = [];
    const mkLine = (segs: Seg, width: number, glow: boolean) => {
      const g = new LineSegmentsGeometry();
      g.setPositions(segs.map((v, i) => (i % 3 === 0 ? v - CX : i % 3 === 2 ? v - CZ : v)));
      const m = new LineMaterial({ color: 0x9cc2ff, linewidth: width, transparent: true, opacity: glow ? 0.16 : 0.95, depthWrite: false, blending: glow ? THREE.AdditiveBlending : THREE.NormalBlending });
      m.resolution = res;
      mats.push(m);
      return new LineSegments2(g, m);
    };

    type FloorObj = { g: THREE.Group; k: number; rooms: THREE.Mesh[]; roomLines: LineSegments2 | null };
    const floors: FloorObj[] = [];
    for (let k = 1; k <= 9; k++) {
      const g = new THREE.Group();
      g.position.y = floorY(k);
      const segs = floorSegs(k);
      g.add(mkLine(segs, 1.3, false));
      g.add(mkLine(segs, 5.5, true));
      const rooms: THREE.Mesh[] = [];
      const rs: Seg = [];
      for (const rm of ROOMS[kindOf(k)]) {
        const [x0, z0, x1, z1] = rm.r;
        const geo = new THREE.PlaneGeometry(x1 - x0 - 0.12, z1 - z0 - 0.12);
        const mat = new THREE.MeshBasicMaterial({ color: COLORS[rm.t], transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set((x0 + x1) / 2 - CX, 0.06, (z0 + z1) / 2 - CZ);
        g.add(mesh);
        rooms.push(mesh);
        rectLoop(rs, [x0 + 0.06, z0 + 0.06, x1 - 0.06, z1 - 0.06], 0.07);
      }
      let roomLines: LineSegments2 | null = null;
      if (rs.length) {
        roomLines = mkLine(rs, 1.0, false);
        (roomLines.material as LineMaterial).opacity = 0;
        g.add(roomLines);
      }
      root.add(g);
      floors.push({ g, k, rooms, roomLines });
    }
    const roof = new THREE.Group();
    roof.position.y = ROOF_Y;
    roof.add(mkLine(roofSegs(), 1.3, false));
    roof.add(mkLine(roofSegs(), 5.5, true));
    root.add(roof);

    // 바닥 격자 (대지)
    const grid: Seg = [];
    for (let i = -6; i <= 6; i++) {
      grid.push(i * 4 + CX, 0, -22 + CZ, i * 4 + CX, 0, 22 + CZ);
      grid.push(-24 + CX, 0, i * 4 + CZ, 24 + CX, 0, i * 4 + CZ);
    }
    const gridLine = mkLine(grid, 0.6, false);
    (gridLine.material as LineMaterial).opacity = 0.18;
    root.add(gridLine);

    const cBlue = new THREE.Color("#7fb2ff"), cMint = new THREE.Color("#8edbd3"), cGold = new THREE.Color("#e3c993"), cIvory = new THREE.Color("#f4efe2");
    const tmp = new THREE.Color();

    let yaw = -0.62, drag = 0, vel = 0, down = false, lastX = 0;
    const onDown = (e: PointerEvent) => { down = true; lastX = e.clientX; };
    const onMove = (e: PointerEvent) => { if (!down) return; const dx = e.clientX - lastX; lastX = e.clientX; drag += dx * 0.008; vel = dx * 0.008; };
    const onUp = () => { down = false; };
    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = w + "px";
      renderer.domElement.style.height = h + "px";
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
      res.set(w * dpr, h * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let raf = 0, last = performance.now(), visible = true, sp = 0;
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; }, { threshold: 0 });
    io.observe(el);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible) return;
      sp += (progress.current - sp) * Math.min(1, dt * 6); // 부드럽게 따라가기
      const p = sp;

      // 1) 층 올리기
      const build = smooth(0.0, 0.28, p) * 1.0001;
      const ex = smooth(0.5, 0.68, p); // 펼침
      const fill = smooth(0.56, 0.72, p);
      floors.forEach(({ g, k, rooms, roomLines }) => {
        const t = Math.min(1, Math.max(0, 0.35 + build * 9.6 - (k - 1)));
        const e = t * t * (3 - 2 * t);
        g.scale.y = Math.max(0.0001, e);
        g.position.y = floorY(k) + (1 - e) * -1.2 + ex * (k - 1) * 2.1;
        g.visible = t > 0.001;
        for (const m of rooms) (m.material as THREE.MeshBasicMaterial).opacity = fill * 0.62;
        if (roomLines) (roomLines.material as LineMaterial).opacity = fill * 0.9;
      });
      const rt = Math.min(1, Math.max(0, 0.35 + build * 9.6 - 9));
      roof.visible = rt > 0.001;
      roof.scale.y = Math.max(0.0001, rt);
      roof.position.y = ROOF_Y + ex * 9 * 2.1;

      // 2) 색
      if (p < 0.36) tmp.copy(cBlue).lerp(cMint, smooth(0.22, 0.36, p));
      else if (p < 0.6) tmp.copy(cMint).lerp(cGold, smooth(0.36, 0.5, p));
      else tmp.copy(cGold).lerp(cIvory, smooth(0.6, 0.72, p) * 0.55);
      for (const m of mats) m.color.copy(tmp);
      (gridLine.material as LineMaterial).color.set("#6f8399");

      // 3) 회전
      if (!down) { drag += vel; vel *= 0.92; }
      const auto = paused.current ? 0 : dt * 0.12;
      yaw += auto;
      const turn = smooth(0.24, 0.5, p) * Math.PI * 0.85;
      root.rotation.y = yaw + drag + turn;
      const side = smooth(0.5, 0.6, p) - smooth(0.78, 0.86, p);
      root.position.x = -side * 6.5;

      // 4) 카메라
      const span = ROOF_Y + ex * 9 * 2.1;
      const narrow = camera.aspect < 0.75;
      const dist = (narrow ? 128 : 92) + ex * (narrow ? 84 : 56);
      const ty = Math.max(8, span * 0.5 * (0.35 + 0.65 * build)) + (narrow ? span * 0.05 : 0);
      const elev = 0.3 + ex * 0.22 - smooth(0.28, 0.48, p) * 0.08;
      camera.position.set(Math.cos(elev) * dist * 0.0 + 0, ty + Math.sin(elev) * dist, Math.cos(elev) * dist);
      camera.lookAt(0, ty, 0);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mt = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mt)) mt.forEach((x) => x.dispose());
        else if (mt) mt.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progress, paused]);

  return <div ref={host} className={className} />;
}
