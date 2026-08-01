"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "next-themes";

/**
 * Progress-ring metaphor: lime-lit torus + wireframe core + orbit nodes.
 * Mouse parallax via window events — canvas stays pointer-events-none.
 */
function ProgressOrb({
  mouse,
  isDark,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  isDark: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const core = useRef<THREE.Mesh>(null);

  const palette = useMemo(
    () => ({
      ring: isDark ? "#b8ff40" : "#7cbc1f",
      core: isDark ? "#c8ff4d" : "#84cc16",
      accent: isDark ? "#a3e635" : "#65a30d",
      emissive: isDark ? "#84cc16" : "#4d7c0f",
    }),
    [isDark],
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      const targetX = mouse.current.y * 0.35;
      const targetY = mouse.current.x * 0.45;
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        targetX,
        0.04,
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        targetY + t * 0.12,
        0.04,
      );
    }
    if (ring.current) {
      ring.current.rotation.z = t * 0.35;
      ring.current.rotation.x = Math.sin(t * 0.2) * 0.15;
    }
    if (core.current) {
      const pulse = 1 + Math.sin(t * 1.6) * 0.04;
      core.current.scale.setScalar(pulse);
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.6}>
      <group ref={group}>
        <mesh ref={ring} rotation={[Math.PI / 2.4, 0.2, 0]}>
          <torusGeometry args={[1.55, 0.045, 24, 96]} />
          <meshStandardMaterial
            color={palette.ring}
            emissive={palette.emissive}
            emissiveIntensity={isDark ? 0.85 : 0.45}
            metalness={0.35}
            roughness={0.25}
            transparent
            opacity={isDark ? 0.55 : 0.4}
          />
        </mesh>

        <mesh ref={core}>
          <icosahedronGeometry args={[0.55, 1]} />
          <meshStandardMaterial
            color={palette.core}
            emissive={palette.emissive}
            emissiveIntensity={isDark ? 0.7 : 0.35}
            metalness={0.2}
            roughness={0.4}
            wireframe
            transparent
            opacity={isDark ? 0.45 : 0.35}
          />
        </mesh>

        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i / 6) * Math.PI * 2;
          const r = 1.55;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * r,
                Math.sin(angle) * 0.15,
                Math.sin(angle) * r,
              ]}
            >
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial
                color={palette.accent}
                emissive={palette.emissive}
                emissiveIntensity={isDark ? 1.1 : 0.6}
                transparent
                opacity={0.7}
              />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
}

function SceneContents({
  mouse,
  isDark,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  isDark: boolean;
}) {
  return (
    <>
      <ambientLight intensity={isDark ? 0.35 : 0.55} />
      <pointLight
        position={[4, 3, 5]}
        intensity={isDark ? 1.2 : 0.9}
        color={isDark ? "#c8ff4d" : "#84cc16"}
      />
      <pointLight position={[-4, -2, -3]} intensity={0.4} color="#38bdf8" />
      <ProgressOrb mouse={mouse} isDark={isDark} />
    </>
  );
}

export function SceneBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const mouse = useRef({ x: 0, y: 0 });
  const isDark = resolvedTheme !== "light";

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);

    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      mq.removeEventListener("change", onChange);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  if (!mounted || reduced) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute left-1/2 top-1/2 h-[min(70vw,560px)] w-[min(70vw,560px)] -translate-x-1/2 -translate-y-1/2 opacity-70 dark:opacity-90">
        <Canvas
          dpr={[1, 1.5]}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
          camera={{ position: [0, 0, 5.2], fov: 42 }}
          style={{ background: "transparent" }}
        >
          <SceneContents mouse={mouse} isDark={isDark} />
        </Canvas>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/60" />
    </div>
  );
}
