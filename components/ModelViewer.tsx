"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Bounds, Center, Html, OrbitControls } from "@react-three/drei";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import type { Mesh } from "three";

function LoadedStl({ url }: { url: string }) {
  const geometry = useLoader(STLLoader, url);

  return (
    <Bounds fit clip observe margin={1.25}>
      <Center>
        <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#2fbf9b" roughness={0.46} metalness={0.12} />
        </mesh>
      </Center>
    </Bounds>
  );
}

function DemoPart() {
  const meshRef = useRef<Mesh>(null);
  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.45;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.1, 0.28, 120, 16]} />
        <meshStandardMaterial color="#2f6fed" roughness={0.38} metalness={0.16} />
      </mesh>
      <mesh position={[0, -1.35, 0]} scale={[1.6, 0.12, 1.6]}>
        <boxGeometry />
        <meshStandardMaterial color="#f26a4f" roughness={0.6} />
      </mesh>
    </group>
  );
}

export function ModelViewer({ modelUrl }: { modelUrl?: string | null }) {
  return (
    <div className="h-[420px] w-full overflow-hidden rounded-md border border-black/10 bg-[#f2f6f7] dark:border-white/10 dark:bg-[#10161b]">
      <Canvas camera={{ position: [3.2, 2.6, 4.2], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 6, 4]} intensity={1.2} />
        <directionalLight position={[-4, 2, -3]} intensity={0.55} />
        <gridHelper args={[8, 16, "#98a2ad", "#d0d7de"]} position={[0, -1.5, 0]} />
        <Suspense
          fallback={
            <Html center>
              <div className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-forge-ink shadow-soft">Loading model...</div>
            </Html>
          }
        >
          {modelUrl ? <LoadedStl url={modelUrl} /> : <DemoPart />}
        </Suspense>
        <OrbitControls makeDefault enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
}
