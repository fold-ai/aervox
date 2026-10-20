"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// A fictional field reconstruction for the website. All positions are authored.
const POSITIONS = [
  { x: -18, z: -9, yaw: -.48 },
  { x: 0, z: 3, yaw: .24 },
  { x: 20, z: -13, yaw: -.68 },
];
const terrainY = (x, z) => Math.sin(x * .031 + z * .013) * 2.4
  + Math.cos(z * .039 - x * .012) * 1.7
  + Math.sin(x * .081) * Math.cos(z * .062) * .38;
function seeded(seed) {
  let state = seed;
  return () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 4294967296; };
}

function fieldTexture() {
  const size = 256, random = seeded(8321), pixels = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const grain = Math.sin(x * .7 + Math.sin(y * .13) * 2) * 7;
    const shade = 182 + random() * 42 + grain;
    const i = (y * size + x) * 4;
    pixels[i] = shade; pixels[i + 1] = shade; pixels[i + 2] = shade; pixels[i + 3] = 255;
  }
  const texture = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(54, 54); texture.needsUpdate = true;
  return texture;
}

function Terrain() {
  const texture = useMemo(fieldTexture, []);
  const geometry = useMemo(() => {
    const result = new THREE.PlaneGeometry(420, 420, 180, 180);
    result.rotateX(-Math.PI / 2);
    const vertices = result.attributes.position, colors = [];
    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i), z = vertices.getZ(i);
      vertices.setY(i, terrainY(x, z));
      const patch = Math.sin(x * .048 + Math.sin(z * .035)) * .045
        + Math.cos(x * .024 - z * .067) * .035
        + Math.sin(x * .62 + z * .11) * .009;
      const soil = .48 + patch;
      colors.push(soil, soil + .009, soil - .009);
    }
    result.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    result.computeVertexNormals(); return result;
  }, []);
  useEffect(() => () => { geometry.dispose(); texture.dispose(); }, [geometry, texture]);
  return <mesh geometry={geometry} receiveShadow>
    <meshStandardMaterial map={texture} bumpMap={texture} bumpScale={.12} vertexColors roughness={1} />
  </mesh>;
}

function Vegetation() {
  const crowns = useRef(), trunks = useRef(), scrub = useRef();
  const { trees, shrubs } = useMemo(() => {
    const random = seeded(9102), trees = [], shrubs = [];
    // Broken tree belts cross the distant field. They do not follow a road.
    for (let i = 0; i < 340; i++) {
      const x = random() * 265 - 132;
      const belt = i < 220 ? -49 : 69;
      const z = belt + Math.sin(x * .038) * 8 + (random() - .5) * 15;
      trees.push({ x, z, scale: 1.6 + random() * 2.2, angle: random() * Math.PI });
    }
    for (let i = 0; i < 720; i++) {
      const x = random() * 260 - 130, z = random() * 205 - 102;
      if (POSITIONS.some(p => Math.hypot(x - p.x, z - p.z) < 9)) continue;
      shrubs.push({ x, z, scale: .22 + random() * .7, angle: random() * Math.PI });
    }
    return { trees, shrubs };
  }, []);
  useEffect(() => {
    const matrix = new THREE.Object3D(), color = new THREE.Color(), random = seeded(485);
    trees.forEach((tree, index) => {
      const y = terrainY(tree.x, tree.z);
      matrix.position.set(tree.x, y + tree.scale * .52, tree.z);
      matrix.rotation.set(0, tree.angle, .04);
      matrix.scale.set(.17 * tree.scale, tree.scale * 1.6, .17 * tree.scale);
      matrix.updateMatrix(); trunks.current.setMatrixAt(index, matrix.matrix);
      matrix.position.y = y + tree.scale * 1.56;
      matrix.scale.set(tree.scale * .95, tree.scale * 1.26, tree.scale * .88);
      matrix.updateMatrix(); crowns.current.setMatrixAt(index, matrix.matrix);
      const tone = .25 + random() * .13;
      color.setRGB(tone, tone + .012, tone + .002); crowns.current.setColorAt(index, color);
    });
    shrubs.forEach((item, index) => {
      matrix.position.set(item.x, terrainY(item.x, item.z) + item.scale * .2, item.z);
      matrix.rotation.set(.2, item.angle, .1);
      matrix.scale.set(item.scale * 1.3, item.scale * .55, item.scale);
      matrix.updateMatrix(); scrub.current.setMatrixAt(index, matrix.matrix);
      const tone = .32 + random() * .14;
      color.setRGB(tone, tone + .008, tone - .006); scrub.current.setColorAt(index, color);
    });
    for (const mesh of [crowns.current, trunks.current, scrub.current]) {
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.computeBoundingSphere();
    }
  }, [trees, shrubs]);
  return <group>
    <instancedMesh ref={trunks} args={[undefined, undefined, trees.length]} castShadow>
      <cylinderGeometry args={[.45, .7, 1, 5]} /><meshStandardMaterial color="#454743" roughness={1} />
    </instancedMesh>
    <instancedMesh ref={crowns} args={[undefined, undefined, trees.length]} castShadow receiveShadow>
      <icosahedronGeometry args={[1, 1]} /><meshStandardMaterial roughness={1} flatShading />
    </instancedMesh>
    <instancedMesh ref={scrub} args={[undefined, undefined, shrubs.length]} castShadow receiveShadow>
      <icosahedronGeometry args={[1, 0]} /><meshStandardMaterial roughness={1} flatShading />
    </instancedMesh>
  </group>;
}

