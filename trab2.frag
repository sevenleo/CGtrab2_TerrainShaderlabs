uniform sampler2D sampler2d0; //altura
uniform sampler2D sampler2d1; //textura
uniform sampler2D sampler2d2; //agua


varying vec4 enterPoint;

int nSteps = 200;
float profundidade = -0.25;
float niveldoMar = 0.15;
float smallSteps = 0.1;
float range = 0.01; 




//  converte a applicacao da textura de [-1,1] para [0,1]
vec2 texCoord(vec2 p)
{
	return (p + vec2(1.0))/2.0;
}




//retorna a 'altura' (z) do mapa para aquele ponto
float height(vec3 p) 
{
 return texture2D(sampler2d0, texCoord(p.xy)).z;

}


vec3 normal(vec3 p) {
	return texture2D(sampler2d2, texCoord(p.xy)).rgb;
}


//retorna a cor da textura para aquele ponto
vec3 color(vec3 p) 
{
  return texture2D(sampler2d1, texCoord(p.xy)).rgb;   //ESTAVA COM ERRO return texture2D(sampler2d1, texCoord(p.xy));
}






void main()
{

	vec4 camP = ((gl_ModelViewMatrixInverse * vec4(0.0,0.0,0.0,1.0)));

	vec3 p = enterPoint.xyz;
//	if ( height(p) < 0.5 ) discard; //descatar regioes baixas


	
	vec3 traceDir = normalize(p - camP.xyz); //calcula o vetor unitario de direcao entre a camera e o ponto

	
	vec3 stepTrace = range*traceDir;
    p.z = 1.0;

   stepTrace.z /= profundidade;



    for (int i=0; i<nSteps; i++)
    {
			

      if (p.x > 1.0 || p.x < -1.0)
        discard;
      if (p.y > 1.0 || p.y < -1.0)
        discard;
      if (height(p)>=p.z){
					range=range*0.1;
					stepTrace = range*traceDir;
			   stepTrace.z /= profundidade;
					smallSteps = (nSteps - i)*smallSteps; //passos que sobraram divididos por uma quantidade arbitraria para manter o desempenho do porecessaor e da GPU
					for (int j=0; j<smallSteps; j++) 
					{
						p -= stepTrace;
     				if (height(p)<= p.z) break;
					}
	       break;
			 }
      p += stepTrace; //reduz p, visto que a camera esta no alto
			
			
    }


if (enterPoint.z < height(p)){ gl_FragColor.a = 1.0;}
else { gl_FragColor.a = 0.0;  }
//  	gl_FragColor.a = 1.0;
gl_FragColor.rgb = color(p) * dot(traceDir, normal(p));//		gl_FragColor.rgb = color(p);

	/*	if (enterPoint.z < 0.9999999){ 
			gl_FragColor.a = 0.0; 
			enterPoint.z -=0.5;
			return; 
		}*/



		
}
