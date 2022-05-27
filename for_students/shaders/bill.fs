    // declare the varying variable that gets passed to the fragment shader
    varying vec2 v_uv;

    // Uniforms to glow
    uniform float blow;
    uniform float power;
    uniform float shin;
    uniform float tensifyr;
    uniform float tensifyg;
    uniform float tensifyb;
    varying vec3 vNormal;
    varying vec3 vPositionNormal;
    uniform bool r1;
    uniform bool g1;
    uniform bool b1;


    // get the texture from the program
    uniform sampler2D tex;

void main(){

    float r = float(texture2D(tex, v_uv).x);
    float g = float(texture2D(tex, v_uv).x);
    float b = float(texture2D(tex, v_uv).x);
    if(r1){
         r = float(texture2D(tex, v_uv).x) * tensifyr;
    }
    if(g1){
         g = float(texture2D(tex, v_uv).y) * tensifyg;
    }
    if(b1){
        b = float(texture2D(tex, v_uv).z) * tensifyb;
    }


    float a = pow( blow + shin * abs(dot(vNormal, vPositionNormal)), power ); // The Generated Position Information
    gl_FragColor = vec4(r, g, b, a);
}

