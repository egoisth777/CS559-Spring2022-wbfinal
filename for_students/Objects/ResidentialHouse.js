import {GrObject} from "../../libs/CS559-Framework/GrObject.js";
import * as T from "../../libs/CS559-Three/build/three.module.js";
import {shaderMaterial} from "../../libs/CS559-Framework/shaderHelper.js";
import * as Geom from "../../libs/CS559-Three/examples/jsm/deprecated/Geometry.js";
import {TextureLoader} from "../../libs/CS559-Three/build/three.module.js";

/**
 * Create Residence House Type 01
 */
let simpleBuilding1Count = 0;
export class RBuilding01 extends GrObject{
    constructor() {
        let building = new T.Group();
        // you will need a call to "super"
        let roofGeom = new Geom.Geometry();

        const s = Math.sqrt(2);
        // Made the roof Geometry
        // Push in the vertices
        roofGeom.vertices.push(new T.Vector3(-s, 0, 0));
        roofGeom.vertices.push(new T.Vector3(0, 0, s));
        roofGeom.vertices.push(new T.Vector3(s, 0, 0));
        roofGeom.vertices.push(new T.Vector3(0, 0, -s));
        roofGeom.vertices.push(new T.Vector3(0, s, -0));

        // f1 - f4: Four Triangular faces
        let f1 = new Geom.Face3(0,1,4);
        roofGeom.faces.push(f1);
        roofGeom.faceVertexUvs[0].push([
            new T.Vector2(1/2, 0),
            new T.Vector2(1, 0),
            new T.Vector2(1, 1)
        ]);
        let f2 = new Geom.Face3(1,2,4);
        roofGeom.faces.push(f2);
        roofGeom.faceVertexUvs[0].push([
            new T.Vector2(1/2, 0),
            new T.Vector2(1, 0),
            new T.Vector2(1, 1)
        ]);
        let f3 = new Geom.Face3(2,3,4);
        roofGeom.faces.push(f3);
        roofGeom.faceVertexUvs[0].push([
            new T.Vector2(1/2, 0),
            new T.Vector2(1, 0),
            new T.Vector2(1, 1)
        ]);
        let f4 = new Geom.Face3(3,0,4);
        f4.color.setStyle("cyan");
        roofGeom.faces.push(f4);
        roofGeom.faceVertexUvs[0].push([
            new T.Vector2(1/2, 0),
            new T.Vector2(1, 0),
            new T.Vector2(1, 1)
        ]);
        roofGeom.computeFaceNormals();
        roofGeom.uvsNeedUpdate = true;

        let tl = new T.TextureLoader().load("./Textures/roofTexture01.jpg");
        let material = new T.MeshStandardMaterial({ map: tl, roughness: 0.75 });
        let bg = roofGeom.toBufferGeometry();
        let roofMesh = new T.Mesh(bg, material);


        const materials = [
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/buildingTexture01.png")}),
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/buildingWallTexture.png")}),
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/buildingWallTexture.png")}),
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/buildingWallTexture02.png")}),
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/buildingWallTexture02.png")}),
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/buildingWallTexture02.png")})
        ];
        let cubeGeom = new T.BoxGeometry(2,2,2);
        let base = new T.Mesh(cubeGeom, materials);
        base.translateY(1);
        building.add(base);
        building.add(roofMesh);
        roofMesh.translateY(2);
        roofMesh.rotateY(Math.PI/4);
        super(`ResidentialHouseT1-${++simpleBuilding1Count}`, building);
    }
}


/**
 * Create Residence House Type 02
 */
