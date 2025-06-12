import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GridHelper, AxesHelper } from 'three';
import ChallengeModal from './ChallengeModal'; // 아래에서 만들 예정

// 상태별 색상 매핑
const faceColors = { unattempted: '#ccc', inProgress: '#f1c40f', completed: '#2ecc71' };

// 샘플 상태 맵 (0~26)
const MOCK = Array.from({ length: 27 }, (_, i) =>
  i < 9 ? 'unattempted' : i < 18 ? 'inProgress' : 'completed'
);

// 작은 큐브 컴포넌트
function Cell({ idx, status, onSelect }) {
  const ref = useRef();
  // 약간씩 자전
  useFrame((_, d) => {
    ref.current.rotation.x += d * 0.01;
    ref.current.rotation.y += d * 0.008;
  });
  return (
    <mesh
      ref={ref}
      position={[
        (idx % 3) - 1,                    // x: 0,1,2 → -1,0,1
        (Math.floor(idx / 9) - 1),       // y: 0,1,2 → -1,0,1
        (Math.floor((idx % 9) / 3) - 1), // z: 0,1,2 → -1,0,1
      ]}
      onClick={() => onSelect(idx)}
    >
      <boxGeometry args={[0.9, 0.9, 0.9]} />
      <meshStandardMaterial color={faceColors[status]} />
    </mesh>
  );
}
export default function CubeCanvas() {
  const [selected, setSelected] = useState(null);


  return (
    <>
      {/* 모달 */}
      {selected !== null && (
        <ChallengeModal
          idx={selected}
          status={MOCK[selected]}
          onClose={() => setSelected(null)}
        />
      )}

      <div style={{ width: '100%', height: '100%', background: '#222' }}>
        <Canvas camera={{ position: [5, 5, 5], fov: 50 }} gl={{ antialias: true }}>
          <primitive object={new GridHelper(10, 10)} />
          <primitive object={new AxesHelper(5)} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <OrbitControls enablePan={false} minDistance={5} maxDistance={15} />

          {/* 27개 Cell 렌더링 */}
          {MOCK.map((status, idx) => (
            <Cell key={idx} idx={idx} status={status} onSelect={setSelected} />
          ))}
        </Canvas>
      </div>
    </>
  );
}