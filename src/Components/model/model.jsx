import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useGLTF, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import { Html } from '@react-three/drei';
import './model.scss';
import { RotateIcon } from '@/Assets/svg';
import * as THREE from 'three'; 

function Model({ modelUrl }) {
  const [loading, setLoading] = useState(true);
  const [manualRotationEnabled, setManualRotationEnabled] = useState(false);
  const [error, setError] = useState(null);
  const orbitControls = useRef();
  const camera = useRef();
  const modelsGroup = useRef();

  const toggleManualRotation = () => {
    setManualRotationEnabled(prev => !prev);
  };

  useEffect(() => {
    const controls = orbitControls.current;
    if (controls) {
      controls.enabled = manualRotationEnabled;
    }
  }, [manualRotationEnabled]);

  const handleMouseMove = event => {
    if (event.buttons ==2) {
      const movementThreshold = 5;
      const { innerWidth, innerHeight } = window;
  
  
      const movementX = event.movementX / innerWidth;
      const movementY = event.movementY / innerHeight;
  
      const limitedMovementX = Math.max(-movementThreshold, Math.min(movementX, movementThreshold));
      const limitedMovementY = Math.max(-movementThreshold, Math.min(movementY, movementThreshold));
      const { x: cameraX, y: cameraY, z: cameraZ } = camera.current.position;
  
    
      camera.current.position.set(
        cameraX - limitedMovementX * 10, 
        cameraY + limitedMovementY * 10, 
        cameraZ
      );
  
      camera.current.lookAt(modelsGroup.current.position);
    
  
    } else if (controls && (event.ctrlKey || event.metaKey)) {
      controls.enablePan = false;
    } else if (controls) {
      controls.enablePan = true;
    }
  };
  const handleContextLost = event => {
    console.error('WebGL context lost:', event);
    window.location.reload();
  };
  
  useEffect(() => {
    window.addEventListener('webglcontextlost', handleContextLost);

    return () => {
      window.removeEventListener('webglcontextlost', handleContextLost);
    };
  }, []);
  
  

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (modelsGroup.current) {
      const boundingBox = new THREE.Box3().setFromObject(modelsGroup.current);
      const center = boundingBox.getCenter(new THREE.Vector3());
      const size = boundingBox.getSize(new THREE.Vector3());
  
      const maxSize = Math.max(size.x, size.y, size.z);
      const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * camera.current.fov) / 360));
      const fitWidthDistance = fitHeightDistance / camera.current.aspect;
      const distance = 1.2 * Math.max(fitHeightDistance, fitWidthDistance);
      camera.current.position.set(center.x, center.y, center.z + distance);
      camera.current.lookAt(center.x, center.y, center.z);
    }
  }, [modelUrl]);

  return (
    <>
      <Canvas frameloop="demand">
        <ambientLight />
        <Suspense fallback={null}>
          <group ref={modelsGroup}>
          {error ? (
              <Html center>
                <div className="error-message">{error.message}</div>
              </Html>
            ) : (
              <DynamicModel modelUrl={modelUrl} setLoading={setLoading} setError={setError} />
            )}
          </group>
        </Suspense>
        <OrbitControls
          ref={orbitControls}
          enableZoom={manualRotationEnabled}
          enableRotate={manualRotationEnabled}
          enablePan={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          maxDistance={10}
          minDistance={2} 
        />
        <Environment preset="sunset" />
        {loading && (
          <Html center>
            <div className="loading-spinner"> </div>
          </Html>
        )}
      </Canvas>
      <div className="fixed-btn-wrapper">
        <div className="view-btn-wrapper">
          <div onClick={toggleManualRotation}>
            {manualRotationEnabled ? (
              <div className="drag-to-rotate">
                <RotateIcon /> <span>Drag to rotate</span>{' '}
              </div>
            ) : (
              <div className="view-render-button"> 'View 360 Render'</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function DynamicModel({ modelUrl, setLoading }) {
  const gltf = useGLTF(modelUrl);
  const [modelScale, setModelScale] = useState([1, 1, 1]);

  useEffect(() => {
    setLoading(false);
    if (gltf.scene) {
      const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
      const size = boundingBox.getSize(new THREE.Vector3());
      const maxSize = Math.max(size.x, size.y, size.z);
      const scaleFactor = 5 / maxSize;
      setModelScale([scaleFactor, scaleFactor, scaleFactor]);
    }
  }, [modelUrl, setLoading, gltf]);

  return (
    <group dispose={null} scale={modelScale}>
      <primitive object={gltf.scene} />
    </group>
  );
}

export default Model;
