import * as T from "../../libs/CS559-Three/build/three.module.js"
import { GrObject } from "../../libs/CS559-Framework/GrObject.js";
import {shaderMaterial} from "../../libs/CS559-Framework/shaderHelper.js";

let simpleBillCount = 0;
export class GrBill extends GrObject {

    constructor(r = 1.0,g = 1.0,b = 1.0, l = 12, h = 20, w = 0.1,texture, rotate, step = false) {

        let whole_ob = new T.Group();
        texture = texture ? texture : new T.TextureLoader().load("./Textures/buildingWallTexture.png");

        //quantifiers to make sure that the billboard works
        let flagr = r === 1.0 ? false : true;
        let flagg = g === 1.0 ? false : true;
        let flagb = b === 1.0 ? false : true;

        let fancyMat = new shaderMaterial("./shaders/bill.vs", "./shaders/bill.fs", {
            side: T.FrontSide,
            blending: T.AdditiveBlending,
            transparent: true,
            uniforms:
                {
                    tex: { value: texture },
                    r1:{value:flagr},
                    g1:{value:flagg},
                    b1:{value:flagb},
                    tensifyr:{value: 2.0},
                    tensifyg:{value: 2.0},
                    tensifyb:{value: 2.0},
                    "shin": {value: -1.0},
                    "blow": {value: 1.4},
                    "power": {value: 1},
                },
        });

        let billGeom = new T.BoxBufferGeometry(l,h,w);
        let billMesh = new T.Mesh(billGeom, fancyMat);

        whole_ob.add(billMesh);
        billMesh.rotateY(rotate);
        super(`BillBoard_${++simpleBillCount}`, whole_ob);
        this.step = step;
        this.whole_ob = whole_ob;
        this.billMesh = billMesh;
    }
    /**
     * 
     * @param {} delta 
     * @param {*} timeOfDay 
     */
    stepWorld(delta,timeOfDay) {
        if(this.step){
            this.billMesh.rotateY(delta/2000);
        }
    }
}


let simpleBallBillCount = 0;
export class GrBallBill extends GrObject {

    constructor(r = 1.0,g = 1.0,b = 1.0, radius = 3,texture, rotate, step = false) {

        let whole_ob = new T.Group();
        texture = texture ? texture : new T.TextureLoader().load("./Textures/buildingWallTexture.png");

        //quantifiers to make sure that the billboard works
        let flagr = r === 1.0 ? false : true;
        let flagg = g === 1.0 ? false : true;
        let flagb = b === 1.0 ? false : true;

        let fancyMat = new shaderMaterial("./shaders/bill.vs", "./shaders/bill.fs", {
            side: T.FrontSide,
            blending: T.AdditiveBlending,
            transparent: true,
            uniforms:
                {
                    tex: { value: texture },
                    r1:{value:flagr},
                    g1:{value:flagg},
                    b1:{value:flagb},
                    tensifyr:{value: 2.0},
                    tensifyg:{value: 2.0},
                    tensifyb:{value: 2.0},
                    "shin": {value: -1.0},
                    "blow": {value: 1.4},
                    "power": {value: 1},
                },
        });

        let billGeom = new T.SphereGeometry(radius);
        let billMesh = new T.Mesh(billGeom, fancyMat);

        whole_ob.add(billMesh);
        billMesh.rotateY(rotate);
        super(`BallBillBoard_${++simpleBillCount}`, whole_ob);
        this.step = step;
        this.whole_ob = whole_ob;
        this.billMesh = billMesh;
    }
    /**
     *
     * @param {} delta
     * @param {*} timeOfDay
     */
    stepWorld(delta,timeOfDay) {
        if(this.step){
            this.billMesh.rotateY(delta/2000);
        }
    }
}