function Earthworks() {
  const geometry = useMemo(() => {
    const vertices = [], indices = [], colors = [];
    // Shallow, irregular earth banks around a few fictional field positions.
    POSITIONS.forEach((position, positionIndex) => {
      const base = vertices.length / 3, steps = 44;
      for (let step = 0; step <= steps; step++) {
        const angle = .16 * Math.PI + step / steps * 1.4 * Math.PI;
        const noise = Math.sin(angle * 13 + positionIndex) * .16;
        const radii = [6.9, 7.6, 8.3, 9.1];
        radii.forEach((radius, ring) => {
          const x = position.x + Math.cos(angle) * (radius + noise);
          const z = position.z + Math.sin(angle) * (radius + noise) * .79;
          const rise = [0, .45, .66, 0][ring] * (.85 + .15 * Math.sin(angle * 7));
          vertices.push(x, terrainY(x, z) + .025 + rise, z);
          const shade = [.32, .39, .47, .43][ring]; colors.push(shade, shade, shade - .012);
          if (step < steps && ring < 3) {
            const a = base + step * 4 + ring;
            indices.push(a, a + 4, a + 1, a + 1, a + 4, a + 5);
          }
        });
      }
    });
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    result.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    result.setIndex(indices); result.computeVertexNormals(); return result;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} castShadow receiveShadow><meshStandardMaterial vertexColors roughness={1} side={THREE.DoubleSide} /></mesh>;
}

function ChamferHull({ length, width, height, color, position = [0, 0, 0] }) {
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const l = length / 2, w = width / 2, chamfer = .35;
    shape.moveTo(-l + chamfer, -w);
    shape.lineTo(l - chamfer, -w); shape.lineTo(l, -w + chamfer);
    shape.lineTo(l, w - chamfer); shape.lineTo(l - chamfer, w);
    shape.lineTo(-l + chamfer, w); shape.lineTo(-l, w - chamfer);
    shape.lineTo(-l, -w + chamfer); shape.closePath();
    const result = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: true, bevelThickness: .12, bevelSize: .16, bevelSegments: 1, steps: 1 });
    result.rotateX(-Math.PI / 2); return result;
  }, [length, width, height]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} position={position} castShadow receiveShadow><meshStandardMaterial color={color} roughness={.88} metalness={.13} /></mesh>;
}

