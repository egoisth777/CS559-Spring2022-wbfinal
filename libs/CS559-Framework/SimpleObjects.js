/*jshint esversion: 11 */
// @ts-check

/**
 *
 * CS559 3D World Framework Code
 *
 * Simple Example Objects - they don't do much, but for convenience they
 * provide wrappers around THREE objects
 *
 * @module SimpleObjects
 */

// we need to have the BaseClass definition
import { GrObject } from "./GrObject.js";
import * as T from "../CS559-Three/build/three.module.js";

let simpleObjectCounter = 0;

/**
 * we pass a set of properties to a cube to allow for flexible parameters
 *
 * @typedef CubeProperties
 * @type {object}
 * @property {THREE.Material} [material]
 * @property {string | number} [color]
 * @property {number} [x=0]
 * @property {number} [y=0]
 * @property {number} [z=0]
 * @property {number} [size=1]
 * @property {number} [widthSegments=8] - only for Sphere, Cone, Cylinder
 * @property {number} [heightSegments=6] - only for Sphere
 */

/**
 * A simple GrObject: A cube - allows for setting various parameters as parameters
 */
export class GrCube extends GrObject {
  /**
   * @param {CubeProperties} params
   * @param {Array<string|Array>} [paramInfo] - parameters for the GrObject (for sliders)
   */
  constructor(params = {}, paramInfo = []) {

    const material = params.material ?? new T.MeshStandardMaterial({ color: params.color ?? '#FF8888' });
    const size = params.size ?? 1;
    const geometry = new T.BoxGeometry(
      size, 
      size, 
      size,
      params.widthSegments ?? 1,
      params.heightSegments ?? 1
    );

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    const mesh = new T.Mesh(geometry, material);
    super(`Cube-${simpleObjectCounter++}`, mesh, paramInfo);

    // put the object in its place
    mesh.position.x = Number(params.x) || 0;
    mesh.position.y = Number(params.y) || 0;
    mesh.position.z = Number(params.z) || 0;
  }
}

/**
 * A simple object: A sphere (not it uses the CubeParams, since they apply as well)
 */
export class GrSphere extends GrObject {
  /**
   * @param {CubeProperties} params
   * @param {Array<string|Array>} [paramInfo] - parameters for the GrObject (for sliders)
   */
  constructor(params = {}, paramInfo = []) {

    const material = params.material ?? new T.MeshStandardMaterial({ color: params.color ?? '#FF8888' });
    const radius = (params.size / 2.0) || 1.0
    const geometry = new T.SphereBufferGeometry(
      radius,
      params.widthSegments ?? 8,
      params.heightSegments ?? 6
    );

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    const mesh = new T.Mesh(geometry, material);
    super(`Sphere-${simpleObjectCounter++}`, mesh, paramInfo);

    // put the object in its place
    mesh.position.x = Number(params.x) || 0;
    mesh.position.y = Number(params.y) || 0;
    mesh.position.z = Number(params.z) || 0;
    
    this.mesh = mesh;
  }
  
  /**
   * Update the geometry of the sphere to change its level of complexity
   * 
   * @param {number} [widthSegments] - number of horizontal segments
   * @param {number} [heightSegments] - number of vertical segments
   */
  setSegmentation(widthSegments, heightSegments) {
    this.mesh.geometry = new T.SphereBufferGeometry(this.mesh.geometry.parameters.radius, widthSegments, heightSegments);
  }
}


export class GrSquareSign extends GrObject {
    /**
     * A flat "sign" square - this uses the built in THREE PlaneGeometry
     * to make equivalent to other objects, we put zero in the center and
     * use size for radius
     * 
     * @param {Object} [params]
     * @param {string | number} [params.color]
     * @param {THREE.Texture} [params.map]
     * @param {THREE.Material} [params.material]
     * @param {number} [params.x]
     * @param {number} [params.y]
     * @param {number} [params.z]
     * @param {number} [params.size]
     * @param {Array<string|Array>} [paramInfo ]
     */
    constructor(params = {}, paramInfo = []) {
      const materialProps = {
        side: T.DoubleSide,
        color: params.color ?? 0xff8888,
      } 
      if (params.map) materialProps.map = params.map;
      const material = params.material ?? new T.MeshStandardMaterial(materialProps)
      const size = params.size ?? 0.5;
      const geometry = new T.PlaneBufferGeometry(size*2, size*2);
      
  
      // note that we have to make the Object3D before we can call
      // super and we have to call super before we can use this
      const mesh = new T.Mesh(geometry, material);
      super(`SquareSign-${simpleObjectCounter++}`, mesh, paramInfo);
  
      // put the object in its place
      mesh.position.x = Number(params.x) || 0 - size;
      mesh.position.y = Number(params.y) || 0 - size;
      mesh.position.z = Number(params.z) || 0;
      
      this.mesh = mesh;
    }
  }
  
  export class OldGrSquareSign extends GrObject {
    /**
     * A version of GrSquareSign that makes two independent triangles
     * In some cases, this was preferred, but I don't remember why
     * 
     * @param {Object} [params]
     * @param {string | number} [params.color]
     * @param {THREE.Texture} [params.map]
     * @param {THREE.Material} [params.material]
     * @param {number} [params.x]
     * @param {number} [params.y]
     * @param {number} [params.z]
     * @param {number} [params.size]
     * @param {Array<string|Array>} [paramInfo ]
     */
    constructor(params = {}, paramInfo = []) {
      // make a square out of triangles
      const size = params.size ?? 0.5;
      const geometry = new T.BufferGeometry();
      // set vertices
      const vertices = new Float32Array([
        -size, -size, 0,
        size, -size, 0,
        -size, size, 0,
  
        size, -size, 0,
        size, size, 0,
        -size, size, 0,
      ]);
      geometry.setAttribute('position', new T.BufferAttribute(vertices, 3))
      geometry.computeVertexNormals();
      // set uv grid
      const uvs = new Float32Array([
        0, 0,
        1, 0,
        0, 1,
  
        1, 0,
        1, 1,
        0, 1
      ]);
      geometry.setAttribute('uv', new T.BufferAttribute(uvs, 2));
      // uv.needsUpdate = true;
  
      const materialProps = {
        side: T.DoubleSide,
        color: params.color ?? 0xffffff,
      } 
      if (params.map) materialProps.map = params.map;
      const material = params.material ?? new T.MeshStandardMaterial(materialProps)
  
      const mesh = new T.Mesh(geometry, material);
      super(`SquareSign-${simpleObjectCounter++}`, mesh, paramInfo);
  
      // put the object in its place
      mesh.position.x = Number(params.x) || 0;
      mesh.position.y = Number(params.y) || 0;
      mesh.position.z = Number(params.z) || 0;
    }
  }
  
