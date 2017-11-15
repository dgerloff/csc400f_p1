function Radians(angle){return angle*(Math.PI/180)}

var viewmode = {
    normals:false
};
function enableKeyboardControls(){
    //Enables use of keyboard shortcuts
    shortcutsEnabled = true;

    var controlDiv = document.createElement('div');
    controlDiv.innerHTML = 'Controls:<br>t - toggle triangles<br>n - toggle normals';
    controlDiv.setAttribute('style','font-family:Arial,sans-serif;font-size:12px;position:fixed;right:16px;bottom:16px;');
    document.body.appendChild(controlDiv);
}

document.addEventListener('keydown',function(e){
    switch(e.keyCode){
        case 32:
            launchProjectile();
            break;
        case 78:
            viewmode.normals=!viewmode.normals;
            break;
        default:
            break;
    }
});

/**
* Demultiplex a vecN, pushing each component onto the specified array.
* @param {number array}	an array of floats representing vertex locations.
* @param {vecN} the vertex whose component values will be pushed.
* @return {none}
*/
function PushVertex(e,s){switch(s.length){case 2:e.push(s[0],s[1]);break;case 3:e.push(s[0],s[1],s[2]);break;case 4:e.push(s[0],s[1],s[2],s[3])}}