/**
 * This program is the adaptation of the 2D-version of Train
 */
import {GrObject} from "../../libs/CS559-Framework/GrObject.js";
import * as T from "../../libs/CS559-Three/build/three.module.js";
import {shaderMaterial} from "../../libs/CS559-Framework/shaderHelper.js";


// Define Global Variable
let borderLen = 50;
let height = 0.2;
let z = 0.5;
let u_val = 0;
let points = [[-0.7 * borderLen, z, -0.7 * borderLen], [0.7 * borderLen, z, -0.7 * borderLen], [0.7 * borderLen, z, 0.7 * borderLen], [-0.7 * borderLen, z, 0.7 * borderLen]];
let B_curves = [];
let der_table = [];
let arc_table = [];
let segCount = 30;

export class GrTrain extends GrObject {
    constructor() {
        let train = new T.Group();
        let front = new T.Group();



        // Front
        let exSettings = {
            steps: 2,
            depth: 4,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.2,
            bevelSegments: 2
        };

        let frontCurve = new T.Shape();
        frontCurve.moveTo(-4, 0);
        frontCurve.lineTo(-1.8, 2);
        frontCurve.lineTo(3, 2);
        frontCurve.lineTo(8, 0);
        frontCurve.lineTo(-4, 0);
        let frontGeom = new T.ExtrudeGeometry(frontCurve, exSettings);

        const frontMat = new T.MeshLambertMaterial({
            color: "gray",
            emissive: "gray",
            intensity: 0.0001,
        });

        function shinMat(color){
            return new T.MeshLambertMaterial({
                color: color,
                emissive: color,
                intensity: 0.1
            })
        }

        let frontMesh = new T.Mesh(frontGeom, frontMat);

        frontMesh.translateZ(-2);
        frontMesh.translateY(-0.2);
        frontMesh.translateX(-0.7);
        front.add(frontMesh);


        // Connection Point
        let conGroup = new T.Group();
        let conGeom = new T.TorusGeometry( 3, 0.5, 20, 1000 );
        let conMat = shinMat("cyan");
        let conMesh=  new T.Mesh(conGeom, conMat);
        conGroup.add(conMesh);
        front.add(conGroup);

        // Body
        let bodyGroup = new T.Group;
        let bodyGeom = new T.BoxGeometry( 8, 2, 4);
        let bodyMat = shinMat("cyan");
        let bodyMesh = new T.Mesh(bodyGeom, bodyMat);
        bodyGroup.add(bodyMesh);
        bodyGroup.translateX(-6);
        bodyGroup.translateY(1);

        front.add(bodyGroup);


        // Strip
        let stripGeom = new T.BoxGeometry( 5, 0.1, 1);
        let stripMat = shinMat("yellow");
        let stripMesh = new T.Mesh(stripGeom, stripMat);
        bodyGroup.add(stripMesh);
        stripMesh.translateY(1);


        // Ride Point
        let ridePoint = new T.Group();
        ridePoint.translateX(2.6);
        ridePoint.translateY(2);
        front.add(ridePoint);

        train.add(front);
        super(`Train`, front);
        front.position.y = 2;
        train.translateY(1.5);

        this.rideable = ridePoint;
        this.frontGroup = front;
        this.ridePoint = ridePoint;
        ridePoint.rotateY(Math.PI/2);


        const scl = 1;
        front.scale.set(scl, scl, scl);
    }

    stepWorld(delta, timeOfDay) {
        let body_parts = [];
        body_parts.push(this.frontGroup);

        for (let k = 0; k < body_parts.length; k++) {
            let x1, z1, angle;
            u_val += delta * 0.001;
            let part = body_parts[k];
            let param = (u_val) % (points.length);
            let param1 = Math.floor(param) % B_curves.length;
            let distance = 0.05;
            [x1, z1, angle] = arc(param1, param + distance * k, param + distance * k - param1);
            part.position.x = x1;
            part.position.z = z1;
            part.position.y = 10;
            if (k === 1 || k === 0) part.rotation.set(0, angle - Math.PI / 2, 0, "XYZ");
        }

    }
}

/**
 *
 * @param i
 * @param t
 * @param t2
 * @returns {(*|number)[]}
 */
function arc(i, t, t2) { //u is total time

    let angle,
        flag = 0,
        temp_k = -1,
        temp_j = -1,
        per_advance = 0,
        tempx,
        tempz;
    let [x, z, xd, zd] = derXZ(i, t2);
    let percent = t / B_curves.length;
    let temp_table = arc_table[arc_table.length - 1].ten_segs[segCount - 1];
    let max_len = temp_table[2];
    let curve_len = percent * max_len;

    if (curve_len > max_len) {
        flag = 1;
        temp_k = arc_table.length - 1;
        temp_j = segCount - 1;
    }

    for (let k = 0; k < arc_table.length && flag === 0; k++) {

        let temp = arc_table[k].ten_segs;
        for (let j = 0; j < segCount; j++) {

            let low = temp[j][2], high;
            if (j < segCount - 1) {
                high = temp[j + 1];
            } else {
                high = arc_table[(k + 1) % arc_table.length].ten_segs[0];
            }

            if (Math.floor(low) <= Math.floor(curve_len) && Math.floor(high[2]) >= Math.floor(curve_len)) {

                per_advance = (curve_len - low) / (high[2] - low);
                flag = 1;
                temp_k = k;
                temp_j = j;
                tempx = high[0];
                tempz = high[1];
                break;
            }
        }
    }

    let temp2 = arc_table[temp_k].ten_segs[temp_j];
    angle = Math.atan2(xd, zd);
    return [x, z, angle];
}

