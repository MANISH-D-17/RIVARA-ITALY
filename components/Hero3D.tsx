
import React, { useEffect, useRef } from 'react';
// Fix: Added missing import for THREE to resolve 'Cannot find name THREE' errors.
import * as THREE from 'three';

const Hero3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Abstract Luxury Sculpture (Mannequin-like)
    const geometry = new THREE.IcosahedronGeometry(1.5, 0);
    const material = new THREE.MeshStandardMaterial({
      color: 0xC6A75E,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: true
    });
    const sculpture = new THREE.Mesh(geometry, material);
    scene.add(sculpture);

    // Internal Core Glow
    const coreGeom = new THREE.SphereGeometry(0.8, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xC6A75E,
      emissive: 0xC6A75E,
      emissiveIntensity: 0.5,
      metalness: 1,
      roughness: 0
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    scene.add(core);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xC6A75E, 2, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    camera.position.z = 4;

    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      sculpture.rotation.y += 0.005;
      sculpture.rotation.x += 0.002;
      
      // Subtle parallax follow
      sculpture.position.x += (mouseX * 0.5 - sculpture.position.x) * 0.05;
      sculpture.position.y += (mouseY * 0.5 - sculpture.position.y) * 0.05;
      
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};

export default Hero3D;
