/*jshint esversion: 6 */
// @ts-check

/*
 * Graphics Town Example Objects
 *
 * Morph: an example of morph target animation
 *
 * Some caveats:
 * - don't forget to enable morphing (for positions and normals) in the material!
 * - set up morph targets using Geometry (simple data structure) and then convert
 *      to "BufferGeometry"
 * - morph normals seem to have a different form than the documentation suggests
 *      I just let "computeMorphNormals" take care of it
 * - the base mesh is always added to the morph targets - it is unclear what it's
 *      weight/influence is (I think its 1-sum(influences)). so in the example,
 *      the influence of the target is 1, the base is 0
 * 
 * Warning: this was written long ago using "old fashioned geometry" and hasn't 
 * really been converted to the new era of "buffer geometry only"
 */

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { Geometry, Face3 } from "../libs/CS559-Three/examples/jsm/deprecated/Geometry.js";

let mtTexture = null;

class SphereRealGeometry extends Geometry {

	constructor( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ) {

		super();
		this.type = 'SphereGeometry';

		this.parameters = {
			radius: radius,
			widthSegments: widthSegments,
			heightSegments: heightSegments,
			phiStart: phiStart,
			phiLength: phiLength,
			thetaStart: thetaStart,
			thetaLength: thetaLength
		};

		this.fromBufferGeometry( new T.SphereBufferGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength ) );
		this.mergeVertices();

	}

}

export class MorphTest extends GrObject {
  /**
   *
   * @param {Object} params
   */
  constructor(params = {}) {
    let radius = params.r || 1.0;

    if (!mtTexture) {
      let loader = new T.TextureLoader();
      mtTexture = loader.load("../examples/4x4.png");
    }
    // getting the UV is hard since they are in faces!
    let material = new T.MeshStandardMaterial({
      map: mtTexture,
      morphTargets: true,
      morphNormals: true,
    });

    // the initial shape is a sphere - which makes for weird UVs
    let geometry = new SphereRealGeometry(radius);

    // set up morph targets
    // set up a morph target - the first morph target is flat
    // we let the x,y position be the u,v coordinate (so the sphere "unwraps")
    // getting the UV is hard since they are in faces!
    let morphVerts = [];
    // make an empty array of positions
    geometry.vertices.forEach((element) => {
      morphVerts.push(new T.Vector3(0, 0, 0));
    });
    // now go through the faces and copy the UVs for each vertex
    for (let i = 0; i < geometry.faces.length; i++) {
      // each vertex on the face
      let v = geometry.faces[i].a;
      morphVerts[geometry.faces[i].a].x =
        geometry.faceVertexUvs[0][i][0].x * radius * 2;
      morphVerts[geometry.faces[i].a].y =
        geometry.faceVertexUvs[0][i][0].y * radius * 2;
      morphVerts[geometry.faces[i].b].x =
        geometry.faceVertexUvs[0][i][1].x * radius * 2;
      morphVerts[geometry.faces[i].b].y =
        geometry.faceVertexUvs[0][i][1].y * radius * 2;
      morphVerts[geometry.faces[i].c].x =
        geometry.faceVertexUvs[0][i][2].x * radius * 2;
      morphVerts[geometry.faces[i].c].y =
        geometry.faceVertexUvs[0][i][2].y * radius * 2;
    }
    // make the morph target given the vertex positions
    geometry.morphTargets.push({ name: "flat", vertices: morphVerts });
    geometry.computeMorphNormals();

    // Morphing only works with Buffer Geometries
    // let bgeometry = new T.BufferGeometry().fromGeometry(geometry);
    let bgeometry = geometry.toBufferGeometry();
    let mesh = new T.Mesh(bgeometry, material);

    super("MorphTest", mesh);
    mesh.position.x = params.x || 0;
    mesh.position.y = params.y || 0;
    mesh.position.z = params.z || 0;
    this.mesh = mesh;

    // set up the controls vector
    this.mesh.updateMorphTargets();

    this.time = 0;
  }
  stepWorld(delta, timeOfDay) {
    this.time += delta / 1000;
    // we do cos^2 since it causes things to dwell at the ends (looks better than abs)
    this.mesh.morphTargetInfluences[0] =
      Math.cos(this.time) * Math.cos(this.time);
  }
}
