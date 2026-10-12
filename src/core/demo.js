import * as THREE from 'three';
export function createDemo(){
 const root=new THREE.Group();root.name='Demo';
 const wall=new THREE.MeshStandardMaterial({color:'#d6c7ae',roughness:.88});const roof=new THREE.MeshStandardMaterial({color:'#4b514f',roughness:.78});const glass=new THREE.MeshPhysicalMaterial({color:'#83aab3',roughness:.14,metalness:.12,transparent:true,opacity:.65});const stone=new THREE.MeshStandardMaterial({color:'#a9aaa1',roughness:.95});
 const add=(g,name,geo,mat,x,y,z)=>{const m=new THREE.Mesh(geo,mat);m.name=name;m.position.set(x,y,z);g.add(m);return m};
 [[-5,0,'North Pavilion'],[5,0,'South Pavilion']].forEach(([x,z,name],i)=>{const g=new THREE.Group();g.name=name;g.position.set(x,0,z);root.add(g);add(g,'Floor',new THREE.BoxGeometry(7,.25,6),stone,0,.1,0);add(g,'Main Structure',new THREE.BoxGeometry(6.4,3.4,5.4),wall,0,1.9,0);add(g,'Front Glazing',new THREE.BoxGeometry(4,2.35,.09),glass,0,2,-2.76);add(g,'Entrance Door',new THREE.BoxGeometry(1.3,2.4,.13),roof,-2.15,1.3,-2.84);const r=add(g,'Roof',new THREE.ConeGeometry(5.5,2.1,4),roof,0,4.65,0);r.rotation.y=Math.PI/4; r.scale.z=.9;});
 const court=new THREE.Group();court.name='Central Court';root.add(court);add(court,'Stone Terrace',new THREE.BoxGeometry(3,.16,8),stone,0,.05,0);for(let i=0;i<5;i++)add(court,'Stepping Stone '+(i+1),new THREE.BoxGeometry(1,.08,.75),wall,0,.17,-3+i*1.5);
 add(root,'Site Base',new THREE.BoxGeometry(19,.35,11),new THREE.MeshStandardMaterial({color:'#879387',roughness:1}),0,-.3,0);return root;
}
