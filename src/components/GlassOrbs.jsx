"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function GlassShape({ position, geometry, scale = 1, speed = 1 }) {
  const ref = useRef();
  const [start] = useState(() => Math.random() * Math.PI * 2);

  useFrame(({ clock, mouse }) => {
    const t = clock.getElapsedTime() * speed + start;
    ref.current.position.y = position[1] + Math.sin(t) * 0.4;
    ref.current.rotation.x = t * 0.3;
    ref.current.rotation.y = t * 0.2;
    ref.current.position.x = position[0] + mouse.x * 0.3;
    ref.current.position.z = position[2] + mouse.y * 0.2;
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      {geometry}
      <meshPhysicalMaterial
        color="#cfa646"
        transparent
        opacity={0.55}
        roughness={0.15}
        metalness={0}
        clearcoat={1}
        clearcoatRoughness={0.1}
        ior={1.3}
      />
    </mesh>
  );
}

export default function GlassOrbs() {
  const [enabled] = useState(
    () =>
      typeof window !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  if (!enabled) return null;

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        filter: "drop-shadow(0 10px 18px rgba(5, 46, 43, 0.22))",
      }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 5]} intensity={1.2} color="#cfa646" />
      <directionalLight position={[-4, -2, 3]} intensity={0.5} color="#c3cbd8" />

      <GlassShape
        position={[0.2, 2.0, 0]}
        geometry={<icosahedronGeometry args={[0.9, 0]} />}
        scale={0.75}
        speed={0.6}
      />
      <GlassShape
        position={[2.9, -2.0, -1]}
        geometry={<torusGeometry args={[0.6, 0.22, 16, 64]} />}
        scale={0.75}
        speed={0.8}
      />
      <GlassShape
        position={[2.4, 1.8, -2]}
        geometry={<octahedronGeometry args={[0.55, 0]} />}
        scale={0.75}
        speed={1.1}
      />
      <GlassShape
        position={[1.2, -2.1, -1.5]}
        geometry={<sphereGeometry args={[0.4, 32, 32]} />}
        scale={0.75}
        speed={0.9}
      />
    </Canvas>
  );
}
