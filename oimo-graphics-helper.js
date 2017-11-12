
var shapes = [];
function attachOimoObjectToShape(shape_id,oimo_object){
    for(i in shapes){
        if(shapes[i].name == shape_id){
            shapes[i]["oimo"] = oimo_object;
        }
    }
}

function registerShape(shape_id,shape_object){
    var found = false;
    for(i in shapes){
        if(shapes[i].name == shape_id){
            shapes[i]["shape"] = shape_object;
            found = true;
            break;
        }
    }
    if(!found){
        shapes.push({name:shape_id,shape:shape_object});
    }
}