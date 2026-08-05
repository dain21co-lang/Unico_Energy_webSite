"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useScroll, useMotionValueEvent } from "framer-motion";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const LIQUID_COLOR = new THREE.Color("#cfa646");
const SOLID_COLOR = new THREE.Color("#c3cbd8");
const LERP_COLOR = new THREE.Color();

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(max-width: 767px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

function useReducedMotion() {
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  return reduced;
}

function usePointerRef() {
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // A dedicated window-level listener, independent of the canvas's own
    // `pointer-events: none` (set so the crystal never blocks clicks on the
    // page) — R3F's built-in `state.pointer` only updates from events the
    // canvas element itself receives, which pointer-events: none suppresses
    const onMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return pointerRef;
}

function StaticEnvironment() {
  const { gl, scene } = useThree();

  useEffect(() => {
    // A single procedural room, baked ONCE into a small PMREM cubemap — no
    // network fetch (unlike drei's <Environment preset="..."> presets, which
    // download a remote HDRI) and no per-frame re-render, just static
    // reflections for the metal material to pick up
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    const renderTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    // Mutating three.js's Scene graph directly (not a React value) is the
    // normal, idiomatic way to set this — not something the immutability
    // rule is meant to catch
    // eslint-disable-next-line react-hooks/immutability
    scene.environment = renderTarget.texture;
    pmremGenerator.dispose();

    return () => {
      renderTarget.texture.dispose();
      scene.environment = null;
    };
  }, [gl, scene]);

  return null;
}

function CrystalMesh({ progressRef }: { progressRef: React.RefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);
  const pointerRef = usePointerRef();
  const targetVec = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    mesh.rotation.x += delta * 0.15;
    mesh.rotation.y += delta * 0.22;

    targetVec.set(pointerRef.current.x * 0.7, pointerRef.current.y * 0.45, 0);
    mesh.position.x = THREE.MathUtils.damp(mesh.position.x, targetVec.x, 4, delta);
    mesh.position.y = THREE.MathUtils.damp(mesh.position.y, targetVec.y, 4, delta);

    const p = progressRef.current;
    const mat = materialRef.current;
    LERP_COLOR.copy(LIQUID_COLOR).lerp(SOLID_COLOR, p);
    mat.color.copy(LERP_COLOR);
    mat.metalness = THREE.MathUtils.lerp(0.75, 1, p);
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.6, 0]} />
      <meshStandardMaterial ref={materialRef} metalness={0.85} roughness={0.1} />
    </mesh>
  );
}

function Scene({ progressRef }: { progressRef: React.RefObject<number> }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 3, 5]} intensity={1.1} color="#cfa646" />
      <directionalLight position={[-4, -2, 3]} intensity={0.5} color="#c3cbd8" />
      <StaticEnvironment />
      <CrystalMesh progressRef={progressRef} />
    </>
  );
}

function StaticFallback() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      aria-hidden
    >
      <div
        className="h-64 w-64 rounded-full sm:h-80 sm:w-80"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, rgba(207,166,70,0.55), rgba(195,203,216,0.25) 55%, transparent 75%)",
          filter: "blur(2px)",
        }}
      />
    </div>
  );
}

export default function AlchemistSphere() {
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const progressRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  // Scoped to this component's own box (which spans the Hero section),
  // not the whole document — otherwise progress barely moves while the
  // Hero (a small fraction of the full page) is on screen
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });

  if (isMobile || reducedMotion) {
    return <StaticFallback />;
  }

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        style={{ pointerEvents: "none" }}
      >
        <Scene progressRef={progressRef} />
      </Canvas>
    </div>
  );
}
