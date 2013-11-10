varying vec4 enterPoint;

void main ()
{
	enterPoint = gl_Vertex;
  //gl_Position = ftransform();
	gl_Position = gl_ModelViewProjectionMatrix * enterPoint;
}
