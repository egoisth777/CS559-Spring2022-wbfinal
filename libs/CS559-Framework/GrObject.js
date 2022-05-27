/*jshint esversion: 11 */
// @ts-check

/**
 * CS559 3D World Framework Code
 *
 * GrObject: a "thin wrapper" around Three.JS's Object3D to facilitate
 * creating UIs and doing animation
 * 
 * @module GrObject 
 */

/* students will want to create objects that extend this class */

/*
 * This is the main class for the framework. Most of the work involves extending
 * the class `GrObject` defined here.
 */

import * as T from "../CS559-Three/build/three.module.js";

/**
 * This function converts from the specifications given to the `GrObject`
 * constructor into the form used internally. It is the best documentation for
 * how those descriptions are interpreted.
 * 
 * when creating an object, a parameter is defined by an array of up to 
 * 5 things
 * name (string)
 * min (number)
 * max (number)
 * initial value (number)
 * step size for slider (number)
 *
 * **Note:** this function is for internal use, but it is exported to convince
 * JSDoc to document it.
 *
 * @param {string|Array} param
 */
export function paramObjFromParam(param) {
  const paramObj = { 
    name: "no name", 
    min: 0, 
    max: 1, 
    initial: 0, 
    step: 0 
  };

  if (typeof param === "string") {
    paramObj.name = param;
  } else if (Array.isArray(param)) {
    if (param.length > 0) {
      paramObj.name = param[0];
    }
    if (param.length > 1) {
      paramObj.min = param[1];
    }
    if (param.length > 2) {
      paramObj.max = param[2];
    }
    if (param.length > 3) {
      paramObj.initial = param[3];
    }
    if (param.length > 4) {
        paramObj.step = param[4];
    } 
  }
  // make sure the initial value is legal
  if (paramObj.initial < paramObj.min) {
    paramObj.initial = paramObj.min;
  }
  if (paramObj.initial > paramObj.max) {
    paramObj.initial = paramObj.max;
  }

  return paramObj;
}

/** 
 * @class GrObject
 * 
 * GrObjects have:
 * - a name - each object should have a unique name (like an id), but this is not
 *   enforced
 * - parameters (these are things that the user may want to control with sliders)
 * - geometry / "Object3D" - they kind of serve like three's groups
 * note: animation should not update the parameters
 *
 * any new object should provide methods for:
 * - construction - the constructor needs to call the base class constructor
 *      and provide the parameters and geometry
 * - update - which takes an array of parameters and sets things accordingly
 * - stepWorld - which moves the animation ahead a small amount
 *
 *
 * and optionally
 * - lookfrom/lookat
 *
 * Note that a `GrObject` does not add itself to the scene (other things take care
 * of that). When the object is added to the world, it's THREE objects are added to
 * the `Scene` (the THREE world container).
 * 
 * 
 */
export class GrObject {
  /**
   * The parameter list (if provided) should be either a string
   * (with the name of the parameter) or an Array with the first
   * value being a string (the name), and the remaining 4 values being
   * numbers: min, max, initial value, and step size (all optional).
   * @see paramObjFromParam
   *
   * @param {String} name - unique name for the object
   * @param {THREE.Object3D | Array<THREE.Object3D>} objectOrObjects
   * @param {Array<string|Array>} [paramInfo] - a list of the parameters for the object
   */
  constructor(name, objectOrObjects, paramInfo) {
    // simple declarations of defaults so we can easily identify members
    /** @type {Array<THREE.Object3D>} */
    this.objects = [];
    /** @type {Array<Object>} */
    this.params = [];
    /** @type {String} */
    this.name = name;

    /** A flag for if this object is ridable - if so, it should be a specific THREE object to
     * parent the object to */
    /** @type {THREE.Object3D} */
    this.rideable = undefined;

    /** the unique ID is a number (non-zero) that comes from the world - set by GrWorld.add*/
    /** @type {Number} */
    this.id = 0;

    /** a flag as to whether this object should be "highlighted" as special - use by the UI */
    /**  @type {Boolean} */
    this.highlighted = false;

    // set up the object list
    if (Array.isArray(objectOrObjects)) {
      // we were given a list - do a deep copy
      const objList = this.objects; // deal with the non-lexical this
      objectOrObjects.forEach(function(obj) {
        objList.push(obj);
      });
    } else {
      // if there is 1 object (there might be zero)
      if (objectOrObjects) {
        this.objects.push(objectOrObjects);
      }
    }

    // set up the parameters
    // we allow specifying parameters in many different ways
    // we always convert to lightweight objects
    if (paramInfo) {
      // Totally OK to have none
      const self = this;
      paramInfo.forEach(function(param) {
        // default values for the parameter in case we don't get any
        const paramObj = paramObjFromParam(param);
        self.params.push(paramObj);
      });
    }
  }

  // methods that must be over-ridden
  /**
   * Advance the object by an amount of time. Time only flows forward
   * so use this to figure out how fast things should move.
   * In theory, it is always a "step" (1/60th of a second)
   * In the past, so many things were stochastic and only computed the
   * delta, that this became the norm (if you need to accumulate time
   * you can sum the delta)
   * time of day is provided so you can make objects that change over the
   * course of the day - it is a number between 0-24 (midnight->midnight)
   * it does not necessarily change smoothly.
   * Delta is intended to be in "milliseconds" - but it is scaled by the current
   * "speed" (and will be zero if time is stopped).
   * @param {number} delta
   * @param {number} timeOfDay
   */
  stepWorld(delta, timeOfDay) {
    // by default (base class), does nothing
  }

  /**
   * set the parameter values to new values
   * this gets called when the sliders are moved
   * @param {Array<Number>} paramValues
   */
  update(paramValues) {}

  /**
   * return a plausible lookfrom/lookat pair to look at this object
   * this makes a guess based on the bounding box, but an object may
   * want to override to give a better view
   *
   * Returns an array of 6 numbers (lookfrom X,Y,Z, lookat X, Y, Z)
   *
   * @returns {Array<Number>}
   */
  lookFromLookAt() {
    const bbox = new T.Box3();
    bbox.setFromObject(this.objects[0]);
    const x = (bbox.max.x + bbox.min.x) / 2;
    const y = (bbox.max.y + bbox.min.y) / 2;
    const z = (bbox.max.z + bbox.min.z) / 2;

    // make the box a little bigger to deal with think/small objects
    const dx = bbox.max.x - x + 0.05;
    const dy = bbox.max.y - y + 0.05;
    const dz = bbox.max.z - z + 0.05;

    const d = Math.max(dx, dy, dz);

    const fx = x + d * 3;
    const fy = y + d * 3;
    const fz = z + d * 3;

    return [fx, fy, fz, x, y, z];
  }

  /**
   * helper method - set the scale of the objects 
   * note: this sets the scale of all the root level objects
   * it doesn't consider what was already there
   * also, it is only a uniform method
   * 
   * @param {number} scale=1.0
   * @param {number} sy=0
   * @param {number} sz=0
   */
  setScale(scale = 1.0, sy = 0, sz = 0) {
    const syy = sy || scale;
    const szz = sz || scale;
    this.objects.forEach(e => e.scale.set(scale, syy, szz));
  }

  /**
   * set the position of each (root level) object
   * 
   * @param {number} x 
   * @param {number} y 
   * @param {number} z 
   */
  setPos(x = 0, y = 0, z = 0) {
    this.objects.forEach(e => e.position.set(x,y,z));
  }
}
