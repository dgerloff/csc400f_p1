var world = new OIMO.World({ 
    timestep: 1/60,//simulation time per step. Smaller #'s are "finer", e.g 1/1000
    iterations: 8,//Solvers for joints
    broadphase: 2,//2 means "sweep and prune", see docs
    worldscale: 1,//Min 0.1, Max 10; Basic "units" of distance
    random: true,
    info: false,
    gravity: [0,-9.8,0]//Setup the forces of gravity on XYZ; -9.8 on Y simulates Earth's Gravity (when `worldscale` is 1.0)
});

var o_particle = world.add({ 
    type:'sphere', // type of shape : sphere, box, cylinder 
    size:[1,1,1], // size of shape
    pos:[-10,20,0], // start position in degree
    move:true, // dynamic or static
    density: 1,
    friction: 0.2,
    restitution: 0.5
});
attachOimoObjectToShape(o_particle,'projectile');
o_particle.linearVelocity.x += 9.8;
var o_ground = world.add({ 
    type:'box', // type of shape : sphere, box, cylinder 
    size:[20,2,20], // size of shape
    pos:[0,0,0], // start position in degree
    move:false, // dynamic or static
    density: 1,
    friction: 0.2,
    restitution: 1
});
attachOimoObjectToShape(o_ground,'ground');
var o_wall = world.add({ 
    type:'box', // type of shape : sphere, box, cylinder 
    size:[2,10,20], // size of shape
    pos:[9,6,0], // start position in degree
    move:false, // dynamic or static
    density: 1,
    friction: 0.2,
    restitution: 1
});

function HelloWorld(now){
    world.step();
    if(o_particle.pos.y > -10)
        requestAnimationFrame(HelloWorld);
    else
        console.log('particle below y = -10');
}

requestAnimationFrame(HelloWorld);

