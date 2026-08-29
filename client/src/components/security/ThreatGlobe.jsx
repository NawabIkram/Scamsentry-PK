import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line, OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

const GlobeNodes = () => {
  const groupRef = useRef();

  // Slow rotation
  useFrame((state, delta) => {
    groupRef.current.rotation.y += delta * 0.1;
    groupRef.current.rotation.x += delta * 0.05;
  });

  const nodes = [];
  const lines = [];
  const radius = 2;
  const numNodes = 30;

  for (let i = 0; i < numNodes; i++) {
    const phi = Math.acos(-1 + (2 * i) / numNodes);
    const theta = Math.sqrt(numNodes * Math.PI) * phi;
    
    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);
    nodes.push(new THREE.Vector3(x, y, z));
  }

  // Generate lines between close nodes
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (nodes[i].distanceTo(nodes[j]) < 1.5) {
        lines.push([nodes[i], nodes[j]]);
      }
    }
  }

  return (
    <group ref={groupRef}>
      <Sphere args={[1.9, 32, 32]}>
        <meshBasicMaterial color="#080E1A" transparent opacity={0.8} />
      </Sphere>
      
      {/* Wireframe Sphere */}
      <Sphere args={[2, 16, 16]}>
        <meshBasicMaterial color="#38BDF8" wireframe transparent opacity={0.15} />
      </Sphere>

      {/* Nodes */}
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color={i % 3 === 0 ? "#EF4444" : "#38BDF8"} />
        </mesh>
      ))}

      {/* Connecting Lines */}
      {lines.map((pts, i) => (
        <Line key={`line-${i}`} points={pts} color="#38BDF8" opacity={0.2} transparent lineWidth={1} />
      ))}
    </group>
  );
};

const ThreatGlobe = () => {
  return (
    <div className="w-full h-[400px] lg:h-[500px] relative pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
          <GlobeNodes />
        </Float>
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

export default ThreatGlobe;
