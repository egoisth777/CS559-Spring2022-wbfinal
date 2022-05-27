/*jshint esversion: 11 */
// @ts-check

/**
 * CS559 3D World Framework Code
 *
 * Simple object behaviors that work by patching the objects
 *
 * @module SimpleBehaviors
 *  */

import * as T from "../CS559-Three/build/three.module.js";

// we need to have the BaseClass definition
import { GrObject } from "./GrObject.js";
/**
 * Simple spinning behavior as an example of how to create behaviors as functions
 * 
 * @param {GrObject} grobj
 * @param {number} [speed]
 */
export function spinY(grobj, speed) {
  const newSpeed = speed ?? 0.001;
  const oldStep = grobj.stepWorld;
  grobj.stepWorld = function(delta, timeOfDay) {
    this.objects.forEach(obj => obj.rotateY(newSpeed * delta));
    oldStep.call(this, delta, timeOfDay);
  };
  return grobj;
}
