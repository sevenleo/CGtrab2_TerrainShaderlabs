uniform sampler2D sampler2d0;
uniform sampler2D sampler2d1;


varying vec4 enterPoint;

int nSteps = 200;
float profundidade = 0.25;

vec2 texCoord(vec2 p)
{
	return (p + vec2(1.0))/2.0;
}

float height(vec3 p)
{
 return texture2D(sampler2d0, texCoord(p.xy)).z;

}

vec3 color(vec3 p)
{
  return texture2D(sampler2d1, texCoord(p.xy));
}

void main()
{
	vec4 camP = ((gl_ModelViewMatrixInverse * vec4(0.0,0.0,0.0,1.0)));

	vec3 p = enterPoint.xyz;
//	if ( height(p) < 0.5 ) discard;
	
	vec3 traceDir = normalize(p - camP.xyz);
	float range = 0.01f;
	
	vec3 stepTrace = range*traceDir;
    p.z = 1.0;

   stepTrace.z /= profundidade;

    for (int i=0; i<200; i++)
    {
      if (p.x > 1.0 || p.x < -1.0)
        discard;
      if (p.y > 1.0 || p.y < -1.0)
        discard;
      if (height(p)>=p.z)
        break;
      p += stepTrace;
    }


	gl_FragColor.rgb = color(p);
  	gl_FragColor.a = 1.0;
}
