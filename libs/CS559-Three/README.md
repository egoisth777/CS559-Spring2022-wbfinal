# CS559-Three -  a version of the THREE.js library for CS559 Workbooks

**This is the Spring22 version!**

These files are taken from the THREE distribution. 

They are the pieces that are required for the CS559 workbooks. This is the minimum.
If you want other things (like the sources or the documentations or examples), download the entire three package.

This archive was created by downloading three.js-master on January 14, 2022.
It is THREE version **137**.

The choices of files are based on last year (which might not be an informed choice).

What's here (all copied from the THREE distribution):
1. The Three README.md and LICENSE files (renamed)
1. `build/three.module.js`
1. the src folder (mainly to get the typing information)
1. some of the examples (not all of them) - all from the jsm folder
    - controls (in the past, it was a subset - this year I included more)
    - curves
    - libs
    - loaders
    - webxr
1. the fonts (just the json for helvetiker) - this was added later in the semester

## Type Information

The `build/types` folder is copied from this [repository](https://github.com/three-types/three-ts-types). For future updates, replace the contents of `build/types` with the contents in [this](https://github.com/three-types/three-ts-types/tree/master/types/three) folder.
