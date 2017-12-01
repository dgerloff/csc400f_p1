
var world = new OIMO.World({
    timestep: 1 / 60,//simulation time per step. Smaller #'s are "finer", e.g 1/1000
    iterations: 8,//Solvers for joints
    broadphase: 2,//2 means "sweep and prune", see docs
    worldscale: 1,//Min 0.1, Max 10; Basic "units" of distance
    random: true,
    info: false,
    gravity: [0, -9.8, 0]//Setup the forces of gravity on XYZ; -9.8 on Y simulates Earth's Gravity (when `worldscale` is 1.0)
});

(function (){
    var o_ground = world.add({
        type: 'box', // type of shape : sphere, box, cylinder 
        size: [40, 2, 40], // size of shape
        pos: [0, 0, 0], // start position in degree
        move: false, // dynamic or static
        density: 1,
        friction: 1,
        restitution: 0.9,
        belongsTo:2
    });
    attachOimoObjectToShape('ground',o_ground);
})();

(function (){
    var pos = [-10,10,0];
    var src = world.add({
        type: 'box', // type of shape : sphere, box, cylinder 
        size: [0.5,0.5,0.5], // size of shape
        pos: pos, // start position in degree
        move: false, // dynamic or static
        density: 1,
        friction: 1,
        restitution: 0.9,
        belongsTo:1
    });
    attachOimoObjectToShape('launcher_source',src,pos);
})();

//Call for the first frame & repeat
function OimoMain(now) {
    world.step();
    requestAnimationFrame(OimoMain);
}
requestAnimationFrame(OimoMain);

var shape_groups = {
    bricks:{
        start: -1,
        end: -1
    },
    projectiles:{
        start:-1,
        end:-1,
        next_index:-1
    }
}
//Setup projectiles
setup_projectiles(100,1.5);
function setup_projectiles(projectile_count,projectile_size){
    shape_groups["projectiles"]["start"] = shapes.length;
    shape_groups["projectiles"]["next_index"] = shapes.length;
    for(var i=0;i<projectile_count;i++){
        var proj_id = 'proj_'+i;

        registerShape(proj_id,[1,0,0]);
        var proj_oimo = world.add({
            type: 'box',
            size: [projectile_size,projectile_size,projectile_size],
            pos: [0, -100, 0],
            rot:[45,0,0],
            move: true, 
            density: 20,
            friction: 0.2,
            restitution: 0.8,
            belongsTo:1,
            collidesWith:2
        });
        attachOimoObjectToShape(proj_id,proj_oimo,[0, -100, 0]);
    }
    shape_groups["projectiles"]["end"] = shapes.length;
}

function launchProjectile(){
    var proj = shapes[shape_groups["projectiles"]["next_index"]].oimo;
    proj.resetPosition(-10,10,0);
    proj.resetRotation(45,0,0);
    proj.linearVelocity.x = launcher_power;
    proj.linearVelocity.y = launcher_elevation;
    proj.linearVelocity.z = launcher_azimuth;
    shape_groups["projectiles"]["next_index"] += 1;
    if(shape_groups["projectiles"]["next_index"] >= shape_groups["projectiles"]["end"]){
        shape_groups["projectiles"]["next_index"] = shape_groups["projectiles"]["start"];
    }
}
function reset_projectiles(){
    var sgb = shape_groups["projectiles"];
    if(sgb["start"] !== -1 && sgb["end"] !== -1 ){
        for(var i=sgb["start"];i<sgb["end"];i++){//Reset all old bricks
            if(shapes[i].id.indexOf('proj') !== -1){
                var o = shapes[i]["oimo"];
                var o_pos = shapes[i]["spawn_pos"];
                o.resetRotation(0,0,0);
                o.resetPosition(o_pos[0],o_pos[1],o_pos[2]);
            }
        }
    }
}

