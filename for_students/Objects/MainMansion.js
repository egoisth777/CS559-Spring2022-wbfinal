import * as T from "../../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../../libs/CS559-Framework/GrObject.js";
import { OBJLoader } from "../../libs/CS559-Three/examples/jsm/loaders/OBJLoader.js";
import { shaderMaterial } from "../../libs/CS559-Framework/shaderHelper.js";
/**
 * This Creates the simple Center Mansion of the Scenes
 */

let simpleMansionCount = 0
export class MainMansion extends GrObject {
    constructor() {

        // Create the Base Part of the Mansion
        let whole_ob = new T.Group();
        let baseMat = new T.TorusGeometry( 3, 0.5, 20, 2999 );
        let base01 = new T.Mesh(baseMat, new T.MeshBasicMaterial({color: 0x00ffff, wireframe: true}));
        let base02 = new T.Mesh(baseMat, new T.MeshBasicMaterial({color: "yellow", wireframe: true}));
        let base03 = new T.Mesh(baseMat, new T.MeshBasicMaterial({color: "white", wireframe: true}));
        whole_ob.add(base01);
        whole_ob.add(base02);
        whole_ob.add(base03);
        base01.position.set(0,5,0);
        base02.position.set(0,10,0);
        base03.position.set(0,16,0);
        base01.rotateX(Math.PI/2);
        base02.rotateX(Math.PI/2);
        base03.rotateX(Math.PI/2);
        base01.scale.set(3,3,3);
        base02.scale.set(2,2,2);
        base03.scale.set(1.2,1.2,1.2);

        // Base
        let baseGeom1 = new T.CylinderGeometry(12,12,2,20);
        let baseMat1 = new shaderMaterial("./shaders/glow.vs", "./shaders/glow.fs", {
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
        let baseMesh = new T.Mesh(baseGeom1, baseMat1);
        baseMesh.translateY(2);

        whole_ob.add(baseMesh);


        // Central Pillar => A DNA Structure that Spins

        let pillar = new T.Group();
        let loader = new OBJLoader();
        let obj = loader.loadAsync("./Models/DNA.obj");
        obj.then(function(astronaut) {
            astronaut.position.set(0, 0, 0);
            astronaut.scale.set(0.03, 0.03, 0.03);
            pillar.add(astronaut);
        });

        whole_ob.add(pillar);
        whole_ob.translateY(3);


        super("MainMansion", whole_ob);
        this.pillar = pillar;
    }
    
    stepWorld(step, timeOfDay){
        this.pillar.rotateY(Math.PI/600 * step);
    }
}