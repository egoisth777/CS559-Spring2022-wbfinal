import {GrObject} from "../../libs/CS559-Framework/GrObject.js";
import * as T from "../../libs/CS559-Three/build/three.module.js";
import {shaderMaterial} from "../../libs/CS559-Framework/shaderHelper.js";


let simpleSN1Count = 0;

export class cyberSnow extends GrObject {
    constructor() {

        // Create Groups
        let whole_ob = new T.Group();

        // Get the buildings
        let sw1 = createSnowMan2();


        // Add things to Groups
        sw1.scale.set(1, 1, 1);
        whole_ob.add(sw1);

        whole_ob.position.set(0, 0, 0);


        super(`SN1-${++simpleSN1Count}`, whole_ob);
        this.whole_ob = whole_ob;
    }

    stepWorld(delta, timeOfDay) {
        this.whole_ob.rotateY(delta / 3000);
    }
}


// A Carousel.
/**
 * @typedef CarouselProperties
 * @type {object}
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 */
let carouselObCtr = 0;
export class GrCarousel extends GrObject {
    /**
     * @param {CarouselProperties} params
     */
    constructor(params = {}) {
        let width = 3;
        let carousel = new T.Group();

        let base_geom = new T.CylinderGeometry(width, width, 1, 32);
        let base_mat = new T.MeshStandardMaterial({
            color: "lightblue",
            metalness: 0.3,
            roughness: 0.8
        });
        let base = new T.Mesh(base_geom, base_mat);
        base.translateY(0.5);
        carousel.add(base);

        let platform_group = new T.Group();
        base.add(platform_group);
        platform_group.translateY(0.5);

        let platform_geom = new T.CylinderGeometry(
            0.95 * width,
            0.95 * width,
            0.2,
            32
        );
        let platform_mat = new T.MeshStandardMaterial({
            color: "gold",
            metalness: 0.3,
            roughness: 0.8
        });
        let platform = new T.Mesh(platform_geom, platform_mat);
        platform_group.add(platform);

        let cpole_geom = new T.CylinderGeometry(0.3 * width, 0.3 * width, 3, 16);
        let cpole_mat = new T.MeshStandardMaterial({
            color: "gold",
            metalness: 0.8,
            roughness: 0.5
        });
        let cpole = new T.Mesh(cpole_geom, cpole_mat);
        platform_group.add(cpole);
        cpole.translateY(1.5);

        let rot = new T.Mesh(cpole_geom, cpole_mat);
        platform_group.add(rot);
        rot.translateY(4);
        let snowMan = createSnowMan2();
        snowMan.scale.set(0.5, 0.5, 0.5);
        rot.add(snowMan);

        let top_trim = new T.Mesh(platform_geom, platform_mat);
        platform_group.add(top_trim);
        top_trim.translateY();

        let opole_geom = new T.CylinderGeometry(0.03 * width, 0.03 * width, 3, 16);
        let opole_mat = new T.MeshStandardMaterial({
            color: "#aaaaaa",
            metalness: 0.8,
            roughness: 0.5
        });
        let opole;
        let num_poles = 10;
        let poles = [];
        //declare some personal staff with the box
        // materials and geometries
        let box_geo = new T.BoxGeometry(0.6, 0.6, 0.6);
        let box_mat1 = new T.MeshStandardMaterial({color: "red", metalness: 0.4, roughness: 0.3});
        let box_mat2 = new T.MeshStandardMaterial({color: "yellow", metalness: 0.4, roughness: 0.3});
        let box_mat3 = new T.MeshStandardMaterial({color: "blue", metalness: 0.4, roughness: 0.3});
        let box;
        let boxes = [];
        let direction;

        // iterations to place the poles
        for (let i = 0; i < num_poles; i++) {
            opole = new T.Mesh(opole_geom, opole_mat);
            platform_group.add(opole);
            opole.translateY(1.5);
            opole.rotateY((2 * i * Math.PI) / num_poles);
            opole.translateX(0.8 * width);
            poles.push(opole);

            // put the boxes in place and in right directions
            if (i % 3 === 0) box = new T.Mesh(box_geo, box_mat1);
            else if (i % 3 === 1) box = new T.Mesh(box_geo, box_mat2);
            else box = new T.Mesh(box_geo, box_mat3)
            platform_group.add(box);

            if (i % 2 === 0) box.translateY(1.4);
            else box.translateY(0.7);

            box.rotateY(2 * i * Math.PI / num_poles);
            box.translateX(0.8 * width);

            if (i % 2 === 0) direction = -1;
            else direction = 1;
            boxes.push({object: box, index: i, direction: direction}); // push the boxes object in the list for animation
        }

        let roof_geom = new T.ConeGeometry(width, 0.5 * width, 32, 4);
        let roof = new T.Mesh(roof_geom, base_mat);
        carousel.add(roof);
        roof.translateY(4.8);

        // note that we have to make the Object3D before we can call
        // super and we have to call super before we can use this
        super(`Carousel-${carouselObCtr++}`, carousel);
        this.whole_ob = carousel;
        this.platform = platform_group;
        this.poles = poles;
        this.boxes = boxes;

        // put the object in its place
        this.whole_ob.position.x = params.x ? Number(params.x) : 0;
        this.whole_ob.position.y = params.y ? Number(params.y) : 0;
        this.whole_ob.position.z = params.z ? Number(params.z) : 0;
        let scale = params.size ? Number(params.size) : 1;
        carousel.scale.set(scale, scale, scale);
        //end of the constructor
    }

