/*jshint esversion: 6 */
// @ts-check

/**
 * Graphics Town Framework - "Main" File
 *
 * This is the main file - it creates the world, populates it with
 * objects and behaviors, and starts things running
 *
 * The initial distributed version has a pretty empty world.
 * There are a few simple objects thrown in as examples.
 *
 * It is the students job to extend this by defining new object types
 * (in other files), then loading those files as modules, and using this
 * file to instantiate those objects in the world.
 */

import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { WorldUI } from "../libs/CS559-Framework/WorldUI.js";
import{test} from "./Objects/test.js";
import * as T from "../libs/CS559-Three/build/three.module.js";

import {main} from "./Objects/main.js";

// Create Lights for the World
let lights = [];

// SpotLight
let SL1 = new T.SpotLight({
    color: 0xffffff, 
    intensity: 1.0,
    angle: Math.PI/3,
});
SL1.position.set(0,10, 0);
SL1.castShadow = true;
// push the lights
for (let i = 0; i < 4; i++) {
    let sl = new T.SpotLight({
        color: 0x00ffff,
        angle: Math.PI/12,
    });
    sl.intensity = 0.3;
    sl.castShadow = true;
    sl.rotateY(Math.PI * i * 0.5 );
    sl.translateZ(-38);
    sl.translateY(15);
    lights.push(sl);
}





// Ambient Light
const ABL = new T.AmbientLight( 0x404040, 0.2); // soft white light

// Directional Light
let DL1 = new T.DirectionalLight(0xffffff, 0.2);
let target = new T.Object3D(0,0,0);
DL1.target = target;

lights.push(ABL);
lights.push(SL1);


// Directional Lights




/**m
 * The Graphics Town Main -
 * This builds up the world and makes it go...
 */

// make the world
let world = new GrWorld({
    lights:lights,
    width: 800,
    height: 600,
    groundplanesize: 60, // make the ground plane big enough for a world of stuff
});

main(world);
// test(world);



// while making your objects, be sure to identify some of them as "highlighted"

///////////////////////////////////////////////////////////////
// because I did not store the objects I want to highlight in variables, I need to look them up by name
// This code is included since it might be useful if you want to highlight your objects here
function highlight(obName) {
    const toHighlight = world.objects.find(ob => ob.name === obName);
    if (toHighlight) {
        toHighlight.highlighted = true;
    } else {
        throw `no object named ${obName} for highlighting!`;
    }
}
// of course, the student should highlight their own objects, not these
highlight("SC1-1");
highlight("Water-1");
highlight("FancyBall-1");
highlight("BallBillBoard_4");
highlight("BillBoard_1");
highlight("SC1-2");
highlight("Radar-1");
highlight("ResidentialHouseT1-1");
highlight("ResidentialHouseT2-1");
highlight("SC1-3");
highlight("SN1-1");
highlight("Tree-1");
highlight("MainMansion");
highlight("Car01");
highlight("Car02");
highlight("Car03");
highlight("Train");
highlight("Plane-1");

///////////////////////////////////////////////////////////////
// build and run the UI
// only after all the objects exist can we build the UI
// @ts-ignore       // we're sticking a new thing into the world
world.ui = new WorldUI(world);
// now make it go!
world.go();
