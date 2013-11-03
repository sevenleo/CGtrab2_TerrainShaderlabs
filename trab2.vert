varying vec4 enterPoint;

void main ()
{
	enterPoint = gl_Vertex;
	gl_Position = ftransform();
}
