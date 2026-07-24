'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, RoundedBox } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';

function PageLines({ side }: { side: -1 | 1 }) {
  return (
    <group position={[side * 0.73, 0.02, 0.125]} rotation={[0, 0, side * -0.035]}>
      {[-0.5, -0.25, 0, 0.25, 0.5].map((y, index) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[index === 4 ? 0.62 : 0.88, 0.014, 0.012]} />
          <meshStandardMaterial color="#A7C7B5" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function OpenBook() {
  const groupRef = useRef<THREE.Group>(null);
  const reducedMotion = useReducedMotion();

  useFrame((state, delta) => {
    if (!groupRef.current || reducedMotion) return;
    groupRef.current.rotation.y += delta * 0.16;
    groupRef.current.rotation.x = -0.2 + Math.sin(state.clock.elapsedTime * 0.65) * 0.035;
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 1.25}
      rotationIntensity={reducedMotion ? 0 : 0.12}
      floatIntensity={reducedMotion ? 0 : 0.38}
    >
      <group ref={groupRef} rotation={[-0.2, -0.35, 0.02]} scale={1.08}>
        <RoundedBox args={[3.15, 2.18, 0.15]} radius={0.08} smoothness={4} position={[0, 0, -0.15]}>
          <meshStandardMaterial color="#047857" roughness={0.42} metalness={0.05} />
        </RoundedBox>

        <RoundedBox args={[1.49, 2.02, 0.18]} radius={0.055} smoothness={4} position={[-0.78, 0, -0.01]} rotation={[0, -0.035, -0.018]}>
          <meshStandardMaterial color="#FFFDF4" roughness={0.9} />
        </RoundedBox>
        <RoundedBox args={[1.49, 2.02, 0.18]} radius={0.055} smoothness={4} position={[0.78, 0, -0.01]} rotation={[0, 0.035, 0.018]}>
          <meshStandardMaterial color="#FFFDF4" roughness={0.9} />
        </RoundedBox>

        <RoundedBox args={[0.16, 2.2, 0.28]} radius={0.05} smoothness={4} position={[0, 0, -0.02]}>
          <meshStandardMaterial color="#064E3B" roughness={0.5} />
        </RoundedBox>

        <PageLines side={-1} />
        <PageLines side={1} />

        <mesh position={[0.72, 0.85, 0.18]} rotation={[0, 0, -0.06]}>
          <boxGeometry args={[0.18, 0.7, 0.035]} />
          <meshStandardMaterial color="#EF4444" roughness={0.65} />
        </mesh>
      </group>
    </Float>
  );
}

function BookFallback() {
  return (
    <div className="relative flex h-full min-h-[310px] items-center justify-center md:hidden" aria-label="Minh họa quyển sách số">
      <div className="absolute h-44 w-44 rounded-full bg-emerald-200/50 blur-3xl dark:bg-emerald-500/10" />
      <div className="relative flex w-[250px] -rotate-3 drop-shadow-[0_24px_28px_rgba(6,78,59,0.22)] motion-safe:animate-float-slow">
        <div className="h-40 w-1/2 rounded-l-2xl border-[7px] border-r-[3px] border-emerald-700 bg-[#fffdf4] p-4">
          <div className="space-y-3 pt-5">{[1, 2, 3, 4].map((line) => <div key={line} className="h-1 rounded bg-emerald-200" />)}</div>
        </div>
        <div className="relative h-40 w-1/2 rounded-r-2xl border-[7px] border-l-[3px] border-emerald-700 bg-[#fffdf4] p-4">
          <span className="absolute right-5 top-0 h-14 w-4 bg-red-500" />
          <div className="space-y-3 pt-5">{[1, 2, 3, 4].map((line) => <div key={line} className="h-1 rounded bg-emerald-200" />)}</div>
        </div>
      </div>
    </div>
  );
}

export function Home3DScene() {
  return (
    <div className="h-full min-h-[310px] w-full">
      <BookFallback />
      <div className="hidden h-full min-h-[420px] md:block">
        <Canvas
          camera={{ position: [0, 0.25, 5.2], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={1.8} />
          <directionalLight position={[4, 6, 5]} intensity={3.2} color="#ffffff" />
          <directionalLight position={[-4, 1, 3]} intensity={2.2} color="#6ee7b7" />
          <pointLight position={[0, -3, 2]} intensity={1.5} color="#f87171" />
          <OpenBook />
        </Canvas>
      </div>
    </div>
  );
}
