import {GrObject} from "../../libs/CS559-Framework/GrObject.js";
import * as T from "../../libs/CS559-Three/build/three.module.js";
import {shaderMaterial} from "../../libs/CS559-Framework/shaderHelper.js";

// Load some textures
const normal = new T.TextureLoader().load("./Textures/LeatherRed/leather_red_03_nor_gl_1k.jpg");
const rough = new T.TextureLoader().load("./Textures/LeatherRed/leather_red_03_rough_1k.jpg");
const map = new T.TextureLoader().load("./Textures/LeatherRed/leather_red_03_coll1_1k.jpg");


/**
 *
 */
let count = 0;

export class FancyBall extends GrObject {

    constructor() {


        let whole_ob = new T.Group();
        let ringMat = new shaderMaterial("./shaders/glow.vs", "./shaders/glow.fs", {
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
        // Create the Geometry
        const geometry = new T.BoxGeometry(2, 2, 2, 32, 32, 32);

        // create an empty array to  hold targets for the attribute we want to morph
        // morphing positions and normals is supported
        geometry.morphAttributes.position = [];

        // the original positions of the cube's vertices
        const positionAttribute = geometry.attributes.position;

        // for the first morph target we'll move the cube's vertices onto the surface of a sphere
        const spherePositions = [];

        // for the second morph target, we'll twist the cubes vertices
        const twistPositions = [];
        const direction = new T.Vector3(1, 0, 0);
        const vertex = new T.Vector3();

        for (let i = 0; i < positionAttribute.count; i++) {

            const x = positionAttribute.getX(i);
            const y = positionAttribute.getY(i);
            const z = positionAttribute.getZ(i);

            spherePositions.push(
                2 * x * Math.sqrt(1 - (y * y / 2) - (z * z / 2) + (y * y * z * z / 3)),
                2 * y * Math.sqrt(1 - (z * z / 2) - (x * x / 2) + (z * z * x * x / 3)),
                2 * z * Math.sqrt(1 - (x * x / 2) - (y * y / 2) + (x * x * y * y / 3))
            );

            // stretch along the x-axis so we can see the twist better
            vertex.set( 2 * x, 2 * y, 2 * z);

            vertex.applyAxisAngle(direction, Math.PI * x / 2).toArray(twistPositions, twistPositions.length);
        }
        geometry.morphAttributes.position[0] = new T.Float32BufferAttribute(spherePositions, 3);
        geometry.morphAttributes.position[1] = new T.Float32BufferAttribute(twistPositions, 3);


        // Create the material
        const material = new T.MeshStandardMaterial({
            color: "red",
            flatShading: true,
        });
        material.normalMap = normal;
        material.roughnessMap = rough;

        // Create the Mesh
        let mesh = new T.Mesh(geometry, material);
        whole_ob.add(mesh);
        mesh.scale.set(2, 2, 2);


        // Create the Rings

        let rings = [];
        for (let i = 0; i < 5; i++) {
            let geometry = new T.TorusGeometry( 8, 0.5, 20, 40 );
            rings[i] = new T.Mesh(geometry, ringMat);
            whole_ob.add(rings[i]);
        }
        rings[1].rotateX(Math.PI/3);
        rings[1].name = "rings1";
        rings[2].rotateY(-Math.PI/3);
        rings[2].name = "rings2";
        rings[3].rotateX(-Math.PI/3);
        rings[3].name = "rings3";

        // create rotating ball

        let balls = [];
        for (let i = 0; i < 5; i++) {
            let geometry = new T.SphereGeometry(1.5);
            let tt = new T.Mesh(geometry, new T.MeshLambertMaterial({
                emissive: "yellow",
                color:"yellow",
            }))
            balls.push(tt);
            whole_ob.add(tt);
        }

        console.log(whole_ob.position);
        console.log(mesh.position);

        super(`FancyBall-${++count}`, whole_ob);
        this.mesh = mesh;  // pass mesh to class
        this.rings = rings;
        this.whole_ob = whole_ob;
        this.balls = balls;

    }

    stepWorld(delta, timeOfDay) {
        // Animate the Ring Effect
        let time = Date.now()/2000;
        for (let i = 0; i < this.rings.length; i++) {
            if(i === 0){
                this.rings[i].rotateX(delta/1000);
            }
            if(i === 1){
                this.rings[i].rotateY(delta/1000);
            }
            if(i === 2){
                this.rings[i].rotateY(delta/ 1000);
            }
        }

        // Animate the Morphing Effect
        let value = (time) % 1;
        this.mesh.morphTargetInfluences[0] = 1 - value;
        this.mesh.morphTargetInfluences[1] = value;

        // animate this object
        this.whole_ob.position.y = 28 + 3 * Math.sin(Date.now()/600);

        // Animate the rotating balls
        for (let i = 0; i < this.balls.length; i++) {
            // this.balls[i].position.set(Math.pow(-1, i) * 7 * Math.sin(Date.now()/100), 7 * Math.sin(Date.now() / (i * 100)), -7 * Math.cos(Date.now()/100));
            this.balls[i].position.set(Math.pow(-1, i) * 7 * Math.sin(Date.now()/100), 7 * Math.sin(Date.now() / 100),-7 * Math.cos(Date.now()/100));
        }
    }
}
