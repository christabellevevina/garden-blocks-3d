import * as THREE from 'three';
export function analyze(root,config){
 const nodes=[],buildings=[],roofs=[],materials=new Map();root.updateMatrixWorld(true);
 root.traverse(o=>{
  if(o.isMesh){o.castShadow=true;o.receiveShadow=true;(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(m&&!materials.has(m.uuid))materials.set(m.uuid,{material:m,original:m.clone()})})}
  // Imported CAD helper nodes are not architectural components. Only groups
  // explicitly mapped from the supplied file manifest are classified.
  if(!o.userData.explorer)return;
  const path=[];let p=o;while(p&&p!==root){path.unshift(p.name||p.type);p=p.parent}
  const box=new THREE.Box3().setFromObject(o);if(box.isEmpty())return;
  const key=path.join('/');const node={id:o.uuid,name:o.name,path:key,object:o,depth:path.length,kind:o.userData.kind,description:config.metadata[key]?.description||config.metadata[o.name]?.description||'',children:[]};nodes.push(node);
  if(o.userData.kind==='roof')roofs.push(node);
 });
 const byId=new Map(nodes.map(n=>[n.id,n]));nodes.forEach(n=>{let p=n.object.parent;while(p&&p!==root&&!byId.has(p.uuid))p=p.parent;if(p&&byId.has(p.uuid))byId.get(p.uuid).children.push(n);else buildings.push(n)});
 return {nodes,buildings,roofs,materials};
}
export function boundsOf(o){const box=new THREE.Box3().setFromObject(o);return {box,center:box.getCenter(new THREE.Vector3()),size:box.getSize(new THREE.Vector3()),radius:box.getBoundingSphere(new THREE.Sphere()).radius}}
