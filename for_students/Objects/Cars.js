import * as T from "../../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../../libs/CS559-Framework/GrObject.js";
import {TextureLoader} from "../../libs/CS559-Three/build/three.module.js";
import {shaderMaterial} from "../../libs/CS559-Framework/shaderHelper.js";



/**
 * This Defines a Normal car in the town
 */
export class car01 extends GrObject {

    constructor() {
        // Define function wise variable to help building
        let whole_object = new T.Group(); // the whole object
        // extrude settings
        let exSettings = {
            steps: 2,
            depth: 1,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.2,
            bevelSegments: 2
        };

        // Create the base for the car
        let fork_base_mat = new T.MeshStandardMaterial({
            color: "blue",
            metalness: 0.5,
            roughness: 0.7
        });

        let base_curve = new T.Shape();
        base_curve.moveTo(-1, 0)
        base_curve.lineTo(1.2, 0);
        base_curve.lineTo(1.2, 1.2);
        base_curve.lineTo(-0.4, 1.2);
        base_curve.lineTo(-1, 0.2);
        base_curve.lineTo(-1, 0);
        let base_geom = new T.ExtrudeGeometry(base_curve, exSettings);

        let base = new T.Mesh(base_geom, fork_base_mat); // define the base of the car
        whole_object.add(base);
        base.translateZ(-0.5);

        // Create the base wheels
        let wheels = [];
        let wheel_geo = new T.CylinderGeometry( 0.5, 0.5, 0.5, 20);
        let wheel_mat = new T.MeshStandardMaterial({
            color: "silver",
            metalness: 0.5,
            roughness: 0.7
        });

        for (let i = 0; i < 4; i++) {
            let wheel_mesh = new T.Mesh(wheel_geo, wheel_mat);
            let wheel_hinge = new T.Group();
            wheel_hinge.add(wheel_mesh);
            wheel_mesh.rotateX(Math.PI/2);
            wheels.push(wheel_hinge);
            whole_object.add(wheel_hinge);
        }
        wheels[0].position.set(-1,0,0.6);
        wheels[1].position.set(1.2,0,0.6);
        wheels[2].position.set(-1,0,-0.6);
        wheels[3].position.set(1.2,0,-0.6);


        // add car top
        const materials = [
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/carWindowTexture.jpg"), metalness:1.0}),
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/carWindowTexture.jpg"), metalness:1.0}),
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/carWindowTexture.jpg"), metalness:1.0}),
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/carWindowTexture.jpg"), metalness:1.0}),
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/carWindowTexture.jpg"), metalness:1.0}),
            new T.MeshBasicMaterial({map: new TextureLoader().load("./Textures/carWindowTexture.jpg"), metalness:1.0})
        ];
        let cubeGeom = new T.BoxGeometry(0.8,0.1,1);
        let cubeGeom2 = new T.BoxGeometry(1.2,0.1,0.7);
        let window01 = new T.Mesh(cubeGeom, materials);
        let window02 = new T.Mesh(cubeGeom2, materials);
        let window03 = new T.Mesh(cubeGeom2, materials);
        window01.translateX(-0.8);
        window01.translateY(1);
        window01.rotateZ(Math.PI/3);
        whole_object.add(window01);
        whole_object.add(window02);
        whole_object.add(window03);

        window02.translateY(1);
        window02.translateZ(0.7);
        window02.translateX(0.2);
        window02.rotateX(Math.PI/2);

        window03.translateY(1);
        window03.translateZ(-0.7);
        window03.translateX(0.2);
        window03.rotateX(Math.PI/2);

        whole_object.rotateY(Math.PI);
        super("Car01",whole_object);
        this.whole_ob = whole_object;

        this.ridePoint = new T.Object3D();
        this.ridePoint.translateY(0.7);
        this.ridePoint.translateX(-2);
        this.ridePoint.rotateY(-Math.PI/2);
        this.whole_ob.add(this.ridePoint);
        this.rideable = this.ridePoint;


    }
    stepWorld(step, timeOfDay) {
        this.whole_ob.position.setY(0.5);
        this.time = step/50;
        if(this.whole_ob.position.z === 0 && this.whole_ob.position.x ===0){
            this.whole_ob.rotateY(Math.PI*1.5);
            this.whole_ob.position.set(32,0,32);
        }
        if(this.whole_ob.position.x===32 && this.whole_ob.position.z <33){
            this.whole_ob.position.z += this.time;
            if(this.whole_ob.position.z>32){
                this.whole_ob.position.z = 32;
            }
        }

        if(this.whole_ob.position.x===32 && this.whole_ob.position.z===32){
            this.whole_ob.rotateY(Math.PI*1.5);
        }

        if(this.whole_ob.position.x>-33 && this.whole_ob.position.z === 32){
            this.whole_ob.position.x -= this.time;
            if(this.whole_ob.position.x<-32){
                this.whole_ob.position.x = -32;
            }
        }

        if(this.whole_ob.position.x === -32 && this.whole_ob.position.z === 32){
            this.whole_ob.rotateY(Math.PI*1.5);
        }
        if(this.whole_ob.position.x === -32 && this.whole_ob.position.z>-33){
            this.whole_ob.position.z -= this.time;
            if(this.whole_ob.position.z<-32){
                this.whole_ob.position.z = -32;
            }
        }
        if(this.whole_ob.position.x === -32 && this.whole_ob.position.z === -32){
            this.whole_ob.rotateY(Math.PI*1.5);
        }
        if(this.whole_ob.position.x<33 && this.whole_ob.position.z===-32){
            this.whole_ob.position.x += this.time;
            if(this.whole_ob.position.x>32){
                this.whole_ob.position.x = 32;
            }
        }
        if(this.whole_ob.position.x===32 && this.whole_ob.position.z===-32){
            this.whole_ob.rotateY(Math.PI*1.5);
        }
    }
}

