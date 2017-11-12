var canvas = document.getElementById('glcanvas');
var gl = canvas.getContext('webgl2');

var colorfulShader = new Shader("colorful_vertex_shader", "colorful_fragment_shader");
var solidShader = new Shader("solid_vertex_shader", "solid_fragment_shader");

var projectile_3d = new Cube();
shapes.push({ "name": 'projectile', "shape": projectile_3d });

var ground_3d = new Cube();
shapes.push({ "name": 'ground', "shape": ground_3d });

function Draw(now) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.01, 0.01, 0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    now = now / 1000.0;

    var prj = mat4.create();
    mat4.perspective(prj, Radians(90.0), canvas.width / canvas.height, 0.5, 1000.0);

    var mdv = mat4.create();
    mat4.lookAt(mdv, [0.0, 5.0, 15.0], [0.0, 0.0, 0.0], [0.0, 5.0, 0.0]);

    if (!viewmode.wireframe) {
        gl.useProgram(colorfulShader.GetProgram());
        gl.uniformMatrix4fv(colorfulShader.program.projection_matrix_handle, false, prj);
        gl.uniformMatrix4fv(colorfulShader.program.modelview_matrix_handle, false, mdv);
        drawAllShapes(mdv, colorfulShader.program.modelview_matrix_handle, colorfulShader, solidShader, true, false, false, false);
    }

    if (viewmode.wireframe || viewmode.triangles) {
        gl.useProgram(solidShader.GetProgram());
        gl.uniformMatrix4fv(solidShader.program.projection_matrix_handle, false, prj);
        gl.uniformMatrix4fv(solidShader.program.modelview_matrix_handle, false, mdv);
        gl.uniform3fv(solidShader.program.color_uniform_handle, [0.5, 1, 1]);
        drawAllShapes(mdv, solidShader.program.modelview_matrix_handle, colorfulShader, solidShader, true, false, viewmode.wireframe, viewmode.triangles);
    }

    if (viewmode.normals) {
        gl.useProgram(solidShader.GetProgram());
        gl.uniformMatrix4fv(solidShader.program.projection_matrix_handle, false, prj);
        gl.uniformMatrix4fv(solidShader.program.modelview_matrix_handle, false, mdv);
        gl.uniform3fv(solidShader.program.color_uniform_handle, [0.5, 1, 1]);
        drawAllShapes(mdv, solidShader.program.modelview_matrix_handle, colorfulShader, solidShader, false, true, false, false);
    }

    gl.useProgram(null);

    requestAnimationFrame(Draw);
}

function drawAllShapes(mdv, modelview_matrix_handle, shader_1, shader_2, arg1, arg2, arg3, arg4) {
    for (i in shapes) {
        //Re-locate all shapes according to their oimo object, if it exists
        if (shapes[i].oimo != undefined) {
            var m = mat4.create();
            // center - used for translation
            var c = [shapes[i].oimo.pos.x, shapes[i].oimo.pos.y, shapes[i].oimo.pos.z];
            // orientation - used for rotation
            var o = [shapes[i].oimo.orientation.x, shapes[i].oimo.orientation.y, shapes[i].oimo.orientation.z, shapes[i].oimo.orientation.w];

            mat4.fromRotationTranslation(m, o, c);
            mat4.multiply(m, mdv, m);
            //mat4.scale(m, m, [shapes[i].oimo.shapes.width, shapes[i].oimo.shapes.height, shapes[i].oimo.shapes.depth]);
            gl.uniformMatrix4fv(modelview_matrix_handle, false, m);

            gl.clearColor(0.1, 0.1, 0.1, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.drawArrays(gl.TRIANGLES, 0, shapes[i].shape.triangle_vrts.length / 3);
        }

        //Draw all shapes
        shapes[i].shape.Draw(shader_1, shader_2, arg1, arg2, arg3, arg4);
    }
}

requestAnimationFrame(Draw);