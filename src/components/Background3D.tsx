import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function DustParticles() {
  const meshRef = useRef<THREE.Points>(null!);
  const count = 800;

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
      spd[i] = 0.001 + Math.random() * 0.003;
    }
    return { positions: pos, speeds: spd };
  }, []);

  useFrame(() => {
    const arr = meshRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i];
      if (arr[i * 3 + 1] > 12.5) arr[i * 3 + 1] = -12.5;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.07} color="#c8a060" transparent opacity={0.75} sizeAttenuation />
    </points>
  );
}

function PulsingOrb({ position, color, radius = 2 }: { position: [number, number, number]; color: string; radius?: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    ref.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 0.6) * 0.08);
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.12} />
    </mesh>
  );
}

export default function Background3D() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0,
      background: 'radial-gradient(ellipse at 30% 40%, #1f0800 0%, #0a0305 50%, #000 100%)'
    }}>
      <Canvas camera={{ position: [0, 0, 12], fov: 65 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[-6, 4, 4]} intensity={1.2} color="#ff4400" />
        <pointLight position={[7, -3, 3]} intensity={0.6} color="#440022" />
        <DustParticles />
        <PulsingOrb position={[-9, 4, -6]} color="#cc3300" radius={3} />
        <PulsingOrb position={[10, -5, -8]} color="#330055" radius={2.5} />
        <PulsingOrb position={[0, -8, -4]} color="#442200" radius={4} />
      </Canvas>
    </div>
  );
}
