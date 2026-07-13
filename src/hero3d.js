import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const h = React.createElement;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

const PRESETS = {
  low: {
    id:'low', label:'LOW', dpr:[1,1], antialias:false,
    terrainCols:38, terrainRows:58, waterCols:18, waterRows:76,
    streaks:12, markers:3, curtains:2, fogFar:44
  },
  medium: {
    id:'medium', label:'MEDIUM', dpr:[1,1.15], antialias:true,
    terrainCols:54, terrainRows:82, waterCols:26, waterRows:112,
    streaks:22, markers:5, curtains:3, fogFar:52
  },
  high: {
    id:'high', label:'HIGH', dpr:[1,1.35], antialias:true,
    terrainCols:72, terrainRows:112, waterCols:34, waterRows:156,
    streaks:34, markers:7, curtains:4, fogFar:60
  }
};
const ORDER = ['low','medium','high'];

function initialPresetId(){
  const w = window.innerWidth || 1024;
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  if(reduceMotion || coarsePointer || w < 720 || cores <= 4 || memory <= 4) return 'low';
  if(w < 1180 || cores <= 8 || memory <= 8) return 'medium';
  return 'high';
}

function setQualityLabel(id){
  document.documentElement.dataset.heroQuality = id;
  document.querySelectorAll('[data-quality-label]').forEach(node => { node.textContent = PRESETS[id]?.label || id; });
}

function riverCenter(z){
  return Math.sin(z * 0.095) * 2.8 + Math.sin(z * 0.038 + 1.2) * 1.35;
}

