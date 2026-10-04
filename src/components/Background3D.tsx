import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

function DustParticles({ theme }: { theme: 'light' | 'dark' }) {
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

  const color = theme === 'light' ? '#8c6b3e' : '#c8a060';
  const opacity = theme === 'light' ? 0.9 : 0.75;

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.07} color={color} transparent opacity={opacity} sizeAttenuation />
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
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} transparent opacity={0.15} />
    </mesh>
  );
}

function FloatingWireframe({ position, rotationSpeed = 0.01, theme }: { position: [number, number, number], rotationSpeed?: number, theme: 'light' | 'dark' }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    ref.current.rotation.x += rotationSpeed;
    ref.current.rotation.y += rotationSpeed * 1.5;
  });
  const color = theme === 'light' ? '#d32f2f' : '#a30000';
  return (
    <mesh ref={ref} position={position}>
      <icosahedronGeometry args={[1.5, 0]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
    </mesh>
  );
}

function FingerprintMesh({ position, theme }: { position: [number, number, number], theme: 'light' | 'dark' }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    ref.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
    ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 0.5) * 0.5;
  });
  const color = theme === 'light' ? '#a17808' : '#d4a017';
  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[4, 5]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.2} side={THREE.DoubleSide} />
    </mesh>
  );
}


export default function Background3D() {
  const { theme } = useTheme();

  const isLight = theme === 'light';
  const bgGradient = isLight 
    ? 'radial-gradient(ellipse at 30% 40%, #f4f1ea 0%, #e7e0d3 50%, #d4c5b0 100%)'
    : 'radial-gradient(ellipse at 30% 40%, #1f0800 0%, #0a0305 50%, #000 100%)';

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0,
      background: bgGradient,
      transition: 'background 0.5s ease'
    }}>
      <Canvas camera={{ position: [0, 0, 12], fov: 65 }}>
        <ambientLight intensity={isLight ? 0.8 : 0.4} />
        <pointLight position={[-6, 4, 4]} intensity={1.2} color={isLight ? "#ff8844" : "#ff4400"} />
        <pointLight position={[7, -3, 3]} intensity={isLight ? 0.3 : 0.6} color={isLight ? "#ffddaa" : "#440022"} />
        <DustParticles theme={theme} />
        <PulsingOrb position={[-9, 4, -6]} color={isLight ? "#ff5533" : "#cc3300"} radius={3} />
        <PulsingOrb position={[10, -5, -8]} color={isLight ? "#8855dd" : "#330055"} radius={2.5} />
        <PulsingOrb position={[0, -8, -4]} color={isLight ? "#995522" : "#442200"} radius={4} />
        <FloatingWireframe position={[-6, -2, -3]} rotationSpeed={0.005} theme={theme} />
        <FloatingWireframe position={[8, 3, -5]} rotationSpeed={0.008} theme={theme} />
        <FingerprintMesh position={[0, 0, -10]} theme={theme} />
      </Canvas>
    </div>
  );
}
