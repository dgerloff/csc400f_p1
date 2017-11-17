var GlobalShaderObject = {
	colorful_vertex_shader :
	`#version 300 es\n 
	uniform mat4 modelview_matrix;
	uniform mat4 projection_matrix;
	in vec3 vertex_coordinates;
	in vec3 vertex_color;
	out vec3 color_out;
	void main(void)
	{
		gl_Position = projection_matrix * modelview_matrix * vec4(vertex_coordinates, 1.0);
		color_out = vertex_color;
	}`,
	
	colorful_fragment_shader : 
	`#version 300 es\n
	precision mediump float;
	in vec3 color_out;
	out vec4 color;
	void main(void)
	{
		color = vec4(color_out, 1.0);
	}`,

	solid_vertex_shader :
	`#version 300 es\n 
	uniform mat4 modelview_matrix;
	uniform mat4 projection_matrix;
	in vec3 vertex_coordinates;
	void main(void)
	{
		gl_Position = projection_matrix * modelview_matrix * vec4(vertex_coordinates, 1.0);
	}`,

	solid_fragment_shader :
	`#version 300 es\n
	precision mediump float;
	uniform vec3 u_color;
	out vec4 color;
	void main(void)
	{
		color = vec4(1,1,1, 1.0);
	}`
}