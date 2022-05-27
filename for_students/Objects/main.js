// imports
import { FancyRoad } from "./FancyRoad.js";
import {Water} from "./Water.js";
import {car01, car02, car03,} from "./Cars.js";
import {MainMansion} from "./MainMansion.js";
import {NormalRoad, RoadLanterns} from "./NormalRoad.js";
import {GrTrain,draw} from "./Train.js";
import {SkyCrapper, SkyCrapper02, SkyCrapper03, SkyCrapper04} from "./SkyCrapper.js";
import{FancyPlane, radar} from "./Plane.js";
import {RBuilding01,RBuilding02,tree} from "./ResidentialHouse.js";
import {FancyBall} from "./FancyBall.js";
import{NormalWaterTank} from "./NormalWaterTank.js";
import {GrBallBill, GrBill} from "./VirtualBillboard.js";
import * as T from "../../libs/CS559-Three/build/three.module.js"
import {cyberSnow, GrCarousel} from "./cyberSnowMan.js";

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
 * Help to scale the grobj
 * @param grobj
 * @param x
 * @param y
 * @param z
 * @returns {*}
 */
function scale(grobj, x, y, z){
    grobj.objects.forEach(o => {
        o.scale.set(x, y, z);
    });
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
export function main(world) {


    // // Set the Skybox of the World
    // const tl = new T.CubeTextureLoader().load([
    //     "../textures/BoxTextures/Right.png",
    //     "../textures/BoxTextures/Left.png",
    //     "../textures/BoxTextures/Top.png",
    //     "../textures/BoxTextures/Front.png",
    //     "../textures/BoxTextures/Back.png",
    //     "../textures/BoxTextures/Bottom.png"
    // ]);


    // Load Objects into the World

    // Fancy Roads
    for(let j = 0; j<4; j++){
        let tt = repeatShift(j,new FancyRoad(), 0,-40,0);
        world.add(tt);
    }

    // Normal Roads
    for(let j = 0; j<4;j++){
        let tt = repeatShift(j,new NormalRoad(), 0,-33,0, true);
        if(j<2 ){
            let t1 = repeatShift(j,new NormalRoad(), 0,0,0, true);
            world.add(t1);
        }
        world.add(tt);
    }


    // Road Lanterns
    for(let i = 0; i < 4; i++){
        let t = repeatShift(i, new RoadLanterns(), 0, -38, 0);
        t.objects[0].translateX(-15);
        world.add(t);
    }
    for(let i = 0; i < 4; i++){
        let t = repeatShift(i, new RoadLanterns(), 0, -38, 0);
        t.objects[0].translateX(15);
        world.add(t);
    }


    // MainMansion
    let MM1 = shift(new MainMansion(), 0,0,0);
    world.add(MM1);

    // Add Vehicles
    let C1 = new car01();
    world.add(C1);

    let C2 = new car02();
    world.add(C2);

    let C3 = new car03();
    world.add(C3);

    // Add Train
    draw(world);
    world.add(new GrTrain());

    // Add Plane & Radar
    let FP1 = new FancyPlane();
    world.add(FP1);
    let RD1 = shift(new radar(FP1.objects[0]),-20, 16,-18);
    world.add(RD1);

    // Add SkyCrappers Group
    let SC1 = new SkyCrapper();
    let SC2 = new SkyCrapper02("yellow");
    let SC3 = shift(new SkyCrapper02("yellow"), -8,0,4);
    let SC4 = shift(new SkyCrapper03(), -25,0,-25);
    let SC5 = shift(new SkyCrapper04(), 20, 0, 20);
    let SC6 = shift(new SkyCrapper02("cyan"), 30,0,30);
    world.add(SC1);
    world.add(SC2);
    world.add(SC3);
    world.add(SC4);
    world.add(SC5);
    world.add(SC6);


    // Add Water
    let W1 = shift(new Water(),18,18,5);
    world.add(W1);

    // Add Water Tank
    for(let j = 0; j<4;j++){
        let tt = repeatShift(j,new NormalWaterTank(), 0,-10,0, true);
        world.add(tt);
    }



    // Add Trees & Residential Building

    for(let i = 1; i < 6; i++){
        for(let j = 1; j < 6; j++){
            if((i === 2 || i=== 3) && (j === 2 || j=== 3)) continue;
            let RB;
            if( (i + j)  % 2 === 0){
                RB = shift(new RBuilding01(),-8,0,6);
            }else{
                RB = shift(new RBuilding02(),-8,0,6);
            }
            RB.objects[0].translateX(-4 * i);
            RB.objects[0].translateZ(4 * j);
            world.add(RB);
        }
    }
    for(let i = 1; i < 6; i++){
        for(let j = 1; j < 6; j++){
            if((i === 2 || i=== 3) && (j === 2 || j=== 3)){
                let RB = shift(new tree(),-8,0,6);
                RB.objects[0].translateX(-4 * i);
                RB.objects[0].translateZ(4 * j);
                world.add(RB);
            }
        }
    }

    // Add the Morphing Ball
    let FB1 = new FancyBall();
    world.add(FB1);

    // Add the bill board
    // Load pictures
    let cyber01 = new T.TextureLoader().load("./images/cyber01.jpg");
    let cyber02 = new T.TextureLoader().load("./images/cyber02.jpg");
    let cyber03 = new T.TextureLoader().load("./images/cyber03.jpg");
    let cyber04 = new T.TextureLoader().load("./images/cyber04.jpg");


    // Add to World
    let BB1 = shift(new GrBill(1.0,1.2,2.0, 12, 20, 0.1, cyber01, Math.PI/4, true),
        -20,30,-20);
    world.add(BB1);


    let BB2 = shift(new GrBill(2.0,1.2,1.2, 20, 40, 0.1, cyber02,Math.PI/4, true),
        -40,30,-40);
    world.add(BB2);

    let BB3 = shift(new GrBill(2.0,1.2,1.2, 20, 40, 0.1, cyber03,Math.PI, true),
        -15,30,-45);
    world.add(BB3);

    let BB4 = shift(new GrBallBill(2.0,1.2,1.2, 20, cyber04,Math.PI, true),
        -45,30,10);
    world.add(BB4);

    // Add Cyberpunk Snowman
    let SN1 = shift(new cyberSnow(),-10, 20,-20);
    world.add(SN1);

    // Add Ground Carousel
    let CR1 = shift(new GrCarousel(),10, 0,20);
    world.add(CR1);
}