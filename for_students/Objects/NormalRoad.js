import * as T from "../../libs/CS559-Three/build/three.module.js"
import { GrObject } from "../../libs/CS559-Framework/GrObject.js";

let simpleRoadCount = 0;
/**
 * This class creates the Basic Geometry of Roads in the town
 */
export class NormalRoad extends GrObject {
    constructor() {
        let roadBasicMat = new T.MeshLambertMaterial( { color: "#42464d" } );

        let roadGeom = new T.BoxGeometry( 15, 0.1, 230 );
        let roadStem = new T.Mesh( roadGeom, roadBasicMat );
        let stripMat = new T.MeshLambertMaterial( { color: "yellow" } );
        let stripGeom = new T.BoxGeometry( 2, 0.1, 17 );


        roadStem.position.set(0, 0, 0);
        roadStem.scale.set(0.3, 1.5, 0.3);

        // Create the FancyRoad Group that has the stem & everything
        let whole_ob = new T.Group();
        whole_ob.add(roadStem);

        // Create Several Strips
        for(let i = 0; i < 5; i++){
            let s = new T.Mesh(stripGeom, stripMat);
            s.position.set(0,0.1, -25 + 13 * i);
            s.scale.set(0.3,1.5,0.3);
            whole_ob.add(s);
        }

        let GateGeom = new T.TorusGeometry( 3, 0.5, 20, 2999 );

        super(`NormalRoad-${++simpleRoadCount}`, whole_ob);
    }
}

let simpleRoadLanternCount = 0;
export class RoadLanterns extends GrObject {

    constructor() {
        let whole_ob = new T.Group();

        // Create shiny material designated by the color
        function shinMat(color){
            return new T.MeshLambertMaterial({
                color: color,
                emissive: color,
            })
        }

        // lantern base
        const baseGeom = new T.CylinderGeometry(
            1, 1, 4, 12);
        const baseMat = shinMat("red");
        let base = new T.Mesh(baseGeom, baseMat);


        // lantern top
        const topGeom = new T.CylinderGeometry(2,1, 2, 12);
        const topMat = new shinMat("cyan");
        let top = new T.Mesh(topGeom, topMat);

        // construction
        whole_ob.add(base);
        whole_ob.add(top);
        base.translateY(2);
        top.translateY(4);


        super(`RoadLantern" + ${++simpleRoadLanternCount}`, whole_ob);
    }
}