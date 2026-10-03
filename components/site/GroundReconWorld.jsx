"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

// Authored scene geometry and traffic. These are scenario values, not sensor measurements.
const ROAD_LENGTH = 640;
const roadZ = x => Math.sin(x / 53) * 5 + Math.sin(x / 121) * 3;
const roadYaw = x => -Math.atan(Math.cos(x / 53) * 5 / 53 + Math.cos(x / 121) * 3 / 121);
const terrainY = (x, z) => {
  const distance = Math.abs(z - roadZ(x));
  const rise = Math.max(0, distance - 9);
  return -.08 + Math.min(rise / 14, 1) * (Math.sin(x * .035 + z * .02) * 1.7 + Math.cos(z * .045) * 2.5 + 2.8) + rise * .014;
};
function seeded(seed) { let state = seed; return () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 4294967296; }; }

function surfaceTexture() {
  const random = seeded(5147);
  const pixels = new Uint8Array(256 * 256 * 4);
  for (let i = 0; i < pixels.length; i += 4) {
    const shade = 194 + random() * 18;
    pixels[i] = shade; pixels[i + 1] = shade; pixels[i + 2] = shade; pixels[i + 3] = 255;
  }
  const texture = new THREE.DataTexture(pixels, 256, 256, THREE.RGBAFormat);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(90, 40); texture.needsUpdate = true;
  return texture;
}
function roadGeometry(width, lift) {
  const points = [], indices = [], uvs = [];
  for (let i = 0; i <= 320; i++) {
    const x = -400 + i * 2.5;
    for (const side of [-1, 1]) { points.push(x, lift, roadZ(x) + side * width); uvs.push(i / 16, (side + 1) / 2); }
    if (i < 320) { const n = i * 2; indices.push(n, n + 1, n + 2, n + 1, n + 3, n + 2); }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices); geometry.computeVertexNormals();
  return geometry;
}

