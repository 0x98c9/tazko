
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Simple floating shape component with corrected prop types and structure
const FloatingShape: React.FC<{
  position: [number, number, number];
  color: string;
  speed: number;
  radius?: number;
  shape: 'sphere' | 'box';
}> = ({ position, color, speed, radius = 0.5, shape }) => {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!mesh.current) return;
    
    // Gentle floating movement
    mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
    
    // Slow rotation
    mesh.current.rotation.x = state.clock.elapsedTime * 0.1;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  return (
    <mesh ref={mesh} position={position}>
      {shape === 'sphere' ? (
        <sphereGeometry args={[radius, 24, 24]} />
      ) : (
        <boxGeometry args={[radius, radius, radius]} />
      )}
      <meshStandardMaterial
        color={color}
        transparent={true}
        opacity={0.6}
        roughness={0.4}
        metalness={0.8}
      />
    </mesh>
  );
};

// Simplified particle field component
const ParticleField: React.FC<{ count: number }> = ({ count }) => {
  const points = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  // Generate particle positions
  const particlePositions = React.useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 10;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, [count]);

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={particlePositions}
          count={particlePositions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#ffffff"
        transparent={true}
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
};

// Main scene component
const Scene: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={0.3} />
      <pointLight position={[-10, 0, -10]} intensity={0.2} color="#9b87f5" />
      <pointLight position={[0, 10, 0]} intensity={0.2} color="#7E69AB" />
      
      {/* Floating shapes with explicit position arrays */}
      <FloatingShape position={[-4, 2, -2]} color="#9b87f5" speed={0.4} shape="sphere" radius={0.8} />
      <FloatingShape position={[5, -2, -1]} color="#7E69AB" speed={0.3} shape="sphere" radius={0.6} />
      <FloatingShape position={[-2, -3, -3]} color="#D3E4FD" speed={0.2} shape="box" radius={0.7} />
      <FloatingShape position={[3, 3, -4]} color="#FEC6A1" speed={0.5} shape="sphere" radius={0.4} />
      <FloatingShape position={[-5, 0, -6]} color="#F2FCE2" speed={0.25} shape="box" radius={0.5} />
      <FloatingShape position={[0, 4, -2]} color="#9b87f5" speed={0.35} shape="box" radius={0.6} />
      
      {/* Reduced particle count for better performance */}
      <ParticleField count={150} />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        enableRotate={false}
        autoRotate={true}
        autoRotateSpeed={0.5}
      />
    </>
  );
};

// Main ThreeBackground component
const ThreeBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <Canvas 
        camera={{ position: [0, 0, 15], fov: 60 }}
        dpr={[1, 1.5]} // Optimized pixel ratio
      >
        <Scene />
      </Canvas>
    </div>
  );
};

export default ThreeBackground;
