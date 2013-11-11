uniform sampler2D sampler2d0; //altura
uniform sampler2D sampler2d1; //textura
uniform sampler2D sampler2d2; //normal
uniform sampler2D sampler2d3; //regras de escolha de textura
uniform sampler2D sampler2d4; //agua
uniform sampler2D sampler2d5; //agua normal
uniform sampler2D sampler2d6; //neve
uniform sampler2D sampler2d7; //neve normal

varying vec4 enterPoint;



int nSteps = 200;
float profundidade = 0.25;
float extremo = 0.9999999;



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

//retorna a normal do mapa para aquele ponto
vec3 normal(vec3 p) {
	return texture2D(sampler2d2, texCoord(p.xy)).rgb;
}


//retorna a cor da textura para aquele ponto
vec3 color(vec3 p) 
{
  return texture2D(sampler2d1, texCoord(p.xy)).rgb; 
}


vec3 escolheTextura(vec3 p) {
	return texture2D(sampler2d3, texCoord(p.xy)).rgb;
}





















void main()
{
	
	vec4 camP = ((gl_ModelViewMatrixInverse * vec4(0.0,0.0,0.0,1.0)));

	vec3 p = enterPoint.xyz;

	if (enterPoint.z < height(p))discard;







	
	vec3 traceDir = normalize(p - camP.xyz); //calcula o vetor unitario de direcao entre a camera e o ponto
float angulo = dot(traceDir, ( gl_ModelViewMatrix * vec4(0.0,1.0,0.0,1.0)).xyz);  
	nSteps = (nSteps * angulo) + 1;
	//float angulo = dot(traceDir, vec3(0.0,0.0,1.0));  //BALANCEAMENTO DE PASSOS
	//nSteps = ((nSteps * angulo) + 1);

	float range = 1.74 / nSteps; //1.74 é a raiz de 3, que é a diagonal do cubo (maior tamanho de raio possível) 

	vec3 stepTrace = range*traceDir;
  p.z = 1.0;

 	stepTrace.z /= profundidade;



    for (int i=0; i<nSteps; i++)
    {
                        

      if (p.x > extremo || p.x < -extremo)
        discard;
      if (p.y > extremo || p.y < -extremo)
        discard;
      if (height(p)>=p.z){ //Encostou no terreno
					
					for (int j = 0; j < 10; j++) { //busca binaria
						if (height(p) > p.z && range > 0) 
							range = -range;
						else if (height(p) < p.z && range < 0) 
							range = -range;
						else if (height(p) == p.z) break;
						range /=2;
						stepTrace = range * traceDir;
						p += stepTrace;
							
					}
         break;
      }
      p += stepTrace; //reduz p, visto que a camera esta no alto
                        
                        
    }

	vec4 lightDir = gl_ModelViewMatrix * gl_LightSource[0].position;



	//regras //
	vec3 mapaTextura = escolheTextura(p);

	//nao desenhar regioes pretas
	
	if ( mapaTextura == vec3(0.0,0.0,0.0) ) {
			gl_FragColor.a = .0;
	}



	else //if ( mapaTextura == vec3(1.0,0.0,0.0) || mapaTextura == vec3(1.0,1.0,1.0) || mapaTextura == vec3(0.0,0.0,1.0)) 
	{
 			gl_FragColor.a = 1.0;
			gl_FragColor.rgb = color(p) * dot((normalize(lightDir.xyz - p)), normal(p) ) ;


			//agua
			if ( escolheTextura(p) == vec3(0.0,0.0,1.0) ) {
					vec3 watercolor = texture2D(sampler2d4, texCoord(p.xy)).rgb;
					vec3 waternormal = texture2D(sampler2d5, texCoord(p.xy)).rgb;
					gl_FragColor.rgb= watercolor* dot((normalize(lightDir.xyz - p)), waternormal ) ;		
					gl_FragColor.a = 0.7;
			}

			//neve
			if ( escolheTextura(p) == vec3(1.0,1.0,1.0) ) //neve
			{
						
						gl_FragColor.rgb = vec3(1.0,1.0,1.0) * dot((normalize(lightDir.xyz - p)), normal(p) ) ;
						gl_FragColor.a = 1.0;
						return;
			}

	}	




		
}