function makeTerrainGeometry(preset){
  const width = 66, length = 98, cols = preset.terrainCols, rows = preset.terrainRows;
  const positions = [], colors = [], indices = [];
  const low = new THREE.Color('#17215e');
  const mid = new THREE.Color('#091046');
  const high = new THREE.Color('#010532');
  const ridge = new THREE.Color('#0d174f');
  for(let z=0; z<=rows; z++){
    const v = z / rows;
    const pz = (v - 0.5) * length;
    const center = riverCenter(pz);
    for(let x=0; x<=cols; x++){
      const u = x / cols;
      const px = (u - 0.5) * width;
      const ax = Math.abs(px - center);
      const bank = Math.max(0, ax - 4.35);
      let py = ax < 4.35 ? -0.82 : Math.min(bank * bank * 0.048 + bank * 0.25, 9.4);
      py += Math.sin(px * 0.27 + pz * 0.17) * 0.22 + Math.cos(pz * 0.31 + px * 0.09) * 0.2;
      positions.push(px, py, pz);
      const t = THREE.MathUtils.clamp((py + 0.82) / 6.2, 0, 1);
      let c = t < 0.42 ? low.clone().lerp(mid, t / 0.42) : mid.clone().lerp(high, (t - 0.42) / 0.58);
      if(ax > 20) c.lerp(ridge, 0.28);
      colors.push(c.r, c.g, c.b);
    }
  }
  for(let z=0; z<rows; z++){
    for(let x=0; x<cols; x++){
      const a = z * (cols + 1) + x;
      const b = a + 1;
      const c = a + cols + 1;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function makeWaterGeometry(preset){
  const width = 9.2, length = 96, cols = preset.waterCols, rows = preset.waterRows;
  const positions = [], lanes = [], flow = [], indices = [];
  for(let z=0; z<=rows; z++){
    const v = z / rows;
    const pz = (v - 0.5) * length;
    const center = riverCenter(pz);
    for(let x=0; x<=cols; x++){
      const u = x / cols;
      const lateral = (u - 0.5) * width;
      const bendNudge = Math.sin(v * Math.PI * 5.2) * (1 - Math.abs(u - 0.5) * 2) * 0.2;
      positions.push(center + lateral + bendNudge, -0.04, pz);
      lanes.push(Math.abs(lateral) / (width * 0.5));
      flow.push(v);
    }
  }
  for(let z=0; z<rows; z++){
    for(let x=0; x<cols; x++){
      const a = z * (cols + 1) + x;
      const b = a + 1;
      const c = a + cols + 1;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('aLane', new THREE.Float32BufferAttribute(lanes, 1));
  geo.setAttribute('aFlow', new THREE.Float32BufferAttribute(flow, 1));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function Terrain({ preset }){
  const geometry = useMemo(() => makeTerrainGeometry(preset), [preset.id]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return h('mesh', { geometry, position:[1.8, -0.05, -14] },
    h('meshStandardMaterial', { vertexColors:true, roughness:1, metalness:0.02 })
  );
}

const waterVertex = `
uniform float uTime;
attribute float aLane;
attribute float aFlow;
varying float vWave;
varying float vLane;
varying float vFlow;
varying vec3 vWorld;
void main(){
  vec3 p = position;
  float t = uTime;
  float w = sin(p.z * 0.66 + t * 1.55 + p.x * 0.72) * 0.11;
  w += sin(p.z * 1.9 - t * 2.25) * 0.046;
  w += sin((p.x - p.z) * 2.6 + t * 1.2) * 0.025;
  p.y += w;
  vWave = w;
  vLane = aLane;
  vFlow = aFlow;
  vec4 world = modelMatrix * vec4(p, 1.0);
  vWorld = world.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

const waterFragment = `
uniform float uTime;
varying float vWave;
varying float vLane;
varying float vFlow;
varying vec3 vWorld;
void main(){
  vec3 deep = vec3(0.004, 0.012, 0.115);
  vec3 teal = vec3(0.028, 0.095, 0.40);
  vec3 green = vec3(0.08, 0.24, 1.0);
  float center = 1.0 - smoothstep(0.08, 0.98, vLane);
  float edge = smoothstep(0.7, 1.0, vLane);
  float stream = sin(vWorld.z * 1.45 - uTime * 4.1 + sin(vWorld.x * 2.0)) * 0.5 + 0.5;
  float cross = sin((vWorld.x + vWorld.z) * 2.55 - uTime * 1.9) * 0.5 + 0.5;
  float glint = pow(max(0.0, stream * center), 4.0) * 0.62 + pow(max(0.0, cross * center), 9.0) * 0.38;
  vec3 color = mix(deep, teal, center * 0.9 + vWave * 1.15);
  color += green * glint;
  color += vec3(0.72, 0.82, 1.0) * edge * (0.18 + 0.26 * stream);
  float alpha = 0.92 + center * 0.06;
  gl_FragColor = vec4(color, alpha);
}`;

function Water({ active, preset }){
  const mat = useRef();
  const geometry = useMemo(() => makeWaterGeometry(preset), [preset.id]);
  const uniforms = useMemo(() => ({ uTime:{ value:0 } }), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame(({ clock }) => {
    if(mat.current && active && !reduceMotion) mat.current.uniforms.uTime.value = clock.getElapsedTime();
  });
  return h('mesh', { geometry, position:[1.8, 0.02, -14] },
    h('shaderMaterial', { ref:mat, uniforms, vertexShader:waterVertex, fragmentShader:waterFragment, transparent:true, side:THREE.DoubleSide, depthWrite:false })
  );
}

function FlowStreaks({ active, preset }){
  const group = useRef();
  const streaks = useMemo(() => Array.from({ length:preset.streaks }, (_, i) => ({
    lane:(Math.random() - 0.5) * 6.8,
    z:-48 + Math.random() * 82,
    y:0.16 + Math.random() * 0.05,
    len:0.9 + Math.random() * 2.4,
    speed:2.3 + Math.random() * 2.8,
    opacity:0.16 + Math.random() * 0.38,
    phase:Math.random() * Math.PI * 2,
    key:i
  })), [preset.id]);
  useFrame((_, delta) => {
    if(!active || reduceMotion || !group.current) return;
    group.current.children.forEach((mesh, i) => {
      const s = streaks[i];
      s.z += s.speed * delta;
      if(s.z > 42) s.z = -50;
      const x = riverCenter(s.z) + s.lane + Math.sin(s.z * 0.18 + s.phase) * 0.13 + 1.8;
      mesh.position.set(x, s.y, s.z - 14);
      mesh.rotation.z = Math.sin(s.z * 0.08) * 0.18;
    });
  });
  return h('group', { ref:group }, streaks.map(s =>
    h('mesh', { key:s.key, position:[riverCenter(s.z) + s.lane + 1.8, s.y, s.z - 14], rotation:[-Math.PI / 2, 0, 0] },
      h('planeGeometry', { args:[0.055, s.len] }),
      h('meshBasicMaterial', { color:'#e6ecff', transparent:true, opacity:s.opacity, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.DoubleSide })
    )
  ));
}

function SurveyMarkers({ active, preset }){
  const group = useRef();
  const markers = useMemo(() => {
    const all = [-38, -26, -14, -2, 10, 23, 36];
    return all.slice(0, preset.markers).map((z, i) => ({ z, side:i % 2 ? -1 : 1, key:i }));
  }, [preset.id]);
  useFrame(({ clock }) => {
    if(!active || reduceMotion || !group.current) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, i) => { child.position.y = 0.32 + Math.sin(t * 1.15 + i) * 0.035; });
  });
  return h('group', { ref:group }, markers.map(m => {
    const x = riverCenter(m.z) + m.side * 6.15 + 1.8;
    return h('group', { key:m.key, position:[x, 0.32, m.z - 14] },
      h('mesh', { position:[0, 0.58, 0] },
        h('cylinderGeometry', { args:[0.036, 0.036, 1.16, 8] }),
        h('meshStandardMaterial', { color:'#eef2ff', roughness:0.58 })
      ),
      h('mesh', { position:[0, 1.18, 0] },
        h('sphereGeometry', { args:[0.12, 14, 10] }),
        h('meshBasicMaterial', { color:'#b8c5ff' })
      )
    );
  }));
}

function ScanCurtains({ active, preset }){
  const group = useRef();
  const curtains = useMemo(() => Array.from({ length:preset.curtains }, (_, i) => ({
    z:-30 + i * (62 / Math.max(1, preset.curtains - 1)),
    phase:i * 1.35,
    key:i
  })), [preset.id]);
  useFrame(({ clock }) => {
    if(!group.current || reduceMotion) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((mesh, i) => {
      const p = curtains[i];
      const pulse = active ? Math.sin(t * 0.9 + p.phase) * 0.5 + 0.5 : 0.35;
      mesh.material.opacity = 0.08 + pulse * 0.12;
      mesh.position.y = 3.4 + pulse * 0.22;
    });
  });
  return h('group', { ref:group }, curtains.map(c =>
    h('mesh', { key:c.key, position:[riverCenter(c.z) + 1.8, 3.4, c.z - 14], rotation:[0, Math.sin(c.z * 0.05) * 0.45, 0] },
      h('planeGeometry', { args:[10.5, 8.6, 1, 1] }),
      h('meshBasicMaterial', { color:'#b8c5ff', transparent:true, opacity:0.12, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.DoubleSide })
    )
  ));
}

function Station({ active }){
  const ring = useRef();
  useFrame(({ clock }) => {
    if(!ring.current || reduceMotion) return;
    const t = active ? clock.getElapsedTime() : 0;
    const s = 1.05 + (Math.sin(t * 2.0) * 0.5 + 0.5) * 1.25;
    ring.current.scale.setScalar(s);
    ring.current.material.opacity = 0.52 / s;
  });
  const z = 2.5;
  const x = riverCenter(z) + 6.05 + 1.8;
  return h('group', { position:[x, -0.34, z - 14] },
    h('mesh', { position:[0, 1.08, 0] },
      h('cylinderGeometry', { args:[0.046, 0.046, 2.35, 10] }),
      h('meshStandardMaterial', { color:'#eef2ff', roughness:0.72 })
    ),
    [0,1,2,3,4].map(i => h('mesh', { key:i, position:[0, 0.35 + i * 0.38, 0] },
      h('cylinderGeometry', { args:[0.05, 0.05, 0.13, 10] }),
      h('meshStandardMaterial', { color:i % 2 ? '#0930d0' : '#010532', roughness:0.7 })
    )),
    h('mesh', { ref:ring, rotation:[Math.PI / 2, 0, 0], position:[0, 0.42, -0.02] },
      h('torusGeometry', { args:[0.42, 0.012, 8, 56] }),
      h('meshBasicMaterial', { color:'#b8c5ff', transparent:true, opacity:0.38, depthWrite:false, blending:THREE.AdditiveBlending })
    ),
    h('mesh', { position:[0, 0.42, -0.02] },
      h('sphereGeometry', { args:[0.09, 16, 12] }),
      h('meshBasicMaterial', { color:'#b8c5ff' })
    )
  );
}

function CameraDrift({ active }){
  useFrame(({ camera, clock }) => {
    if(!active || reduceMotion) return;
    const t = clock.getElapsedTime();
    camera.position.x = -8.4 + Math.sin(t * 0.13) * 0.8;
    camera.position.y = 6.2 + Math.sin(t * 0.11) * 0.18;
    camera.position.z = 18.2 + Math.sin(t * 0.07) * 0.48;
    camera.lookAt(2.6 + Math.sin(t * 0.1) * 0.35, 0.28, -18.5);
  });
  return null;
}

function PerformanceGovernor({ active, presetId, downgrade }){
  const state = useRef({ warm:0, total:0, frames:0, checked:false });
  useFrame((_, delta) => {
    if(!active || reduceMotion || state.current.checked || presetId === 'low') return;
    state.current.warm += delta;
    if(state.current.warm < 2.4) return;
    state.current.total += delta;
    state.current.frames += 1;
    if(state.current.total >= 1.7){
      const fps = state.current.frames / state.current.total;
      state.current.checked = true;
      if(fps < 42) downgrade();
    }
  });
  useEffect(() => { state.current = { warm:0, total:0, frames:0, checked:false }; }, [presetId]);
  return null;
}

function Scene({ active, preset, presetId, downgrade }){
  return h(React.Fragment, null,
    h('fog', { attach:'fog', args:['#010532', 14, preset.fogFar] }),
    h('hemisphereLight', { args:['#e8eeff', '#010532', 0.84] }),
    h('directionalLight', { position:[-7, 9, 9], intensity:1.85, color:'#f0f4ff' }),
    h('ambientLight', { intensity:0.34, color:'#050a32' }),
    h(Terrain, { preset }),
    h(Water, { active, preset }),
    h(FlowStreaks, { active, preset }),
    h(ScanCurtains, { active, preset }),
    h(SurveyMarkers, { active, preset }),
    h(Station, { active }),
    h(CameraDrift, { active }),
    h(PerformanceGovernor, { active, presetId, downgrade })
  );
}

function RiverHeroApp(){
  const [active, setActive] = useState(!reduceMotion);
  const [presetId, setPresetId] = useState(initialPresetId);
  const preset = PRESETS[presetId];

  useEffect(() => { setQualityLabel(presetId); }, [presetId]);
  useEffect(() => {
    const hero = document.querySelector('.hero');
    if(!hero || reduceMotion) return;
    const observer = new IntersectionObserver(entries => setActive(Boolean(entries[0]?.isIntersecting)), { threshold:0.01 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const downgrade = () => setPresetId(current => {
    const index = ORDER.indexOf(current);
    return ORDER[Math.max(0, index - 1)] || current;
  });

  return h(Canvas, {
    dpr:preset.dpr,
    frameloop:active && !reduceMotion ? 'always' : 'demand',
    camera:{ position:[-8.4, 6.2, 18.2], fov:43, near:0.1, far:110 },
    gl:{ antialias:preset.antialias, alpha:true, powerPreference:'high-performance', preserveDrawingBuffer:false },
    onCreated:({ gl, camera }) => {
      gl.setClearColor(0x000000, 0);
      camera.lookAt(2.6, 0.28, -18.5);
      document.querySelector('.hero')?.classList.add('react-ready');
    }
  }, h(Scene, { active, preset, presetId, downgrade, key:presetId }));
}

const mount = document.querySelector('[data-react-river]');
if(mount) createRoot(mount).render(h(RiverHeroApp));