// imports
import { FancyRoad } from "./FancyRoad.js";
import {Water} from "./Water.js";
import { car01 } from "./Cars.js";
import {MainMansion} from "./MainMansion.js";
import {NormalRoad, RoadLanterns} from "./NormalRoad.js";
import {GrTrain,draw} from "./Train.js";
import {SkyCrapper, SkyCrapper02, SkyCrapper03} from "./SkyCrapper.js";
import{FancyPlane, radar} from "./Plane.js";
import {RBuilding01,RBuilding02,tree} from "./ResidentialHouse.js";
import {FancyBall} from "./FancyBall.js";
import {GrBill} from "./VirtualBillboard.js";
import * as T from "../../libs/CS559-Three/build/three.module.js"

/**
 * Shift a grobject that is created
 */
function shift(grobj, x, y, z) {
    grobj.objects.forEach(o => {
        o.translateX(x);
        o.translateY(y);
        o.translateZ(z);
    });
    return grobj;
}

/**
 * This function produce repetitive shift effect
 * @param count
 * @param grobj
 * @param x
 * @param z
 * @param y
 * @returns {*}
 */
function repeatShift(count, grobj, x, z, y, flag){
    grobj.objects[0].rotateY(Math.PI * count * 0.5 );
    grobj.objects[0].translateX(x);
    grobj.objects[0].translateZ(z);
    grobj.objects[0].translateY(y);
    if(flag)
        grobj.objects[0].rotateY(4.7);
    return grobj;
}


/**
 * The main function onload when the world started
 * @param world
 */
export function test(world) {
    let FB1 = new FancyBall();
    world.add(FB1);
}