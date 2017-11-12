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
    density: 5,
    friction: 0.2,
    restitution: 0.8
});
attachOimoObjectToShape('projectile',o_particle);
o_particle.linearVelocity.x += 9.8;
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
reset_wall([10,1,0]);


function OimoMain(now) {
    world.step();
    if(o_particle.pos.y < -5){
        reset_projectile();
    }
    requestAnimationFrame(OimoMain);
}

requestAnimationFrame(OimoMain);

function reset_projectile(){
    o_particle.resetPosition(-10, 15, 0);
    o_particle.resetRotation(45, 0, 45);
    o_particle.linearVelocity.set(9.8, 0, 0);
}
function reset_wall(origin){
    if(origin === undefined){
        origin = [10,1,0];
    }
    for(i in shapes){//Clear out all old bricks
        if(shapes[i].name.indexOf('brick') !== -1){
            shapes[i]["oimo"] = null;
            shapes[i]["shape"] = null;
            shapes.splice(i,1);
        }
    }
    var brick_size = 1;
    var brick_radius = brick_size/2;
    var wall_length = 20;
    var wall_height = 10;
    //Build up a wall, "centered" on the given `origin` (bottom middle)
    for(var c=0;c<wall_length;c++){
        for(var r=0;r<wall_height;r++){
            var brick_id = 'brick_'+r+'_'+c;
            var brick_pos = [
                origin[0]-brick_radius,
                origin[1]+brick_radius+(r*brick_size),
                origin[2]-(wall_length*brick_radius)+((c/(wall_length/2)) * (wall_length*brick_radius) )
            ];

            var brick_model = new Cube();
            registerShape(brick_id,brick_model);
            var brick_oimo = world.add({
                type: 'box',
                size: [brick_size,brick_size,brick_size],
                pos: brick_pos,
                move: true, 
                density: 1,
                friction: 0.5,
                restitution: 0
            });
            attachOimoObjectToShape(brick_id,brick_oimo);
        }
    }
}
