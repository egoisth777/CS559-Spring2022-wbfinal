import {GrObject} from "../../libs/CS559-Framework/GrObject.js";
import * as T from "../../libs/CS559-Three/build/three.module.js";
import {shaderMaterial} from "../../libs/CS559-Framework/shaderHelper.js";
import {FBXLoader} from "../../libs/CS559-Three/examples/jsm/loaders/FBXLoader.js";

let simpleSC1Count = 0;
export class SkyCrapper extends GrObject{
    constructor() {

        // Create Groups
        let whole_ob = new T.Group();

        // Get the buildings
        let sc1 = createSkyCrapper01();


        // Add things to Groups
        whole_ob.add(sc1);

        whole_ob.position.set(-10,0,-20);
        super(`SC1-${++simpleSC1Count}`, whole_ob);
    }
}

let simpleSC2Count = 0;
export class SkyCrapper02 extends GrObject{
    constructor(color) {

        // Create Groups
        let whole_ob = new T.Group();


        let baseMat = new T.TorusGeometry( 3, 0.5, 20, 50 );
        let baseMesh02 = new T.Mesh(baseMat, new T.MeshBasicMaterial({color: 0x00ffff, wireframe: true}));
        baseMesh02.translateY(3);

        baseMesh02.rotateX(Math.PI/2);

        // Get the buildings
        let sc2 = createSkyCrapper02(color);


        // Add things to Groups
        whole_ob.add(sc2);

        whole_ob.position.set(-20,0,-20);
        super(`SC1-${++simpleSC2Count}`, whole_ob);
    }
}


let simpleSC3Count = 0;
export class SkyCrapper03 extends GrObject{
    constructor() {

        // Create Groups
        let whole_ob = new T.Group();


        let baseMat = new T.TorusGeometry( 3, 0.5, 20, 50 );
        let baseMesh02 = new T.Mesh(baseMat, new T.MeshBasicMaterial({color: 0x00ffff, wireframe: true}));
        baseMesh02.translateY(3);

        baseMesh02.rotateX(Math.PI/2);

        // Load the 3D Model
        let building = new T.Group();
        let loader = new FBXLoader();
        let obj = loader.loadAsync("./Models/FutureBuiding01.fbx");
        obj.then(function(obj) {
            obj.position.set(0, 0, 0);
            obj.scale.set(0.08, 0.08, 0.08);
            building.add(obj);
        });


        // Add things to Groups
        whole_ob.add(building);

        whole_ob.position.set(0,0,0);
        super(`SC1-${++simpleSC3Count}`, whole_ob);
    }
}

/**
 * 
 */
let simpleSC4Count = 0;
export class SkyCrapper04 extends GrObject{
    constructor(){
        let whole_ob = new T.Group()
        
        // Define the materials
        let baseMat1 = new T.MeshStandardMaterial(
            {
                color : "silver",
            }
        )
    
        let baseMat2 = new shaderMaterial("./shaders/glow.vs", "./shaders/glow.fs", {
            side: T.FrontSide,
            blending: T.AdditiveBlending,
            transparent: false,
            uniforms:
                {
                    "shin": {value: -1.0},
                    "blow": {value: 1.0},
                    "power": {value: 1.0},
                    glowColor: {type: "c", value: new T.Color("yellow")}
                },
        });

        
        
        // Create Geometries
        let baseGeom01 = new T.TorusGeometry( 3, 0.5, 20, 50 );
        let ballGeom02 = new T.SphereGeometry(2,12,12);
        let scGeom5 = new T.BoxGeometry(3,6,3);
        // Create Mesh
        // 3 Rings
        let rings = [];
        for (let i = 0; i < 3; i++){
            let baseMesh01 = new T.Mesh(baseGeom01, baseMat2);
            baseMesh01.translateY(3);
            baseMesh01.rotateX(Math.PI/2);
            whole_ob.add(baseMesh01); 
            rings.push(baseMesh01)
        }

        // 1 Transparent Ball
        let baseMesh02 = new T.Mesh(ballGeom02, baseMat2);
        whole_ob.add(baseMesh02);

        // Create Building Main body
        let BodyMesh01 = new T.Mesh(scGeom5, baseMat1);
        let BodyMesh02 = new T.Mesh(scGeom5, baseMat1);
        whole_ob.add(BodyMesh01);
        whole_ob.add(BodyMesh02);

        BodyMesh01.position.setY(12);
        BodyMesh02.position.setY(3);

        baseMesh02.position.setY(7.5);
        baseMesh02.scale.set(0.5,0.5,0.5);

        rings[0].position.setY(7.5);


        super(`SC4-${++simpleSC4Count}`,whole_ob );
    }

}

