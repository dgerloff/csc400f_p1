var world = new OIMO.World({
    timestep: 1 / 60,//simulation time per step. Smaller #'s are "finer", e.g 1/1000
    iterations: 8,//Solvers for joints
    broadphase: 2,//2 means "sweep and prune", see docs
    worldscale: 1,//Min 0.1, Max 10; Basic "units" of distance
    random: true,
    info: false,
    gravity: [0, -9.8, 0]//Setup the forces of gravity on XYZ; -9.8 on Y simulates Earth's Gravity (when `worldscale` is 1.0)
});

var o_particle = world.add({
    type: 'box', // type of shape : sphere, box, cylinder 
    size: [1, 1, 1], // size of shape
    pos: [-10, 15, 0], // start position in degree
    rot:[45,0,0], //rotation, in degrees
    move: true, // dynamic or static
    density: 9001,
    friction: 0.2,
    restitution: 0.8
});
attachOimoObjectToShape('projectile',o_particle);
o_particle.linearVelocity.x += 11;
var o_ground = world.add({
    type: 'box', // type of shape : sphere, box, cylinder 
    size: [20, 2, 40], // size of shape
    pos: [0, 0, 0], // start position in degree
    move: false, // dynamic or static
    density: 1,
    friction: 0.2,
    restitution: 0.9
});
attachOimoObjectToShape('ground',o_ground);

//Setup wall for first time
setup_wall([10,1,0]);

function OimoMain(now) {
    world.step();
    if(o_particle.pos.y < -5){
        reset_projectile();
    }
    requestAnimationFrame(OimoMain);
}

requestAnimationFrame(OimoMain);

function setup_wall(origin){
    var brick_size = 2;
    var brick_radius = brick_size/2;
    var wall_length = 10;
    var wall_height = 10;
    //Build up a wall, "centered" on the given `origin` (bottom middle)
    for(var r=0;r<wall_height;r++){
        var offset = (r+1) % 2 == 0;
        for(var c=0;c<wall_length;c++){
            if(!offset && c == 0){
                // skip the first block in every non-offset row
            } else {
                var brick_id = 'brick_'+r+'_'+c;
                
                var b_x = brick_radius,
                b_y = brick_radius,
                b_z = brick_size;
                
                if(offset && (c==0 || c == wall_length-1)){
                    b_z = brick_radius;
                }
            
                var brick_pos = [
                    origin[0]-b_x,
                    origin[1]+(r*b_y)+(b_y/2),
                    origin[2]-(wall_length)+(c*brick_size)+(offset?b_x:0)+(offset&&c==0?b_z/2:0)-(offset&&c==(wall_length-1)?b_z/2:0)
                ];
    
                var brick_model = new Cube();
                registerShape(brick_id,brick_model);
                var brick_oimo = world.add({
                    type: 'box',
                    size: [b_x,b_y,b_z],
                    pos: brick_pos,
                    move: true, 
                    density: 1,
                    friction: 1,
                    restitution: 0,
                    sleeping:true
                });
                attachOimoObjectToShape(brick_id,brick_oimo,brick_pos);
            }
        }
    }
}

function reset_projectile(){
    o_particle.resetPosition(-10, 15, 0);
    o_particle.resetRotation(45, 0, 45);
    o_particle.linearVelocity.set(9.8, 0, 0);
}
function reset_wall(){
    for(i in shapes){//Reset all old bricks
        if(shapes[i].name.indexOf('brick') !== -1){
            var o = shapes[i]["oimo"];
            var o_pos = shapes[i]["spawn_pos"];
            o.resetRotation(0,0,0);
            o.resetPosition(o_pos[0],o_pos[1],o_pos[2]);
        }
    }
}
