# Graphics Town Example Objects

This is a directory of example objects for Graphics Town.

We don't necessarily expect students to use them, but you can if you want to.
They are more here so the world isn't totally empty.

Credits / Notes:

Most of these objects were taken from the Framework Demo code and from previous workbooks.

House - while the design is based on the original (circa 2000)
graphics town houses, these are newly created in 2019

    One thing to notice here: I use a single texture for the whole house so it can
    be one mesh.

Track / Cube / Car:
A simple example of a track (circular) and vehicles that go around it.
Notice how the track is used by the vehicles to figure out how to move.

    The car is loaded from an FBX file (attribution in that directory).
    But notice how I put the riding point above the car
    (so you don't have your eyes on the road literally).

    The Race Car FBX come from open game art https://opengameart.org/content/lowpoly-racecar
    It is provided with a CC0 license, so I can use it. 
    I converted it to FBX format using Blender.


Helicopter:
A simple example in terms of geometry, but a more complex behavior.
This is adapted (but re-written) from the 2015 assignment.

ShinySculpture:
A simple example of a floating, shiny sphere that has a dynamic environment
map. It is ridiculously simple to implement since THREE takes care of all
of the hard parts.

Morph:
Simple examples of using vertex/mesh morphing.