    // use the step world method to update
    /**
     * StepWorld method
     * @param {*} delta
     * @param {*} timeOfDay
     */
    stepWorld(delta, timeOfDay) {
        this.platform.rotateY(delta / 850);
        for (let i = 0; i < this.boxes.length; i++) {
            this.boxes[i].object.translateY(0.02 * this.boxes[i].direction);
            if (this.boxes[i].object.position.y <= 0.7 || this.boxes[i].object.position.y >= 2.1)
                this.boxes[i].direction *= (-1);
        }
    }
}


/**
 * Create a second creative snowman
 * @param scene
 */
function createSnowMan2() {
    const snowMan2 = new T.Group();
    let sphere = new T.SphereGeometry(2);
    let cylinder = new T.CylinderGeometry(0.5, 0.5, 3, 20);
    let cone = new T.ConeGeometry(1, 2, 20);

    let baseMat2 = new shaderMaterial("./shaders/glow.vs", "./shaders/glow.fs", {
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

// Create a first sphere
    let sphereMesh1 = new T.Mesh(
        sphere,
        baseMat2
    );
    snowMan2.add(sphereMesh1);
// Create a second sphere
    let sphereMesh2 = new T.Mesh(
        sphere,
        baseMat2
    );
    snowMan2.add(sphereMesh2);
    sphereMesh2.translateY(2);
    sphereMesh2.scale.set(0.8, 0.8, 0.8);

// Create a third sphere
    let sphereMesh3 = new T.Mesh(
        sphere,
        baseMat2
    );
    snowMan2.add(sphereMesh3);
    sphereMesh3.translateY(4);
    sphereMesh3.scale.set(0.6, 0.6, 0.6);

// Create the eyes for the snow man
    let axis1 = new T.Group();
    let axis2 = new T.Group();
    let eyes = new T.Group();
    let eyeMesh1 = new T.Mesh(
        sphere,
        baseMat2
    );
    let eyeMesh2 = new T.Mesh(
        sphere,
        baseMat2
    );
    // wrapped group
    axis1.add(eyeMesh1);
    axis2.add(eyeMesh2);
    eyes.add(axis1);
    eyes.add(axis2);
    sphereMesh3.add(eyes);
    eyeMesh1.scale.set(1.2, 1.2, 1.2);
    eyeMesh2.scale.set(1.2, 1.2, 1.2);

    eyeMesh1.position.set(Math.sqrt(3), 1, 0);
    eyeMesh2.position.set(Math.sqrt(3), 1, 0);
    eyeMesh1.scale.set(0.1, 0.1, 0.1);
    eyeMesh2.scale.set(0.1, 0.1, 0.1);

    let axis = new T.Vector3(0, 1, 0);
    axis1.rotateOnAxis(axis, Math.PI / 6);
    axis2.rotateOnAxis(axis, -Math.PI / 6);

// Create the nose for the snow man
    const nose = new T.Group();

    let noseMesh = new T.Mesh(
        cone,
        baseMat2
    );
    nose.add(noseMesh);
    sphereMesh3.add(nose);
    noseMesh.translateX(2);
    noseMesh.rotateZ(-Math.PI / 2);
    noseMesh.scale.set(1.5, 3, 1.5);
    nose.rotateZ(-Math.PI / 15);


// Create the hat for the snow man
    const hat = new T.Group();
    let hatMesh = new T.Mesh(
        cylinder,
        baseMat2
    );
    let hatBoard = new T.Mesh(
        cylinder,
        baseMat2
    )
    hat.add(hatMesh);
    hat.add(hatBoard);
    sphereMesh3.add(hat);
    hat.translateY(2);
    hatMesh.scale.set(2, 1, 2);
    hatBoard.scale.set(4, 0.1, 4);

// Create the cross for the snowman
    const cross = new T.Group();
    let crossMesh1 = new T.Mesh(
        cylinder,
        baseMat2
    );
    let crossMesh2 = new T.Mesh(
        cylinder,
        baseMat2
    );
    cross.add(crossMesh1);
    cross.add(crossMesh2);
    sphereMesh2.add(cross);
    cross.position.set(-2, 0, 0);
    crossMesh1.scale.set(1, 5, 1);
    crossMesh2.scale.set(1, 2.5, 1);
    crossMesh2.translateY(2);
    crossMesh2.rotateX(Math.PI / 2);
    cross.rotateX(Math.PI / 6);

    // Create the hand for the snowman
    let handMesh1 = new T.Mesh(
        cylinder,
        baseMat2
    );

    let handMesh2 = new T.Mesh(
        cylinder,
        baseMat2
    );
    let handAxis1 = new T.Group();
    let handAxis2 = new T.Group();
    let hands = new T.Group();
    sphereMesh2.add(hands);
    handAxis1.add(handMesh1);
    handAxis2.add(handMesh2);
    hands.add(handAxis1);
    hands.add(handAxis2);
    handMesh1.position.set(2, 0, 0);
    handMesh2.position.set(2, 0, 0);
    handMesh1.rotateZ(Math.PI / 2);
    handMesh2.rotateZ(Math.PI / 2);
    handAxis1.rotateY(Math.PI / 2);
    handAxis2.rotateY(-Math.PI / 2);
    hands.rotateX(Math.PI / 16);
    hands.name = 'hands';

    // Create core
    const core = new T.Group();
    let coreMesh = new T.Mesh(
        sphere,
        baseMat2
    );
    core.add(coreMesh);
    sphereMesh2.add(core);
    core.position.set(1.5, 0.2, 0);
    core.scale.set(0.5, 0.5, 0.5);

    // Create halo for the snowman
    const halo = new T.Group();
    let geometry = new T.TorusGeometry(3, 0.5, 20, 2999);
    let ring1 = new T.Mesh(geometry, baseMat2);
    halo.add(ring1);
    sphereMesh3.add(halo);
    halo.position.set(0, 4, 0);
    halo.rotateX(Math.PI / 2);


    // Create Back halo
    const halo2 = new T.Group();
    let Geometry = new T.TorusGeometry(3, 0.5, 20, 2999);
    let ring2 = new T.Mesh(geometry, baseMat2);
    halo2.add(ring2);
    sphereMesh2.add(halo2);
    halo2.translateX(-3);
    halo2.rotateY(Math.PI / 2);
    halo2.scale.set(1.5, 1.5, 1.5);
    return snowMan2;
}