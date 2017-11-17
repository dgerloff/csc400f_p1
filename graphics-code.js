var canvas = document.getElementById('glcanvas');
var gl = canvas.getContext('webgl2');

var colorfulShader = new Shader("colorful_vertex_shader", "colorful_fragment_shader");
var solidShader = new Shader("solid_vertex_shader", "solid_fragment_shader");

registerShape('ground',[0.3,0.3,0.3]);
registerShape('launcher_source',[1,1,1]);

//Projection matrix
var prj = mat4.create();

// Hook the twirly handler up to the canvas.
InitializeMouseOverElement('glcanvas');

function Draw(now) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    now = now / 1000.0;

    mat4.perspective(prj, Radians(90.0), canvas.width / canvas.height, 0.5, 100.0);

    var mdv = mat4.create();
    mat4.lookAt(mdv, [camera["current"]["x"],camera["current"]["y"],camera["current"]["z"]],
        [
            0.0,
            camera["current"]["y"]-(camera["start"]["y"]+(camera["current"]["y"]*0.15)),
            0.0
        ],
        [0.0, 5.0, 0.0]
    );
    mat4.multiply(mdv, mdv, camera["rotation"]); 

    //Draw colors
    gl.useProgram(colorfulShader.program);
    gl.uniformMatrix4fv(colorfulShader.program.projection_matrix_handle, false, prj);
    gl.uniformMatrix4fv(colorfulShader.program.modelview_matrix_handle, false, mdv);
    drawAllShapes(mdv, colorfulShader.program, colorfulShader, solidShader, true, false, false, false);
    //Draw outlines
    //Draw outlines
    if(viewmode.outlines){
        gl.useProgram(solidShader.program);
        gl.uniformMatrix4fv(solidShader.program.projection_matrix_handle, false, prj);
        gl.uniformMatrix4fv(solidShader.program.modelview_matrix_handle, false, mdv);
        gl.uniform3fv(solidShader.program.color_uniform_handle, [0.5, 1, 1]);
        drawAllShapes(mdv, solidShader.program, colorfulShader, solidShader, false, false, true, false);
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

var drawinCube = new Cube();
function drawAllShapes(mdv, shader_program, shader_1, shader_2, arg1, arg2, arg3, arg4) {
    for (i in shapes) {
        gl.useProgram(shader_program);
        let shape = shapes[i];
        //Re-locate all shapes according to their oimo object, if it exists
        if (shape.oimo != undefined) {
            if(shape.oimo.pos.y >= -5){
                // center - used for translation
                let c = [shape.oimo.pos.x, shape.oimo.pos.y, shape.oimo.pos.z];
                let m = mat4.create();
                // orientation - used for rotation
                let o = [shape.oimo.orientation.x, shape.oimo.orientation.y, shape.oimo.orientation.z, shape.oimo.orientation.w];

                mat4.fromRotationTranslation(m, o, c);
                mat4.multiply(m, mdv, m);
                mat4.scale(m, m, [shape.oimo.shapes.width, shape.oimo.shapes.height, shape.oimo.shapes.depth]);
                gl.uniformMatrix4fv(shader_program.modelview_matrix_handle, false, m);

                drawinCube.SetColor(shape.color);
                drawinCube.Draw(shader_1, shader_2, arg1, arg2, arg3, arg4);
            }
        }
    }
}

requestAnimationFrame(Draw);