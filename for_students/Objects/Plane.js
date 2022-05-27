import {GrObject} from "../../libs/CS559-Framework/GrObject.js";
import * as T from "../../libs/CS559-Three/build/three.module.js";
import {shaderMaterial} from "../../libs/CS559-Framework/shaderHelper.js";

// Some Helper Functions

/**
 * Return a cylinder Mesh
 * @returns {T.Mesh}
 */
function cylinder(color){
    return new T.Mesh(
        new T.CylinderGeometry( 0.5, 0.5, 3, 20),
        new T.MeshStandardMaterial({color: color}, {metalness : 1.0})
    );
}

function cone(color){
    return new T.Mesh(
        new T.ConeGeometry(1, 2, 20),
        new T.MeshStandardMaterial({color: color}, {metalness : 1.0})
    );
}

/**
 * Return a torusMesh
 * @returns {T.Mesh}
 */
function torus(){
    return new T.Mesh(
        new T.TorusGeometry( 3, 0.5, 20, 2999 ),
        new T.MeshStandardMaterial({color: "white", wireframe: true}, {metalness : 1.0})
    );
}

/**
 * Return sphereMesh
 * @returns {T.Mesh}
 */
function sphere(color){
    return new T.Mesh(
        new T.SphereGeometry(2),
        new T.MeshStandardMaterial({color: color}, {metalness : 1.0})
    );
}

/**
 * Return a rectangleMesh
 * @returns {T.Mesh}
 */
function rectangle(){
    return new T.Mesh(
        new T.BoxGeometry(1, 1, 1),
        new T.MeshStandardMaterial({color: "grey"}, {metalness : 1.0})
    );
}

/**
 * Create reusable propellors
 */
function createProp(){
    let prop = new T.Group();
    let first = cylinder("blue");
    let second = cylinder("blue");
    let third = cylinder("grey");
    let spin = sphere("silver");
    prop.add(third);
    third.add(first);
    third.add(second);
    third.add(spin);
    first.rotateX(Math.PI/2);
    second.rotateX(Math.PI/2);
    second.rotateZ(Math.PI/2);
    first.position.set(0,1.5,0);
    second.position.set(0,1.5,0);
    spin.position.set(0,1.5,0);
    spin.scale.set(0.25, 0.25, 0.25);
    first.scale.setZ(0.2);
    second.scale.setZ(0.2);
    // first.rotateY(Math.PI/2);
    return prop;
}


/**
 * Class that creates the plane
 */
