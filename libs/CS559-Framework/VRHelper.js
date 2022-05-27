/*jshint esversion: 11 */
// @ts-check

/**
 * CS559 3D World Framework Code
 *
 * Enables entering VR in a GrWorld by clicking the "Enter VR" button.  
 * Includes basic flight mechanics using the VR controller.
 * 
 * @module VRHelper 
 * */

import { XRControllerModelFactory } from '../CS559-Three/examples/jsm/webxr/XRControllerModelFactory.js';
import { VRButton } from '../CS559-Three/examples/jsm/webxr/VRButton.js';
import * as T from "../CS559-Three/build/three.module.js";

/** @class VRHelper
 * 
 * Enables entering VR in a GrWorld by clicking the "Enter VR" button.  
 * Includes basic flight mechanics using the VR controller.
 * 
 */
export class VRHelper {

    /**
     * @param {Object} params
     * @property params.renderer
     * @property params.scene
     * @property params.camera
     * @property {Number} params.flightSpeed
     * 
     */
    constructor(params = {}) {

        this.renderer = params.renderer;
        this.scene = params.scene;
        this.camera = params.camera;

        this.speed = params.flightSpeed ?? 10;

        this.clock = new T.Clock();
        this.flightDir = null;

        this.renderer.xr.enabled = true;
        document.body.appendChild(VRButton.createButton(this.renderer))

        // right controller
        this.controller = this.renderer.xr.getControllerGrip(0);

        // add controller model to the scene
        // const controllerModelFactory = new XRControllerModelFactory();
        // const model1 = controllerModelFactory.createControllerModel(this.controller1);
        // this.controller1.add(model1);

        this.cameraGroup = new T.Group()
        this.cameraGroup.add(this.camera)
        this.cameraGroup.add(this.controller)
        this.scene.add(this.cameraGroup)

        // squeeze button is used to fly forwards
        this.controller.addEventListener('squeezestart', () => {
            // direction the camera is facing
            const dir = this.renderer.xr.getCamera(this.camera).getWorldDirection(new T.Vector3(0,0,0));
            this.flightDir = dir.normalize();
        })     

        this.controller.addEventListener('squeezeend', () => {
            this.flightDir = null;
        }) 

        // select button is used to fly backwards
        this.controller.addEventListener('selectstart', () => {
            // opposite of the direction the camera is facing
            const dir = this.renderer.xr.getCamera(this.camera).getWorldDirection(new T.Vector3(0,0,0)).multiplyScalar(-1);
            this.flightDir = dir.normalize();
        })

        this.controller.addEventListener('selectend', () => {
            this.flightDir = null;
        })
    }    

    /**
     * Updates and adds flight vector to current position
     */
    update() {
        const delta = this.clock.getDelta();
        // don't fly if flight direction is null
        if (this.flightDir) {
            this.cameraGroup.position.addScaledVector(this.flightDir, this.speed * delta);
        }
    }

}