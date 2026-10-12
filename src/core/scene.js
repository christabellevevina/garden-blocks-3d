import * as THREE from 'three';
export const presets={three:[1,0.72,1],front:[0,.1,1],back:[0,.1,-1],left:[-1,.1,0],right:[1,.1,0],top:[0,1,.0001],eye:[1,.14,1]};
export const lighting={morning:{color:'#ffe2bc',intensity:2.1,pos:[-9,12,5],ambient:.75},day:{color:'#ffffff',intensity:2.7,pos:[7,15,9],ambient:1},afternoon:{color:'#ffd1a0',intensity:2.2,pos:[11,8,3],ambient:.8},evening:{color:'#ffac75',intensity:1.3,pos:[-9,4,-5],ambient:.4},night:{color:'#a9c7ff',intensity:.45,pos:[3,10,-6],ambient:.18}};
export function applyVisuals(root,mode,selected,entered,materialRegistry,clipping,roofOpacity){
 if(!root)return;
 root.traverse(o=>{if(!o.isMesh)return;const mats=Array.isArray(o.material)?o.material:[o.material];const originals=o.userData.originalMaterials||mats.map(m=>m.clone());if(!o.userData.originalMaterials)o.userData.originalMaterials=originals;
 const inSelected=selected&&(o===selected||selected.getObjectById(o.id)||isDescendant(o,selected));const isOther=selected&&!inSelected;
 const next=mats.map((m,i)=>{const base=materialRegistry.get(m.uuid)?.material||m;let result=base.clone();if(mode==='clay'){result=new THREE.MeshStandardMaterial({color:'#c8c6bf',roughness:.92})}else if(mode==='blueprint'){result=new THREE.MeshBasicMaterial({color:'#145f8c',wireframe:true})}else if(mode==='xray'){result=new THREE.MeshPhysicalMaterial({color:'#70c5dd',transparent:true,opacity:.25,depthWrite:false,side:THREE.DoubleSide})}
 if(isOther){result.transparent=true;result.opacity=entered?.13:.22;result.depthWrite=false;}else if(inSelected&&mode==='realistic'&&result.color){result.color.lerp(new THREE.Color('#e9b765'),.23)}
 if(/roof|canopy|atap/i.test(o.name)){result.transparent=true;result.opacity=Math.min(result.opacity??1,roofOpacity)}
 result.clippingPlanes=clipping;result.clipShadows=true;return result});
 if(o.userData.displayMaterials)o.userData.displayMaterials.forEach(m=>m.dispose());o.userData.displayMaterials=next;o.material=Array.isArray(o.material)?next:next[0];
 });
}
function isDescendant(o,parent){let p=o.parent;while(p){if(p===parent)return true;p=p.parent}return false}