function Tracks({ side, color }) {
  return <group position={[0, .64, side * 1.64]}>
    <mesh castShadow><boxGeometry args={[6.45, 1.13, .56]} /><meshStandardMaterial color="#303330" roughness={.97} /></mesh>
    {Array.from({ length: 6 }, (_, i) => <mesh key={`wheel-${i}`} position={[-2.55 + i * 1.02, -.035, side * .29]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[.43, .43, .09, 12]} /><meshStandardMaterial color={color} roughness={.9} />
    </mesh>)}
    {Array.from({ length: 19 }, (_, i) => <group key={`tread-${i}`} position={[-3.02 + i * .335, 0, 0]}>
      <mesh position={[0, .59, 0]} castShadow><boxGeometry args={[.21, .09, .62]} /><meshStandardMaterial color="#50534e" roughness={.95} /></mesh>
      <mesh position={[0, -.59, 0]}><boxGeometry args={[.21, .09, .62]} /><meshStandardMaterial color="#454842" roughness={.95} /></mesh>
    </group>)}
  </group>;
}

function ArmoredAsset({ definition, index, groupRef, onSelect }) {
  const fieldPosition = POSITIONS[index % POSITIONS.length];
  const carrier = definition.kind === "carrier", paint = definition.color || "#858a85";
  return <group ref={groupRef} position={[fieldPosition.x, terrainY(fieldPosition.x, fieldPosition.z) + .04, fieldPosition.z]} rotation={[0, fieldPosition.yaw, 0]} onClick={event => { event.stopPropagation(); onSelect?.(index); }}>
    <Tracks side={-1} color={paint} /><Tracks side={1} color={paint} />
    <ChamferHull length={6.7} width={3.1} height={.8} position={[0, .8, 0]} color={paint} />
    <ChamferHull length={carrier ? 4.55 : 2.7} width={carrier ? 2.5 : 2.2} height={carrier ? 1.05 : .67} position={[carrier ? -.35 : .2, 1.75, 0]} color={paint} />
    {!carrier && <group position={[1.45, 2.12, 0]}>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[1.65, 0, 0]} castShadow><cylinderGeometry args={[.105, .14, 3.3, 10]} /><meshStandardMaterial color="#686e66" roughness={.8} metalness={.2} /></mesh>
      <mesh position={[.22, 0, 0]} castShadow><boxGeometry args={[.65, .43, .5]} /><meshStandardMaterial color={paint} roughness={.85} /></mesh>
    </group>}
    <mesh position={[carrier ? -.75 : -.05, carrier ? 2.93 : 2.55, .42]} castShadow><cylinderGeometry args={[.42, .42, .1, 12]} /><meshStandardMaterial color="#636962" roughness={.85} /></mesh>
    <mesh position={[-2.37, 1.74, 0]}><boxGeometry args={[1.1, .08, 1.8]} /><meshStandardMaterial color="#3c423c" roughness={.95} /></mesh>
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-2.8 + i * .17, 1.8, 0]}><boxGeometry args={[.055, .035, 1.7]} /><meshStandardMaterial color="#878d83" roughness={.9} /></mesh>)}
    {[-1, 1].map(side => <group key={side}>
      <mesh position={[-.1, 1.47, side * 1.72]} castShadow><boxGeometry args={[6.05, .28, .12]} /><meshStandardMaterial color={paint} roughness={.9} /></mesh>
      {[0, 1, 2, 3].map(i => <mesh key={i} position={[-2.2 + i * 1.4, 1.49, side * 1.795]}><boxGeometry args={[.035, .25, .015]} /><meshStandardMaterial color="#53594f" roughness={.9} /></mesh>)}
      <mesh position={[-2.88, 1.81, side * 1.1]} castShadow><boxGeometry args={[.58, .34, .42]} /><meshStandardMaterial color="#565e54" roughness={.95} /></mesh>
    </group>)}
    <mesh position={[-1.7, carrier ? 3.35 : 2.9, -.85]} castShadow><cylinderGeometry args={[.017, .025, carrier ? 1.1 : 1.7, 5]} /><meshStandardMaterial color="#373d36" roughness={.8} /></mesh>
  </group>;
}

