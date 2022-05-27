// Create a repository to contain the water

import * as T from "../../libs/CS559-Three/build/three.module.js"
import { GrObject } from "../../libs/CS559-Framework/GrObject.js";

let simpleWaterCount = 0;
export class Water extends GrObject{
    constructor(){
        
        // Create the object
        const waterGeom = new T.PlaneBufferGeometry(18, 18, 30, 30);
        const waterMat = new T.MeshPhongMaterial({color: 0x00ffff});
        const water = new T.Mesh(waterGeom, waterMat);

        water.receiveShadow = true;
        water.castShadow = true;
        water.rotateX(-Math.PI/2);


        super(`Water-${++simpleWaterCount}`, water);
        this.whole_ob = water;
        this.count = waterGeom.attributes.position.count;
        this.geom =  water.geometry;
    }

    /**
     * Step world function
     * @param step
     * @param timeOfDay
     */
    stepWorld(step, timeOfDay){
        let Geom = this.geom;
        let now = Date.now()/400; // take the current time divided by
        for (let i = 0; i < this.count; i++) {
            const x = Geom.attributes.position.getX(i);
            const y = Geom.attributes.position.getY(i);

            const x_angle = x + now;
            // console.log(x);
            const xsin = 1/2 * Math.sin(x_angle);
            const y_angle = y + now;
            const ycos = 2/3 * Math.cos(y_angle);

            Geom.attributes.position.setZ(i, xsin + ycos);
        }
        Geom.computeVertexNormals();
        Geom.attributes.position.needsUpdate= true; // update the geometry accordingly
    }   
}