/**
 * Create second type of car
 */
export class car02 extends GrObject {
    constructor() {
        const car = new T.Group();


        function shinMat(color){
            return new T.MeshLambertMaterial({
                color: color,
                emissive: color,
                intensity: 0.1
            })
        }
        const main = new T.Mesh(
            new T.BoxBufferGeometry(3, 0.75, 1.5), [
                new T.MeshLambertMaterial({color: "yellow"}),
                new T.MeshLambertMaterial({color: "yellow"}),
                new T.MeshLambertMaterial({color: "hotpink"}),
                new T.MeshLambertMaterial({color: "hotpink"}),
                new T.MeshLambertMaterial({color: "hotpink"}),
                new T.MeshLambertMaterial({color: "hotpink"}),
            ]
        );
        main.position.y = 0.55;
        car.add(main);


        const cabin = new T.Mesh(new T.BoxBufferGeometry(1.6, 0.6, 1.2), [
            new T.MeshLambertMaterial({color:"black"}),
            new T.MeshLambertMaterial({color:"black"}),
            new T.MeshLambertMaterial({color: 0xffffff}),
            new T.MeshLambertMaterial({color: 0xffffff}),
            new T.MeshLambertMaterial({color:"black"}),
            new T.MeshLambertMaterial({color:"black"}),
        ]);

        let conGeom = new T.TorusGeometry( 2, 0.5, 20, 1000 );
        let conMat = shinMat("cyan");
        let conMesh=  new T.Mesh(conGeom, conMat);
        car.add(conMesh);

        cabin.position.x = -0.3;
        cabin.position.y = 1.25;
        car.add(cabin);
        super("Car02", car);
        this.time = 0;
        this.whole_ob = car;

        this.ridePoint = new T.Object3D();
        this.ridePoint.translateY(0.7);
        this.ridePoint.rotateY(3 * Math.PI / 2);
        this.whole_ob.add(this.ridePoint);
        this.rideable = this.ridePoint;
    }

    stepWorld(step, timeOfDay) {
        this.time = step / 50;
        if (this.whole_ob.position.z === 0 && this.whole_ob.position.x === 0) {
            this.whole_ob.rotateY(Math.PI * 1.5);
            this.whole_ob.position.set(-32, 0, -32);
        }
        if (this.whole_ob.position.x === 32 && this.whole_ob.position.z < 33) {
            this.whole_ob.position.z += this.time;
            if (this.whole_ob.position.z > 32) {
                this.whole_ob.position.z = 32;
            }
        }

        if (this.whole_ob.position.x === 32 && this.whole_ob.position.z === 32) {
            this.whole_ob.rotateY(Math.PI * 1.5);
        }

        if (this.whole_ob.position.x > -33 && this.whole_ob.position.z === 32) {
            this.whole_ob.position.x -= this.time;
            if (this.whole_ob.position.x < -32) {
                this.whole_ob.position.x = -32;
            }
        }

        if (this.whole_ob.position.x === -32 && this.whole_ob.position.z === 32) {
            this.whole_ob.rotateY(Math.PI * 1.5);
        }
        if (this.whole_ob.position.x === -32 && this.whole_ob.position.z > -33) {
            this.whole_ob.position.z -= this.time;
            if (this.whole_ob.position.z < -32) {
                this.whole_ob.position.z = -32;
            }
        }
        if (this.whole_ob.position.x === -32 && this.whole_ob.position.z === -32) {
            this.whole_ob.rotateY(Math.PI * 1.5);
        }
        if (this.whole_ob.position.x < 33 && this.whole_ob.position.z === -32) {
            this.whole_ob.position.x += this.time;
            if (this.whole_ob.position.x > 32) {
                this.whole_ob.position.x = 32;
            }
        }
        if (this.whole_ob.position.x === 32 && this.whole_ob.position.z === -32) {
            this.whole_ob.rotateY(Math.PI * 1.5);
        }
    }
}

/**
 * Create the Third Moving Car
 */

export class car03 extends GrObject {

