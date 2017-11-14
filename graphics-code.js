var canvas = document.getElementById('glcanvas');
var gl = canvas.getContext('webgl2');

var colorfulShader = new Shader("colorful_vertex_shader", "colorful_fragment_shader");
var solidShader = new Shader("solid_vertex_shader", "solid_fragment_shader");

var projectile_model = new Cube([1,0,0]);
registerShape('projectile',projectile_model);

var ground_model = new Cube([0.3,0.3,0.3]);
registerShape('ground',ground_model);

//Projection matrix
var prj = mat4.create();

function Draw(now) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    now = now / 1000.0;

    mat4.perspective(prj, Radians(90.0), canvas.width / canvas.height, 0.5, 1000.0);

    var mdv = mat4.create();
    mat4.lookAt(mdv, [-10, 5.0, 0.0], [0.0, 5.0, 0.0], [0.0, 5.0, 0.0]);

    if (!viewmode.wireframe) {
        gl.useProgram(colorfulShader.program);
        gl.uniformMatrix4fv(colorfulShader.program.projection_matrix_handle, false, prj);
        gl.uniformMatrix4fv(colorfulShader.program.modelview_matrix_handle, false, mdv);
        drawAllShapes(mdv, colorfulShader.program, colorfulShader, solidShader, true, false, false, false);
    }

    if (viewmode.wireframe || viewmode.triangles) {
        gl.useProgram(solidShader.program);
        gl.uniformMatrix4fv(solidShader.program.projection_matrix_handle, false, prj);
        gl.uniformMatrix4fv(solidShader.program.modelview_matrix_handle, false, mdv);
        gl.uniform3fv(solidShader.program.color_uniform_handle, [0.5, 1, 1]);
        drawAllShapes(mdv, solidShader.program, colorfulShader, solidShader, true, false, viewmode.wireframe, viewmode.triangles);
    }

    if (viewmode.normals) {
        gl.useProgram(solidShader.program);
        gl.uniformMatrix4fv(solidShader.program.projection_matrix_handle, false, prj);
        gl.uniformMatrix4fv(solidShader.program.modelview_matrix_handle, false, mdv);
        gl.uniform3fv(solidShader.program.color_uniform_handle, [0.5, 1, 1]);
        drawAllShapes(mdv, solidShader.program, colorfulShader, solidShader, false, true, false, false);
    }

    gl.useProgram(null);

    requestAnimationFrame(Draw);
}

function drawAllShapes(mdv, shader_program, shader_1, shader_2, arg1, arg2, arg3, arg4) {
    for (i in shapes) {
        gl.useProgram(shader_program);
        let shape = shapes[i];
        //Re-locate all shapes according to their oimo object, if it exists
        if (shape.oimo != undefined) {
            let m = mat4.create();
            // center - used for translation
            let c = [shape.oimo.pos.x, shape.oimo.pos.y, shape.oimo.pos.z];
            // orientation - used for rotation
            let o = [shape.oimo.orientation.x, shape.oimo.orientation.y, shape.oimo.orientation.z, shape.oimo.orientation.w];

            mat4.fromRotationTranslation(m, o, c);
            mat4.multiply(m, mdv, m);
            mat4.scale(m, m, [shape.oimo.shapes.width, shape.oimo.shapes.height, shape.oimo.shapes.depth]);
            gl.uniformMatrix4fv(shader_program.modelview_matrix_handle, false, m);

            gl.drawArrays(gl.TRIANGLES, 0, shape.shape.triangle_vrts.length / 3);
        }

        //Draw all shapes
        shape.shape.Draw(shader_1, shader_2, arg1, arg2, arg3, arg4);
    }
}

requestAnimationFrame(Draw);