/**
 * Create the Bezier Curve
 */
function toBezier() {
    B_curves = [];
    der_table = [];
    arc_table = [];
    let i, s = 0.5, u = 1 / 3;
    for (i = 0; i < points.length; i++) {
        let p0 = points[i];
        let x, y;
        x = points[(i + 1) % points.length][0] - points[(i - 1 + points.length) % points.length][0];
        y = points[(i + 1) % points.length][2] - points[(i - 1 + points.length) % points.length][2];
        let p0d = [s * x, height, s * y];
        let p1 = [p0[0] + u * p0d[0], height, p0[2] + u * p0d[2]];
        let p3 = points[(i + 1) % points.length];
        x = points[(i + 2) % points.length][0] - points[i][0];
        z = points[(i + 2) % points.length][2] - points[i][2];
        let p3d = [s * x, height, s * z];
        let p2 = [p3[0] - u * p3d[0], height, p3[2] - u * p3d[2]];
        B_curves.push([p0, p1, p2, p3]);
        der_table.push([p0, p3, p0d, p3d]);

        let j, expected_angle, x_distance, z_distance;
        let segs = [];

        for (j = 0; j < 1; j += 1 / segCount) {
            [x, z, x_distance, z_distance] = derXZ(i, j);
            expected_angle = Math.atan2(x_distance, z_distance);
            if (i === 0 && j === 0) {
                segs.push([p0[0], p0[2], 0, expected_angle]);
                continue;
            }
            let temp;
            if (j === 0) {
                temp = arc_table[(i - 1 + arc_table.length) % arc_table.length].ten_segs[9];
            } else {
                temp = segs.pop();
                segs.push(temp);
            }
            let dist = temp[2] + Math.sqrt((temp[0] - x) * (temp[0] - x) + (temp[1] - z) * (temp[1] - z));
            segs.push([x, z, dist, expected_angle]);
        }
        arc_table.push({
            "ten_segs": segs,
        });
    }
}

/**
 * Helper function
 * Find the derivatives
 * @param i
 * @param u
 * @returns {*[]}
 */
function derXZ(i, u) {
    let p = der_table[i];
    let u_cube = u * u * u;
    let u_sqr = u * u;
    let x = p[0][0] + p[2][0] * u + (-3 * p[0][0] - 2 * p[2][0] + 3 * p[1][0] - p[3][0]) * u_sqr + (2 * p[0][0] + p[2][0] - 2 * p[1][0] + p[3][0]) * u_cube;
    let z = p[0][2] + p[2][2] * u + (-3 * p[0][2] - 2 * p[2][2] + 3 * p[1][2] - p[3][2]) * u_sqr + (2 * p[0][2] + p[2][2] - 2 * p[1][2] + p[3][2]) * u_cube;
    let xd = p[2][0] + (-3 * p[0][0] - 2 * p[2][0] + 3 * p[1][0] - p[3][0]) * u * 2 + (2 * p[0][0] + p[2][0] - 2 * p[1][0] + p[3][0]) * u_sqr * 3;
    let zd = p[2][2] + (-3 * p[0][2] - 2 * p[2][2] + 3 * p[1][2] - p[3][2]) * u * 2 + (2 * p[0][2] + p[2][2] - 2 * p[1][2] + p[3][2]) * u_sqr * 3;
    return [x, z, xd, zd];
}

/**
 * This function draw the Rails according to the table
 * @param world
 */
function drawRails(world) {
    arc_table.forEach(function (point_table) {

        let segs = point_table.ten_segs;
        let rail_Geom = new T.BoxGeometry(2, 1, 6);
        let railMat = new shaderMaterial("./shaders/glow.vs", "./shaders/glow.fs", {
            side: T.FrontSide,
            blending: T.AdditiveBlending,
            transparent: false,
            uniforms:
                {
                    "shin": {value: -1.0},
                    "blow": {value: 1.0},
                    "power": {value: 1.0},
                    glowColor: {type: "c", value: new T.Color(0xffff00)}
                },
        });

        // Draw the Rail
        for (let j = 0; j < segCount; j++) {
            let rail = new T.Mesh(rail_Geom, railMat);
            rail.translateX(segs[j][0]);
            rail.translateZ(segs[j][1]);
            rail.translateY(8);
            rail.rotateY(segs[j][3] + Math.PI / 2);
            world.scene.add(rail);
        }


        const pillarGeom = new T.CylinderGeometry(
            2, 2, 8, 12);
        const pillarMat = new T.MeshLambertMaterial({
           color: "gray",
           emissive: 0xfffff,
        });
        // Create the Pillars
        for(let i = 0; i < points.length; i++) {
            let pillar = new T.Mesh(pillarGeom, pillarMat);
            pillar.position.set(points[i][0], 4, points[i][2]);
            world.scene.add(pillar);
        }

    });
}

export function draw(world) {
    toBezier();
    drawRails(world);

}
