import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

// The source package contains nine independent GLBs in common project coordinates.
// Category assignment is based ONLY on the supplied directory/file provenance.
export const manifest = [
  ...['A','B'].flatMap(b=>['Floor','Interior','Roof','Walls'].map(part=>({building:`Building ${b}`,part,url:`/models/garden/BUILDING_${b}_${part}.glb` }))),
  {building:'Landscape',part:null,url:'/models/garden/Landscape.glb'}
];
export async function loadGarden(onProgress=()=>{}) {
 const loader=new GLTFLoader();const root=new THREE.Group();root.name='Garden Blocks';
 const groups=new Map();
 for(let i=0;i<manifest.length;i++){
  const item=manifest[i];let building=groups.get(item.building);
  if(!building){building=new THREE.Group();building.name=item.building;building.userData.explorer=true;building.userData.kind='building';root.add(building);groups.set(item.building,building)}
  const gltf=await loader.loadAsync(item.url);
  const component=new THREE.Group();component.name=item.part||'Site geometry';component.userData.explorer=true;
  component.userData.kind=item.part==='Roof'?'roof':item.part?.toLowerCase()||'landscape';
  component.add(gltf.scene);building.add(component);
  onProgress(Math.round((i+1)/manifest.length*100));
 }
 // Source coordinates are shared across files. All nine parts receive ONE common
 // transform: source Z-up -> Three.js Y-up, source millimetres -> metres.
 root.rotation.x=-Math.PI/2;root.scale.setScalar(.001);
 root.updateMatrixWorld(true);
 const bounds=new THREE.Box3().setFromObject(root);
 if(bounds.isEmpty())throw new Error('The source files contain no visible geometry');
 // Center horizontally and put the lowest point at ground level; preserve relative placement.
 const c=bounds.getCenter(new THREE.Vector3());
 root.position.set(-c.x,-bounds.min.y,-c.z);root.updateMatrixWorld(true);
 return root;
}
