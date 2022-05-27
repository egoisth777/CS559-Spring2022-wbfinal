    uniform vec3 glowColor;
    uniform float blow;
    uniform float power;
    uniform float shin;
    varying vec3 vNormal;
    varying vec3 vPositionNormal;
    void main()
    {
        float a = pow( blow + shin * abs(dot(vNormal, vPositionNormal)), power );
        gl_FragColor = vec4( glowColor, a );
    }