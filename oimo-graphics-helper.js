
var shapes = [];
function attachOimoObjectToShape(oimo_object,shape_name){
    for(i in shapes){
        if(shapes[i].name == shape_name){
            shapes[i]["oimo"] = oimo_object;
        }
    }
}