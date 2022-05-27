/*jshint esversion: 11 */
// @ts-check

/**
 * Access to THREE's loaders within the CS559 framework
 * 
 * @module loaders
 */

import * as T from "../CS559-Three/build/three.module.js";
import { GrObject } from "./GrObject.js";
import { FBXLoader } from "../CS559-Three/examples/jsm/loaders/FBXLoader.js";
import { MTLLoader } from "../CS559-Three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "../CS559-Three/examples/jsm/loaders/OBJLoader.js";

/**
 * Rescale an object - assumes that the object is a group with 1 mesh in it
 *
 * @param {THREE.Object3D} obj
 */
function normObject(obj, scale = 1.0, center = true, ground = true) {
  // since other bounding box things aren't reliable
  const box = new T.Box3();
  box.setFromObject(obj);
  // easier than vector subtract
  const dx = box.max.x - box.min.x;
  const dy = box.max.y - box.min.y;
  const dz = box.max.z - box.min.z;
  const size = Math.max(dx, dy, dz);
  const s = scale / size;
  obj.scale.set(s, s, s);

  if (center) {
    obj.translateX((-s * (box.max.x + box.min.x)) / 2);
    obj.translateZ((-s * (box.max.z + box.min.z)) / 2);
    if (!ground) {
      // only center Y if not grounding
      obj.translateY((-s * (box.max.y + box.min.y)) / 2);
    }
  }
  if (ground) {
    obj.translateY(-box.min.y * s);
  }
}

/**
 * The loaders have optional callbacks that take a GrObject (not an Object3D!)
 * 
 * @callback LoaderCallback
 * @param {GrObject} object
 */

/**
 * A base class of GrObjects loaded from an OBJ file
 * note: this has to deal with the deferred loading
 *
 * Warning: While ObjLoader2 might be better, ObjLoader is simpler
 */
export class ObjGrObject extends GrObject {
  /**
   *
   * @param {Object} params
   * @property {string} params.obj
   * @property {string} [params.mtl]
   * @property {string} [params.name]
   * @property {Object} [params.mtloptions]
   * @property {Number} [params.norm] - normalize the object (make the largest dimension this value)
   * @property {Number} [params.x] - initial translate for the group
   * @property {Number} [params.y]
   * @property {Number} [params.z]
   * @property {LoaderCallback} [params.callback]
   */
  constructor(params = {}) {
    if (!params.obj) {
      alert("Bad OBJ object - no obj file given!");
      throw "No OBJ given!";
    }

    const name = params.name || `Objfile(${params.obj})`;
    const objholder = new T.Group();

    super(name, objholder);
    const self = this;

    // if there is a material, load it first, and then have that load the OBJ file
    if (params.mtl) {
      const mtloader = new MTLLoader();

      if (params.mtloptions) {
        mtloader.setMaterialOptions(params.mtloptions);
      }

      // note that the callback then calls the Obj Loader
      mtloader.load(params.mtl, function(myMaterialCreator) {
        myMaterialCreator.preload();

        const objLoader = new OBJLoader();
        objLoader.setMaterials(myMaterialCreator);
        
        objLoader.load(params.obj, function(obj) {
          if (params.norm) normObject(obj, params.norm);
          objholder.add(obj);
          if (params.callback) params.callback(self);
        });
      });

    } else {
      // no material file, just an obj
      const objLoader = new OBJLoader();

      objLoader.load(params.obj, function(obj) {
        if (params.norm) normObject(obj, params.norm);
        objholder.add(obj);
        if (params.callback) params.callback(self);
      });

    }
    objholder.translateX(Number(params.x) || 0);
    objholder.translateY(Number(params.y) || 0);
    objholder.translateZ(Number(params.z) || 0);
  }
}

/** 
 * load from an FBX file - this is quite simple 
 * it makes a group so it can stick the FBX object in once
 * it is loaded
 * */
export class FbxGrObject extends GrObject {
  /**
   *
   * @param {Object} [params]
   * @property {string} params.fbx
   * @property {Number} [params.norm] - normalize the object (make the largest dimension this value)
   * @property {Number} [params.x] - initial translate for the group
   * @property {Number} [params.y]
   * @property {Number} [params.z]
   * @property {String} [params.name]
   * @property {LoaderCallback} [params.callback]
   */
  constructor(params = {}) {
    const name = params.name || `FBXfile(${params.fbx})`;
    const objholder = new T.Group();
    super(name, objholder);
    const self = this;

    const fbx = new FBXLoader();
    
    fbx.load(params.fbx, function(obj) {
      if (params.norm) normObject(obj, params.norm);
      objholder.add(obj);
      if (params.callback) params.callback(self);
    });

    objholder.translateX(Number(params.x) || 0);
    objholder.translateY(Number(params.y) || 0);
    objholder.translateZ(Number(params.z) || 0);
  }
}
