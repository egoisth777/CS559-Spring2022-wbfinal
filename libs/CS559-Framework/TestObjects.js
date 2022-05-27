/*jshint esversion: 11 */
// @ts-check

/**
 * CS559 3D World Framework Code
 *
 * Test Objects - these examples are for use in testing the framework
 * and are less generally useful
 *
 * @module TestObjects 
 */

// we need to have the BaseClass definition
import { GrObject } from "./GrObject.js";

// a global variable to keep track of how many objects we create
// this allows us to give unique names
let testobjsctr = 0;

import * as T from "../CS559-Three/build/three.module.js";

function degreesToRadians(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * A simple object that is like a dump truck (with a hinge), but just made of
 * boxes.
 * A simple way to test a parametric object
 * 
 * It's also a simple example of a hierarchical object
 */
export class HingeCube extends GrObject {
  constructor() {
    const group = new T.Group();
    const geometry = new T.BoxGeometry(1, 0.5, 1);

    const mesh1 = new T.Mesh(
      geometry,
      new T.MeshStandardMaterial({ color: 0xa0a000 })
    );
    mesh1.position.y = 0.25;

    const mesh2 = new T.Mesh(
      geometry,
      new T.MeshStandardMaterial({ color: 0xffff00 })
    );
    mesh2.position.y = 0.25;
    mesh2.position.z = 0.5;

    // set group with origin at pivot point
    group.add(mesh1);
    const g2 = new T.Group();
    g2.position.set(0, 0.5, -0.5);
    g2.add(mesh2);
    group.add(g2);

    super(`HingeCube-${testobjsctr++}`, group, [
      ["x", -5, 5, 2],
      ["z", -5, 5, 2],
      ["theta", -180, 180, 0],
      ["tilt", 0, 90, 0]
    ]);

    this.group = group;
    this.mesh1 = mesh1;
    this.mesh2 = mesh2;
    this.g2 = g2;
  }

  update(paramValues) {
    this.group.position.x = paramValues[0];
    this.group.position.z = paramValues[1];
    this.group.rotation.y = degreesToRadians(paramValues[2]);
    this.g2.rotation.x = degreesToRadians(-paramValues[3]);
  }
}

// for faking deferred loading
// from https://flaviocopes.com/javascript-sleep/
const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

/**
 * test for an object that is created slowly (like loading an OBJ)
 *
 * the catch is that we need to have an object to install in the world
 * (since we can't defer that), but we don't have "the" object
 *
 * the trick: make a Group - when the deferred object finally arrives,
 * stick it in the group
 *
 * here, we fake OBJ loading with sleep
 */
export class DelayTest extends GrObject {
  constructor() {
    const group = new T.Group();
    super("Delay-Test", group);
    this.group = group;
    // use sleep, rather than OBJ loader
    sleep(1500).then(function() {
      group.add(
        new T.Mesh(
          new T.TorusKnotGeometry(),
          new T.MeshStandardMaterial({ color: "red" })
        )
      );
    });
  }
}

/**
 * Better delayed object - put a proxy object in its place, and then remove it
 */
export class BetterDelayTest extends GrObject {
  constructor() {
    const group = new T.Group();
    super("Delay-Test", group);
    this.group = group;
    // make a cube that will be there temporarily
    const tempCube = new T.Mesh(
      new T.BoxGeometry(),
      new T.MeshStandardMaterial()
    );
    group.add(tempCube);
    // use sleep, rather than OBJ loader
    sleep(2000).then(function() {
      group.remove(tempCube);
      group.add(
        new T.Mesh(
          new T.TorusKnotGeometry(),
          new T.MeshStandardMaterial({ color: "purple" })
        )
      );
    });
  }
}

/**
 * test for changing an object's material after some delay
 */
export class MaterialDelayTest extends GrObject {
  constructor() {
    const group = new T.Group();
    super("Delay-Test", group);

    this.material = new T.MeshStandardMaterial({ color: "white" });
    this.geometry = new T.TorusGeometry();
    this.mesh = new T.Mesh(this.geometry, this.material);

    group.add(this.mesh);
    group.position.x = -3;

    const self = this;

    // use sleep, rather than OBJ loader
    sleep(1000).then(function() {
      // note: we can't use "this" because this isn't lexically scoped
      self.material.setValues({ color: "red" });
      self.material.needsUpdate = true;
    });
  }
}

export class CheckSign extends GrObject {
  /**
   *
   * @param {Object} props
   * @param {number} [props.checks=4] - number of squares per side
   * @param {string} [props.colortype="vertex"] - vertex,face,none
   * @param {number} [props.x]
   * @param {number} [props.y]
   * @param {number} [props.z]
   * @param {number} [props.scale=1]
   * @param {THREE.Color | string | Number} [props.materialcolor]
   */
  constructor(props = {}) {
    const group = new T.Group();
    super("CheckSign1", group);

    // let geometry = new T.Geometry();
    const geometry = new T.BufferGeometry();

    const nchecks = props.checks ?? 4;
    const nverts = nchecks + 1;
    const scale = props.scale > 0.0001 ? props.scale : 1; // disallow 0

    let colortype;
    switch (props.colortype && props.colortype[0]) {
      case "v":
        colortype = T.VertexColors;
        break;
      case "f":
        colortype = T.FaceColors;
        break;
      case "n":
        colortype = T.NoColors;
        break;
      default:
        console.log(`no or bad colortype - assuming vertex`);
        colortype = T.VertexColors;
    }

    const vertexIndex = []

    for (let i = 0; i < nverts + 1; i++) {
      for (let j = 0; j < nverts; j++) {
        vertexIndex.push([i, j, 0]);
      }
    }

    const vertices = []
    const colors = []

    for (let i = 0; i < nchecks; i++) {
      for (let j = 0; j < nchecks; j++) {
        vertices.push(...vertexIndex[i * nverts + j])
        vertices.push(...vertexIndex[i * nverts + j + 1])
        vertices.push(...vertexIndex[(i + 1) * nverts + j])

        vertices.push(...vertexIndex[i * nverts + j + 1])
        vertices.push(...vertexIndex[(i + 1) * nverts + j + 1])
        vertices.push(...vertexIndex[(i + 1) * nverts + j])

        const faceColor1 = (new T.Color('red')).toArray()
        
        colors.push(...faceColor1);
        colors.push(...faceColor1);
        colors.push(...faceColor1);

        colors.push(1, 0, 0);
        colors.push(1, 1, 1);
        colors.push(0, 0, 1);
      }
    }

    geometry.setAttribute('position', new T.BufferAttribute(Float32Array.from(vertices), 3))
    geometry.setAttribute('color', new T.BufferAttribute(Float32Array.from(colors), 3))

    geometry.computeVertexNormals();

    const materialProps = { 
      side: T.DoubleSide, 
      vertexColors: colortype 
    };
    if (props.materialcolor) materialProps["color"] = props.materialcolor;
    const material = new T.MeshStandardMaterial(materialProps);

    const mesh = new T.Mesh(geometry, material);
    // center at 0,0
    mesh.scale.set(scale, scale, scale);
    // warning - scale does not affect translation!
    mesh.translateX(scale * (-nchecks / 2));
    mesh.translateY(scale * (-nchecks / 2));

    group.add(mesh);

    group.position.x = Number(props.x) || 0;
    group.position.y = Number(props.y) || 0;
    group.position.z = Number(props.z) || 0;
  }
}