    constructor() {
        // Define function wise variable to help building
        let whole_object = new T.Group(); // the whole object
        // extrude settings
        let exSettings = {
            steps: 2,
            depth: 1,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.2,
            bevelSegments: 2
        };

        // Create the base for the car
        let fork_base_mat = new shaderMaterial("./shaders/glow.vs", "./shaders/glow.fs", {
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

        let base_curve = new T.Shape();
        base_curve.moveTo(-1, 0)
        base_curve.lineTo(1.2, 0);
        base_curve.lineTo(1.2, 1.2);
        base_curve.lineTo(-0.4, 1.2);
        base_curve.lineTo(-1, 0.2);
        base_curve.lineTo(-1, 0);
        let base_geom = new T.ExtrudeGeometry(base_curve, exSettings);

        let base = new T.Mesh(base_geom, fork_base_mat); // define the base of the car
        whole_object.add(base);
        base.translateZ(-0.5);

        // Create the base wheels
        let wheels = [];
        let wheel_geo = new T.CylinderGeometry( 0.5, 0.5, 0.5, 20);
        let wheel_mat = new shaderMaterial("./shaders/glow.vs", "./shaders/glow.fs", {
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

        for (let i = 0; i < 4; i++) {
            let wheel_mesh = new T.Mesh(wheel_geo, wheel_mat);
            let wheel_hinge = new T.Group();
            wheel_hinge.add(wheel_mesh);
            wheel_mesh.rotateX(Math.PI/2);
            wheels.push(wheel_hinge);
            whole_object.add(wheel_hinge);
        }
        wheels[0].position.set(-1,0,0.6);
        wheels[1].position.set(1.2,0,0.6);
        wheels[2].position.set(-1,0,-0.6);
        wheels[3].position.set(1.2,0,-0.6);


        // add car top
        const materials = new shaderMaterial("./shaders/glow.vs", "./shaders/glow.fs", {
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

        let cubeGeom = new T.BoxGeometry(0.8,0.1,1);
        let cubeGeom2 = new T.BoxGeometry(1.2,0.1,0.7);
        let window01 = new T.Mesh(cubeGeom, materials);
        let window02 = new T.Mesh(cubeGeom2, materials);
        let window03 = new T.Mesh(cubeGeom2, materials);
        window01.translateX(-0.8);
        window01.translateY(1);
        window01.rotateZ(Math.PI/3);
        whole_object.add(window01);
        whole_object.add(window02);
        whole_object.add(window03);

        window02.translateY(1);
        window02.translateZ(0.7);
        window02.translateX(0.2);
        window02.rotateX(Math.PI/2);

        window03.translateY(1);
        window03.translateZ(-0.7);
        window03.translateX(0.2);
        window03.rotateX(Math.PI/2);

        whole_object.rotateY(Math.PI/2);
        super("Car03",whole_object);
        this.whole_ob = whole_object;

        this.ridePoint = new T.Object3D();
        this.ridePoint.translateY(0.7);
        this.ridePoint.rotateY(-Math.PI/2);
        this.whole_ob.add(this.ridePoint);
        this.rideable = this.ridePoint;


    }
    stepWorld(step, timeOfDay) {
        this.whole_ob.position.setY(0.5);
        this.time = step/50;
        if(this.whole_ob.position.z === 0 && this.whole_ob.position.x ===0){
            this.whole_ob.rotateY(Math.PI*1.5);
            this.whole_ob.position.set(-32,0,32);
        }
        if(this.whole_ob.position.x===32 && this.whole_ob.position.z <33){
            this.whole_ob.position.z += this.time;
            if(this.whole_ob.position.z>32){
                this.whole_ob.position.z = 32;
            }
        }

        if(this.whole_ob.position.x===32 && this.whole_ob.position.z===32){
            this.whole_ob.rotateY(Math.PI*1.5);
        }

        if(this.whole_ob.position.x>-33 && this.whole_ob.position.z === 32){
            this.whole_ob.position.x -= this.time;
            if(this.whole_ob.position.x<-32){
                this.whole_ob.position.x = -32;
            }
        }

        if(this.whole_ob.position.x === -32 && this.whole_ob.position.z === 32){
            this.whole_ob.rotateY(Math.PI*1.5);
        }
        if(this.whole_ob.position.x === -32 && this.whole_ob.position.z>-33){
            this.whole_ob.position.z -= this.time;
            if(this.whole_ob.position.z<-32){
                this.whole_ob.position.z = -32;
            }
        }
        if(this.whole_ob.position.x === -32 && this.whole_ob.position.z === -32){
            this.whole_ob.rotateY(Math.PI*1.5);
        }
        if(this.whole_ob.position.x<33 && this.whole_ob.position.z===-32){
            this.whole_ob.position.x += this.time;
            if(this.whole_ob.position.x>32){
                this.whole_ob.position.x = 32;
            }
        }
        if(this.whole_ob.position.x===32 && this.whole_ob.position.z===-32){
            this.whole_ob.rotateY(Math.PI*1.5);
        }
    }
}
