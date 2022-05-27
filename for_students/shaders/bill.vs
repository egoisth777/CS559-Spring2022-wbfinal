// image texture shading - pretty boring in the
/* pass interpolated variables to the fragment */
varying vec2 v_uv;
varying vec3 vNormal;
varying vec3 vPositionNormal;

void main() {
    // pass the texture coordinate to the fragment, calculate the texture coordinate
    v_uv = uv;

    // Vectex Position, used to generate the z- information

    vNormal = normalize(normalMatrix * normal);
    vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
