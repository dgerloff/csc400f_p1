
var shapes = [];
function attachOimoObjectToShape(shape_id,oimo_object,original_location){
    for(i in shapes){
        if(shapes[i].id == shape_id){
            shapes[i]["oimo"] = oimo_object;
            shapes[i]["spawn_pos"] = original_location;
        }
    }
}

function registerShape(shape_id,block_color){
    var found = false;
    if(null===block_color || "object"!=typeof block_color || 3!==block_color.length){
        block_color = [Math.random(),Math.random(),Math.random()];
    }
    for(i in shapes){
        if(shapes[i].id == shape_id){
            shapes[i]["color"] = block_color;
            found = true;
            break;
        }
    }
    if(!found){
        shapes.push({id:shape_id,color:block_color});
    }
}

function attachMaterialToShape(shape_id){
    for(i in shapes){
        if(shapes[i].id == shape_id){
            shapes[i]["material"] = [
                [Math.random(),Math.random(),Math.random()],
                [Math.random(),Math.random(),Math.random()],
                [Math.random(),Math.random(),Math.random()]
            ];
        }
    }
}