/**
 * Create a fancy modern building
 * @returns {Group}
 */
function createSkyCrapper01(){

    // Group
    let scGroup = new T.Group();

    // Geom
    let scGeom1 = new T.CylinderGeometry(0.5,0.5,3,12);
    let scGeom2 = new T.CylinderGeometry(1,1,3,12);
    let scGeom3 = new T.CylinderGeometry(2, 2,8,12);
    let scGeom4 = new T.CylinderGeometry(0.5, 0.5,10,12);
    let scMat  =  new T.MeshStandardMaterial({
        color:"gray"
    });

    let baseMat2 = new shaderMaterial("./shaders/glow.vs", "./shaders/glow.fs", {
        side: T.FrontSide,
        blending: T.AdditiveBlending,
        transparent: false,
        uniforms:
            {
                "shin": {value: -1.0},
                "blow": {value: 1.0},
                "power": {value: 1.0},
                glowColor: {type: "c", value: new T.Color("yellow")}
            },
    });

    // Mesh
    let scMesh1 = new T.Mesh(scGeom1, scMat);
    let scMesh2 = new T.Mesh(scGeom2, scMat);
    let scMesh3 = new T.Mesh(scGeom3, scMat);
    let scMesh4 = new T.Mesh(scGeom4, baseMat2);
    let scMesh5 = new T.Mesh(scGeom2, baseMat2);

    scGroup.add(scMesh1);
    scGroup.add(scMesh2);
    scGroup.add(scMesh3);
    scGroup.add(scMesh4);
    scGroup.add(scMesh5);

    scMesh4.translateY(12);
    scMesh3.translateY(4);
    scMesh2.translateY(11);
    scMesh1.translateY(8);
    scMesh5.translateX(-3);
    scMesh5.translateY(2);
    scMesh5.scale.set(1.2,1.2,1.2);


    // return
    return scGroup;
}

/**
 * Creates a fancy morden building
 * @returns {Group}
 */
function createSkyCrapper02(color){

    // Group
    let scGroup = new T.Group();

    // Geom
    let exSettings = {
        steps: 2,
        depth: 4,
        bevelEnabled: true,
        bevelThickness: 0.2,
        bevelSize: 0.2,
        bevelSegments: 2
    };

    let frontCurve = new T.Shape();
    frontCurve.moveTo(-2, 0);
    frontCurve.lineTo(-2, 8);
    frontCurve.lineTo(2, 6);
    frontCurve.lineTo(2, 0);
    frontCurve.lineTo(-2, 0);




    let scGeom1 = new T.CylinderGeometry(0.5,0.5,3,12);
    let scGeom2 = new T.CylinderGeometry(1,1,3,12);
    let scGeom3 = new T.CylinderGeometry(2, 2,8,12);
    let scGeom4 = new T.CylinderGeometry(0.5, 0.5,10,12);
    let scGeom5 = new T.BoxGeometry(3,4,3);
    let scGeom6 = new T.ExtrudeGeometry(frontCurve, exSettings);


    let baseMat1 = new T.MeshStandardMaterial(
        {
            color : "silver",
        }
    )

    let baseMat2 = new shaderMaterial("./shaders/glow.vs", "./shaders/glow.fs", {
        side: T.FrontSide,
        blending: T.AdditiveBlending,
        transparent: false,
        uniforms:
            {
                "shin": {value: -1.0},
                "blow": {value: 1.0},
                "power": {value: 1.0},
                glowColor: {type: "c", value: new T.Color(color)}
            },
    });

    // Mesh
    let Mesh1 = new T.Mesh(scGeom5, baseMat2);
    let Mesh2 = new T.Mesh(scGeom6, baseMat1);
    let Mesh3 = new T.Mesh(scGeom6, baseMat1);

    // Mesh Structure & Building
    Mesh2.translateY(0);
    Mesh2.add(Mesh3);
    Mesh3.translateY(16);
    Mesh3.rotateZ(Math.PI);
    Mesh1.translateY(8);
    Mesh1.translateZ(2);


    // Add to Group
    scGroup.add(Mesh1);
    scGroup.add(Mesh2);
    scGroup.add(Mesh3);

    // return
    return scGroup;
}