let simplePlaneCount = 0;
let isUp = true;
let droneVelocity = 0.01;
export class FancyPlane extends GrObject {
    constructor() {
        // Create Group
        let whole_ob = new T.Group();

        let coolCopter = new T.Group();
        let bodyGroup = new T.Group();
        let baseGeo = new T.CylinderGeometry(0.3, 0.7, 0.3, 18, 24);
        let baseMaterial = new T.MeshStandardMaterial({color:"silver", emissive: "lightgray", emissiveIntensity: 0.2});

        let baseMesh = new T.Mesh(baseGeo, baseMaterial);
        baseMesh.rotateZ(Math.PI);
        bodyGroup.add(baseMesh);
        coolCopter.add(bodyGroup);
        baseMesh.scale.set(1.2,1.2,1.2);

        let sphereMesh = new sphere("red");
        sphereMesh.scale.set(0.2,0.2,0.2);
        bodyGroup.add(sphereMesh);
        sphereMesh.position.setY(0.5);

        // Create the top Mesh
        let topMesh = new T.Mesh(baseGeo, baseMaterial);
        bodyGroup.add(topMesh);
        topMesh.scale.set(1.2,1.2,1.2);
        topMesh.position.setY(1.3);

        // Create the ball
        const ball = new T.Group();
        //Create three rings
        let materials = ["red","blue",0xffffff,"yellow"];
        let rings = [];
        for (let i = 0; i < 4; i++) {
            let geometry = new T.TorusGeometry( 3, 0.5, 20, 2999 );
            rings[i] = new T.Mesh(geometry, new T.MeshBasicMaterial({color: materials[i], wireframe: true}));
            ball.add(rings[i]);
        }
        rings[1].rotateX(Math.PI/3);
        rings[1].name = "rings1";
        rings[2].rotateY(-Math.PI/3);
        rings[2].name = "rings2";
        rings[3].rotateX(-Math.PI/3);
        rings[3].name = "rings3";
        ball.scale.set(0.2, 0.2, 0.2);


        // Creat fancy outrings
        coolCopter.add(ball);
        ball.position.setY(0.5);


        // Create props

        let props2 = [];
        for (let i = 0; i < 4; i++) {
            props2.push(createProp());
            if(i < 2) topMesh.add(props2[i]);
            else baseMesh.add(props2[i]);
            props2[i].position.setX(i % 2 === 0 ? 0.5 : -0.5);
            props2[i].scale.set(0.2,0.2,0.2);
        }


        // Add to the whole Group
        whole_ob.add(coolCopter)
        whole_ob.scale.set(2,2,2);

        super(`Plane-${++simplePlaneCount}`, whole_ob);
        this.whole_ob = whole_ob;
        this.props = props2;
        this.rings = rings;
    }
    stepWorld(delta, timeOfDay) {



        // animate the ball
        this.rings.forEach( (ring) =>{
            ring.rotateY(0.001 * delta);
        })

        // animate the propellor
        for (let i = 0; i < this.props.length; i++) {
            this.props[i].rotateY(Math.PI/15);
        }

        // Up and Down

        this.whole_ob.position.y = 20 + 5 * Math.sin(Date.now()/600);
        this.whole_ob.position.x = -20 + 8 * (Math.sin(Date.now()/3000));
        this.whole_ob.position.z = -20 + 16 * Math.sin(Date.now()/3000) * Math.cos(Date.now()/3000);


    }
}

/**
 * This Creates a simple Radar
 * @type {number}
 */
let simpleRadarCount = 0;
export class radar extends GrObject {
    constructor(coolCopter) {
        // Create Group
        let whole_ob = new T.Group();

        // Create the bodyMesh
        let radar = new T.Group();
        let radarGeo = new T.CylinderGeometry(0.35, 0.65, 1, 18, 24);
        let radarMaterial = new T.MeshStandardMaterial({color: "silver"});
        let radarBodyMesh = new T.Mesh(radarGeo,radarMaterial);

        // Create DiskMesh
        let diskGroup = new T.Group();
        let diskGeo = new T.CylinderGeometry(0.8, 0.35, 0.75, 18, 24);
        let radardiskMesh = new T.Mesh(diskGeo, radarMaterial);
        diskGroup.add(radardiskMesh);
        diskGroup.position.setY(0.8);
        // Create the ring
        let ring = torus();
        ring.scale.set(0.2,0.2,0.2);
        // Create the cone
        let cone2 = cone("yellow");
        cone2.scale.set(0.4,0.4,0.4);
        cone2.position.set(0,0.5,0);
        radar.add(radarBodyMesh);
        radardiskMesh.add(ring);
        radardiskMesh.add(cone2);
        radardiskMesh.rotateX(Math.PI/2);


        // create the sphere
        let sphereMesh = sphere("red");
        sphereMesh.scale.set(0.25,0.25,0.25);
        sphereMesh.position.setY(0.5);
        radarBodyMesh.add(sphereMesh);
        radarBodyMesh.add(diskGroup);
        diskGroup.name = "disk";

        whole_ob.add(radar);
        whole_ob.scale.set(1,1,1);

        super(`Radar-${++simpleRadarCount}`, whole_ob);
        this.disk = diskGroup;
        this.whole_ob = whole_ob;
        this.coolCopter = coolCopter;
    }

    /**
     *
     * @param delta
     * @param timeOfDay
     */
    stepWorld(delta, timeOfDay) {

        let vec= new T.Vector3();
        this.disk.lookAt(this.coolCopter.getWorldPosition(vec));
    }
}