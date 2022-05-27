/**
 * This file create a single futuristic road
 */

import * as T from "../../libs/CS559-Three/build/three.module.js"
import { GrObject } from "../../libs/CS559-Framework/GrObject.js";
import { shaderMaterial } from "../../libs/CS559-Framework/shaderHelper.js";

let simpleRoadCount = 0;
/** 
 * This class creates the Basic Geometry of Roads in the town
 */
export class FancyRoad extends GrObject {
    constructor() {
        let glowMaterial = new shaderMaterial("./shaders/glow.vs", "./shaders/glow.fs", {
            side: T.FrontSide,
            blending: T.AdditiveBlending,
            transparent: false,
            uniforms:
                {
                    "shin": {value: -1.0},
                    "blow": {value: 1.0},
                    "power": {value: 1.0},
                    glowColor: {type: "c", value: new T.Color(0x00ffff)}
                },
        })

        let geometry = new T.BoxGeometry(20, 1, 150);
        let roadStem = new T.Mesh(geometry, glowMaterial);


        roadStem.position.set(0, 3, 0);
        roadStem.scale.set(0.3, 1.5, 0.3);

        // Create the FancyRoad Group that has the stem & everything
        let roadGroup = new T.Group();
        roadGroup.add(roadStem);

        let GateGeom = new T.TorusGeometry( 3, 0.5, 20, 2999 );
        
        let Gate1 = new T.Mesh(GateGeom, new T.MeshBasicMaterial({color: 0xffffff, wireframe: true}));
        Gate1.position.set(0,3,-20);
        Gate1.scale.set(2,2,2);
        roadGroup.add(Gate1);

        let Gate2 = new T.Mesh(GateGeom, new T.MeshBasicMaterial({color: 0xffffff, wireframe: true}));
        Gate2.position.set(0,3,0);
        Gate2.scale.set(2,2,2);
        roadGroup.add(Gate2);

        let Gate3 = new T.Mesh(GateGeom, new T.MeshBasicMaterial({color: 0xffffff, wireframe: true}));
        Gate3.position.set(0,3,20);
        Gate3.scale.set(2,2,2);
        roadGroup.add(Gate3);
        super(`Road-${++simpleRoadCount}`, roadGroup);
    }
}