function Terrain() {
  const texture = useMemo(surfaceTexture, []);
  const { invalidate } = useThree();
  const [groundTexture, setGroundTexture] = useState(null);
  // Load this optional finish without suspending/remounting the WebGL canvas.
  useEffect(() => {
    let cancelled = false;
    const loaded = new THREE.TextureLoader().load("/media/recon-terrain.webp", result => {
      if (!cancelled) { setGroundTexture(result); invalidate(); }
    }, undefined, error => console.warn("GroundRecon terrain texture unavailable; retaining procedural finish", error));
    loaded.wrapS = loaded.wrapT = THREE.RepeatWrapping;
    loaded.repeat.set(850 / 18, 400 / 18);
    loaded.colorSpace = THREE.SRGBColorSpace;
    loaded.anisotropy = 8;
    return () => { cancelled = true; loaded.dispose(); };
  }, [invalidate]);
  const asphalt = useMemo(() => { const copy = texture.clone(); copy.repeat.set(1, 4); return copy; }, [texture]);
  const terrain = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(850, 400, 200, 90);
    geometry.rotateX(-Math.PI / 2);
    const positions = geometry.attributes.position;
    const colors = [];
    const base = new THREE.Color();
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i), z = positions.getZ(i);
      positions.setY(i, terrainY(x, z));
      const variation = Math.sin(x * .1 + Math.sin(z * .06)) * .075 + Math.cos(z * .11 + x * .04) * .055;
      base.setRGB(.59 + variation, .62 + variation, .55 + variation);
      colors.push(base.r, base.g, base.b);
    }
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.computeVertexNormals(); return geometry;
  }, []);
  const shoulder = useMemo(() => roadGeometry(5.35, -.015), []);
  const road = useMemo(() => roadGeometry(4.05, .015), []);
  const furnishings = useMemo(() => {
    const random = seeded(1853), shrubs = [], stones = [];
    for (let i = 0; i < 2200; i++) {
      const x = random() * 810 - 405;
      const z = (random() < .5 ? -1 : 1) * (9 + random() * 133) + roadZ(x);
      const scale = .3 + random() * 1.4;
      shrubs.push({ x, z, y: terrainY(x, z), scale, angle: random() * Math.PI });
    }
    for (let i = 0; i < 380; i++) {
      const x = random() * 810 - 405;
      const z = (random() < .5 ? -1 : 1) * (6 + random() * 75) + roadZ(x);
      const scale = .15 + random() * .7;
      stones.push({ x, z, y: terrainY(x, z), scale, angle: random() * Math.PI });
    }
    return { shrubs, stones };
  }, []);
  useEffect(() => () => { texture.dispose(); asphalt.dispose(); terrain.dispose(); road.dispose(); shoulder.dispose(); }, [texture, asphalt, terrain, road, shoulder]);
  return <group>
    <mesh geometry={terrain} receiveShadow><meshStandardMaterial vertexColors map={groundTexture || texture} bumpMap={groundTexture} bumpScale={.13} roughness={1} /></mesh>
    <mesh geometry={shoulder} receiveShadow><meshStandardMaterial color="#8b8a7e" map={asphalt} roughness={1} /></mesh>
    <mesh geometry={road} receiveShadow><meshStandardMaterial color="#434744" map={asphalt} roughness={.95} /></mesh>
    <RoadDetails />
    <Scatter items={furnishings.shrubs} color="#424b3d" type="shrub" />
    <Scatter items={furnishings.stones} color="#96978a" type="stone" />
  </group>;
}
function RoadDetails() {
  const markings = useRef(), posts = useRef(), reflectors = useRef();
  useEffect(() => {
    const object = new THREE.Object3D();
    const color = new THREE.Color();
    const planeRotation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
    const up = new THREE.Vector3(0, 1, 0);
    let markIndex = 0, postIndex = 0;
    for (let i = 0; i < 133; i++) {
      const x = -396 + i * 6, yaw = roadYaw(x), z = roadZ(x);
      for (const side of [0, -1, 1]) {
        object.position.set(x, .036, z + side * 3.72);
        object.quaternion.setFromAxisAngle(up, yaw).multiply(planeRotation);
        object.scale.set(side === 0 ? 2.8 : 6.06, side === 0 ? .09 : .1, 1);
        object.updateMatrix(); markings.current.setMatrixAt(markIndex, object.matrix);
        color.set(side === 0 ? "#a3a28b" : "#bcbcaf"); markings.current.setColorAt(markIndex++, color);
      }
      if (i % 3 !== 0) continue;
      for (const side of [-1, 1]) {
        object.quaternion.setFromAxisAngle(up, yaw);
        object.position.set(x, .385, z + side * 5.1); object.scale.set(.1, .7, .14); object.updateMatrix();
        posts.current.setMatrixAt(postIndex, object.matrix);
        object.position.set(x, .545, z + side * 5.02); object.scale.set(.12, .13, .015); object.updateMatrix();
        reflectors.current.setMatrixAt(postIndex++, object.matrix);
      }
    }
    for (const mesh of [markings.current, posts.current, reflectors.current]) { mesh.instanceMatrix.needsUpdate = true; mesh.computeBoundingBox(); mesh.computeBoundingSphere(); }
    markings.current.instanceColor.needsUpdate = true;
  }, []);
  return <>
    <instancedMesh ref={markings} args={[undefined, undefined, 399]} receiveShadow><planeGeometry args={[1, 1]} /><meshStandardMaterial roughness={1} /></instancedMesh>
    <instancedMesh ref={posts} args={[undefined, undefined, 90]} castShadow><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#b5b5a7" /></instancedMesh>
    <instancedMesh ref={reflectors} args={[undefined, undefined, 90]}><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#d2be9a" /></instancedMesh>
  </>;
}
function Scatter({ items, color, type }) {
  const ref = useRef();
  const geometry = useMemo(() => {
    const positions = [], colors = [];
    const palette = new THREE.Color(color);
    const clusters = type === "shrub" ? [
      [-.35, -.14, -.15, .69], [.30, -.06, -.12, .65], [-.02, .25, .25, .67], [.36, -.13, .35, .41],
    ] : [[0, 0, 0, 1]];
    clusters.forEach(([cx, cy, cz, scale], clusterIndex) => {
      const source = new THREE.IcosahedronGeometry(1, type === "shrub" ? 1 : 0);
      const vertices = source.attributes.position;
      for (let i = 0; i < vertices.count; i++) {
        const x = vertices.getX(i), y = vertices.getY(i), z = vertices.getZ(i);
        const irregular = 1 + Math.sin(x * 18.1 + y * 25.3 + z * 15.7 + clusterIndex * 4.3) * (type === "shrub" ? .21 : .19);
        positions.push(cx + x * scale * irregular, cy + y * scale * irregular, cz + z * scale * irregular);
        const tone = .65 + (Math.sin(x * 7.8 + z * 9.4 + y * 12.5) + 1) * .27;
        colors.push(palette.r * tone, palette.g * tone, palette.b * tone);
      }
      source.dispose();
    });
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    result.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    result.computeVertexNormals(); return result;
  }, [color, type]);
  useEffect(() => {
    const matrix = new THREE.Object3D();
    const random = seeded(type === "shrub" ? 722 : 187);
    const tint = new THREE.Color();
    items.forEach((item, i) => {
      matrix.position.set(item.x, item.y + item.scale * .32, item.z);
      matrix.rotation.set(.12, item.angle, .17);
      matrix.scale.set(item.scale * 1.1, item.scale * (type === "shrub" ? .72 : .43), item.scale);
      matrix.updateMatrix(); ref.current.setMatrixAt(i, matrix.matrix);
      const variation = .76 + random() * .39;
      tint.setRGB(variation, variation * (.95 + random() * .08), variation * .89);
      ref.current.setColorAt(i, tint);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.instanceColor.needsUpdate = true;
    ref.current.computeBoundingBox(); ref.current.computeBoundingSphere();
  }, [items, type]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <instancedMesh ref={ref} args={[geometry, undefined, items.length]} castShadow receiveShadow>
    <meshStandardMaterial vertexColors roughness={1} flatShading />
  </instancedMesh>;
}

function Panel({ points, color, glass = false }) {
  const geometry = useMemo(() => {
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.Float32BufferAttribute(points.flat(), 3));
    result.setIndex([0, 1, 2, 0, 2, 3]); result.computeVertexNormals(); return result;
  }, [points]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} castShadow={!glass}><meshStandardMaterial color={color} roughness={glass ? .13 : .31} metalness={glass ? .38 : .35} side={THREE.DoubleSide} /></mesh>;
}
function Pillar({ start, end, color, radius = .045 }) {
  const center = start.map((v, i) => (v + end[i]) / 2);
  const vector = new THREE.Vector3(...end).sub(new THREE.Vector3(...start));
  const rotation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vector.clone().normalize());
  return <mesh position={center} quaternion={rotation} castShadow><cylinderGeometry args={[radius, radius, vector.length(), 6]} /><meshStandardMaterial color={color} roughness={.3} metalness={.3} /></mesh>;
}
function Wheel({ x, side, wheelRef }) {
  return <group position={[x, .47, side * 1.025]} ref={wheelRef}>
    <mesh rotation={[Math.PI / 2, 0, 0]} castShadow><cylinderGeometry args={[.445, .445, .29, 24]} /><meshStandardMaterial color="#151a19" roughness={.94} /></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, side * .154]}><cylinderGeometry args={[.29, .29, .018, 20]} /><meshStandardMaterial color="#353c3c" roughness={.4} metalness={.7} /></mesh>
    <mesh position={[0, 0, side * .17]}><torusGeometry args={[.277, .025, 6, 24]} /><meshStandardMaterial color="#9baba9" roughness={.25} metalness={.8} /></mesh>
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[Math.sin(i * Math.PI * 2 / 5) * .115, Math.cos(i * Math.PI * 2 / 5) * .115, side * .181]} rotation={[0, 0, -i * Math.PI * 2 / 5]}><boxGeometry args={[.055, .26, .028]} /><meshStandardMaterial color="#b2bcba" metalness={.8} roughness={.3} /></mesh>)}
    <mesh position={[0, 0, side * .19]}><circleGeometry args={[.075, 14]} /><meshStandardMaterial color="#b7c0bf" metalness={.8} side={THREE.DoubleSide} /></mesh>
  </group>;
}
function BodyShell({ color }) {
  const geometry = useMemo(() => {
    const sections = [
      [-2.36, .78, .63, 1.07], [-2.24, .91, .54, 1.17], [-1.8, .99, .56, 1.22],
      [-1.2, 1.0, .59, 1.25], [-.5, 1.0, .59, 1.26], [.7, .99, .59, 1.27],
      [1.25, .985, .53, 1.285], [1.8, .955, .54, 1.255], [2.17, .88, .6, 1.16], [2.37, .77, .71, 1.02],
    ];
    const positions = [], indices = [], segments = 24;
    sections.forEach(([x, width, low, high], section) => {
      for (let i = 0; i < segments; i++) {
        const angle = i / segments * Math.PI * 2, cs = Math.cos(angle), sn = Math.sin(angle);
        positions.push(x, (low + high) / 2 + (high - low) / 2 * Math.sign(sn) * Math.pow(Math.abs(sn), .43), width * Math.sign(cs) * Math.pow(Math.abs(cs), .48));
        if (section < sections.length - 1) {
          const a = section * segments + i, b = (section + 1) * segments + i;
          const c = section * segments + (i + 1) % segments, d = (section + 1) * segments + (i + 1) % segments;
          indices.push(a, b, c, b, d, c);
        }
      }
    });
    for (const section of [0, sections.length - 1]) {
      const [x, , low, high] = sections[section], center = positions.length / 3;
      positions.push(x, (low + high) / 2, 0);
      for (let i = 0; i < segments; i++) {
        const a = section * segments + i, b = section * segments + (i + 1) % segments;
        indices.push(...(section === 0 ? [center, a, b] : [center, b, a]));
      }
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3)); result.setIndex(indices); result.computeVertexNormals(); return result;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh geometry={geometry} castShadow receiveShadow><meshPhysicalMaterial color={color} roughness={.29} metalness={.48} clearcoat={.65} clearcoatRoughness={.25} /></mesh>;
}
function ContactShadow() {
  const texture = useMemo(() => {
    const size = 96, pixels = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      const u = (x / (size - 1) * 2 - 1), v = (y / (size - 1) * 2 - 1);
      const falloff = Math.max(0, 1 - Math.pow(Math.abs(u), 3) - Math.pow(Math.abs(v), 3));
      const i = (y * size + x) * 4;
      pixels[i] = 7; pixels[i + 1] = 10; pixels[i + 2] = 9; pixels[i + 3] = Math.round(falloff * falloff * 152);
    }
    const result = new THREE.DataTexture(pixels, size, size, THREE.RGBAFormat); result.needsUpdate = true; return result;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh position={[0, .017, 0]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={2}><planeGeometry args={[5.4, 2.85]} /><meshBasicMaterial map={texture} transparent depthWrite={false} polygonOffset polygonOffsetFactor={-1} /></mesh>;
}
function Vehicle({ definition, index, groupRef, elapsedRef, active, onSelect }) {
  const wheels = useRef([]);
  const paint = definition.color;
  useFrame(() => {
    if (active) wheels.current.forEach(wheel => { if (wheel) wheel.rotation.z = -elapsedRef.current * definition.speed / 3.6 / .445; });
  });
  return <group ref={groupRef} onClick={event => { event.stopPropagation(); onSelect(index); }}>
    <ContactShadow />
    <BodyShell color={paint} />
    <RoundedBox args={[4.45, .19, 1.94]} radius={.075} smoothness={2} position={[0, .59, 0]} castShadow><meshStandardMaterial color="#242b29" roughness={.72} /></RoundedBox>
    <RoundedBox args={[2.1, .12, 1.53]} radius={.06} smoothness={3} position={[-.52, 1.84, 0]} castShadow><meshStandardMaterial color={paint} roughness={.28} metalness={.42} /></RoundedBox>
    <Panel glass color="#253638" points={[[1.07, 1.26, -.88], [1.07, 1.26, .88], [.53, 1.79, .755], [.53, 1.79, -.755]]} />
    <Panel glass color="#243133" points={[[-2.08, 1.23, .88], [-2.08, 1.23, -.88], [-1.57, 1.79, -.755], [-1.57, 1.79, .755]]} />
    {[-1, 1].map(side => <group key={side}>
      <Panel glass color="#243537" points={[[1.02, 1.23, side * .94], [.08, 1.23, side * .94], [.08, 1.79, side * .77], [.51, 1.79, side * .77]]} />
      <Panel glass color="#223134" points={[[-.03, 1.23, side * .94], [-1.83, 1.23, side * .94], [-1.52, 1.79, side * .77], [-.03, 1.79, side * .77]]} />
      <Pillar start={[1.1, 1.19, side * .93]} end={[.55, 1.81, side * .785]} color={paint} />
      <Pillar start={[-2.07, 1.2, side * .93]} end={[-1.57, 1.81, side * .785]} color={paint} radius={.085} />
      <Pillar start={[.025, 1.2, side * .95]} end={[.025, 1.82, side * .78]} color="#182323" radius={.04} />
      <Pillar start={[.045, .68, side * .97]} end={[.045, 1.21, side * .973]} color="#354139" radius={.008} />
      <Pillar start={[-1.33, .72, side * .965]} end={[-1.40, 1.20, side * .965]} color="#354139" radius={.008} />
      <Pillar start={[.045, .69, side * .968]} end={[-1.30, .71, side * .968]} color="#354139" radius={.007} />
      <mesh position={[-.5, 1.23, side * .976]}><boxGeometry args={[2.94, .025, .03]} /><meshStandardMaterial color="#a4b0ac" metalness={.8} roughness={.3} /></mesh>
      <RoundedBox args={[.25, .16, .24]} position={[.73, 1.4, side * 1.07]} radius={.05} smoothness={2} castShadow><meshStandardMaterial color={paint} metalness={.35} roughness={.28} /></RoundedBox>
      {[-.9, .42].map(x => <mesh key={x} position={[x, 1.09, side * .98]}><boxGeometry args={[.21, .035, .026]} /><meshStandardMaterial color="#bac1bb" metalness={.8} roughness={.25} /></mesh>)}
      <mesh position={[-.55, 1.93, side * .65]}><boxGeometry args={[2.19, .035, .055]} /><meshStandardMaterial color="#58605c" metalness={.7} roughness={.4} /></mesh>
      {[-1.43, 1.42].map((x, i) => <group key={x}>
        <mesh position={[x, .5, side * .983]}><circleGeometry args={[.51, 24]} /><meshStandardMaterial color="#17201c" side={THREE.DoubleSide} /></mesh>
        <mesh position={[x, .48, side * 1.003]}><torusGeometry args={[.49, .055, 6, 24, Math.PI]} /><meshStandardMaterial color="#353b36" roughness={.6} /></mesh>
        <Wheel x={x} side={side} wheelRef={el => { wheels.current[(side === -1 ? 0 : 2) + i] = el; }} />
      </group>)}
      <mesh position={[2.278, 1.08, side * .665]}><boxGeometry args={[.04, .12, .48]} /><meshStandardMaterial color="#d9e0d8" emissive="#b5c1b3" emissiveIntensity={.4} roughness={.18} /></mesh>
      <mesh position={[-2.29, 1.07, side * .7]}><boxGeometry args={[.045, .15, .35]} /><meshStandardMaterial color="#761e17" emissive="#761e17" emissiveIntensity={.25} roughness={.2} /></mesh>
    </group>)}
    <mesh position={[2.375, .85, 0]}><boxGeometry args={[.03, .24, 1.25]} /><meshStandardMaterial color="#1e2926" roughness={.58} /></mesh>
    {[-.08, 0, .08].map(y => <mesh key={y} position={[2.394, .87 + y, 0]}><boxGeometry args={[.02, .012, 1.19]} /><meshStandardMaterial color="#7c8982" metalness={.75} /></mesh>)}
    <mesh position={[-2.303, .76, 0]}><boxGeometry args={[.03, .1, .41]} /><meshStandardMaterial color="#b1b5a8" roughness={.8} /></mesh>
  </group>;
}

function World({ active, reducedMotion, view, selectedIndex, vehicles, trackerRefs, onSelect, onFailure }) {
  const { camera, scene, gl, size, invalidate } = useThree();
  const elapsed = useRef(0);
  const groups = useRef([]);
  const light = useRef();
  const lightTarget = useMemo(() => new THREE.Object3D(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const initialized = useRef(false);
  const cameraTransition = useRef(false);
  const previousX = useRef(null);
  const desired = useMemo(() => new THREE.Vector3(), []);
  const aim = useMemo(() => new THREE.Vector3(), []);
  const corner = useMemo(() => new THREE.Vector3(), []);
  useEffect(() => {
    const generator = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const environment = generator.fromScene(room, .02);
    scene.environment = environment.texture;
    scene.environmentIntensity = .46;
    room.dispose(); generator.dispose();
    const lost = event => { event.preventDefault(); console.error(`GroundRecon WebGL context lost: ${event.statusMessage || "browser supplied no additional details"}`); onFailure(); };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => { scene.environment = null; environment.dispose(); gl.domElement.removeEventListener("webglcontextlost", lost); };
  }, [gl, scene, onFailure]);
  useEffect(() => { invalidate(); }, [view, selectedIndex, active, reducedMotion, invalidate]);
  useEffect(() => { cameraTransition.current = true; invalidate(); }, [view, selectedIndex, invalidate]);
  useFrame((_, delta) => {
    const frameDelta = Math.min(delta, .06);
    if (active) elapsed.current += frameDelta;
    vehicles.forEach((vehicle, index) => {
      const x = ((vehicle.offset + elapsed.current * vehicle.speed / 3.6 + ROAD_LENGTH / 2) % ROAD_LENGTH) - ROAD_LENGTH / 2;
      const group = groups.current[index];
      if (!group) return;
      group.position.set(x, .015, roadZ(x) + vehicle.lane);
      group.rotation.y = roadYaw(x);
    });
    const followed = groups.current[selectedIndex];
    if (!followed) return;
    const x = followed.position.x, z = followed.position.z;
    const heading = -roadYaw(x);
    const c = Math.cos(heading), s = Math.sin(heading);
    let offset;
    if (view === "aerial") offset = [-19, 53, 42];
    else if (view === "drone02") offset = [18, 9, -17.5];
    else offset = [-17, 8.5, 17];
    const narrow = size.width / size.height < 1.15 ? 1.35 : 1;
    desired.set(x + (offset[0] * c - offset[2] * s) * narrow, offset[1] * narrow, z + (offset[0] * s + offset[2] * c) * narrow);
    aim.set(x + (view === "aerial" ? 7 : 1.2) * c, .75, z + (view === "aerial" ? 7 : 1.2) * s);
    const wrapped = previousX.current !== null && Math.abs(x - previousX.current) > 200;
    previousX.current = x;
    const snap = !initialized.current || reducedMotion || wrapped;
    const damping = snap ? 1 : 1 - Math.exp(-frameDelta * 3.3);
    if (active || snap || cameraTransition.current) {
      camera.position.lerp(desired, damping); look.lerp(aim, damping); camera.lookAt(look);
    }
    initialized.current = true;
    const cameraSettled = camera.position.distanceToSquared(desired) <= .0004 && look.distanceToSquared(aim) <= .0004;
    if (cameraSettled || active) cameraTransition.current = false;
    if (!active && !reducedMotion && cameraTransition.current && !cameraSettled) invalidate();
    if (light.current) { light.current.position.set(x - 25, 42, z + 28); lightTarget.position.set(x, 0, z); lightTarget.updateMatrixWorld(); }
    camera.updateMatrixWorld();
    groups.current.forEach((group, index) => {
      const element = trackerRefs?.current[index];
      if (!element || !group) return;
      group.updateMatrixWorld();
      let left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity, visible = true;
      for (const dx of [-2.6, 2.6]) for (const dy of [.05, 2.05]) for (const dz of [-1.25, 1.25]) {
        corner.set(dx, dy, dz).applyMatrix4(group.matrixWorld).project(camera);
        if (corner.z > 1 || corner.z < -1) visible = false;
        const px = (corner.x * .5 + .5) * size.width, py = (-corner.y * .5 + .5) * size.height;
        left = Math.min(left, px); right = Math.max(right, px); top = Math.min(top, py); bottom = Math.max(bottom, py);
      }
      const width = Math.max(20, right - left), height = Math.max(16, bottom - top);
      visible = visible && right > 0 && left < size.width && bottom > 0 && top < size.height;
      element.style.visibility = visible ? "visible" : "hidden";
      element.style.transform = `translate3d(${left.toFixed(1)}px,${top.toFixed(1)}px,0)`;
      element.style.width = `${width.toFixed(1)}px`; element.style.height = `${height.toFixed(1)}px`;
    });
  });
  return <>
    <color attach="background" args={["#90978f"]} />
    <fog attach="fog" args={["#90978f", 85, 220]} />
    <hemisphereLight args={["#ced9d7", "#72664e", 1.3]} />
    <directionalLight ref={light} position={[-25, 42, 28]} intensity={2.7} color="#fff1db" castShadow target={lightTarget} shadow-mapSize={[2048, 2048]} shadow-camera-left={-42} shadow-camera-right={42} shadow-camera-top={42} shadow-camera-bottom={-42} shadow-camera-near={1} shadow-camera-far={120} shadow-bias={-.0002} shadow-normalBias={.04} shadow-radius={3} />
    <primitive object={lightTarget} />
    <Terrain />
    {vehicles.map((vehicle, index) => <Vehicle key={vehicle.id} definition={vehicle} index={index} groupRef={el => { groups.current[index] = el; }} elapsedRef={elapsed} active={active} onSelect={onSelect} />)}
  </>;
}

export default function GroundReconWorld(props) {
  return <Canvas shadows dpr={[1, 1.6]} camera={{ fov: 40, near: .15, far: 400, position: [-13, 6, 13] }} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }} frameloop={props.active ? "always" : "demand"} onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.0; }}>
    <World {...props} />
  </Canvas>;
}
