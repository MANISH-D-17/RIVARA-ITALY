import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Hero3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(1, 0.35, 180, 24);
    const material = new THREE.MeshStandardMaterial({ color: '#D4AF37', metalness: 1, roughness: 0.2 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    scene.add(new THREE.AmbientLight('#fff', 0.8));
    const point = new THREE.PointLight('#FFD700', 2, 20); point.position.set(2, 2, 3); scene.add(point);

    let mouseX = 0; let mouseY = 0;
    const onMouseMove = (e) => { mouseX = (e.clientX / window.innerWidth - 0.5) * 0.35; mouseY = (e.clientY / window.innerHeight - 0.5) * 0.35; };
    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      mesh.rotation.y += 0.005;
      mesh.rotation.x += 0.002;
      camera.position.x += (mouseX - camera.position.x) * 0.03;
      camera.position.y += (-mouseY - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="h-[340px] w-full" />;
}
