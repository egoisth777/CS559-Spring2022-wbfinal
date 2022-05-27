import * as T from "../../libs/CS559-Three/build/three.module.js"
import { GrObject } from "../../libs/CS559-Framework/GrObject.js";
import {shaderMaterial} from "../../libs/CS559-Framework/shaderHelper.js";

let simpleTankCount = 0;
/**
 * This class creates the Basic Geometry of Roads in the town
 */
export class NormalWaterTank extends GrObject {
    constructor() {



        let baseMat2 = new shaderMaterial("./shaders/glow.vs", "./shaders/glow.fs", {
            side: T.FrontSide,
            blending: T.AdditiveBlending,
            transparent: false,
            uniforms:
                {
                    "shin": {value: -1.0},
                    "blow": {value: 1.0},
                    "power": {value: 1.0},
                    glowColor: {type: "c", value: new T.Color("cyan")}
                },
        });
        let roadBasicMat = new T.MeshLambertMaterial( { color: "#42464d" } );

        let roadGeom = new T.BoxGeometry( 15, 6, 60);
        let roadStem = new T.Mesh( roadGeom, roadBasicMat );


        roadStem.position.set(0, 0, 0);
        roadStem.scale.set(0.3, 1.5, 0.3);

        // Create the FancyRoad Group that has the stem & everything
        let whole_ob = new T.Group();
        whole_ob.add(roadStem);



        // Create Rings

        let baseGeom01 = new T.TorusGeometry( 3, 0.5, 20, 50 );


        let rings = [];
        for (let i = 0; i < 3; i++){
            let baseMesh01 = new T.Mesh(baseGeom01, baseMat2);
            baseMesh01.translateY(3);
            baseMesh01.rotateX(Math.PI/2);
            whole_ob.add(baseMesh01);
            rings.push(baseMesh01)
        }

        rings[0].position.setY(6);
        whole_ob.position.set(18,3,-18);

        super(`WaterTank-${++simpleTankCount}`, whole_ob);
    }
}

