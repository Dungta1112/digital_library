'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';

function FloatingBook() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2.5, 0.4]} />
        <meshStandardMaterial color="#22c55e" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Decorative pages */}
      <mesh position={[0.1, 0, 0]}>
         <boxGeometry args={[1.9, 2.4, 0.45]} />
         <meshStandardMaterial color="#ffffff" roughness={0.8} />
      </mesh>
    </Float>
  );
}

export function Home3DScene() {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  if (isMobile) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-green-400 rounded-xl border border-gray-800">
        <div className="text-center p-6">
          <div className="w-20 h-28 bg-green-500/20 border border-green-500 rounded mx-auto mb-4 flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <span className="text-3xl">📖</span>
          </div>
          <p className="text-sm font-medium">Smart Library</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#4ade80" />
        <Stars radius={50} depth={30} count={3000} factor={4} saturation={0} fade speed={1} />
        <FloatingBook />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate={true} autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
