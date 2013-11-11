uniform sampler2D sampler2d0; //altura
uniform sampler2D sampler2d1; //textura
uniform sampler2D sampler2d2; //normal
uniform sampler2D sampler2d3; //regras de escolha de textura


varying vec4 enterPoint;

int nSteps = 200;
float profundidade = 0.5;
float niveldoMar = 0.15;
float smallSteps = 10;
float range;
float diagonaldocubo = 1.74; // raizde3
float extremidade = 0.9999999; //como é um cuboas extriidades sao todas nos pontos 1 e -1




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


//retorna a cor da textura para aquele ponto
vec3 color(vec3 p) 
{
  return texture2D(sampler2d1, texCoord(p.xy)).rgb;   
}


vec3 normal(vec3 p) {
	return texture2D(sampler2d2, texCoord(p.xy)).rgb;
}


vec3 escolheTextura(vec3 p) {
	return texture2D(sampler2d3, texCoord(p.xy)).rgb;
}











void main(){

			vec4 camP = ((gl_ModelViewMatrixInverse * vec4(0.0,0.0,0.0,1.0)));
			vec3 p = enterPoint.xyz;

			//descartar pontos abaixo do mapa de altura
			if (enterPoint.z < height(p)) discard; 

			//nao desenhar regioes pretas
		//	if ( escolheTextura(p) == vec3(0.0,0.0,0.0) ) discard; 
						
			
			
			//agua
/*
			 if ( escolheTextura(p) == vec3(0.0,0.0,1.0) ) 
			{

						gl_FragColor.rgb = vec3(0.0,0.0,1.0);
						gl_FragColor.a = 0.5;

			}*/


			//desenhar normalmente
			 if ( escolheTextura(p) == vec3(1.0,0.0,0.0) ) 
			{

					range = diagonaldocubo / nSteps;

					//calcula o vetor unitario de direcao entre a camera e o ponto
					vec3 traceDir = normalize(p - camP.xyz); 

					
					vec3 stepTrace = range*traceDir;
							p.z = 1.0;

							stepTrace.z /= profundidade;



					for (int i=0; i<nSteps; i++)
					{
										

						  if (p.x > extremidade || p.x < -extremidade)   discard;
						  if (p.y > extremidade || p.y < -extremidade)   discard;

						  if (height(p)>=p.z){
									range=range/smallSteps;
									stepTrace = range*traceDir;
								for (int j=0; j<smallSteps; j++) 
									{
								 p -= stepTrace;
								 if (height(p)<= p.z) break;
								  }
							  
						  }
						  p += stepTrace; //reduz p, visto que a camera esta no alto
								
								
				}



				//neve
				if ( escolheTextura(p) == vec3(1.0,1.0,1.0) ) //neve
				{
						gl_FragColor.rgb = vec3(1.0,1.0,1.0);
						gl_FragColor.a = 1.0;
						return;
				}

				//agua
			 if ( escolheTextura(p) == vec3(0.0,0.0,1.0) ) 
			{
						p.z=1.0;
						gl_FragColor.rgb = vec3(0.0,0.0,1.0);
						gl_FragColor.a = 0.5;
						return;

			}

				vec4 lightDir = normalize(gl_ModelViewMatrix * gl_LightSource[0].position);
				gl_FragColor.rgb = color(p) * dot(lightDir.xyz, normal(p) ) ;
				gl_FragColor.a = 1.0;


			}



          
}