/**
 * A "simple" object (TorusKnot) - this is built into THREE, so the code here is simple,
 * but the object itself has non-simple appearance
 */
export class GrTorusKnot extends GrObject {
  /**
   * @param {Object} [params]
   * @param {string | number} [params.color]
   * @param {THREE.Material} [params.material]
   * @param {number} [params.x]
   * @param {number} [params.y]
   * @param {number} [params.z]
   * @param {number} [params.size]
   * @param {Array<string|Array>} [paramInfo] - parameters for the GrObject (for sliders)
   */
  constructor(params = {}, paramInfo = []) {
    const material = params.material ?? new T.MeshStandardMaterial({ color: params.color ?? '#FF8888' });
    const geometry = new T.TorusKnotBufferGeometry();

    // note that we have to make the Object3D before we can call
    // super and we have to call super before we can use this
    const mesh = new T.Mesh(geometry, material);
    super(`TorusKnot-${simpleObjectCounter++}`, mesh, paramInfo);

    // put the object in its place
    mesh.position.x = Number(params.x) || 0;
    mesh.position.y = Number(params.y) || 0;
    mesh.position.z = Number(params.z) || 0;

    // set size by scaling
    const size = params.size || 1.0;
    mesh.scale.set(size, size, size);
  }
}

/**
 * A "simple" object - a group
 * Remember that the framework doesn't actually handle hierarchy - you add THREE Object3D to the group
 */
export class GrGroup extends GrObject {
  /**
   * @param {Object} [params]
   * @param {number} [params.x]
   * @param {number} [params.y]
   * @param {number} [params.z]
   * @param {Array<string|Array>} [paramInfo] - parameters for the GrObject (for sliders)
   */
  constructor(params = {}, paramInfo = []) {
    const group = new T.Group();
    super(`Group-${simpleObjectCounter++}`, group, paramInfo);

    // put the object in its place
    group.position.x = Number(params.x) || 0;
    group.position.y = Number(params.y) || 0;
    group.position.z = Number(params.z) || 0;
  }
  /**
   * Add an Object3D to the group (not a GrObject!)
   *
   * @param {T.Object3D} obj
   */
  add(obj) {
    this.objects[0].add(obj);
  }
}

export class GrCylinder extends GrObject {
    /**
     * 
     * @param {*} params 
     * @param {Array<string|Array>} [paramInfo]
     */
    constructor(params = {}, paramInfo = []) {
        const material = params.material ?? new T.MeshStandardMaterial({ color: params.color ?? '#FF8888' });
        const radius = params.radius ?? 1;
        const geometry = new T.CylinderBufferGeometry(
          params.top ?? radius,
          params.bottom ?? radius,
          params.height ?? 1.0,
          params.widthSegments ?? 8,
          params.heightSegments ?? 6
        )
        
        // note that we have to make the Object3D before we can call
        // super and we have to call super before we can use this
        const mesh = new T.Mesh(geometry, material);
        super(`Sphere-${simpleObjectCounter++}`, mesh, paramInfo);

        // put the object in its place
        mesh.position.x = Number(params.x) || 0;
        mesh.position.y = Number(params.y) || 0;
        mesh.position.z = Number(params.z) || 0;
    }
}

export class GrCone extends GrObject {
    /**
     * 
     * @param {*} params 
     * @param {Array<string|Array>} [paramInfo]
     */
    constructor(params = {}, paramInfo = []) {
        const material = params.material ?? new T.MeshStandardMaterial({ color: params.color ?? '#FF8888' });
        const radius = params.radius ?? 1;
        const geometry = new T.ConeBufferGeometry(
          radius,
          params.height ?? 1.0,
          params.widthSegments ?? 8,
          params.heightSegments ?? 6
        )
        
        // note that we have to make the Object3D before we can call
        // super and we have to call super before we can use this
        const mesh = new T.Mesh(geometry, material);
        super(`Sphere-${simpleObjectCounter++}`, mesh, paramInfo);

        // put the object in its place
        mesh.position.x = Number(params.x) || 0;
        mesh.position.y = Number(params.y) || 0;
        mesh.position.z = Number(params.z) || 0;
    }
}