function World({ active, reducedMotion, view, selectedIndex, vehicles, trackerRefs, clockRef, onSelect, onFailure }) {
  const { camera, gl, size, invalidate } = useThree();
  const groups = useRef([]), localElapsed = useRef(0), elapsed = clockRef || localElapsed;
  const initialized = useRef(false), transition = useRef(true);
  const desired = useMemo(() => new THREE.Vector3(), []);
  const aim = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const corner = useMemo(() => new THREE.Vector3(), []);
  useEffect(() => {
    const lost = event => { event.preventDefault(); onFailure?.(); };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => gl.domElement.removeEventListener("webglcontextlost", lost);
  }, [gl, onFailure]);
  useEffect(() => { transition.current = true; invalidate(); }, [view, selectedIndex, active, reducedMotion, invalidate]);
  useFrame((_, delta) => {
    const dt = Math.min(delta, .06);
    if (active && !reducedMotion) elapsed.current += dt;
    const followed = groups.current[selectedIndex] || groups.current[0];
    if (!followed) return;
    const { x, y, z } = followed.position;
    const drift = Math.sin(elapsed.current * .045) * 1.3;
    const narrow = size.width / size.height < 1.15 ? 1.32 : 1;
    const offset = view === "drone02" ? [24, 22, -26] : view === "aerial" ? [1, 58, 17] : [-24, 19, 29];
    desired.set(x + (offset[0] + drift) * narrow, y + offset[1] * narrow, z + offset[2] * narrow);
    aim.set(x + .7, y + .8, z);
    const snap = !initialized.current || reducedMotion;
    if (active || snap || transition.current) {
      const damping = snap ? 1 : 1 - Math.exp(-dt * 3.1);
      camera.position.lerp(desired, damping); look.lerp(aim, damping); camera.lookAt(look);
    }
    initialized.current = true;
    const settled = camera.position.distanceToSquared(desired) < .0005 && look.distanceToSquared(aim) < .0005;
    if (settled) transition.current = false;
    if (!active && !reducedMotion && transition.current) invalidate();
    camera.updateMatrixWorld();
    groups.current.forEach((group, index) => {
      const element = trackerRefs?.current[index];
      if (!element || !group) return;
      group.updateMatrixWorld();
      let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity, visible = true;
      const maxX = vehicles[index]?.kind === "carrier" ? 3.7 : 5;
      for (const dx of [-3.7, maxX]) for (const dy of [.02, 3.4]) for (const dz of [-2, 2]) {
        corner.set(dx, dy, dz).applyMatrix4(group.matrixWorld).project(camera);
        if (corner.z > 1 || corner.z < -1) visible = false;
        const px = (corner.x * .5 + .5) * size.width, py = (-corner.y * .5 + .5) * size.height;
        left = Math.min(left, px); right = Math.max(right, px); top = Math.min(top, py); bottom = Math.max(bottom, py);
      }
      visible = visible && right > 0 && left < size.width && bottom > 0 && top < size.height;
      element.style.visibility = visible ? "visible" : "hidden";
      element.style.transform = `translate3d(${left.toFixed(1)}px,${top.toFixed(1)}px,0)`;
      element.style.width = `${Math.max(24, right - left).toFixed(1)}px`;
      element.style.height = `${Math.max(18, bottom - top).toFixed(1)}px`;
    });
  });
  return <>
    <color attach="background" args={["#b1b4af"]} />
    <fog attach="fog" args={["#b1b4af", 110, 240]} />
    <hemisphereLight args={["#f1f3ee", "#575b52", 1.65]} />
    <directionalLight position={[-38, 70, 38]} intensity={2.8} color="#f5f3e9" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-78} shadow-camera-right={78} shadow-camera-top={78} shadow-camera-bottom={-78} shadow-camera-near={1} shadow-camera-far={185} shadow-bias={-.00018} shadow-normalBias={.07} />
    <Terrain /><Earthworks /><Vegetation />
    {vehicles.map((definition, index) => <ArmoredAsset key={definition.id} definition={definition} index={index} groupRef={element => { groups.current[index] = element; }} onSelect={onSelect} />)}
  </>;
}

export default function GroundReconWorld(props) {
  return <Canvas shadows dpr={[1, 1.6]} camera={{ fov: 41, near: .15, far: 430, position: [-24, 22, 29] }} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }} frameloop={props.active && !props.reducedMotion ? "always" : "demand"} onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = .98; }}>
    <World {...props} />
  </Canvas>;
}
