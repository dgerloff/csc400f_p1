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
	}`,
	// phong_vertex_shader :
	// `#version 300 es\n
	// precision mediump float;

	// in vec3 a_vertices;
	// in vec3 a_normals;
	// in vec2 a_tcoords;

	// uniform mat4 modelview_matrix;
	// uniform mat3 normal_matrix;
	// uniform mat4 projection_matrix;
	// uniform float parameter;

	// out vec3 v_eyeCoords;
	// out vec3 v_normal;
	// out vec2 v_tcoords;

	// void main()
	// {
	// 	v_normal = normalize(normal_matrix * a_normals);
	// 	v_eyeCoords = vec3(modelview_matrix * vec4(a_vertices,1.0) );
	// 	v_tcoords = a_tcoords;
	// 	gl_Position = projection_matrix * vec4(v_eyeCoords,1.0);
	// }`,

	// phone_fragment_shader :
	// `#version 300 es\n
	// precision mediump float;

	// in vec3 v_eyeCoords;
	// in vec3 v_normal;
	// in vec2 v_tcoords;

	// out vec4 v_color;

	// struct Material
	// {
	// 	vec3 k_ambient;
	// 	vec3 k_diffuse;
	// 	vec3 k_specular;
	// 	float k_shininess;
	// };

	// uniform Material u_material;
	// uniform float u_parameter;
	// uniform vec4 u_light_position;

	// uniform sampler2D u_texture1;
	// uniform sampler2D u_texture2;
	// uniform bool u_texture1_enable;
	// uniform bool u_texture2_enable;
	
	// const float ONE_OVER_PI = 1.0 / 3.14159265;
	
	// vec4 ads()
	// {
	// 	vec3 diffuse2 = u_material.k_diffuse;
	// 	vec3 n = normalize(v_normal);

	// 	if (gl_FrontFacing)
	// 	{
	// 		return vec4(u_material.k_ambient, 1.0);
	// 		//diffuse2 = vec3(fs_in.C);
	// 		//n = -n;
	// 	}

	// 	vec3 s = normalize(vec3(u_light_position) - v_eyeCoords);
	// 	vec3 v = normalize(-v_eyeCoords);
	// 	vec3 r = reflect(-s, n);
	// 	vec3 diffuse = max(dot(s, n), 0.0) * diffuse2;
	// 	vec3 specular = pow(max(dot(r, v), 0.0), u_material.k_shininess) * u_material.k_specular;
	
	// 	return vec4(u_material.k_ambient + diffuse + specular, 1.0);
	// }

	// void main()
	// {	
	// 	bool b1 = floor(mod((v_tcoords.x + u_parameter) * 10.0, 2.0)) == 0.0;
	// 	bool b2 = floor(mod((v_tcoords.y + u_parameter) * 10.0, 2.0)) == 0.0;
	// 	bool b = b1 ^^ b2;
	// 	float scale_value = (b) ? 1.0 : 0.4;
	
	// 	vec4 c = ads();
	
	// 	v_color = c * scale_value;

	// 	/*
	// 	if (u_texture1_enable == true)
	// 		//gl_FragColor = c * texture2D(u_texture1, vec2(v_tcoords.s, v_tcoords.t));
	// 	else
	// 		//v_color = c;
	// 		v_color = vec4(v_tcoords.x, v_tcoords.x, v_tcoords.x, 1);
	// 		*/
	// 	//gl_FragColor = ads() * scale_value;
	// 	//gl_FragColor = vec4(v_tcoords.x, v_tcoords.x, v_tcoords.x, 1);
	// }`
}