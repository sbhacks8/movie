import * as THREE from 'three'
import React, { Suspense, useEffect, useState, useRef, forwardRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Reflector, Text, useTexture, useGLTF } from '@react-three/drei'
import Overlay from './Overlay'

function Carla(props) {
  const { scene } = useGLTF('scene.glb')
  return <primitive object={scene} {...props} />
}

const VideoText = forwardRef(({ clicked, ...props }, ref) => {
  const [video] = useState(() => Object.assign(document.createElement('video'), { src: 'eddie.mp4', crossOrigin: 'Anonymous', loop: false }))
  video.setAttribute('playsinline', 'playsinline')
  return (
    <Text font="/Inter-Bold.woff" fontSize={3} letterSpacing={-0.06} {...props}>
      eddie
      <meshBasicMaterial toneMapped={false}>
        <videoTexture attach="map" args={[video]} ref={ref} encoding={THREE.sRGBEncoding} />
      </meshBasicMaterial>
    </Text>
  )
})

function Ground() {
  const [floor, normal] = useTexture(['SurfaceImperfections003_1K_var1.jpg', 'SurfaceImperfections003_1K_Normal.jpg'])
  return (
    <Reflector blur={[400, 100]} resolution={512} args={[10, 10]} mirror={0.5} mixBlur={6} mixStrength={1.5} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
      {(Material, props) => <Material color="#a0a0a0" metalness={0.4} roughnessMap={floor} normalMap={normal} normalScale={[2, 2]} {...props} />}
    </Reflector>
  )
}

export default function App() {
  const [clicked, setClicked] = useState(false)
  const [ready, setReady] = useState(false)
  const ref = useRef()
  const store = { clicked, setClicked, ready, setReady }
  return (
    <>
      <Canvas concurrent gl={{ alpha: false }} pixelRatio={[1, 1.5]} camera={{ position: [0, 3, 100], fov: 15 }}>
        <color attach="background" args={['black']} />
        <fog attach="fog" args={['black', 15, 20]} />
        
        <Suspense fallback={null}>
          <group position={[0, -1, 0]}>
            <Carla rotation={[0.05, Math.PI -1.0, 0.1]} position={[-1, 4.0, 9.0]} scale={[0.15, 0.15, 0.15]} />
            {/* <Ground /> */}
          </group>
          <ambientLight intensity={0.5} />
          <spotLight position={[0, 10, 0]} intensity={0.3} />
          <directionalLight position={[-20, 0, -10]} intensity={0.7} />
          <Intro start={ready && clicked} set={setReady} />
        </Suspense>
      </Canvas>
      <Overlay {...store} videoPlayer={ref} />
    </>
  )
}

function Intro({ start, set }) {
  const [vec] = useState(() => new THREE.Vector3())
  useEffect(() => setTimeout(() => set(true), 500), [])
  return useFrame((state) => {
    if (start) {
      state.camera.position.lerp(vec.set(state.mouse.x * 5, 3 + state.mouse.y * 2, 14), 0.05)
      state.camera.lookAt(0, 0, 0)
    }
  })
}
