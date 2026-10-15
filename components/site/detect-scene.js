import * as THREE from 'three';

// Entirely fictional industrial campus. Geometry and labels are authored illustration data.
export const observations = [
  { id: 'B-01', name: 'Assembly hall', kind: 'Industrial building', position: [-27, 0, -18], size: [44, 16, 62], detail: 'Large roof span, repeated skylights and connected service buildings.' },
  { id: 'B-02', name: 'Storage building', kind: 'Warehouse', position: [36, 0, -29], size: [39, 11, 46], detail: 'Rectangular footprint with a row of loading doors and an adjacent paved yard.' },
  { id: 'B-03', name: 'Office building', kind: 'Building', position: [-30, 0, 39], size: [35, 14, 16], detail: 'Repeated window pattern and a separate pedestrian entrance.' },
  { id: 'S-01', name: 'Storage vessels', kind: 'Industrial structures', position: [37, 0, -79], size: [39, 13, 21], detail: 'A group of cylindrical structures on a shared concrete pad.' },
  { id: 'Y-01', name: 'Loading yard', kind: 'Open area', position: [39, 0, 31], size: [38, 3, 30], detail: 'Paved circulation area with parked trailers and marked loading spaces.' },
];

export function createDetectScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .95;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#858887');
  scene.fog = new THREE.Fog('#858887', 250, 650);
  const camera = new THREE.PerspectiveCamera(43, 1, 1, 900);
  const geometries = new Set(), materials = new Set();
  const mat = (color, options = {}) => { const m = new THREE.MeshStandardMaterial({ color, roughness: .92, ...options }); materials.add(m); return m; };
  const wall = mat('#dcdfdc'), roof = mat('#eff0ed'), dark = mat('#656c6b'), glass = mat('#8a9492'), pavement = mat('#777b79'), concrete = mat('#989d99');
  const lineMaterial = new THREE.LineBasicMaterial({ color: '#e5f5ef', transparent: true, opacity: .48 }); materials.add(lineMaterial);
  const outlineMaterial = new THREE.LineBasicMaterial({ color: '#c2eced', transparent: true, opacity: .8 }); materials.add(outlineMaterial);
  const structureLines = new THREE.Group(); scene.add(structureLines);
  function mesh(geometry, material, x, y, z, rotation = 0) {
    geometries.add(geometry); const obj = new THREE.Mesh(geometry, material);
    obj.position.set(x, y, z); obj.rotation.y = rotation; obj.castShadow = true; obj.receiveShadow = true; scene.add(obj); return obj;
  }
  function box(x, y, z, w, h, d, material = wall, edges = false) {
    const obj = mesh(new THREE.BoxGeometry(w, h, d), material, x, y + h / 2, z);
    if (edges) { const g = new THREE.EdgesGeometry(obj.geometry); geometries.add(g); const line = new THREE.LineSegments(g, lineMaterial); line.position.copy(obj.position); structureLines.add(line); }
    return obj;
  }
  scene.add(new THREE.HemisphereLight('#ffffff', '#515950', 1.4));
  const sun = new THREE.DirectionalLight('#fffdf6', 2.8); sun.position.set(-100, 180, 90); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024); sun.shadow.camera.left = -150; sun.shadow.camera.right = 150; sun.shadow.camera.top = 150; sun.shadow.camera.bottom = -150; sun.shadow.camera.far = 450; sun.shadow.bias = -.001; sun.shadow.normalBias = .08; scene.add(sun);
  box(0, -1, 0, 1800, 1, 1800, mat('#4e5350'));
  // A deterministic surface texture, generated locally without satellite or sensor data.
  const textureCanvas = document.createElement('canvas'); textureCanvas.width = textureCanvas.height = 256;
  const ctx = textureCanvas.getContext('2d'); let seed = 17;
  ctx.fillStyle = '#929792'; ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 18000; i++) { seed = (seed * 16807) % 2147483647; const x = seed % 256; seed = (seed * 16807) % 2147483647; const y = seed % 256; ctx.fillStyle = i % 2 ? '#a0a49f' : '#828780'; ctx.fillRect(x, y, 1, 1); }
  const texture = new THREE.CanvasTexture(textureCanvas); texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(22, 22);
  const ground = mat('#6f746f', { map: texture }); box(0, -.3, -20, 330, .3, 310, ground);
  box(0, 0, -20, 164, .18, 200, concrete);
  // Campus roads, pavement joints, curbs and parking stripes.
  for (const x of [-87, 4, 86]) box(x, .2, -16, 9, .12, 232, pavement);
  for (const z of [-111, 4, 69]) box(0, .2, z, 184, .12, 8, pavement);
  for (let z = -110; z < 100; z += 10) for (const x of [-87, 4, 86]) box(x, .34, z, .18, .02, 4, roof);
  for (let x = -75; x < 84; x += 10) box(x, .34, 69, 4, .02, .18, roof);
  for (let i = 0; i < 10; i++) { box(-69 + i * 5, .25, 59, .13, .03, 6, roof); }
  for (const building of observations.slice(0, 3)) {
    const [x,,z] = building.position, [w,h,d] = building.size;
    box(x, 0, z, w + 3, .55, d + 3, concrete);
    box(x, .55, z, w, h, d, wall, true);
    box(x, h + .55, z, w + .8, .45, d + .8, roof, true);
    for (let i = -w/2+3; i < w/2; i += 5) { box(x+i, 2, z+d/2+.08, 2.5, building.id === 'B-03' ? 2 : 5, .16, dark); }
    if (building.id === 'B-03') {
      for (let level=0; level<3; level++) for (let i=-w/2+2; i<w/2; i+=4) box(x+i, 3+level*3.4, z+d/2+.12, 2.1, 1.7, .2, glass);
    } else {
      for (let rz=-d/2+6; rz<d/2; rz+=10) {
        box(x-8, h+1, z+rz, 7, .7, 3.2, glass, true); box(x+8, h+1, z+rz, 7, .7, 3.2, glass, true);
        box(x, h+.9, z+rz, 1, .6, d > 50 ? 5 : 3, concrete);
      }
      for(let i=-d/2+1; i<d/2; i+=3) box(x, h+1.02, z+i, w, .06, .12, concrete);
    }
  }
  // Ancillary workshops, covered walkway, pipes and roof equipment.
  box(-62, 0, -30, 14, 7, 39, wall, true); box(-27, 0, -64, 30, 9, 15, wall, true);
  box(-30, 8, 17, 5, 2, 28, roof, true);
  for (let i=0;i<3;i++) {
    const x=23+i*14;
    mesh(new THREE.CylinderGeometry(5.3, 5.3, 12, 32), wall, x, 6.4, -79);
    mesh(new THREE.CylinderGeometry(5.5, 5.5, .4, 32), roof, x, 12.6, -79);
    mesh(new THREE.TorusGeometry(5.35, .09, 5, 32), dark, x, 7, -79).rotation.x = Math.PI/2;
    box(x, 12.8, -79, 1.5, 1, 1.5, concrete);
  }
  for (let i=0;i<6;i++) { box(22+i*6, .3, 33, 3.8, 3.6, 13, wall, true); box(22+i*6, .3, 42, 3.4, 2.8, 4, dark); }
  for(let i=0;i<8;i++) { box(-65+i*5, .35, 59, 2.3, 1.2, 4.5, i%2 ? dark : wall); }
  // Fences, lighting columns and small planted islands establish scale.
  for (let z=-117; z<83; z+=8) for(const x of [-77,77]) box(x, 0, z, .18, 2.6, .18, dark);
  for (const x of [-77,77]) for(const h of [1,2]) box(x, h, -20, .08, .07, 200, dark);
  for (const x of [-70,73]) for(const z of [-95,-45,10,60]) { box(x,0,z,.28,8,.28,dark); box(x+1,8,z,2.5,.15,.7,roof); }
  const foliage = mat('#727d71');
  for(let i=0;i<30;i++) { const x = -111+(i%2)*225, z=-135+Math.floor(i/2)*18; box(x,0,z,.6,3,.6,dark); mesh(new THREE.IcosahedronGeometry(3+(i%3),1),foliage,x,5,z); }
  // Subdued map grid and site boundary.
  const grid = new THREE.GridHelper(700, 70, '#c7ceca', '#bdc4bf'); grid.position.y=.05; grid.material.transparent=true; grid.material.opacity=.075; materials.add(grid.material); geometries.add(grid.geometry); scene.add(grid);
  const outlines = observations.map(o=> {const source = new THREE.BoxGeometry(o.size[0]+2,o.size[1]+2,o.size[2]+2); const g = new THREE.EdgesGeometry(source); source.dispose(); geometries.add(g); const l=new THREE.LineSegments(g,outlineMaterial); l.position.set(o.position[0],o.size[1]/2+1,o.position[2]); scene.add(l); return l;});
  const scanMaterial = new THREE.LineBasicMaterial({color:'#bbebed',transparent:true,opacity:.22}); materials.add(scanMaterial);
  const scanGeometry = new THREE.BufferGeometry(); geometries.add(scanGeometry);
  const scanPositions=new Float32Array(18*6); scanGeometry.setAttribute('position',new THREE.BufferAttribute(scanPositions,3));
  const scanLines=new THREE.LineSegments(scanGeometry,scanMaterial); scene.add(scanLines);
  const sweepGroup=new THREE.Group();scene.add(sweepGroup);
  const sweepGeometry=new THREE.PlaneGeometry(150,30);geometries.add(sweepGeometry);
  const sweepMaterial=new THREE.MeshBasicMaterial({color:'#b3e9ef',transparent:true,opacity:.055,side:THREE.DoubleSide,depthWrite:false});materials.add(sweepMaterial);
  const sweepPlane=new THREE.Mesh(sweepGeometry,sweepMaterial);sweepPlane.position.y=15;sweepGroup.add(sweepPlane);
  const sweepEdges=new THREE.EdgesGeometry(sweepGeometry);geometries.add(sweepEdges);
  const sweepLine=new THREE.LineSegments(sweepEdges,outlineMaterial);sweepLine.position.y=15;sweepGroup.add(sweepLine);
  
  const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
  const projection=new THREE.Vector3();
  return {
    resize(w,h){renderer.setSize(w,h,false);camera.aspect=w/h;camera.zoom=Math.max(.65,Math.min(1,camera.aspect/1.5));camera.updateProjectionMatrix();},
    render(seconds,{selected,structures,scan}) {
      const p=smooth(Math.min(seconds,18)/18);
      camera.position.set(145-55*p,103-49*p,192-72*p); camera.lookAt(-3,5,-20-5*p);
      structureLines.visible=structures;
      outlines.forEach((line,index)=>{line.visible=structures && (selected===index || seconds>2+index*2.2); line.material=outlineMaterial;});
      scanLines.visible=scan;sweepGroup.visible=scan;
      const sweep=(seconds*.095)%1;sweepGroup.position.z=-112+sweep*176;
      for(let i=0;i<18;i++){ const j=i*6, x=-72+i*8.4,z=-112+sweep*176;scanPositions[j]=camera.position.x-10;scanPositions[j+1]=camera.position.y-12;scanPositions[j+2]=camera.position.z-20;scanPositions[j+3]=x;scanPositions[j+4]=.8;scanPositions[j+5]=z; }
      scanGeometry.attributes.position.needsUpdate=true; scanGeometry.computeBoundingSphere();
      renderer.render(scene,camera);
      return observations.map(o=>{projection.set(o.position[0],o.size[1]+2,o.position[2]).project(camera);return {x:(projection.x*.5+.5)*100,y:(-.5*projection.y+.5)*100,visible:projection.z<1&&projection.x>-.93&&projection.x<.93&&projection.y>-.9&&projection.y<.85};});
    },
    dispose(){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());texture.dispose();renderer.dispose();},
  };
}
