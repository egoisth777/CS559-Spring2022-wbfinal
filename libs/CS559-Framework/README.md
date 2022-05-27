# CS559 3D Framework (a.k.a. "Graphics Town")

**This is the Spring 22 Version of the Framework!**

This directory contains framework code to be used for the assignments for the
CS559 (Computer Graphics) class at the University of Wisconsin.

It provides a thin wrapper around the [THREE.JS](https://threejs.org/) library to make
it more convenient to do class assignments.

This is the 2022 version - based on the 2021 version, which started with the 2020 version, which was based on the 2019 re-write of the code.
There was a prior 2015 version (in "non-modern" JavaScript) that was used from 2015-2018.
There were even older versions in C++, beginning from 2000, with the last C++ version in 2014.

For 2022, the big change is that we switch to [THREE.JS](https://threejs.org/) r137 which was the latest version with available typing information when we had to commit to a version in class. Unlike the 2021 version, the new version of THREE deprecated old-style `Geometry` objects, so we have to switch everything to `BufferGeometry`.

The closest thing to a tutorial for the Framework code is the first workbook/assignment that uses it.
In the Spring 2021 class, this is Workbook 8, page 7.

If you want to read about the history of Graphics Town (prior to 2014) and see what the old C++ version was like, read [this](http://graphics.cs.wisc.edu/WP/cs559-fall2014/2014/11/07/project-2-graphics-town-framework-code/). If you want to see the original JavaScript framework, you can look [here](http://graphics.cs.wisc.edu/WP/cs559-fall2015/2015/10/15/project-program-group-2-graphics-town/) for a description. Yes, that really was all the documentation we gave to students.

**WARNING:** The documentation is created using JSDoc, and I am not a JSDoc expert. You should also read the code directly. There may also be version skew between the documentation and the code. Trust the code.

A version of the documentation is available on [GitHub Pages](https://cs559.github.io/CS559-Framework/). This is automatically built by GitHub (using continuous integration) and stored in a branch.

## What is this anyway?

The framework is some common code that sets up simple demos in that use [THREE.JS](https://threejs.org/).
It's main goal is to make it easier to get simple demos done. It takes care of the common things you need to 
put into every single demo you make, so you don't have to re-type it every time. The framework code allows you to focus on creating graphics objects and defining their behavior (for animation). You don’t need to worry about setting up a user interface, or the basic stuff of the world. It will give you “good enough” defaults that you can focus on the parts of the assignment you care about.

The main pieces that the Framework provides:

1. **A "World"** - `GrWorld` is the basic container of your world. It contains a THREE.js `Scene` and a `THREE.js` renderer. When you create the world, it takes care of setting up the Scene and Renderer (including putting the Canvas on the page). It creates some lights, cameras, and a groundplane. The `GrWorld` constructor takes a lot of parameters, so you can tweak things to your needs.

2. **Objects** - `GrObject` is a wrapper around THREE `Object3D` (or to be more precise, it can contain a list of them). It helps add a bit more functionality for objects, including animation, control panels, things for viewing, ...

3. **Control Panels** - `AutoUI` will automatically make control panels for your objects (so you can manipulate the sliders with parameters)

4. **Convenience Objects** - There is an OBJ loader, an FBX loader, and a shader loader - all things you could do yourself. The build in ones put temporary objects in place while the real objects load.

5. **Sample Objects** - for reference.

6. **An Animation Loop** - so you don't need to write it yourself (again).

None of this is complicated. Basically, the Framework takes care of doing a bunch of the boring stuff you need to do each time you make another small program. This lets us try things out quickly.

## What you really want to know

Most of the work that you will do (as a student) will be creating subclasses of `GrObject` to make new kinds of objects for the world. You should make sure you understand how `GrObject` works. You can see examples in `SimpleObjects` and `TestObjects`. Even more examples are provided with the assignments and the online demos given with lectures.

## Some important details

Because you need to have the objects when the `GrObject` is created, this can be a problem if you don't have the object immediately (for example, if you are loading an obj file). The best way to deal with this is to create a THREE `Group` object when the `GrObject` is created and then add the new object to the group. Even better: put a temporary object into the group, and replace it with the new object when it is loaded. Here is a simple example (using `sleep` rather than a real loader, but it's the same delayed execution thing). Beware of the non-lexical `this` (you can't use `this` in the deferred function). What this example does is create an Object that is a cube initially, but changes to a TorusKnot after 2 seconds.

```javascript
export class BetterDelayTest extends GrObject {
  constructor() {
    let group = new T.Group();
    super("Delay-Test", group);
    this.group = group;
    // make a cube that will be there temporarily
    let tempCube = new T.Mesh(
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
```

##  License

This library is provided under a 2-clause BSD open source license. 

From: https://opensource.org/licenses/BSD-2-Clause

Copyright &copy; 2021 Michael Gleicher

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.