let simpleBuilding2Count = 0;
export class RBuilding02 extends GrObject{
    constructor() {
        const sqrt3 = Math.sqrt(3);
        let building = new T.Group();
        // you will need a call to "super"
        // student, fill this in
        // you will need a call to "super"
        let roofGeom = new T.BufferGeometry();

        // Define the vertices
        const vertices = new Float32Array([
            // face 01
            -1, 0, 1,
            1, 0, 1,
            0, sqrt3, 1,

            // face 02 1-2-4; 4-2-5
            1, 0, 1,
            1, 0, -1,
            0, sqrt3, 1,
            0, sqrt3, 1,
            1, 0, -1,
            0, sqrt3, -1,

            // face 03 3-0-5; 5-0-4
            -1, 0, -1,
            -1, 0, 1,
            0, sqrt3, -1,
            0, sqrt3, -1,
            -1, 0, 1,
            0, sqrt3, 1,

            // face 04 3-2-0; 0-2-1
            -1, 0, -1,
            1, 0, -1,
            -1, 0, 1,
            -1, 0, 1,
            1, 0, -1,
            1, 0, 1,

            // face 05 2-3-5
            1, 0, -1,
            -1, 0, -1,
            0, sqrt3, -1,

        ]);
        roofGeom.setAttribute('position',new T.BufferAttribute(vertices,3));
        roofGeom.computeVertexNormals();

        const uvs = new Float32Array( [
            // uv for face 01
            0,1,
            1,0,
            1,0,

            // uv for face 02
            0,1,
            1,1,
            0,0,
            0,0,
            1,1,
            1,0,

            // uv for face 03
            0,1,
            1,1,
            0,0,
            0,0,
            1,1,
            1,0,

            // uv for face 04
            0,1,
            1,1,
            0,0,
            0,0,
            1,1,
            1,0,

            // uv for face 05
            0,1,
            1,0,
            1,0,
        ]);
        roofGeom.setAttribute('uv',new T.BufferAttribute(uvs,2));


        let tl = new T.TextureLoader().load("./Textures/roofTexture02.jpg");
        let material = new T.MeshStandardMaterial({
            roughness: 0.75,
            map: tl
        });

        let roofMesh = new T.Mesh(roofGeom, material);
        building.add(roofMesh);
        roofMesh.translateY(2);


        // Create the base
        const materials = [
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/wallTexture02.png")}),
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/wallTexture02.png")}),
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/frontTexture01.png")}),
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/frontTexture01.png")}),
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/frontTexture01.png")}),
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/wallTexture02.png")})
        ];
        let cubeGeom = new T.BoxGeometry(2,2,2);
        let base = new T.Mesh(cubeGeom, materials);
        building.add(base);
        base.translateY(1);


        super(`ResidentialHouseT2-${++simpleBuilding2Count}`, building);
    }



}


let simpleTreeCount = 0;
export class tree extends GrObject{
    constructor() {
        let tree = new T.Group();
        // you will need a call to "super"
        let treeUpGeometry = new Geom.Geometry();

        const s = Math.sqrt(2);
        // Made the roof Geometry
        // Push in the vertices
        treeUpGeometry.vertices.push(new T.Vector3(-s, 0, 0));
        treeUpGeometry.vertices.push(new T.Vector3(0, 0, s));
        treeUpGeometry.vertices.push(new T.Vector3(s, 0, 0));
        treeUpGeometry.vertices.push(new T.Vector3(0, 0, -s));
        treeUpGeometry.vertices.push(new T.Vector3(0, s, -0));


        // f1 - f4: Four Triangular faces
        let f1 = new Geom.Face3(0,1,4);
        treeUpGeometry.faces.push(f1);
        treeUpGeometry.faceVertexUvs[0].push([
            new T.Vector2(1/2, 0),
            new T.Vector2(1, 0),
            new T.Vector2(1, 1)
        ]);
        let f2 = new Geom.Face3(1,2,4);
        treeUpGeometry.faces.push(f2);
        treeUpGeometry.faceVertexUvs[0].push([
            new T.Vector2(1/2, 0),
            new T.Vector2(1, 0),
            new T.Vector2(1, 1)
        ]);
        let f3 = new Geom.Face3(2,3,4);
        treeUpGeometry.faces.push(f3);
        treeUpGeometry.faceVertexUvs[0].push([
            new T.Vector2(1/2, 0),
            new T.Vector2(1, 0),
            new T.Vector2(1, 1)
        ]);
        let f4 = new Geom.Face3(3,0,4);
        treeUpGeometry.faces.push(f4);
        treeUpGeometry.faceVertexUvs[0].push([
            new T.Vector2(1/2, 0),
            new T.Vector2(1, 0),
            new T.Vector2(1, 1)
        ]);
        treeUpGeometry.computeFaceNormals();
        treeUpGeometry.uvsNeedUpdate = true;

        let tl = new T.TextureLoader().load("./Textures/treeLeavesTexture.png");
        let material = new T.MeshStandardMaterial({ map: tl, roughness: 0.75 });
        let bg = treeUpGeometry.toBufferGeometry();
        let topMesh1 = new T.Mesh(bg, material);
        let topMesh2 = new T.Mesh(bg, material);


        const materials = [
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/treeTexture.jpg")}),
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/treeTexture.jpg")}),
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/treeTexture.jpg")}),
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/treeTexture.jpg")}),
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/treeTexture.jpg")}),
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/treeTexture.jpg")})
        ];
        let cubeGeom = new T.BoxGeometry(1/2,2,1/2);
        let base = new T.Mesh(cubeGeom, materials);
        base.translateY(1);
        tree.add(base);
        tree.add(topMesh1);
        topMesh1.translateY(2);
        topMesh1.add(topMesh2);
        topMesh2.translateY(1);
        tree.scale.set(1,1,1);

        super(`Tree-${++simpleTreeCount}`, tree);
    }
}