//Setup wall for first time
setup_wall([10,1,0]);
function setup_wall(origin,mod){
    shape_groups["bricks"]["start"] = shapes.length;
    var brick_size = 3;
    var brick_radius = brick_size/2;
    var wall_length = 15;
    var wall_height = 10;
    //Build up a wall, "centered" on the given `origin` (bottom middle)
    for(var r=0;r<wall_height;r++){
        var offset = (r+1) % 2 === 0;
        for(var c=0;c<wall_length;c++){
            if(!offset && c == 0){
                // skip the first block in every non-offset row
            } else {
                var brick_id = 'brick_'+r+'_'+c+'_'+mod;
                
                var b_x = brick_radius,
                b_y = brick_radius,
                b_z = brick_size;
                
                if(offset && (c==0 || c == wall_length-1)){
                    b_z = brick_radius;
                }
            
                var brick_pos = [
                    origin[0]-b_x,
                    origin[1]+(r*b_y)+(b_y/2),
                    origin[2]-(wall_length*b_x)+(c*brick_size)+(offset?b_x:0)+(offset&&c==0?b_z/2:0)-(offset&&c==(wall_length-1)?b_z/2:0)
                ];
    
                registerShape(brick_id,null);
                var brick_oimo = world.add({
                    type: 'box',
                    size: [b_x,b_y,b_z],
                    pos: brick_pos,
                    move: true, 
                    density: 10,
                    friction: 0.2,
                    restitution: 0.05,
                    belongsTo:2
                });
                attachOimoObjectToShape(brick_id,brick_oimo,brick_pos);
            }
        }
    }
    shape_groups["bricks"]["end"] = shapes.length;
}
var chain_oimo= [];
//creates the Wrecking block
var anchororgin = [5,23,0];
setup_block(anchororgin,25,chain_oimo);
function setup_block(origin,chain_count,chain_oimo)
{   
    var chain_id = 0;
    registerShape(chain_id,[1,0,0]);
        chain_oimo.push(world.add({
            type: 'box',
            size: [.5,.5,.5],
            pos: origin,
            rot:[0,0,0],
            move: false, 
            density: 20,
            friction: 0.2,
            restitution: 0.01,
            belongsTo:1,
            collidesWith:2
        }));
    attachOimoObjectToShape(chain_id,chain_oimo[0],origin);
    for(var i=1;i<chain_count;i++){
        chain_id = 'chain_'+i;

        registerShape(chain_id,[1,0,0]);
            chain_oimo.push(world.add({
            type: 'box',
            size: [.5,.5,.5],
            pos: [5-(.5*i),23,0],//[Math.cos(Radians(launcher_azimuth))*(origin[0]-(.5*i)),origin[1],Math.sin(Radians(launcher_azimuth))*(origin[0]-(.5*i))],
            rot:[0,0,0],
            move: true, 
            density: 850,
            friction: 0.2,
            restitution: 0.01,
            belongsTo:1,
            collidesWith:2
        }));
        attachOimoObjectToShape(chain_id,chain_oimo[i],origin);
    }

    for(var i =0;i<chain_count-1;i++)
    {
        world.add({type:'jointBall',
            body1:chain_oimo[i],
            body2:chain_oimo[i+1],
            pos1: [0, -.3, 0],
            pos2: [0, .3, 0],
            collision:false
        });
    }
    //now to add the block
    
    chain_id = 'chain_'+(chain_count);

        registerShape(chain_id,[1,0,0]);
            chain_oimo.push(world.add({
            type: 'box',
            size: [3,3,3],
            pos: [5-(.5*chain_count),23,0],//[Math.cos(Radians(launcher_azimuth))*(-(.5*(chain_count))), origin[1], Math.sin(Radians(launcher_azimuth))*(-5-(.5*(chain_count+1)))],
            rot:[0,0,0],
            move: true, 
            density: 40,
            friction: 0.2,
            restitution: 0.01,
            belongsTo:1,
            collidesWith:2
        }));
    attachOimoObjectToShape(chain_id,chain_oimo[chain_count],origin);
     world.add({type:'jointBall',
            body1:chain_oimo[chain_count-1],
            body2:chain_oimo[chain_count],
            pos1: [0, -.3, 0],
            pos2: [0, 1.3, 0],
            collision:true
        });
     for(var i =0; i<chain_count;i++)
     {
        chain_oimo[i].isStatic = true;
        chain_oimo[i].isDynamic = false;
     }
     chain_oimo[chain_count].isStatic = true;
     chain_oimo[chain_count].isDynamic = false;

}
function reset_wall(){
    var sgb = shape_groups["bricks"];
    if(sgb["start"] !== -1 && sgb["end"] !== -1 ){
        for(var i=sgb["start"];i<sgb["end"];i++){//Reset all old bricks
            if(shapes[i].id.indexOf('brick') !== -1){
                var o = shapes[i]["oimo"];
                var o_pos = shapes[i]["spawn_pos"];
                o.resetRotation(0,0,0);
                o.resetPosition(o_pos[0],o_pos[1],o_pos[2]);
            }
        }
    }
}
var wrecking_block=false;
function launch_object()
{
    if(wrecking_block == true)
    {
        var m=mat4.create();
        var finalpos = [];
        mat4.rotate(m,m,Radians(launcher_azimuth),[0,-1,0])
        mat4.rotate(m,m,Radians(launcher_elevation),[0,0,1])
        vec3.transformMat4(finalpos,[-12.5,0,0],m)
        vec3.add(finalpos,finalpos,anchororgin)
        var counter =1;
       for(var i=chain_oimo.length-1; i>0;i--)
       {
            var temp = [finalpos[0]+(.5*counter),finalpos[1]-(.25*i)*(finalpos[1]-anchororgin[1]),finalpos[2]-(.25*i)*(finalpos[2]-anchororgin[2])];
            chain_oimo[i].resetPosition(temp[0],temp[1],temp[2]);//(launcher_power*.1)*(5-(.5*i)),23+(.02*launcher_elevation*i),launcher_azimuth*.05*i)
            chain_oimo[i].isStatic = false;
            chain_oimo[i].isDynamic = true;
            counter=counter+1;
       }
    }
    else
    {

        launchProjectile();
    }
}
function change_destruction(ischecked)
{
    wrecking_block = ischecked;
}
function reset_wrecking_block()
{
           for(var i=1; i<chain_oimo.length;i++)
       {
            chain_oimo[i].resetRotation(0,0,0);
            chain_oimo[i].resetPosition(5-(.5*i),23,0);
        }
        world.step();
        for(var i=1; i<chain_oimo.length;i++)
        {
            chain_oimo[i].isStatic = true;
            chain_oimo[i].isDynamic = false;
        }
}